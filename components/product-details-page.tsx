"use client"

import { useState } from "react"
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
} from "lucide-react"

interface ProductDetailsPageProps {
  productId: string
  onBack: () => void
}

export function ProductDetailsPage({ productId, onBack }: ProductDetailsPageProps) {
  const [isEditing, setIsEditing] = useState(false)

  // Mock product data - in real app, fetch based on productId
  const product = {
    id: "PROD-001",
    name: "Laptop Dell XPS 13",
    sku: "DELL-XPS13-001",
    barcode: "1234567890123",
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Dell",
    model: "XPS 13",
    description:
      "High-performance ultrabook with 13-inch display, Intel Core i7 processor, 16GB RAM, and 512GB SSD storage.",
    price: 1299.99,
    cost: 899.99,
    margin: 30.8,
    stock: 45,
    minStock: 10,
    maxStock: 100,
    status: "Active",
    weight: 1.2,
    dimensions: "30.2 x 19.9 x 1.4 cm",
    supplier: "Dell Technologies",
    createdDate: "2023-06-15",
    lastUpdated: "2024-01-10",
    locations: [
      { warehouse: "Main Distribution Center", zone: "A", shelf: "A-12-3", quantity: 25 },
      { warehouse: "West Coast Hub", zone: "B", shelf: "B-08-1", quantity: 20 },
    ],
    recentMovements: [
      {
        id: "MOV-001",
        type: "Inbound",
        quantity: 10,
        date: "2024-01-15",
        reference: "PO-2024-001",
        warehouse: "Main Distribution Center",
      },
      {
        id: "MOV-002",
        type: "Outbound",
        quantity: -5,
        date: "2024-01-14",
        reference: "ORD-2024-045",
        warehouse: "Main Distribution Center",
      },
      {
        id: "MOV-003",
        type: "Transfer",
        quantity: -3,
        date: "2024-01-13",
        reference: "TRF-2024-012",
        warehouse: "Main Distribution Center",
      },
    ],
    salesData: {
      totalSold: 156,
      revenue: 202740,
      avgMonthlySales: 12,
      topCustomers: [
        { name: "ABC Corporation", quantity: 25, revenue: 32499.75 },
        { name: "Tech Solutions Inc", quantity: 18, revenue: 23399.82 },
        { name: "XYZ Limited", quantity: 15, revenue: 19499.85 },
      ],
    },
    specifications: {
      processor: "Intel Core i7-1165G7",
      memory: "16GB LPDDR4x",
      storage: "512GB PCIe NVMe SSD",
      display: "13.3-inch FHD+ (1920x1200)",
      graphics: "Intel Iris Xe Graphics",
      battery: "52WHr, up to 12 hours",
      connectivity: "Wi-Fi 6, Bluetooth 5.1",
      ports: "2x Thunderbolt 4, 1x microSD",
      os: "Windows 11 Home",
      warranty: "1 Year Limited Warranty",
    },
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
            <h1 className="text-2xl font-bold text-purple-primary">{product.name}</h1>
            <p className="text-gray-600">
              {product.sku} • {product.category}
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
          <TabsTrigger value="specifications">Xüsusiyyətlər</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <Label htmlFor="sku">SKU</Label>
                      <Input id="sku" defaultValue={product.sku} />
                    </div>
                    <div>
                      <Label htmlFor="category">Kateqoriya</Label>
                      <Input id="category" defaultValue={product.category} />
                    </div>
                    <div>
                      <Label htmlFor="brand">Marka</Label>
                      <Input id="brand" defaultValue={product.brand} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Barcode className="h-5 w-5 text-gray-400" />
                      <span className="font-mono text-sm">{product.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{product.model}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qiymət və Xərclər</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="price">Satış Qiyməti</Label>
                      <Input id="price" type="number" defaultValue={product.price} />
                    </div>
                    <div>
                      <Label htmlFor="cost">Maya Dəyəri</Label>
                      <Input id="cost" type="number" defaultValue={product.cost} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selling Price:</span>
                      <span className="font-bold text-green-600">${product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Price:</span>
                      <span className="font-medium">${product.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Margin:</span>
                      <span className="font-bold text-blue-600">{product.margin}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit:</span>
                      <span className="font-bold text-purple-600">${(product.price - product.cost).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stok Statusu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Stock:</span>
                  <span className="font-bold text-2xl">{product.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Stock:</span>
                  <span className="font-medium">{product.minStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Stock:</span>
                  <span className="font-medium">{product.maxStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={product.stock > product.minStock ? "default" : "destructive"}>
                    {product.stock > product.minStock ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {product.stock > product.minStock ? "In Stock" : "Low Stock"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Məhsul Təsviri</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea defaultValue={product.description} rows={4} />
              ) : (
                <p className="text-gray-700">{product.description}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fiziki Xüsusiyyətlər</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium">{product.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Barcode:</span>
                  <span className="font-mono text-sm">{product.barcode}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Təchizatçı Məlumatı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier:</span>
                  <span className="font-medium">{product.supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{product.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{product.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stok Yerləri</CardTitle>
                <CardDescription>Anbarlar üzrə cari stok paylanması</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Anbar</TableHead>
                      <TableHead>Zona</TableHead>
                      <TableHead>Rəf</TableHead>
                      <TableHead>Miqdar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.locations.map((location, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{location.warehouse}</TableCell>
                        <TableCell>{location.zone}</TableCell>
                        <TableCell className="font-mono text-sm">{location.shelf}</TableCell>
                        <TableCell>
                          <span className="font-bold">{location.quantity}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Son Hərəkətlər</CardTitle>
                <CardDescription>Son inventar hərəkətləri</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Növ</TableHead>
                      <TableHead>Miqdar</TableHead>
                      <TableHead>Tarix</TableHead>
                      <TableHead>İstinad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.recentMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <Badge variant={movement.type === "Inbound" ? "default" : "outline"}>
                            {movement.type === "Inbound" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={movement.quantity > 0 ? "text-green-600" : "text-red-600"}>
                            {movement.quantity > 0 ? "+" : ""}
                            {movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{movement.date}</TableCell>
                        <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{product.salesData.totalSold}</div>
                <p className="text-xs text-muted-foreground">units</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${product.salesData.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">lifetime</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{product.salesData.avgMonthlySales}</div>
                <p className="text-xs text-muted-foreground">units/month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Revenue/Unit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(product.salesData.revenue / product.salesData.totalSold).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">per unit</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Customers with highest purchase volume</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Müştəri</TableHead>
                    <TableHead>Alınmış Miqdar</TableHead>
                    <TableHead>Yaradılmış Gəlir</TableHead>
                    <TableHead>Orta Qiymət</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.salesData.topCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.quantity} units</TableCell>
                      <TableCell className="font-medium">${customer.revenue.toLocaleString()}</TableCell>
                      <TableCell>${(customer.revenue / customer.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Texniki Xüsusiyyətlər</CardTitle>
              <CardDescription>Ətraflı məhsul xüsusiyyətləri və funksiyaları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                    <span className="font-medium text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
