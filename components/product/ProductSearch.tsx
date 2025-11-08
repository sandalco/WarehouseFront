"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, List, Grid3X3 } from "lucide-react";
import { ProductStockStatus } from "@/lib/api/products";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  statusFilter?: ProductStockStatus;
  onStatusFilterChange?: (status: ProductStockStatus) => void;
  minPrice?: number | null;
  onMinPriceChange?: (price: number | null) => void;
  maxPrice?: number | null;
  onMaxPriceChange?: (price: number | null) => void;
}

export function ProductSearch({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: ProductSearchProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Məhsul axtar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      {onStatusFilterChange && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="statusFilter">Status</Label>
            <Select
              value={statusFilter?.toString()}
              onValueChange={(value) => onStatusFilterChange(Number(value) as ProductStockStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Bütün Statuslar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Hamısı</SelectItem>
                <SelectItem value="1">Stokda Var</SelectItem>
                <SelectItem value="2">Az Qalıb</SelectItem>
                <SelectItem value="3">Stokda Yoxdur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="minPrice">Minimum Qiymət</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0.00"
              value={minPrice || ""}
              onChange={(e) => onMinPriceChange?.(e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          <div>
            <Label htmlFor="maxPrice">Maksimum Qiymət</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="0.00"
              value={maxPrice || ""}
              onChange={(e) => onMaxPriceChange?.(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}