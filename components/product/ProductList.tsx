"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Eye, Edit, Trash2, PackagePlus } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductStockHistory } from "../ProductStockHistory";

interface ProductListProps {
  products: Product[];
  viewMode: "list" | "grid";
  isBronzeUser: boolean;
  searchTerm: string;
  onViewProduct?: (productId: string) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenQuantityModal: (product: Product) => void;
  onQuickIncrease: (productId: string, quantity: number) => void;
}

export function ProductList({
  products,
  viewMode,
  isBronzeUser,
  searchTerm,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onOpenQuantityModal,
  onQuickIncrease,
}: ProductListProps) {
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Heç bir məhsul tapılmadı
        </h3>
        <p className="text-gray-500">
          {searchTerm
            ? "Axtarış kriteriyalarına uyğun məhsul yoxdur"
            : "Hələlik heç bir məhsul əlavə edilməyib"}
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isBronzeUser={isBronzeUser}
            onViewProduct={onViewProduct}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            onOpenQuantityModal={onOpenQuantityModal}
          />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Məhsul</TableHead>
          {!isBronzeUser && <TableHead>SKU</TableHead>}
          {!isBronzeUser && <TableHead>Kateqoriya</TableHead>}
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
            {!isBronzeUser && (
              <TableCell className="font-mono text-sm">
                {product.sku}
              </TableCell>
            )}
            {!isBronzeUser && <TableCell>{product.category}</TableCell>}
            <TableCell>{product.purchasePrice}₼</TableCell>
            <TableCell>{product.sellPrice}₼</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <div>
                  <span className="font-medium">{product.quantity}</span>
                  <span className="text-sm text-gray-500 ml-1">
                    (min: {product.minRequire})
                  </span>
                </div>
                {isBronzeUser && (
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onQuickIncrease(product.id, 1)}
                      className="h-6 w-6 p-0 text-xs bg-green-50 hover:bg-green-100 text-green-700"
                    >
                      +1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onQuickIncrease(product.id, 5)}
                      className="h-6 w-6 p-0 text-xs bg-green-50 hover:bg-green-100 text-green-700"
                    >
                      +5
                    </Button>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  product.quantity === 0
                    ? "destructive"
                    : product.quantity <= product.minRequire
                    ? "secondary"
                    : "default"
                }
              >
                {product.quantity === 0
                  ? "Bitmiş"
                  : product.quantity <= product.minRequire
                  ? "Az Stok"
                  : "Stokda"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {isBronzeUser && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenQuantityModal(product)}
                    className="bg-green-50 hover:bg-green-100 text-green-700"
                  >
                    <PackagePlus className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProduct?.(product.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <ProductStockHistory 
                  productId={product.id} 
                  productName={product.name}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditProduct?.(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteProduct(product.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}