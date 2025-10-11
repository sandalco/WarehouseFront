"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Package,
  Barcode,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye,
  Warehouse,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "@/lib/axios"

interface ProductDetail {
  id: string
  name: string
  description: string
  imageUrl: string
  purchasePrice: number
  sellPrice: number
  profit: number
  quantity: number
  minRequire: number
  totalSold: number
  totalPurchasedQuantity: number
  totalPurchasedCost: number
  averagePurchasePrice: number
  stockDetails: Array<{
    warehouse: string
    shelfName: string
    quantity: number
  }>
  stockHistories: Array<{
    date: string
    quantity: number
    actionType: "Increase" | "Decrease"
  }>
}

interface ProductDetailsPageProps {
  productId: string
  onBack: () => void
}

export function ProductDetailsPage({ productId, onBack }: ProductDetailsPageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Manat formatı
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("az-AZ", {
      style: "currency", 
      currency: "AZN",
    }).format(value)
  }

  // Tarix formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("az-AZ", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Məhsul məlumatlarını yüklə
  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/product/detailed/${productId}`)
      if (response.isSuccess) {
        setProduct(response.data)
      } else {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Məhsul məlumatları yüklənə bilmədi",
        })
      }
    } catch (error) {
      console.error("Product detail fetch error:", error)
      toast({
        variant: "destructive", 
        title: "Xəta",
        description: "Məhsul məlumatları yüklənərkən xəta baş verdi",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetail()
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Yüklənir...</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Məhsul tapılmadı</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Məhsullara Qayıt
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">
              {product.id} • Məhsul Detayları
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Ləğv Et
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <Save className="h-4 w-4 mr-2" />
                Dəyişiklikləri Saxla
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Məhsulu Redaktə Et
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Ümumi</TabsTrigger>
          <TabsTrigger value="inventory">İnventar</TabsTrigger>
          <TabsTrigger value="sales">Satış Məlumatları</TabsTrigger>
          <TabsTrigger value="history">Stok Tarixçəsi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Məhsul Şəkli */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Məhsul Şəkli</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg"
                  }}
                />
              </CardContent>
            </Card>

            {/* Məhsul Məlumatı */}
            <Card>
              <CardHeader>
                <CardTitle>Məhsul Məlumatı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="name">Məhsul Adı</Label>
                      <Input id="name" defaultValue={product.name} />
                    </div>
                    <div>
                      <Label htmlFor="description">Təsvir</Label>
                      <Textarea id="description" defaultValue={product.description} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Barcode className="h-5 w-5 text-muted-foreground" />
                      <span className="font-mono text-sm">{product.id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Təsvir:</span>
                      <p className="text-sm mt-1">{product.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Qiymət və Mənfəət */}
            <Card>
              <CardHeader>
                <CardTitle>Qiymət və Mənfəət</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alış Qiyməti:</span>
                  <span className="font-medium">{formatCurrency(product.purchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Satış Qiyməti:</span>
                  <span className="font-bold text-green-600">{formatCurrency(product.sellPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mənfəət:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(product.profit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orta Alış:</span>
                  <span className="font-medium">{formatCurrency(product.averagePurchasePrice)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stok Statusu */}
            <Card>
              <CardHeader>
                <CardTitle>Stok Statusu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mövcud Stok:</span>
                  <span className="font-bold text-2xl">{product.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Tələb:</span>
                  <span className="font-medium">{product.minRequire}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={product.quantity > product.minRequire ? "default" : "destructive"}>
                    {product.quantity > product.minRequire ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {product.quantity > product.minRequire ? "Stokda" : "Az Stok"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ümumi Satılan:</span>
                  <span className="font-medium">{product.totalSold}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ümumi Məlumatlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alış Məlumatları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ümumi Alınan:</span>
                  <span className="font-medium">{product.totalPurchasedQuantity} ədəd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ümumi Xərc:</span>
                  <span className="font-medium">{formatCurrency(product.totalPurchasedCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orta Alış Qiyməti:</span>
                  <span className="font-medium">{formatCurrency(product.averagePurchasePrice)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satış Məlumatları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ümumi Satılan:</span>
                  <span className="font-medium">{product.totalSold} ədəd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ümumi Gəlir:</span>
                  <span className="font-medium">{formatCurrency(product.totalSold * product.sellPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ümumi Mənfəət:</span>
                  <span className="font-bold text-green-600">{formatCurrency(product.totalSold * product.profit)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Stok Yerləri
              </CardTitle>
              <CardDescription>Anbarlar üzrə cari stok paylanması</CardDescription>
            </CardHeader>
            <CardContent>
              {product.stockDetails && product.stockDetails.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Anbar</TableHead>
                      <TableHead>Rəf</TableHead>
                      <TableHead>Miqdar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.stockDetails.map((stock, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{stock.warehouse}</TableCell>
                        <TableCell className="font-mono text-sm">{stock.shelfName}</TableCell>
                        <TableCell>
                          <span className="font-bold">{stock.quantity} ədəd</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">Stok məlumatı tapılmadı</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ümumi Satılan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{product.totalSold}</div>
                <p className="text-xs text-muted-foreground">ədəd</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ümumi Gəlir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(product.totalSold * product.sellPrice)}</div>
                <p className="text-xs text-muted-foreground">ömürlük</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ümumi Mənfəət</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(product.totalSold * product.profit)}</div>
                <p className="text-xs text-muted-foreground">ömürlük</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Satış Performansı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orta Satış Qiyməti:</span>
                  <span className="font-medium">{formatCurrency(product.sellPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vahid Mənfəət:</span>
                  <span className="font-medium text-green-600">{formatCurrency(product.profit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mənfəət Dərəcəsi:</span>
                  <span className="font-medium text-blue-600">
                    {((product.profit / product.sellPrice) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stok Dövriyyəsi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mövcud Stok:</span>
                  <span className="font-medium">{product.quantity} ədəd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Satılan/Alınan:</span>
                  <span className="font-medium">
                    {product.totalPurchasedQuantity > 0 
                      ? ((product.totalSold / product.totalPurchasedQuantity) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qalan Stok:</span>
                  <span className="font-medium">
                    {product.totalPurchasedQuantity - product.totalSold} ədəd
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Son Hərəkətlər
                  </CardTitle>
                  <CardDescription>Son 5 stok hərəkəti</CardDescription>
                </div>
                <Link href={`/boss/stock-history?productId=${product.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Bütün Tarixçəni Gör
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {product.stockHistories && product.stockHistories.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Əməliyyat</TableHead>
                      <TableHead>Miqdar</TableHead>
                      <TableHead>Tarix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.stockHistories.slice(0, 5).map((history, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant={history.actionType === "Increase" ? "default" : "destructive"}>
                            {history.actionType === "Increase" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {history.actionType === "Increase" ? "Artırma" : "Azaltma"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={history.actionType === "Increase" ? "text-green-600" : "text-red-600"}>
                            {history.actionType === "Increase" ? "+" : "-"}
                            {history.quantity} ədəd
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(history.date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">Stok hərəkəti tapılmadı</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
