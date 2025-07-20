"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrendingUp, TrendingDown, History, RefreshCw } from "lucide-react"
// Using built-in JavaScript date formatting instead of date-fns
import { getProductStockHistory } from "@/lib/api/products"
import { toast } from "@/hooks/use-toast"

interface StockHistoryItem {
  companyId: string
  productId: string
  quantity: number
  actionType: number
  actionTypeText: "Increase" | "Decrease"
  createdAt: string
}

interface ProductStockHistoryProps {
  productId: string
  productName?: string
  trigger?: React.ReactNode
}

export function ProductStockHistory({ productId, productName, trigger }: ProductStockHistoryProps) {
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchProductStockHistory = async () => {
    if (!productId) return
    
    try {
      setLoading(true)
      const response = await getProductStockHistory(productId) as any
      if (response?.isSuccess) {
        setStockHistory(response.data)
      } else {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Məhsul stok tarixçəsi yüklənə bilmədi",
        })
      }
    } catch (error) {
      console.error("Product stock history fetch error:", error)
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul stok tarixçəsi yüklənərkən xəta baş verdi",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchProductStockHistory()
    }
  }, [open, productId])

  const getActionBadge = (actionType: number, actionTypeText: string) => {
    return actionType === 1 ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <TrendingUp className="w-3 h-3 mr-1" />
        Artırma
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <TrendingDown className="w-3 h-3 mr-1" />
        Azaltma
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    // Backend-dən gələn tarixi olduğu kimi göstər
    const date = new Date(dateString)
    return date.toLocaleString('az-AZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalChanges = () => {
    const increases = stockHistory
      .filter(item => item.actionType === 1)
      .reduce((sum, item) => sum + item.quantity, 0)
    
    const decreases = stockHistory
      .filter(item => item.actionType === 2)
      .reduce((sum, item) => sum + item.quantity, 0)

    return { increases, decreases, net: increases - decreases }
  }

  const totalChanges = getTotalChanges()

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <History className="w-4 h-4 mr-2" />
      Stok Tarixçəsi
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Stok Tarixçəsi
          </DialogTitle>
          <DialogDescription>
            {productName ? `${productName} məhsulu` : `${productId} məhsulu`} üzrə stok dəyişiklikləri
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Toplam Artırma</p>
                    <p className="text-2xl font-bold text-green-600">+{totalChanges.increases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-600">Toplam Azaltma</p>
                    <p className="text-2xl font-bold text-red-600">-{totalChanges.decreases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`h-4 w-4 rounded-full ${totalChanges.net >= 0 ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  <div>
                    <p className="text-sm font-medium">Xalis Dəyişim</p>
                    <p className={`text-2xl font-bold ${totalChanges.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalChanges.net >= 0 ? '+' : ''}{totalChanges.net}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Əməliyyat Tarixçəsi</CardTitle>
                <Button onClick={fetchProductStockHistory} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Yenilə
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Əməliyyat</TableHead>
                        <TableHead>Miqdar</TableHead>
                        <TableHead>Tarix</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                            Heç bir tarixçə tapılmadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        stockHistory.map((item, index) => (
                          <TableRow key={`${item.createdAt}-${index}`}>
                            <TableCell>
                              {getActionBadge(item.actionType, item.actionTypeText)}
                            </TableCell>
                            <TableCell className="font-medium">
                              <span className={item.actionType === 1 ? "text-green-600" : "text-red-600"}>
                                {item.actionType === 1 ? "+" : "-"}{item.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(item.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
