"use client"

import { useEffect, useState } from "react"
import { getWarehouses } from "@/lib/api/warehouse"
import { getCustomers } from "@/lib/api/customer"
import { getProducts } from "@/lib/api/products"
import { Product } from "@/types/product"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2, Package, Building, Warehouse, AlertTriangle, CheckCircle } from "lucide-react"
import { Warehouse as WarehouseType } from "@/types/warehouse"
import { Customer } from "@/types/customer"
import { createOrder } from "@/lib/api/order"
import { OrderCreate, OrderCreateItem, OrderAddress } from "@/types/order"

interface CreateOrderPageProps {
  onBack: () => void
}

interface OrderProduct {
  id: string
  name: string
  sku: string
  sellPrice: number
  quantity: number
  availableStock: number
}

export function CreateOrderPage({ onBack }: CreateOrderPageProps) {
  const { toast } = useToast()
  const [orderType, setOrderType] = useState<"incoming" | "outgoing" | "">("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [productQuantity, setProductQuantity] = useState(1)
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [address, setAddress] = useState<OrderAddress>({
    city: "",
    district: "",
    street: "",
    zipCode: "",
  })

  useEffect(() => {
    getWarehouses().then(setWarehouses)
    getCustomers().then(setCustomers)
    getProducts().then(setAvailableProducts)
  }, [])

  // Customer seçiləndə address-i doldur
  useEffect(() => {
    if (orderType === "outgoing" && selectedCustomer) {
      const customer = customers.find((c) => c.id === selectedCustomer)
      if (customer && customer.address) {
        setAddress({
          city: customer.address.city || "",
          district: customer.address.district || "",
          street: customer.address.street || "",
          zipCode: customer.address.zipCode || "",
        })
      }
    }
  }, [selectedCustomer, orderType, customers])

  const addProduct = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      })
      return
    }

    const product = availableProducts.find((p) => p.id === selectedProduct)
    if (!product) return

    const existingProduct = orderProducts.find((p) => p.id === selectedProduct)
    if (existingProduct) {
      toast({
        title: "Error",
        description: "This product is already added to the order",
        variant: "destructive",
      })
      return
    }

    if (orderType === "outgoing" && productQuantity > product.availableStock) {
      toast({
        title: "Error",
        description: `Only ${product.availableStock} units available in stock`,
        variant: "destructive",
      })
      return
    }

    const newOrderProduct: OrderProduct = {
      ...product,
      quantity: productQuantity,
    }

    setOrderProducts([...orderProducts, newOrderProduct])
    setSelectedProduct("")
    setProductQuantity(1)

    toast({
      title: "Product Added",
      description: `${product.name} added to order`,
    })
  }

  const removeProduct = (productId: string) => {
    setOrderProducts(orderProducts.filter((p) => p.id !== productId))
    toast({
      title: "Product Removed",
      description: "Product removed from order",
    })
  }

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    const product = availableProducts.find((p) => p.id === productId)
    if (!product) return

    if (orderType === "outgoing" && newQuantity > product.availableStock) {
      toast({
        title: "Error",
        description: `Only ${product.availableStock} units available in stock`,
        variant: "destructive",
      })
      return
    }

    setOrderProducts(orderProducts.map((p) => (p.id === productId ? { ...p, quantity: Math.max(1, newQuantity) } : p)))
  }

  const calculateTotal = () => {
    return orderProducts.reduce((total, product) => total + product.sellPrice * product.quantity, 0)
  }

  const handleCreateOrder = async () => {
    if (!orderType) {
      toast({
        title: "Error",
        description: "Please select order type",
        variant: "destructive",
      })
      return
    }

    if (!selectedWarehouse) {
      toast({
        title: "Error",
        description: "Please select a warehouse",
        variant: "destructive",
      })
      return
    }

    if (orderType === "outgoing" && !selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      })
      return
    }

    if (orderProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product",
        variant: "destructive",
      })
      return
    }

    const orderItems: OrderCreateItem[] = orderProducts.map((p) => ({
      productId: p.id,
      productName: p.name,
      unitPrice: p.sellPrice,
      imageUrl: "aa",
      quantity: p.quantity,
    }))

    const warehouse = warehouses.find((w) => w.id === selectedWarehouse)

    const orderData: OrderCreate = {
      warehouseId: selectedWarehouse,
      warehouseName: warehouse?.name || "",
      customerId: selectedCustomer,
      address,
      orderItems,
    }

    try {
      await createOrder(orderData)
      toast({
        title: "Order Created",
        description: "Order has been created successfully",
      })
      onBack()
    } catch (error) {
      toast({
        title: "Error",
        description: "Order could not be created",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sifarişlərə Qayıt
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-purple-primary">Yeni Sifariş Yarat</h1>
            <p className="text-gray-600">Yeni daxil olan və ya çıxan sifariş yaradın</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Sifariş Məlumatları</CardTitle>
              <CardDescription>Sifariş haqqında əsas məlumatlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderType">Sifariş Növü *</Label>
                  <Select value={orderType} onValueChange={(value: "incoming" | "outgoing") => setOrderType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sifariş növünü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incoming">Daxil olan (Qəbul)</SelectItem>
                      <SelectItem value="outgoing">Çıxan (Göndərmə)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="warehouse">Anbar *</Label>
                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Anbar seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          <div className="flex items-center space-x-2">
                            <Warehouse className="h-4 w-4" />
                            <span>{warehouse.name}</span>
                            <span className="text-sm text-gray-500">({warehouse.city})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orderType === "outgoing" && (
                  <div>
                    <Label htmlFor="customer">Müştəri *</Label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Müştəri seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4" />
                              <span>{customer.fullName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Vendor seçimi varsa buraya əlavə et */}
              </div>

              {/* Address inputları */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Şəhər</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={e => setAddress(addr => ({ ...addr, city: e.target.value }))}
                    placeholder="Şəhər"
                  />
                </div>
                <div>
                  <Label htmlFor="district">Rayon</Label>
                  <Input
                    id="district"
                    value={address.district}
                    onChange={e => setAddress(addr => ({ ...addr, district: e.target.value }))}
                    placeholder="Rayon"
                  />
                </div>
                <div>
                  <Label htmlFor="street">Küçə</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={e => setAddress(addr => ({ ...addr, street: e.target.value }))}
                    placeholder="Küçə"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Poçt Kodu</Label>
                  <Input
                    id="zipCode"
                    value={address.zipCode}
                    onChange={e => setAddress(addr => ({ ...addr, zipCode: e.target.value }))}
                    placeholder="AZxxxx"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Qeydlər</Label>
                <Textarea
                  id="notes"
                  placeholder="Əlavə qeydlər və ya xüsusi təlimatlar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Products */}
          <Card>
            <CardHeader>
              <CardTitle>Məhsul Əlavə Et</CardTitle>
              <CardDescription>Bu sifariş üçün məhsul və miqdar seçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="product">Məhsul</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Məhsul seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4" />
                              <span>{product.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>${product.sellPrice}</span>
                              {orderType === "outgoing" && (
                                <Badge variant={product.quantity < 10 ? "destructive" : "outline"}>
                                  Stock: {product.quantity}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Miqdar</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    />
                    <Button onClick={addProduct} className="bg-purple-primary hover:bg-purple-600">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          {orderProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sifariş Məhsulları ({orderProducts.length})</CardTitle>
                <CardDescription>Bu sifarişə əlavə edilmiş məhsullar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Package className="h-6 w-6 text-gray-400" />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                            <p className="text-sm text-gray-600">Price: {product.sellPrice}₼</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`qty-${product.id}`} className="text-sm">
                              Miq.:
                            </Label>
                            <Input
                              id={`qty-${product.id}`}
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) => updateProductQuantity(product.id, Number.parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                          </div>

                          <div className="text-right">
                            <p className="font-medium">₼{(product.sellPrice * product.quantity).toFixed(2)}</p>
                            {orderType === "outgoing" && product.quantity > product.availableStock && (
                              <p className="text-xs text-red-600 flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Insufficient stock
                              </p>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
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
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sifariş Xülasəsi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Order Type:</span>
                  <Badge variant={orderType === "outgoing" ? "default" : "secondary"}>
                    {orderType || "Not selected"}
                  </Badge>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Warehouse:</span>
                  <span className="text-right">
                    {selectedWarehouse ? warehouses.find((w) => w.id === selectedWarehouse)?.name : "Not selected"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>{orderType === "outgoing" ? "Customer:" : "Vendor:"}</span>
                  <span className="text-right">
                    {orderType === "outgoing"
                      ? selectedCustomer
                        ? customers.find((c) => c.id === selectedCustomer)?.name
                        : "Not selected"
                      : "Vendor seçimi yoxdur"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Priority:</span>
                  <Badge
                    variant={priority === "high" ? "destructive" : priority === "medium" ? "secondary" : "outline"}
                  >
                    {priority || "Not selected"}
                  </Badge>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Due Date:</span>
                  <span>{dueDate || "Not selected"}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Total Products:</span>
                  <span>{orderProducts.length}</span>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span>Total Quantity:</span>
                  <span>{orderProducts.reduce((sum, p) => sum + p.quantity, 0)}</span>
                </div>

                <div className="flex justify-between font-medium text-lg">
                  <span>Total Value:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handleCreateOrder} className="w-full bg-purple-primary hover:bg-purple-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Sifariş Yarat
              </Button>
            </CardContent>
          </Card>

          {/* Validation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Doğrulama Statusu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className={`h-4 w-4 ${orderType ? "text-green-600" : "text-gray-400"}`} />
                <span>Order type selected</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className={`h-4 w-4 ${selectedWarehouse ? "text-green-600" : "text-gray-400"}`} />
                <span>Warehouse selected</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle
                  className={`h-4 w-4 ${
                    (orderType === "outgoing" && selectedCustomer) || (orderType === "incoming" && false)
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span>{orderType === "outgoing" ? "Customer" : "Vendor"} selected</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className={`h-4 w-4 ${orderProducts.length > 0 ? "text-green-600" : "text-gray-400"}`} />
                <span>Products added</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className={`h-4 w-4 ${priority && dueDate ? "text-green-600" : "text-gray-400"}`} />
                <span>Priority & due date set</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
