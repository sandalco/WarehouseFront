"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react";
import { ImportExportButtons } from "./import-export-utils";
import { useToast } from "@/hooks/use-toast";
import { createProduct, deleteProduct, getProducts } from "@/lib/api/products";
import { createProductDto, Product } from "@/types/product";

interface ProductManagementProps {
  onViewProduct?: (productId: string) => void;
}

export function ProductManagement({ onViewProduct }: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [productsList, setProductsList] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    getProducts().then((products) => {
      setProductsList(products);
    });
  }, []);

  const handleImport = (file: File) => {
    toast({
      title: "İdxal Başladı",
      description: `${file.name} işlənir. Bu bir neçə dəqiqə çəkə bilər.`,
    });

    setTimeout(() => {
      toast({
        title: "İdxal Tamamlandı",
        description: "Məhsullar uğurla idxal edildi.",
      });
    }, 2000);
  };

  const filteredProducts = productsList.filter(
    (product) => product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    // || product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [newProduct, setNewProduct] = useState<createProductDto>({
    name: "",
    description: "",
    imageUrl: "",
    purchasePrice: 0,
    sellPrice: 0,
    quantity: 0,
    minRequire: 0,
  });

  const handleAddProduct = () => {
    console.log(newProduct);
    
    if (!newProduct.name) {
      toast({
        title: "Xəta",
        description: "Məhsul adı mütləq olmalıdır.",
        variant: "destructive",
      });
      return;
    }
    createProduct(newProduct)
      .then((product) => {
        setProductsList((prev) => [...prev, product]);
        setIsAddDialogOpen(false);
        setNewProduct({
          name: "",
          description: "",
          imageUrl: "",
          purchasePrice: 0,
          sellPrice: 0,
          quantity: 0,
          minRequire: 0,
        });
        toast({
          title: "Məhsul Əlavə Edildi",
          description: `${product.name} məhsulu uğurla əlavə edildi.`,
        });
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast({
          title: "Xəta",
          description: "Məhsul əlavə edilərkən xəta baş verdi.",
          variant: "destructive",
        });
      });
  };

  const handleDeleteProduct = (productId: string) => {
    // Call the API to delete the product
    deleteProduct(productId)
      .then(() => {
        setProductsList((prev) => prev.filter((p) => p.id !== productId));
        toast({
          title: "Məhsul Silindi",
          description: "Məhsul uğurla silindi.",
        });
      })

  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">
            Məhsul İdarəetməsi
          </h2>
          <p className="text-gray-600">
            Anbar məhsullarınızı və inventarınızı idarə edin
          </p>
        </div>
        <div className="flex space-x-3">
          <ImportExportButtons
            type="products"
            data={productsList}
            onImport={handleImport}
          />
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
                <DialogDescription>
                  Yeni məhsul üçün məlumatları daxil edin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName">Məhsul Adı</Label>
                  <Input
                    id="productName"
                    placeholder="Məhsul adını daxil edin"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Description daxil edin"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Description</Label>
                  <Input
                    id="imageUrl"
                    placeholder="imageUrl daxil edin"
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                  />
                </div>
                {/* <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="SKU daxil edin" />
                </div> */}
                <div className="grid grid-cols-2 gap-4">
                  {/* <div>
                    <Label htmlFor="category">Kateqoriya</Label>
                    <Input id="category" placeholder="Kateqoriya" />
                  </div> */}
                  <div>
                    <Label htmlFor="purchasePrice">Alış Qiyməti</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      placeholder="0.00"
                      value={
                        isNaN(newProduct.purchasePrice)
                          ? ""
                          : newProduct.purchasePrice
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          purchasePrice:
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellPrice">Satış Qiyməti</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      placeholder="0.00"
                      value={
                        isNaN(newProduct.sellPrice) ? "" : newProduct.sellPrice
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          sellPrice:
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">İlkin Stok</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      value={
                        isNaN(newProduct.quantity) ? "" : newProduct.quantity
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          quantity:
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="minRequire">Minimum Stok</Label>
                    <Input
                      id="minRequire"
                      type="number"
                      placeholder="0"
                      value={
                        isNaN(newProduct.minRequire)
                          ? ""
                          : newProduct.minRequire
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          minRequire:
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Ləğv Et
                  </Button>
                  <Button onClick={() => handleAddProduct()}>
                    Məhsul Əlavə Et
                  </Button>
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
                <TableHead>Alış Qiyməti</TableHead>
                <TableHead>Satış Qiyməti</TableHead>
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
                  <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.purchasePrice}₼</TableCell>
                  <TableCell>{product.sellPrice}₼</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{product.quantity}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        (min: {product.minRequire})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "Aktiv" ? "default" : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewProduct?.(product.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
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
  );
}
