"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getOrdersByCompany, OrderFiltersRequest, cancelOrder } from "@/lib/api/order"
import { getCustomerLookup } from "@/lib/api/customer"
import { createApiCall } from "@/lib/api-helpers"
import { toast } from "@/hooks/use-toast"
import { getExportDataWithDateRange } from "@/lib/api/template"
import { Order } from "@/types/order"
import { LookupItem } from "@/types/api-response"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OrderFilters } from "./OrderFilters"
import { OrderTable } from "./OrderTable"
import { OrderExportDialog } from "./OrderExportDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EnhancedOrderManagementProps {
  onViewOrder?: (order: any) => void
  onCreateOrder?: () => void
  initialCustomerId?: string | null
}

export function EnhancedOrderManagement({ onViewOrder, onCreateOrder, initialCustomerId }: EnhancedOrderManagementProps = {}) {
  const router = useRouter()
  const { toast } = useToast()

  // State
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<LookupItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const vendors: string[] = []

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)

  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [customerFilter, setCustomerFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  // Cancel order modal state
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)
  const [isCanceling, setIsCanceling] = useState(false)

  // Set initial customer filter if provided
  useEffect(() => {
    if (initialCustomerId) {
      setCustomerFilter(initialCustomerId)
    }
  }, [initialCustomerId])

  // Load data
  useEffect(() => {
    loadData()
  }, [currentPage, pageSize, statusFilter, customerFilter, dateFrom, dateTo])

  // Filter dəyişəndə səhifəni 1-ə qaytır
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [statusFilter, customerFilter, dateFrom, dateTo])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Filterleri hazırla
      const filters: OrderFiltersRequest = {
        customerId: customerFilter !== "all" ? customerFilter : null,
        status: statusFilter !== "all" ? statusFilter : null,
        fromDate: dateFrom ? dateFrom.toISOString() : null,
        toDate: dateTo ? dateTo.toISOString() : null,
      }

      const response = await getOrdersByCompany(currentPage, pageSize, filters)
      
      if (response.isSuccess && response.data) {
        setOrders(response.data)
        setTotalPages(response.totalPages)
        setTotalCount(response.totalCount)
        setHasPreviousPage(response.hasPreviousPage)
        setHasNextPage(response.hasNextPage)
      } else {
        toast({ 
          title: "Xəta", 
          description: response.errors?.[0] || "Sifarişlər yüklənə bilmədi.", 
          variant: "destructive" 
        })
      }
    } catch (error) {
      console.error("Error loading orders:", error)
      toast({ 
        title: "Xəta", 
        description: "Sifarişlər yüklənərkən xəta baş verdi.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
    
    createApiCall(
      getCustomerLookup,
      () => {}, // No separate loading state for customers
      (data) => setCustomers(data),
      (error) => toast({ title: "Xəta", description: error, variant: "destructive" })
    )
  }

  // Export handler
  const handleExportOrders = async () => {
    try {
      const response = await getExportDataWithDateRange("Order", dateFrom, dateTo)
      // Əgər response Blob deyilsə, onu Blob-a çevir
      const blob = response instanceof Blob ? response : new Blob([JSON.stringify(response)])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      
      const dateString = dateFrom && dateTo 
        ? `_${format(dateFrom, "yyyy-MM-dd")}_to_${format(dateTo, "yyyy-MM-dd")}`
        : ""
      
      link.download = `orders_export${dateString}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "İxrac Uğurlu",
        description: "Sifarişlər uğurla Excel faylına ixrac edildi.",
      })
    } catch (error) {
      console.error("Error exporting orders:", error)
      toast({
        title: "İxrac Xətası",
        description: "Sifarişləri ixrac edərkən xəta baş verdi.",
        variant: "destructive",
      })
    }
  }

  // View order handler
  const handleViewOrder = (order: Order) => {
    if (onViewOrder) {
      onViewOrder(order)
    } else {
      router.push(`/boss/orders/${order.id}`)
    }
  }

  // Cancel order handler
  const handleCancelOrder = (order: Order) => {
    setOrderToCancel(order)
  }

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return

    setIsCanceling(true)
    try {
      const response = await cancelOrder(orderToCancel.id)
      
      if (response.isSuccess) {
        toast({
          title: "Uğurlu",
          description: "Sifariş ləğv edildi.",
        })
        setOrderToCancel(null)
        // Siyahını yenilə
        loadData()
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "Sifariş ləğv edilə bilmədi.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error canceling order:", error)
      toast({
        title: "Xəta",
        description: "Sifarişi ləğv edərkən xəta baş verdi.",
        variant: "destructive",
      })
    } finally {
      setIsCanceling(false)
    }
  }

  // Frontend axtarış (search) - yalnız ID və anbar adı üçün
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true
    
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.warehouse && order.warehouse.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSearch
  })

  const outgoingOrders = filteredOrders.filter((order) => !!order.customer)
  const incomingOrders = filteredOrders.filter((order) => !order.customer)

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Processing":
        return "secondary"
      case "StockConfirmed":
        return "outline"
      case "In Transit":
        return "secondary"
      case "Shipped":
        return "default"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">Sifariş İdarəetməsi</h2>
          <p className="text-gray-600">Daxil olan və çıxan anbar sifarişlərini idarə edin</p>
        </div>
        <div className="flex space-x-3">
          <OrderExportDialog
            dateFrom={dateFrom}
            dateTo={dateTo}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            onExport={handleExportOrders}
          />
          <Button 
            className="bg-purple-primary hover:bg-purple-600"
            onClick={onCreateOrder}
          >
            <Plus className="h-4 w-4 mr-2" />
            Sifariş Yarat
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sifarişlər</CardTitle>
          <CardDescription>
            <OrderFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              customerFilter={customerFilter}
              setCustomerFilter={setCustomerFilter}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              customers={customers}
              vendors={vendors}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={filteredOrders}
            outgoingOrders={outgoingOrders}
            incomingOrders={incomingOrders}
            onViewOrder={handleViewOrder}
            onCancelOrder={handleCancelOrder}
            getStatusColor={getStatusColor}
            currentPage={currentPage}
            pageSize={pageSize}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
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
                  disabled={!hasPreviousPage || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!hasNextPage || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Order Modal */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sifarişi ləğv et</AlertDialogTitle>
            <AlertDialogDescription>
              {orderToCancel && (
                <>
                  <span className="font-semibold text-foreground">"{orderToCancel.customer}"</span> müştərisinə aid{" "}
                  <span className="font-semibold text-foreground">{orderToCancel.id}</span> nömrəli sifarişi ləğv etmək istədiyinizdən əminsiniz?
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-800">
                      ⚠️ Bu əməliyyat geri qaytarıla bilməz və sifariş statusu "Cancelled" olaraq dəyişdiriləcək.
                    </p>
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>Ləğv et</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelOrder}
              disabled={isCanceling}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isCanceling ? "Ləğv edilir..." : "Bəli, ləğv et"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}