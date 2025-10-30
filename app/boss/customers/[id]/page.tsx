"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCustomerById } from "@/lib/api/customer"
import { getOrdersByCustomer } from "@/lib/api/order"
import { Customer } from "@/types/customer"
import { Order } from "@/types/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Mail, Phone, MapPin, Building, Package, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CustomerDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCustomerData()
  }, [customerId])

  const loadCustomerData = async () => {
    setIsLoading(true)
    try {
      // Load customer details
      const customerResponse = await getCustomerById(customerId)
      if (customerResponse.isSuccess && customerResponse.data) {
        setCustomer(customerResponse.data)
      } else {
        toast({
          title: "Xəta",
          description: customerResponse.errors?.[0] || "Müştəri məlumatları yüklənə bilmədi.",
          variant: "destructive",
        })
      }

      // Load customer orders (only last 5)
      const ordersResponse = await getOrdersByCustomer(customerId)
      if (ordersResponse.isSuccess && ordersResponse.data) {
        // Get only last 5 orders
        setOrders(ordersResponse.data.slice(0, 5))
      }
    } catch (error) {
      console.error("Error loading customer data:", error)
      toast({
        title: "Xəta",
        description: "Məlumatları yükləyərkən xəta baş verdi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Prepared":
        return "default"
      case "Processing":
      case "StockConfirmed":
        return "secondary"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleViewAllOrders = () => {
    // Navigate to orders page with customer filter
    router.push(`/boss/orders?customerId=${customerId}`)
  }

  const handleViewOrder = (orderId: string) => {
    router.push(`/boss/orders/${orderId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Yüklənir...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Müştəri tapılmadı</p>
          <Button onClick={() => router.push("/boss/customers")} className="mt-4">
            Geri qayıt
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/boss/customers")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-purple-primary">{customer.fullName}</h1>
            <p className="text-muted-foreground">Müştəri məlumatları</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Ümumi Sifarişlər
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.orderCount}</div>
            <p className="text-xs text-muted-foreground">Cəmi sifariş sayı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Son Sifariş
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.lastOrderTime === "N/A" ? "-" : customer.lastOrderTime.split(" ")[0]}
            </div>
            <p className="text-xs text-muted-foreground">
              {customer.lastOrderTime === "N/A" ? "Sifariş yoxdur" : customer.lastOrderTime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Şəhər
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.address.city}</div>
            <p className="text-xs text-muted-foreground">{customer.address.district}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Müştəri Məlumatları</TabsTrigger>
          <TabsTrigger value="orders">Sifarişlər ({orders.length})</TabsTrigger>
        </TabsList>

        {/* Customer Info Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Əlaqə Məlumatları</CardTitle>
              <CardDescription>Müştərinin əlaqə və ünvan məlumatları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Building className="h-5 w-5 text-purple-primary" />
                    Əlaqə
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">E-poçt</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telefon</p>
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-primary" />
                    Ünvan
                  </h3>
                  <div className="space-y-2 pl-7">
                    <div>
                      <p className="text-sm text-muted-foreground">Şəhər</p>
                      <p className="font-medium">{customer.address.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rayon</p>
                      <p className="font-medium">{customer.address.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Küçə</p>
                      <p className="font-medium">{customer.address.street}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Poçt Kodu</p>
                      <p className="font-medium">{customer.address.zipCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Son Sifarişlər</CardTitle>
                  <CardDescription>Müştərinin son 5 sifarişi</CardDescription>
                </div>
                {orders.length > 0 && (
                  <Button variant="outline" onClick={handleViewAllOrders}>
                    Bütün Sifarişlərə Bax
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Bu müştərinin sifarişi yoxdur</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sifariş ID</TableHead>
                      <TableHead>Anbar</TableHead>
                      <TableHead>Açılma Tarixi</TableHead>
                      <TableHead>Bağlanma Tarixi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Məhsul Sayı</TableHead>
                      <TableHead>Ümumi Qiymət</TableHead>
                      <TableHead>Əməliyyat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{order.warehouse}</TableCell>
                        <TableCell>{order.opened}</TableCell>
                        <TableCell>
                          <span className={order.closed === "N/A" ? "text-muted-foreground" : ""}>
                            {order.closed}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell className="font-medium">
                          ${order.totalPrice.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            Ətraflı
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
