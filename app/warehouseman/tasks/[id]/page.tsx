'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Package, MapPin, User, AlertCircle, CheckCircle, PlayCircle, ArrowLeft } from "lucide-react"
import { tasksApi } from '@/lib/api/tasks'
import { Task, TaskProduct } from '@/types/task'
import { useToast } from '@/hooks/use-toast'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [collectedProducts, setCollectedProducts] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    if (taskId) {
      fetchTaskDetail()
    }
  }, [taskId])

  const fetchTaskDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await tasksApi.getTaskById(taskId)
      
      if (response.isSuccess) {
        setTask(response.data)

      } else {
        setError(response.errors?.join(', ') || 'Failed to fetch task details')
      }
    } catch (err) {
      console.error('Error fetching task detail:', err)
      setError('Failed to fetch task details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (newStatus: string) => {
    if (!task) return
    
    try {
      setUpdatingStatus(true)
      const response = await tasksApi.updateTaskStatus(task.id, newStatus)
      
      if (response.isSuccess) {
        setTask(prev => prev ? {
          ...prev, 
          status: newStatus,
          closed: newStatus === 'completed' ? new Date().toISOString() : prev.closed
        } : null)
        
        toast({
          title: "Success",
          description: `Task status updated to ${newStatus}`,
        })

        // If completed, redirect back to tasks list
        if (newStatus === 'completed') {
          setTimeout(() => {
            router.push('/warehouseman/tasks')
          }, 2000)
        }
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
      setUpdatingStatus(false)
    }
  }

  const startTask = async () => {
    if (!task) return
    
    try {
      setUpdatingStatus(true)
      const response = await tasksApi.startTask(task.id)
      
      if (response.isSuccess) {
        setTask(prev => prev ? {
          ...prev, 
          status: 'inprogress'
        } : null)
        
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
      setUpdatingStatus(false)
    }
  }

  const canStartTask = (status: string | null) => {
    if (!status) return false
    const lowerStatus = status.toLowerCase()
    return lowerStatus === 'stockconfirmed'
  }

  const canCompleteTask = (status: string | null) => {
    return status?.toLowerCase() === 'inprogress' || status?.toLowerCase() === 'inprogress'
  }

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    switch (status.toLowerCase()) {
    case 'pending':
    case 'new':
      return 'bg-yellow-100 text-yellow-800'
    case 'inprogress':
      return 'bg-blue-100 text-blue-800'
    case 'stockconfirmed':
      return 'bg-purple-100 text-purple-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string | null) => {
    return status || 'Unknown'
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

  // Function to handle collection completion
  const completeCollection = async () => {
    if (!task || !allProductsCollected) return
    
    try {
      setUpdatingStatus(true)
      
      // Create collected products data for API
      const collectedProductsData: Record<string, number> = {}
      Array.from(collectedProducts).forEach(productId => {
        const product = task.products.find(p => p.productId === productId)
        if (product) {
          collectedProductsData[productId] = product.quantity
        }
      })
      
      // Submit collected products to backend
      const response = await tasksApi.completeTask(task.id, collectedProductsData)
      
      if (response.isSuccess) {
        toast({
          title: "Collection Complete",
          description: "Products collection has been submitted successfully",
        })
        
        // Update task status to completed
        setTask(prev => prev ? {
          ...prev, 
          status: 'completed',
          closed: new Date().toISOString()
        } : null)
        
        // Redirect back to tasks list after a delay
        setTimeout(() => {
          router.push('/warehouseman/tasks')
        }, 2000)
        
      } else {
        toast({
          title: "Error", 
          description: response.errors?.join(', ') || 'Failed to complete collection',
          variant: "destructive"
        })
      }
      
    } catch (err) {
      console.error('Error completing collection:', err)
      toast({
        title: "Error",
        description: 'Failed to complete collection. Please try again.',
        variant: "destructive"
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Check if all products are collected
  const allProductsCollected = task ? collectedProducts.size === task.products.length : false

  const toggleProductCollected = (productId: string) => {
    setCollectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Task Details</h1>
            <p className="text-muted-foreground">Unable to load task information</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Task Details</h1>
            <p className="text-muted-foreground">Task not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Task Details</h1>
            <p className="text-muted-foreground">ID: {task.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(task.status)}>
            {getStatusText(task.status)}
          </Badge>
          
          {canStartTask(task.status) && (
            <Button
              onClick={startTask}
              disabled={updatingStatus}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Task
            </Button>
          )}
        </div>
      </div>

      {/* Task Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Warehouse</h4>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <p>{task.warehouse}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Customer</h4>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <p>{task.customer}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Opened</h4>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <p>{formatDate(task.opened)}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Total Items</h4>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <p>{task.quantity}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Total Price</h4>
              <p className="text-2xl font-bold">${task.totalPrice.toFixed(2)}</p>
            </div>

            {task.note && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Note</h4>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{task.note}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collection Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Products Collected</span>
                <span className="text-lg font-semibold">
                  {collectedProducts.size} / {task.products.length}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(collectedProducts.size / task.products.length) * 100}%` }}
                />
              </div>
              
              {allProductsCollected && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">All products collected!</span>
                </div>
              )}

              {/* Complete Collection Button */}
              {(task.status?.toLowerCase() === 'inprogress' || task.status?.toLowerCase() === 'stockconfirmed') && (
                <div className="pt-2 border-t">
                  <Button
                    onClick={completeCollection}
                    disabled={updatingStatus || !allProductsCollected}
                    className="w-full"
                    variant={allProductsCollected ? "default" : "secondary"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {updatingStatus ? 'Submitting...' : 'Complete Collection'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {allProductsCollected 
                      ? "Submit the collection to complete this task"
                      : `Collect all ${task.products.length} products to enable submission`
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products to Collect ({task.products.length})</CardTitle>
            {task.status?.toLowerCase() !== 'inprogress' && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Start task to begin collection
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {task.products.map((product) => {
              const isCollected = collectedProducts.has(product.id)
              const canCollect = task.status?.toLowerCase() === 'inprogress'
              
              return (
                <div 
                  key={product.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
                    isCollected ? 'bg-green-50 border-green-200' : 
                    canCollect ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-60'
                  }`}
                >
                  <Checkbox
                    checked={isCollected}
                    onCheckedChange={() => canCollect && toggleProductCollected(product.id)}
                    disabled={!canCollect}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  
                  <div className="flex-1">
                    <div className={`font-medium ${isCollected ? 'line-through text-muted-foreground' : ''}`}>
                      {product.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Shelf: {product.shelfCode || 'Not assigned'} • Quantity: {product.quantity}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">
                      {product.quantity} × ${product.unitPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total: ${product.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  
                  {isCollected && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Task History */}
      {task.openedBy && (
        <Card>
          <CardHeader>
            <CardTitle>Task History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Opened by: {task.openedBy} on {formatDate(task.opened)}</p>
              {task.closed && task.closedBy && (
                <p>Closed by: {task.closedBy} on {formatDate(task.closed)}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
