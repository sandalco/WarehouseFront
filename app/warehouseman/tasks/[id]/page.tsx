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
        setError(response.errors?.join(', ') || 'Tapşırıq təfərrüatlarını əldə etmək mümkün olmadı')
      }
    } catch (err) {
      console.error('Error fetching task detail:', err)
      setError('Tapşırıq təfərrüatlarını əldə etmək mümkün olmadı. Yenidən cəhd edin.')
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
          title: "Uğur",
          description: `Tapşırıq statusu ${newStatus} olaraq yeniləndi`,
        })

        // If completed, redirect back to tasks list
        if (newStatus === 'completed') {
          setTimeout(() => {
            router.push('/warehouseman/tasks')
          }, 2000)
        }
      } else {
        toast({
          title: "Xəta", 
          description: response.errors?.join(', ') || 'Tapşırıq statusunu yeniləmək mümkün olmadı',
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error('Error updating task status:', err)
      toast({
        title: "Xəta",
        description: 'Tapşırıq statusunu yeniləmək mümkün olmadı. Yenidən cəhd edin.',
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
          title: "Tapşırıq Başladı",
          description: "Tapşırıq uğurla başladıldı",
        })
      } else {
        toast({
          title: "Xəta", 
          description: response.errors?.join(', ') || 'Tapşırığı başlatmaq mümkün olmadı',
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error('Error starting task:', err)
      toast({
        title: "Xəta",
        description: 'Tapşırığı başlatmaq mümkün olmadı. Yenidən cəhd edin.',
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
    if (!status) return 'Naməlum'
    
    switch (status.toLowerCase()) {
      case 'pending':
      case 'new':
        return 'Gözləyir'
      case 'inprogress':
        return 'İcra olunur'
      case 'stockconfirmed':
        return 'Anbar təsdiqləndi'
      case 'completed':
        return 'Tamamlandı'
      default:
        return status
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
      
      return `${year} ${day} ${month} ${hours}:${minutes}`
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
          title: "Kolleksiya Tamamlandı",
          description: "Məhsul kolleksiyası uğurla təqdim edildi",
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
          title: "Xəta", 
          description: response.errors?.join(', ') || 'Kolleksiyanı tamamlamaq mümkün olmadı',
          variant: "destructive"
        })
      }
      
    } catch (err) {
      console.error('Error completing collection:', err)
      toast({
        title: "Xəta",
        description: 'Kolleksiyanı tamamlamaq mümkün olmadı. Yenidən cəhd edin.',
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
            <h1 className="text-3xl font-bold">Tapşırıq Təfərrüatları</h1>
            <p className="text-muted-foreground">Tapşırıq məlumatları yüklənə bilmir</p>
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
            <h1 className="text-3xl font-bold">Tapşırıq Təfərrüatları</h1>
            <p className="text-muted-foreground">Tapşırıq tapılmadı</p>
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
            <h1 className="text-3xl font-bold">Tapşırıq Təfərrüatları</h1>
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
              Tapşırığı Başlat
            </Button>
          )}
        </div>
      </div>

      {/* Task Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tapşırıq Məlumatları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Anbar</h4>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <p>{task.warehouse}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Müştəri</h4>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <p>{task.customer}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Açılıb</h4>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <p>{formatDate(task.opened)}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Ümumi Əşyalar</h4>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <p>{task.quantity}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Ümumi Qiymət</h4>
              <p className="text-2xl font-bold">₼{task.totalPrice.toFixed(2)}</p>
            </div>

            {task.note && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Qeyd</h4>
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
            <CardTitle>Kolleksiya İrəliləyişi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Toplanmış Məhsullar</span>
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
                  <span className="text-sm font-medium">Bütün məhsullar toplandı!</span>
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
                    {updatingStatus ? 'Göndərilir...' : 'Kolleksiyanı Tamamla'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {allProductsCollected 
                      ? "Bu tapşırığı tamamlamaq üçün kolleksiyanı təqdim edin"
                      : `Təqdim etməyi aktivləşdirmək üçün bütün ${task.products.length} məhsulu toplayın`
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
            <CardTitle>Toplanacaq Məhsullar ({task.products.length})</CardTitle>
            {task.status?.toLowerCase() !== 'inprogress' && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Kolleksiyaya başlamaq üçün tapşırığı başladın
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
                      Rəf: {product.shelfCode || 'Təyin edilməyib'} • Miqdar: {product.quantity}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">
                      {product.quantity} × ₼{product.unitPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ümumi: ₼{product.totalPrice.toFixed(2)}
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
            <CardTitle>Tapşırıq Tarixçəsi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Açan: {task.openedBy} - {formatDate(task.opened)}</p>
              {task.closed && task.closedBy && (
                <p>Bağlayan: {task.closedBy} - {formatDate(task.closed)}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
