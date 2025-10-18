'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Package, MapPin, User, AlertCircle, CheckCircle, PlayCircle, RefreshCw, ExternalLink } from "lucide-react"
import { tasksApi } from '@/lib/api/tasks'
import { createApiCall } from '@/lib/api-helpers'
import { Task } from '@/types/task'
import { useToast } from '@/hooks/use-toast'

export default function TasksPage() {
  console.log('TasksPage component rendering...')
  console.log('Current environment:', {
    NODE_ENV: process.env.NODE_ENV,
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    ALL_ENV_VARS: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC'))
  })
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    console.log('useEffect running, calling fetchTasks...')
    fetchTasks()
  }, [])

  const fetchTasks = () => {
    try {
      createApiCall(
        tasksApi.getTasks,
        setLoading,
        (data) => {
          setTasks(data || [])
          setError(null)
        },
        (errorMessage) => {
          setError(errorMessage)
          toast({ title: "Xəta", description: errorMessage, variant: "destructive" })
        }
      )
    } catch (err) {
      console.error('Error in fetchTasks:', err)
    }
  }

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setUpdatingTaskId(taskId)
    
    createApiCall(
      () => tasksApi.updateTaskStatus(taskId, newStatus),
      () => {}, // No loading state for this operation
      () => {
        // Update local state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, status: newStatus, closed: newStatus === 'completed' ? new Date().toISOString() : task.closed }
              : task
          )
        )
        
        toast({
          title: "Uğur",
          description: `Tapşırıq statusu ${newStatus === 'completed' ? 'tamamlandı' : 'yeniləndi'} olaraq dəyişdirildi`,
        })
        
        setUpdatingTaskId(null)
      },
      (errorMessage) => {
        toast({
          title: "Xəta", 
          description: errorMessage,
          variant: "destructive"
        })
        setUpdatingTaskId(null)
      }
    )
  }

  const startTask = (taskId: string) => {
    setUpdatingTaskId(taskId)
    
    createApiCall(
      () => tasksApi.startTask(taskId),
      () => {}, // No loading state for this operation
      () => {
        // Update local state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, status: 'in-progress' }
              : task
          )
        )
        
        toast({
          title: "Tapşırıq Başladı",
          description: "Tapşırıq uğurla başladıldı",
        })
        
        setUpdatingTaskId(null)
      },
      (errorMessage) => {
        toast({
          title: "Xəta",
          description: errorMessage,
          variant: "destructive"
        })
        setUpdatingTaskId(null)
      }
    )
  }

  const fetchTaskDetail = async (taskId: string) => {
    // Navigate to task detail page
    router.push(`/warehouseman/tasks/${taskId}`)
  }

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    switch (status.toLowerCase()) {
      case 'pending':
      case 'new':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'stockconfirmed':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const monthNames = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
      ]
      
      const year = date.getFullYear()
      const month = monthNames[date.getMonth()]
      const day = date.getDate()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')

      return `${hours}:${minutes} ${day} ${month} ${year}`
    } catch {
      return dateString
    }
  }

  const getStatusText = (status: string | null) => {
    if (!status) return 'Naməlum'
    
    switch (status.toLowerCase()) {
      case 'pending':
      case 'new':
        return 'Gözləyir'
      case 'in-progress':
      case 'in progress':
        return 'İcra olunur'
      case 'stockconfirmed':
        return 'Anbar təsdiqləndi'
      case 'completed':
        return 'Tamamlandı'
      default:
        return status
    }
  }

  const canStartTask = (status: string | null) => {
    if (!status) return true
    const lowerStatus = status.toLowerCase()
    return lowerStatus === 'pending' || lowerStatus === 'new' || lowerStatus === ''
  }

  const canCompleteTask = (status: string | null) => {
    return status?.toLowerCase() === 'in-progress' || status?.toLowerCase() === 'in progress'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tapşırıqlar</h1>
          <p className="text-muted-foreground">
            Sizə təyin edilmiş anbar tapşırıqlarını görün və idarə edin
          </p>
        </div>

        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tapşırıqlar</h1>
          <p className="text-muted-foreground">
            Sizə təyin edilmiş anbar tapşırıqlarını görün və idarə edin
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tapşırıqlar</h1>
          <p className="text-muted-foreground">
            Sizə təyin edilmiş anbar tapşırıqlarını görün və idarə edin
          </p>
        </div>

        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Heç bir tapşırıq təyin edilməyib</h3>
            <p className="text-muted-foreground text-center">
              Hazırda sizə heç bir tapşırıq təyin edilməyib. Yeni tapşırıqlar üçün daha sonra yoxlayın.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tapşırıqlar</h1>
          <p className="text-muted-foreground">
            Sizə təyin edilmiş anbar tapşırıqlarını görün və idarə edin
          </p>
        </div>
        <Button
          onClick={fetchTasks}
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Yenilə
        </Button>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            className="w-full cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => fetchTaskDetail(task.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{task.id}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusText(task.status)}
                  </Badge>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation()
                      fetchTaskDetail(task.id)
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Aç
                  </Button>
                  
                  {canStartTask(task.status) && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        startTask(task.id)
                      }}
                      disabled={updatingTaskId === task.id}
                    >
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Başla
                    </Button>
                  )}
                  
                  {canCompleteTask(task.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateTaskStatus(task.id, 'completed')
                      }}
                      disabled={updatingTaskId === task.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Tamamla
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {task.warehouse}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {task.customer}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(task.opened)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">{task.quantity} məhsul</span>
                  </div>
                  <div className="text-lg font-semibold">
                    ₼{task.totalPrice.toFixed(2)}
                  </div>
                </div>

                {task.note && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm truncate">{task.note}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}