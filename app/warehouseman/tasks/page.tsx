'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Package, MapPin, User, AlertCircle, CheckCircle, PlayCircle, RefreshCw, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { tasksApi } from '@/lib/api/tasks'
import { Task } from '@/types/task'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [currentPage, pageSize])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await tasksApi.getPaginatedTasks(currentPage, pageSize)
      
      if (response.isSuccess && response.data) {
        setTasks(response.data)
        setTotalPages(response.totalPages)
        setTotalCount(response.totalCount)
        setHasPreviousPage(response.hasPreviousPage)
        setHasNextPage(response.hasNextPage)
        setError(null)
      } else {
        const errorMsg = response.errors?.[0] || "Tapşırıqlar yüklənə bilmədi."
        setError(errorMsg)
        toast({ title: "Xəta", description: errorMsg, variant: "destructive" })
      }
    } catch (err) {
      console.error('Error in fetchTasks:', err)
      const errorMsg = "Tapşırıqları yükləyərkən xəta baş verdi."
      setError(errorMsg)
      toast({ title: "Xəta", description: errorMsg, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    setUpdatingTaskId(taskId)
    
    try {
      const response = await tasksApi.updateTaskStatus(taskId, newStatus)
      
      if (response.isSuccess) {
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
      } else {
        toast({
          title: "Xəta", 
          description: response.errors?.[0] || "Status yenilənə bilmədi",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      toast({
        title: "Xəta",
        description: "Status yenilənərkən xəta baş verdi",
        variant: "destructive"
      })
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const startTask = async (taskId: string) => {
    setUpdatingTaskId(taskId)
    
    try {
      const response = await tasksApi.startTask(taskId)
      
      if (response.isSuccess) {
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
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "Tapşırıq başladıla bilmədi",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error starting task:', error)
      toast({
        title: "Xəta",
        description: "Tapşırıq başladılarkən xəta baş verdi",
        variant: "destructive"
      })
    } finally {
      setUpdatingTaskId(null)
    }
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

      {/* Pagination */}
      {totalCount > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Səhifə başına:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setCurrentPage(1) // Reset to first page when changing page size
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-sm text-muted-foreground">
                  {totalCount > 0 ? (
                    <>
                      {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} / {totalCount} arası göstərilir
                    </>
                  ) : (
                    'Nəticə yoxdur'
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Səhifə {currentPage} / {totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={!hasPreviousPage || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={!hasNextPage || loading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}