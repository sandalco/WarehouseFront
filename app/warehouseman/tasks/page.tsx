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
import { Task } from '@/types/task'
import { useToast } from '@/hooks/use-toast'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Test if we can reach the API at all
      const response = await tasksApi.getTasks()
      
      if (response && response.isSuccess) {
        setTasks(response.data || [])
      } else if (response) {
        console.error('API Error:', response.errors)
        setError(response.errors?.join(', ') || 'API returned unsuccessful response')
      } else {
        console.error('No response received')
        setError('No response received from server')
      }
    } catch (err) {
      console.error('Network Error Details:', err)
      
      // For now, let's use mock data to test the UI
      console.log('Using mock data for testing...')
      const mockTasks = [
        {
          id: "TASK-001",
          warehouse: "Main Warehouse", 
          customer: "Test Customer",
          opened: new Date().toISOString(),
          openedBy: "System",
          closed: null,
          closedBy: null,
          status: "stockconfirmed",
          quantity: 5,
          totalPrice: 150.00,
          note: "Test task for UI",
          products: [
            {
              id: "1",
              name: "Product 1",
              quantity: 2,
              unitPrice: 25.00,
              totalPrice: 50.00,
              shelfCode: "A1-01"
            },
            {
              id: "2", 
              name: "Product 2",
              quantity: 3,
              unitPrice: 33.33,
              totalPrice: 100.00,
              shelfCode: "B2-05"
            }
          ]
        }
      ]
      
      setTasks(mockTasks)
      setError(`API Error (using mock data): Backend not available at ${process.env.NEXT_PUBLIC_API_BASE_URL}`)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      setUpdatingTaskId(taskId)
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
          title: "Success",
          description: `Task status updated to ${newStatus}`,
        })
      } else {
        toast({
          title: "Error", 
          description: response.errors?.join(', ') || 'Failed to update task status',
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error('Error updating task status:', err)
      toast({
        title: "Error",
        description: 'Failed to update task status. Please try again.',
        variant: "destructive"
      })
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const startTask = async (taskId: string) => {
    try {
      setUpdatingTaskId(taskId)
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
          title: "Task Started",
          description: "Task has been started successfully",
        })
      } else {
        toast({
          title: "Error", 
          description: response.errors?.join(', ') || 'Failed to start task',
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error('Error starting task:', err)
      toast({
        title: "Error",
        description: 'Failed to start task. Please try again.',
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
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusText = (status: string | null) => {
    return status || 'Unknown'
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
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            View and manage your assigned warehouse tasks
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
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            View and manage your assigned warehouse tasks
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
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            View and manage your assigned warehouse tasks
          </p>
        </div>

        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks assigned</h3>
            <p className="text-muted-foreground text-center">
              You don't have any tasks assigned at the moment. Check back later for new assignments.
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
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            View and manage your assigned warehouse tasks
          </p>
        </div>
        <Button
          onClick={fetchTasks}
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
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
                    Open
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
                      Start
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
                      Complete
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
                    <span className="font-medium">{task.quantity} items</span>
                  </div>
                  <div className="text-lg font-semibold">
                    ${task.totalPrice.toFixed(2)}
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