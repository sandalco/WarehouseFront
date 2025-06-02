"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2, Package, Building, Warehouse, AlertTriangle, CheckCircle } from "lucide-react"

interface CreateOrderPageProps {
  onBack: () => void
}

interface OrderProduct {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  availableStock: number
}

export function CreateOrderPage({ onBack }: CreateOrderPageProps) {
  const { toast } = useToast()
  const [orderType, setOrderType] = useState<"incoming" | "outgoing" | "">("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedVendor, setSelectedVendor] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [productQuantity, setProductQuantity] = useState(1)

  // Mock data
  const customers = [
    { id: "CUST-001", name: "ABC Corporation" },
    { id: "CUST-002", name: "XYZ Limited" },
    { id: "CUST-003", name: "Tech Solutions Inc" },
    { id: "CUST-004", name: "Global Trade Co" },
  ]

  const vendors = [
    { id: "VEND-001", name: "Tech Supplies Inc" },
    { id: "VEND-002", name: "Global Electronics" },
    { id: "VEND-003", name: "Office Equipment Ltd" },
  ]

  const warehouses = [
    { id: "WH-001", name: "Main Distribution Center", location: "New York, NY" },
    { id: "WH-002", name: "West Coast Hub", location: "Los Angeles, CA" },
    { id: "WH-003", name: "Central Storage", location: "Chicago, IL" },
  ]

  const availableProducts = [
    {
      id: "PROD-001",
      name: "Laptop Dell XPS 13",
      sku: "DELL-XPS13-001",
      price: 1299.99,
      availableStock: 45,
    },
    {
      id: "PROD-002",
      name: "Wireless Mouse",
      sku: "MOUSE-WL-002",
      price: 29.99,
      availableStock: 150,
    },
    {
      id: "PROD-003",
      name: "Monitor 24 inch",
      sku: "MON-24-003",
      price: 299.99,
      availableStock: 8,
    },
    {
      id: "PROD-004",
      name: "Keyboard Mechanical",
      sku: "KB-MECH-004",
      price: 89.99,
      availableStock: 75,
    },
  ]

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

    // Check if product already exists in order
    const existingProduct = orderProducts.find((p) => p.id === selectedProduct)
    if (existingProduct) {
      toast({
        title: "Error",
        description: "This product is already added to the order",
        variant: "destructive",
      })
      return
    }

    // Check stock availability for outgoing orders
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
    return orderProducts.reduce((total, product) => total + product.price * product.quantity, 0)
  }

  const handleCreateOrder = () => {
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

    if (orderType === "incoming" && !selectedVendor) {
      toast({
        title: "Error",
        description: "Please select a vendor",
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

    if (!priority || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Create order logic here
    toast({
      title: "Order Created",
      description: "Order has been created successfully",
    })

    onBack()
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
                            <span className="text-sm text-gray-500">({warehouse.location})</span>
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
                              <span>{customer.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {orderType === "incoming" && (
                  <div>
                    <Label htmlFor="vendor">Təchizatçı *</Label>
                    <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Təchizatçı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4" />
                              <span>{vendor.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="priority">Prioritet *</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioritet seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Yüksək</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Aşağı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Son Tarix *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
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
                              <span>${product.price}</span>
                              {orderType === "outgoing" && (
                                <Badge variant={product.availableStock < 10 ? "destructive" : "outline"}>
                                  Stock: {product.availableStock}
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
                            <p className="text-sm text-gray-600">Price: ${product.price}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`qty-${product.id}`} className="text-sm">
                              Qty:
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
                            <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
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
                      : selectedVendor
                        ? vendors.find((v) => v.id === selectedVendor)?.name
                        : "Not selected"}
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
                    (orderType === "outgoing" && selectedCustomer) || (orderType === "incoming" && selectedVendor)
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
