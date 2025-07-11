"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect } from "react";
import api from "@/lib/axios";
import { getImportTemplate, getExportData } from "@/lib/api/template";

// Utility functions for Excel import/export
export function downloadTemplate(
  type: "products" | "warehouses" | "customers" | "orders" | "shelves"
) {

  getImportTemplate(type).then((blob) => {
    const url = window.URL.createObjectURL(blob);
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
  type: "products" | "warehouses" | "customers" | "orders" | "shelves"
) {
  // Map frontend types to backend enum values
  const typeMapping = {
    products: "Product",
    warehouses: "Warehouse", 
    customers: "Customer",
    orders: "Order",
    shelves: "Shelf"
  };

  const backendType = typeMapping[type];
  
  getExportData(backendType).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}_export.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }).catch((error) => {
    console.error("Error exporting data:", error);
  });
}

export function ImportExportButtons({
  type,
  data,
  onImport,
}: {
  type: "products" | "warehouses" | "customers" | "orders" | "shelves";
  data: any[];
  onImport: (file: File) => void;
}) {
  const { toast } = useToast();

  const handleDownloadTemplate = useCallback(
    (type: "products" | "warehouses" | "customers" | "orders" | "shelves") => {
      downloadTemplate(type);
      toast({
        title: "Şablon Yükləndi",
        description: `${type}_template.xlsx uğurla yükləndi.`,
      });
    },
    [toast]
  );

  const handleExportData = useCallback(
    (type: "products" | "warehouses" | "customers" | "orders" | "shelves") => {
      exportData(type);
      toast({
        title: "Məlumatlar İxrac Edildi",
        description: `${type}_export.xlsx uğurla yükləndi.`,
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
        onClick={() => handleExportData(type)}
        className="border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        İxrac
      </Button>
    </div>
  );
}
