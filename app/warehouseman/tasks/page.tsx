'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Package, AlertCircle, ExternalLink, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
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

  const fetchTaskDetail = async (taskId: string) => {
    // Navigate to task detail page
    router.push(`/warehouseman/tasks/${taskId}`)
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
                <CardTitle className="text-xl">Tapşırıq #{task.id.slice(0, 8)}</CardTitle>
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
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(task.opened)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Məhsul növü</span>
                    </div>
                    <span className="text-2xl font-bold">{task.productCount}</span>
                  </div>
                  <div className="flex flex-col p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Ümumi miqdar</span>
                    </div>
                    <span className="text-2xl font-bold">{task.totalQuantity}</span>
                  </div>
                </div>
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