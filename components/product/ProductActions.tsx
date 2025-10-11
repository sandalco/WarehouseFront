"use client";

import { Button } from "@/components/ui/button";
import { Plus, Calculator, PackagePlus, Minus } from "lucide-react";
import { ImportExportButtons } from "../import-export-utils";
import { Product } from "@/types/product";

interface ProductActionsProps {
  products: Product[];
  isBronzeUser: boolean;
  onImport: (file: File) => Promise<void>;
  onAddProduct: () => void;
  onInventoryModal: () => void;
  onBulkIncrease: () => void;
  onStockReduction: () => void;
}

export function ProductActions({
  products,
  isBronzeUser,
  onImport,
  onAddProduct,
  onInventoryModal,
  onBulkIncrease,
  onStockReduction,
}: ProductActionsProps) {
  return (
    <div className="flex space-x-3">
      <ImportExportButtons
        type="products"
        data={products}
        onImport={onImport}
      />
      
      <Button
        variant="outline"
        onClick={onInventoryModal}
        className="bg-blue-50 hover:bg-blue-100 text-blue-700"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Sayım
      </Button>
      
      {isBronzeUser && (
        <>
          <Button
            variant="outline"
            onClick={onBulkIncrease}
            className="bg-green-50 hover:bg-green-100 text-green-700"
          >
            <PackagePlus className="h-4 w-4 mr-2" />
            Stok Artır
          </Button>
          
          <Button
            variant="outline"
            onClick={onStockReduction}
            className="bg-red-50 hover:bg-red-100 text-red-700"
          >
            <Minus className="h-4 w-4 mr-2" />
            Stok Azalt
          </Button>
        </>
      )}
      
      <Button 
        onClick={onAddProduct}
        className="bg-purple-primary hover:bg-purple-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Məhsul Əlavə Et
      </Button>
    </div>
  );
}