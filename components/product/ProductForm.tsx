"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createProductDto } from "@/types/product";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: createProductDto) => void;
  loading?: boolean;
}

export function ProductForm({ open, onOpenChange, onSubmit, loading }: ProductFormProps) {
  const [newProduct, setNewProduct] = useState<createProductDto>({
    name: "",
    description: "",
    imageUrl: "",
    purchasePrice: 0,
    sellPrice: 0,
    quantity: 0,
    minRequire: 0,
  });

  const handleSubmit = () => {
    if (!newProduct.name.trim()) {
      return;
    }
    
    onSubmit(newProduct);
    
    // Reset form
    setNewProduct({
      name: "",
      description: "",
      imageUrl: "",
      purchasePrice: 0,
      sellPrice: 0,
      quantity: 0,
      minRequire: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Məhsul Əlavə Et</DialogTitle>
          <DialogDescription>
            Yeni məhsul üçün məlumatları daxil edin
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName">Məhsul Adı *</Label>
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
            <Label htmlFor="description">Təsvir</Label>
            <Input
              id="description"
              placeholder="Məhsul təsvirini daxil edin"
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
            <Label htmlFor="imageUrl">Şəkil URL</Label>
            <Input
              id="imageUrl"
              placeholder="Şəkil URL-ni daxil edin"
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchasePrice">Alış Qiyməti (₼)</Label>
              <Input
                id="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newProduct.purchasePrice || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    purchasePrice: e.target.value === "" ? 0 : parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="sellPrice">Satış Qiyməti (₼)</Label>
              <Input
                id="sellPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newProduct.sellPrice || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    sellPrice: e.target.value === "" ? 0 : parseFloat(e.target.value),
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
                min="0"
                placeholder="0"
                value={newProduct.quantity || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    quantity: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="minRequire">Minimum Stok</Label>
              <Input
                id="minRequire"
                type="number"
                min="0"
                placeholder="0"
                value={newProduct.minRequire || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    minRequire: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Ləğv Et
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading || !newProduct.name.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {loading ? "Əlavə edilir..." : "Məhsul Əlavə Et"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}