"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect } from "react";
import api from "@/lib/axios";
import { getImportTemplate } from "@/lib/api/template";

// Utility functions for Excel import/export
export function downloadTemplate(
  type: "products" | "warehouses" | "customers"
) {

  getImportTemplate(type).then((response) => {
    const url = window.URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}_template.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
}

export function exportData(
  type: "products" | "warehouses" | "customers",
  data: any[]
) {
  const exportConfigs = {
    products: {
      filename: "products_export.csv",
      headers: [
        "ID",
        "Name",
        "SKU",
        "Category",
        "Price",
        "Stock",
        "Min Stock",
        "Status",
      ],
      mapData: (item: any) => [
        item.id,
        item.name,
        item.sku,
        item.category,
        item.price,
        item.stock,
        item.minStock,
        item.status,
      ],
    },
    warehouses: {
      filename: "warehouses_export.csv",
      headers: [
        "ID",
        "Name",
        "Location",
        "Capacity",
        "Occupied",
        "Shelves",
        "Workers",
        "Status",
      ],
      mapData: (item: any) => [
        item.id,
        item.name,
        item.location,
        item.capacity,
        item.occupied,
        item.shelves,
        item.workers,
        item.status,
      ],
    },
    customers: {
      filename: "customers_export.csv",
      headers: [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Address",
        "Type",
        "Total Orders",
        "Total Value",
        "Status",
      ],
      mapData: (item: any) => [
        item.id,
        item.name,
        item.email,
        item.phone,
        item.address,
        item.type,
        item.totalOrders,
        item.totalValue,
        item.status,
      ],
    },
  };

  const config = exportConfigs[type];
  const csvContent = [
    config.headers.join(","),
    ...data.map((item) => config.mapData(item).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = config.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function ImportExportButtons({
  type,
  data,
  onImport,
}: {
  type: "products" | "warehouses" | "customers";
  data: any[];
  onImport: (file: File) => void;
}) {
  const { toast } = useToast();

  const handleDownloadTemplate = useCallback(
    (type: "products" | "warehouses" | "customers") => {
      downloadTemplate(type);
      toast({
        title: "Şablon Yükləndi",
        description: `${type}_template.xlsx uğurla yükləndi.`,
      });
    },
    [toast]
  );

  const handleExportData = useCallback(
    (type: "products" | "warehouses" | "customers", data: any[]) => {
      exportData(type, data);
      toast({
        title: "Məlumatlar İxrac Edildi",
        description: `${type}_export.csv uğurla yükləndi.`,
      });
    },
    [toast]
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDownloadTemplate(type)}
        className="border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        Şablon
      </Button>

      <label className="cursor-pointer">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
        >
          <span>
            <Upload className="h-4 w-4 mr-2" />
            İdxal
          </span>
        </Button>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExportData(type, data)}
        className="border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        İxrac
      </Button>
    </div>
  );
}
