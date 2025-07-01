'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Package, MapPin, User, AlertCircle, CheckCircle, Eye } from "lucide-react"
import { tasksApi } from '@/lib/api/tasks'
import { Task } from '@/lib/api/tasks'
import { useRouter } from 'next/navigation'

// app/warehouseman/completed/page.tsx
export default function CompletedPage() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCompletedTasks()
  }, [])

  const fetchCompletedTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await tasksApi.getCompletedTasks()
      
      if (response.isSuccess) {
        setCompletedTasks(response.data)
      } else {
        setError(response.errors?.join(', ') || 'Failed to fetch completed tasks')
      }
    } catch (err) {
      console.error('Error fetching completed tasks:', err)
      setError('Failed to fetch completed tasks. Please try again.')
    } finally {
      setLoading(false)
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

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    switch (status.toLowerCase()) {
      case 'prepared':
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const viewTaskDetails = (taskId: string) => {
    router.push(`/warehouseman/tasks/${taskId}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-primary">Tamamlanmış</h1>
          <p className="text-gray-600">Tamamlanmış tapşırıqlar</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
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
          <h1 className="text-2xl font-bold text-purple-primary">Tamamlanmış</h1>
          <p className="text-gray-600">Tamamlanmış tapşırıqlar</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button onClick={fetchCompletedTasks} variant="outline">
          Yenidən cəhd et
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-primary">Tamamlanmış</h1>
          <p className="text-gray-600">Tamamlanmış tapşırıqlar ({completedTasks.length})</p>
        </div>
        
        <Button onClick={fetchCompletedTasks} variant="outline">
          Yenile
        </Button>
      </div>

      {completedTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hələ tamamlanmış tapşırıq yoxdur
            </h3>
            <p className="text-gray-600 text-center">
              Tamamladığınız tapşırıqlar burada görünəcək
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Tapşırıq #{task.id.slice(0, 8)}</CardTitle>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status || 'Unknown'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Anbar:</span>
                    <span>{task.warehouse}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Müştəri ID:</span>
                    <span>{task.customer.slice(0, 8)}...</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Məhsul sayı:</span>
                    <span>{task.quantity}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Tamamlandı:</span>
                    <span>{task.closed ? formatDate(task.closed) : 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ümumi məbləğ</p>
                      <p className="text-lg font-bold text-green-600">
                        ${task.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewTaskDetails(task.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Bax
                    </Button>
                  </div>
                </div>

                {task.note && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Qeyd:</span> {task.note}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}