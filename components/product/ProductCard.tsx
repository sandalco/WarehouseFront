"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Eye, Edit, Trash2, PackagePlus } from "lucide-react";
import { Product } from "@/types/product";
import { ProductStockHistory } from "../ProductStockHistory";

interface ProductCardProps {
  product: Product;
  isBronzeUser: boolean;
  onViewProduct?: (productId: string) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenQuantityModal: (product: Product) => void;
}

export function ProductCard({
  product,
  isBronzeUser,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onOpenQuantityModal,
}: ProductCardProps) {
  const getProductStatusBadge = (product: Product) => {
    if (product.quantity === 0) {
      return <Badge variant="destructive">Bitmiş</Badge>;
    } else if (product.quantity <= product.minRequire) {
      return <Badge variant="secondary">Az Stok</Badge>;
    } else {
      return <Badge variant="default">Stokda</Badge>;
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onViewProduct?.(product.id)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            {product.name}
          </CardTitle>
          {getProductStatusBadge(product)}
        </div>
        <CardDescription>
          SKU: {product.sku || "N/A"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Məhsul şəkli */}
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {product.imageUrl && product.imageUrl !== "" ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-gray-400"><svg class="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg><span class="text-sm">Məhsul</span></div>';
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Package className="h-8 w-8 mb-2" />
                <span className="text-sm">Məhsul</span>
              </div>
            )}
          </div>

          {/* Məlumatlar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alış:</span>
              <span className="font-medium">{product.purchasePrice}₼</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Satış:</span>
              <span className="font-medium text-green-600">{product.sellPrice}₼</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Stok:</span>
              <span className="font-medium">{product.quantity} ədəd</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Min:</span>
              <span className="text-sm text-gray-500">{product.minRequire} ədəd</span>
            </div>
          </div>

          {product.description && (
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>
          )}

          {/* Əməliyyat düymələri */}
          <div className="flex justify-between pt-2">
            <div className="flex space-x-1">
              {isBronzeUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuantityModal(product);
                  }}
                  className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100 text-green-700"
                >
                  <PackagePlus className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProduct?.(product.id);
                }}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <div onClick={(e) => e.stopPropagation()}>
                <ProductStockHistory 
                  productId={product.id} 
                  productName={product.name}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <PackagePlus className="h-3 w-3" />
                    </Button>
                  }
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct?.(product);
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProduct(product.id);
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}