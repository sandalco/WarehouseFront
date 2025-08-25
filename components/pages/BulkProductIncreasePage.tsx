"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/lib/api/products"
import { bulkIncreaseProductStock } from "@/lib/api/products"
import { Product } from "@/types/product"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2, Package, AlertTriangle, CheckCircle } from "lucide-react"

interface BulkProductIncreasePageProps {
  onBack: () => void
}

interface ProductIncrease {
  id: string
  name: string
  sku: string
  currentStock: number
  increaseQuantity: number
  price: number
}

export function BulkProductIncreasePage({ onBack }: BulkProductIncreasePageProps) {
  const { toast } = useToast()
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductIncrease[]>([])
  const [selectedProductId, setSelectedProductId] = useState("")
  const [increaseQuantity, setIncreaseQuantity] = useState(1)
  const [initialPrice, setInitialPrice] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts()
        setAvailableProducts(products)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Xəta",
          description: "Məhsullar yüklənmədi",
          variant: "destructive",
        })
      }
    }

    fetchProducts()
  }, [toast])

  const addProduct = () => {
    if (!selectedProductId) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa məhsul seçin",
        variant: "destructive",
      })
      return
    }

    if (!increaseQuantity || increaseQuantity <= 0) {
      toast({
        title: "Xəta",
        description: "Artırma miqdarı 0-dan böyük olmalıdır",
        variant: "destructive",
      })
      return
    }

    // Məhsulun artıq seçilməsini yoxla
    const existingProduct = selectedProducts.find(p => p.id === selectedProductId)
    if (existingProduct) {
      toast({
        title: "Xəta",
        description: "Bu məhsul artıq seçilmişdir",
        variant: "destructive",
      })
      return
    }

    const selectedProduct = availableProducts.find(p => p.id === selectedProductId)
    if (!selectedProduct) return

    const newProduct: ProductIncrease = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      sku: selectedProduct.sku,
      currentStock: selectedProduct.quantity,
      increaseQuantity: increaseQuantity,
      price: initialPrice || selectedProduct.purchasePrice
    }

    setSelectedProducts([...selectedProducts, newProduct])
    setSelectedProductId("")
    setIncreaseQuantity(1)
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
  }

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return
    
    setSelectedProducts(selectedProducts.map(p => 
      p.id === productId 
        ? { ...p, increaseQuantity: quantity }
        : p
    ))
  }

  const updateProductPrice = (productId: string, price: number) => {
    if (price < 0) return
    
    setSelectedProducts(selectedProducts.map(p => 
      p.id === productId 
        ? { ...p, price: price }
        : p
    ))
  }

  const handleBulkIncrease = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Xəta",
        description: "Zəhmət olmasa ən azı bir məhsul seçin",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const increaseProductDtos = selectedProducts.map(product => ({
        productId: product.id,
        quantity: product.increaseQuantity,
        price: product.price
      }))

      await bulkIncreaseProductStock(increaseProductDtos)
      
      toast({
        title: "Uğurlu",
        description: `${selectedProducts.length} məhsulun stoku artırıldı`,
        variant: "default",
      })
      
      // Səhifəni təmizlə
      setSelectedProducts([])
      
      // Məhsulları yenidən yüklə
      const products = await getProducts()
      setAvailableProducts(products)
      
    } catch (error) {
      console.error("Error bulk increasing products:", error)
      toast({
        title: "Xəta",
        description: "Məhsulların stoku artırılmadı",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalProducts = () => selectedProducts.length
  const getTotalIncrease = () => selectedProducts.reduce((sum, p) => sum + p.increaseQuantity, 0)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Məhsul Stoku Artırma</h1>
            <p className="text-gray-600">Seçilmiş məhsulların stokunu artırın</p>
          </div>
        </div>
        
        {selectedProducts.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {getTotalProducts()} məhsul, {getTotalIncrease()} ümumi artırma
            </div>
            <Button
              onClick={handleBulkIncrease}
              disabled={isLoading}
              className="bg-purple-primary hover:bg-purple-600"
            >
              {isLoading ? "Artırılır..." : "Stoku Artır"}
            </Button>
          </div>
        )}
      </div>

      {/* Product Addition Form */}
      <Card>
        <CardHeader>
          <CardTitle>Məhsul Əlavə Et</CardTitle>
          <CardDescription>Stokunu artırmaq istədiyiniz məhsulları seçin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="product">Məhsul</Label>
              <Select 
                value={selectedProductId} 
                onValueChange={(value) => {
                  setSelectedProductId(value);
                  const product = availableProducts.find(p => p.id === value);
                  if (product && initialPrice === undefined) {
                    setInitialPrice(product.purchasePrice);
                  }
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="Məhsul seçin" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts
                    .filter(p => !selectedProducts.some(sp => sp.id === p.id))
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{product.name}</span>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant="secondary">
                              Stok: {product.quantity}
                            </Badge>
                            <Badge variant="outline">
                              Alış: {product.purchasePrice}₼
                            </Badge>
                            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity">Artırma Miqdarı</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={increaseQuantity || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : Number(e.target.value);
                    setIncreaseQuantity(value || 0);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="initialPrice">Alış Qiyməti (₼)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="initialPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={initialPrice || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : Number(e.target.value);
                      setInitialPrice(value || 0);
                    }}
                    placeholder="Məhsulun alış qiyməti"
                  />
                  <Button onClick={addProduct} className="bg-purple-primary hover:bg-purple-600">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Products List */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Seçilmiş Məhsullar ({selectedProducts.length})</CardTitle>
            <CardDescription>Stoku artırılacaq məhsullar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Package className="h-6 w-6 text-gray-400" />
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">
                            Cari Stok: {product.currentStock}
                          </Badge>
                          <Badge variant="default">
                            Yeni Stok: {product.currentStock + product.increaseQuantity}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`qty-${product.id}`} className="text-sm">
                          Artırma:
                        </Label>
                        <Input
                          id={`qty-${product.id}`}
                          type="number"
                          min="1"
                          value={product.increaseQuantity}
                          onChange={(e) => updateProductQuantity(product.id, Math.max(1, Number.parseInt(e.target.value) || 1))}
                          className="w-20"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`price-${product.id}`} className="text-sm">
                          Alış Qiyməti (₼):
                        </Label>
                        <Input
                          id={`price-${product.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.price}
                          onChange={(e) => updateProductPrice(product.id, Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-24"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Xülasə</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{getTotalProducts()}</div>
                <div className="text-sm text-gray-600">Məhsul</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{getTotalIncrease()}</div>
                <div className="text-sm text-gray-600">Ümumi Artırma</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {availableProducts.reduce((sum, p) => {
                    const selected = selectedProducts.find(sp => sp.id === p.id)
                    return sum + (selected ? selected.increaseQuantity : 0)
                  }, 0)}
                </div>
                <div className="text-sm text-gray-600">Yeni Ümumi Stok</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
