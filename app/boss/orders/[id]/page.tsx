"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getOrderById } from "@/lib/api/order"
import { Order } from "@/types/order"
import { OrderDetailsPageBoss } from "@/components/pages/OrderDetailsPageBoss"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
          const orderData = await getOrderById(params.id as string);
          setOrder(orderData);
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

  return (
    <div className="container mx-auto px-4 py-6">
      <OrderDetailsPageBoss order={order} onBack={handleBack} />
    </div>
  )
}
