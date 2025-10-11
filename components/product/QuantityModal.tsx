"use client";

import { useState, useEffect } from "react";
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
import { Package, PackagePlus } from "lucide-react";
import { Product } from "@/types/product";

interface QuantityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmit: (quantity: number, price: number) => void;
  loading?: boolean;
}

export function QuantityModal({
  open,
  onOpenChange,
  product,
  onSubmit,
  loading,
}: QuantityModalProps) {
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setQuantityToAdd(1);
      setPricePerUnit(product.purchasePrice);
    }
  }, [product]);

  const handleSubmit = () => {
    if (quantityToAdd <= 0 || pricePerUnit < 0) {
      return;
    }
    onSubmit(quantityToAdd, pricePerUnit);
  };

  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Məhsul Miqdarı Artır</DialogTitle>
          <DialogDescription>
            {product.name} məhsulunun miqdarını artırmaq üçün ədəd daxil edin
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Hazırki miqdar: {product.quantity} ədəd
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantityToAdd">Artırılacaq Miqdar</Label>
              <Input
                id="quantityToAdd"
                type="number"
                min="1"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(parseInt(e.target.value) || 1)}
                placeholder="Artırılacaq ədəd"
              />
            </div>

            <div>
              <Label htmlFor="pricePerUnit">Alış Qiyməti (₼)</Label>
              <Input
                id="pricePerUnit"
                type="number"
                min="0"
                step="0.01"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                placeholder="Məhsulun alış qiyməti"
              />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Yeni miqdar:</strong> {product.quantity + quantityToAdd} ədəd
              </p>
              <p className="text-sm text-blue-800 mt-1">
                <strong>Cari alış qiyməti:</strong> {product.purchasePrice} ₼
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Ləğv Et
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || quantityToAdd <= 0 || pricePerUnit < 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <PackagePlus className="h-4 w-4 mr-2" />
              {loading ? "Artırılır..." : "Miqdarı Artır"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}