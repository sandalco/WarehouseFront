"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getOrdersByCompany } from "@/lib/api/order"
import { getCustomers } from "@/lib/api/customer"
import { createApiCall } from "@/lib/api-helpers"
import { toast } from "@/hooks/use-toast"
import { getExportDataWithDateRange } from "@/lib/api/template"
import { Order } from "@/types/order"
import { Customer } from "@/types/customer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { OrderFilters } from "./OrderFilters"
import { OrderTable } from "./OrderTable"
import { OrderExportDialog } from "./OrderExportDialog"

interface EnhancedOrderManagementProps {
  onViewOrder?: (order: any) => void
  onCreateOrder?: () => void
}

export function EnhancedOrderManagement({ onViewOrder, onCreateOrder }: EnhancedOrderManagementProps = {}) {
  const router = useRouter()
  const { toast } = useToast()

  // State
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const vendors: string[] = []

  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [customerFilter, setCustomerFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    createApiCall(
      getOrdersByCompany,
      setIsLoading,
      (data) => setOrders(data),
      (error) => toast({ title: "Xəta", description: error, variant: "destructive" })
    )
    
    createApiCall(
      getCustomers,
      () => {}, // No separate loading state for customers
      (data) => setCustomers(data),
      (error) => toast({ title: "Xəta", description: error, variant: "destructive" })
    )
  }

  // Export handler
  const handleExportOrders = async () => {
    try {
      const blob = await getExportDataWithDateRange("Order", dateFrom, dateTo)
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.warehouseName && order.warehouseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesCustomer = customerFilter === "all" || 
      (order.customer && order.customer === customerFilter)

    const orderDate = new Date(order.opened)
    const matchesDateFrom = !dateFrom || orderDate >= dateFrom
    const matchesDateTo = !dateTo || orderDate <= dateTo

    return matchesSearch && matchesStatus && matchesCustomer && matchesDateFrom && matchesDateTo
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
            getStatusColor={getStatusColor}
          />
        </CardContent>
      </Card>
    </div>
  )
}