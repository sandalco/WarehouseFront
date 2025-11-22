"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getOrderById } from "@/lib/api/order"
import { Order } from "@/types/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2, Package, User, Calendar, MapPin, FileText, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Status tərcümələri
const statusTranslations: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  Pending: { label: "Gözləyir", variant: "outline" },
  StockConfirmed: { label: "Stok Təsdiqləndi", variant: "secondary" },
  StockInsufficient: { label: "Stok Çatışmır", variant: "destructive" },
  Confirmed: { label: "Təsdiqləndi", variant: "default" },
  Completed: { label: "Tamamlandı", variant: "default" },
  Cancelled: { label: "Ləğv Edildi", variant: "destructive" },
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (params.id) {
          const response = await getOrderById(params.id as string);
          if (response.data) {
            setOrder(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Xəta",
          description: "Sifariş məlumatları yüklənə bilmədi.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, toast])

  const handleBack = () => {
    router.back()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    const months = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
    ]
    
    const month = months[date.getMonth()]
    
    return `${day} ${month} ${year} ${hours}:${minutes}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price) + ' ₼'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Sifariş yüklənir...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Sifariş Tapılmadı</CardTitle>
            <CardDescription className="text-center">
              Axtardığınız sifariş mövcud deyil və ya silinib.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = statusTranslations[order.status] || { label: order.status, variant: "outline" as const }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Sifariş Detalları</h1>
            <p className="text-sm text-muted-foreground mt-1">#{order.id.slice(0, 8)}</p>
          </div>
        </div>
        <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
          {statusInfo.label}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sol tərəf - Əsas məlumatlar */}
        <div className="md:col-span-2 space-y-6">
          {/* Ümumi məlumatlar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ümumi Məlumatlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Müştəri</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{order.customer}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Anbar</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{order.warehouse}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Açılma Tarixi</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium text-sm">{formatDate(order.opened)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Açan Şəxs</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{order.openedBy}</p>
                  </div>
                </div>
                {order.closed && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bağlanma Tarixi</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium text-sm">{formatDate(order.closed)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bağlayan Şəxs</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{order.closedBy}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {order.note && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Qeyd
                    </p>
                    <p className="text-sm bg-muted p-3 rounded-md">{order.note}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Məhsullar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Məhsullar ({order.products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.products.map((product, index) => (
                  <div key={product.id}>
                    {index > 0 && <Separator className="my-3" />}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Rəf: <span className="font-medium text-foreground">{product.shelfCode}</span></span>
                          <span>Miqdar: <span className="font-medium text-foreground">{product.quantity}</span></span>
                          <span>Vahid qiymət: <span className="font-medium text-foreground">{formatPrice(product.unitPrice)}</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Toplam</p>
                        <p className="text-lg font-bold">{formatPrice(product.totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Çatışmayan Məhsullar */}
          {order.insufficientProducts && order.insufficientProducts.length > 0 && (
            <Card className="border-destructive">
              <CardHeader className="bg-destructive/10">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Çatışmayan Məhsullar ({order.insufficientProducts.length})
                </CardTitle>
                <CardDescription>
                  Bu məhsullar anbarda kifayət qədər stokda yoxdur
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {order.insufficientProducts.map((product, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-3" />}
                      <div className="flex justify-between items-center">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Tələb olunan miqdar: <span className="font-semibold text-destructive">{product.quantity} ədəd</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sağ tərəf - Maliyyə məlumatları */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Maliyyə Məlumatları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ümumi Miqdar</span>
                  <span className="font-medium">{order.quantity} ədəd</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-medium">Ümumi Məbləğ</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
