"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react"
import { ImportExportButtons } from "./import-export-utils"
import { useToast } from "@/hooks/use-toast"

interface ProductManagementProps {
  onViewProduct?: (productId: string) => void
}

export function ProductManagement({ onViewProduct }: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const products = [
    {
      id: "MƏHS-001",
      name: "Laptop Dell XPS 13",
      sku: "DELL-XPS13-001",
      category: "Elektronika",
      price: 1299.99,
      stock: 45,
      minStock: 10,
      status: "Aktiv",
    },
    {
      id: "MƏHS-002",
      name: "Simsiz Siçan",
      sku: "MOUSE-WL-002",
      category: "Aksesuarlar",
      price: 29.99,
      stock: 150,
      minStock: 50,
      status: "Aktiv",
    },
    {
      id: "MƏHS-003",
      name: "24 düym Monitor",
      sku: "MON-24-003",
      category: "Elektronika",
      price: 299.99,
      stock: 8,
      minStock: 15,
      status: "Az Qalıb",
    },
    {
      id: "MƏHS-004",
      name: "Mexaniki Klaviatura",
      sku: "KB-MECH-004",
      category: "Aksesuarlar",
      price: 89.99,
      stock: 75,
      minStock: 20,
      status: "Aktiv",
    },
  ]

  const [productsList, setProductsList] = useState(products)

  const handleImport = (file: File) => {
    toast({
      title: "İdxal Başladı",
      description: `${file.name} işlənir. Bu bir neçə dəqiqə çəkə bilər.`,
    })

    setTimeout(() => {
      toast({
        title: "İdxal Tamamlandı",
        description: "Məhsullar uğurla idxal edildi.",
      })
    }, 2000)
  }

  const filteredProducts = productsList.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">Məhsul İdarəetməsi</h2>
          <p className="text-gray-600">Anbar məhsullarınızı və inventarınızı idarə edin</p>
        </div>
        <div className="flex space-x-3">
          <ImportExportButtons type="products" data={productsList} onImport={handleImport} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-primary hover:bg-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Məhsul Əlavə Et
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Məhsul Əlavə Et</DialogTitle>
                <DialogDescription>Yeni məhsul üçün məlumatları daxil edin</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName">Məhsul Adı</Label>
                  <Input id="productName" placeholder="Məhsul adını daxil edin" />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="SKU daxil edin" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kateqoriya</Label>
                    <Input id="category" placeholder="Kateqoriya" />
                  </div>
                  <div>
                    <Label htmlFor="price">Qiymət</Label>
                    <Input id="price" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">İlkin Stok</Label>
                    <Input id="stock" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="minStock">Minimum Stok</Label>
                    <Input id="minStock" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Ləğv Et
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Məhsul Əlavə Et</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Məhsullar</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Məhsul axtar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Məhsul</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kateqoriya</TableHead>
                <TableHead>Qiymət</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Package className="h-8 w-8 text-gray-400" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}₼</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{product.stock}</span>
                      <span className="text-sm text-gray-500 ml-1">(min: {product.minStock})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === "Aktiv" ? "default" : "destructive"}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onViewProduct?.(product.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
