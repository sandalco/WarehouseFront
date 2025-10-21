"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  Package, 
  DollarSign,
  AlertTriangle,
  ImageIcon,
  Box,
  Plus,
  X
} from "lucide-react"
import { shelfApi } from "@/lib/api/shelf"
import type { ShelfProduct } from "@/types/shelf"
import { log } from "console"

export default function ShelfDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const shelfCode = params.code as string
  
  const [products, setProducts] = useState<ShelfProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Add product form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [adding, setAdding] = useState(false)
  const { toast } = useToast()

  // Məhsulları stokda olan və bitmiş kimi ayırmaq üçün
  const [inStockProducts, setInStockProducts] = useState<ShelfProduct[]>([])
  const [outOfStockProducts, setOutOfStockProducts] = useState<ShelfProduct[]>([])

  useEffect(() => {
    const loadShelfProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await shelfApi.getShelfProducts(shelfCode)
        if (response.isSuccess) {
          setProducts(response.data)
          
          // Bir dəfə loop edərək ayırırıq (data artıq quantity-ə görə sıralanıb)
          const inStock: ShelfProduct[] = []
          const outOfStock: ShelfProduct[] = []
          
          response.data.forEach(product => {
            if (product.quantity > 0) {
              inStock.push(product)
            } else {
              outOfStock.push(product)
            }
          })
          
          setInStockProducts(inStock)
          setOutOfStockProducts(outOfStock)
        } else {
          setError('Məhsullar yüklənə bilmədi')
        }
      } catch (error) {
        console.error('Rəf məhsulları yüklənərkən xəta:', error)
        setError('Xəta baş verdi')
      } finally {
        setLoading(false)
      }
    }

    if (shelfCode) {
      loadShelfProducts()
    }
  }, [shelfCode])

  const handleBackToInventory = () => {
    router.push('/warehouseman/inventory')
  }

  const getQuantityBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="secondary">Bitmiş</Badge>
    } else if (quantity < 5) {
      return <Badge variant="destructive">Az Stok</Badge>
    } else {
      return <Badge variant="default">Stokda</Badge>
    }
  }

  const handleAddProduct = async () => {
    if (!productId.trim() || !quantity.trim()) {
      toast({
        title: "Xəta",
        description: "Məhsul ID və miqdarı daxil edin",
        variant: "destructive"
      })
      return
    }

    const quantityNum = parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "Xəta", 
        description: "Düzgün miqdar daxil edin",
        variant: "destructive"
      })
      return
    }

    try {
      setAdding(true)
      const productIds = { [productId.trim()]: quantityNum }
      const response = await shelfApi.addProductsToShelf(shelfCode, productIds)
      if (response.isSuccess) {
        toast({
          title: "Uğurlu",
          description: "Məhsul rəfə əlavə edildi"
        })
        
        // Reset form
        setProductId('')
        setQuantity('')
        setShowAddForm(false)
        
        // Reload products
        const updatedResponse = await shelfApi.getShelfProducts(shelfCode)
        if (updatedResponse.isSuccess) {
          setProducts(updatedResponse.data)
          
          // Yenidən ayırırıq
          const inStock: ShelfProduct[] = []
          const outOfStock: ShelfProduct[] = []
          
          updatedResponse.data.forEach(product => {
            if (product.quantity > 0) {
              inStock.push(product)
            } else {
              outOfStock.push(product)
            }
          })
          
          setInStockProducts(inStock)
          setOutOfStockProducts(outOfStock)
        }
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.join(', ') || 'Məhsul əlavə edilə bilmədi',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Məhsul əlavə edərkən xəta:', error)
      toast({
        title: "Xəta",
        description: "Məhsul əlavə edilərkən xəta baş verdi",
        variant: "destructive"
      })
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToInventory}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            İnventara qayıt
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Rəf {shelfCode}</h1>
            <p className="text-gray-600">Məhsullar yüklənir...</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToInventory}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            İnventara qayıt
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Rəf {shelfCode}</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToInventory}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            İnventara qayıt
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Rəf {shelfCode} - Məhsullar</h1>
            <p className="text-gray-600">
              Toplam {products.length} məhsul növü
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          {showAddForm ? (
            <>
              <X className="h-4 w-4" />
              Ləğv et
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Məhsul əlavə et
            </>
          )}
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Rəfə məhsul əlavə et</CardTitle>
            <CardDescription>
              Məhsul ID və miqdarını daxil edərək rəfə məhsul əlavə edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Məhsul ID</Label>
                <Input
                  id="productId"
                  placeholder="Məhsul ID-sini daxil edin"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  disabled={adding}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Miqdar</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Miqdarı daxil edin"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  disabled={adding}
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  onClick={handleAddProduct}
                  disabled={adding || !productId.trim() || !quantity.trim()}
                  className="w-full"
                >
                  {adding ? 'Əlavə edilir...' : 'Əlavə et'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Box className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bu rəfdə məhsul yoxdur</h3>
          <p className="text-gray-500">Hələlik heç bir məhsul əlavə edilməyib</p>
        </div>
      ) : (
        <>
          {/* Stokda olan məhsullar */}
          {inStockProducts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Stokda olan məhsullar ({inStockProducts.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inStockProducts.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {item.product.name}
                    </CardTitle>
                  </div>
                  {getQuantityBadge(item.quantity)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Məhsul şəkli */}
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.product.imageUrl && item.product.imageUrl !== "aaaa" ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-gray-400"><svg class="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-sm">Şəkil yoxdur</span></div>';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="h-8 w-8 mb-2" />
                      <span className="text-sm">Şəkil yoxdur</span>
                    </div>
                  )}
                </div>

                {/* Məlumatlar */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      Rəfdə: <strong>{item.quantity} ədəd</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Ümumi stok: <strong>{item.product.quantity} ədəd</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Alış: ₼{item.product.purchasePrice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Satış: ₼{item.product.sellPrice}</span>
                    </div>
                  </div>

                  {item.product.description && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.product.description}
                      </p>
                    </div>
                  )}

                  {item.product.minRequire > 0 && item.quantity <= item.product.minRequire && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-800">
                        Minimum tələb: {item.product.minRequire} ədəd
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
                ))}
              </div>
            </div>
          )}

          {/* Bitmiş məhsullar */}
          {outOfStockProducts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-500">
                Bitmiş məhsullar ({outOfStockProducts.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {outOfStockProducts.map((item) => (
                  <Card key={item.id} className="overflow-hidden opacity-60 border-gray-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight text-gray-600">
                            {item.product.name}
                          </CardTitle>
                        </div>
                        {getQuantityBadge(item.quantity)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Məhsul şəkli */}
                      <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product.imageUrl && item.product.imageUrl !== "aaaa" ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-gray-400"><svg class="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-sm">Şəkil yoxdur</span></div>';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <span className="text-sm">Şəkil yoxdur</span>
                          </div>
                        )}
                      </div>

                      {/* Məlumatlar */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600">
                            Rəfdə: <strong>0 ədəd</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            Ümumi stok: <strong>{item.product.quantity} ədəd</strong>
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-gray-600">Alış: ₼{item.product.purchasePrice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600">Satış: ₼{item.product.sellPrice}</span>
                          </div>
                        </div>

                        {item.product.description && (
                          <div className="pt-2 border-t">
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {item.product.description}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-800 font-medium">
                            Məhsul bitib
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
