"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCallback } from "react"

// Utility functions for Excel import/export
export function downloadTemplate(type: "products" | "warehouses" | "customers") {
  const templates = {
    products: {
      filename: "products_template.xlsx",
      headers: ["Name", "SKU", "Category", "Price", "Initial Stock", "Min Stock"],
      sampleData: [
        ["Sample Product", "PROD-001", "Electronics", "99.99", "100", "10"],
        ["Another Product", "PROD-002", "Accessories", "29.99", "50", "5"],
      ],
    },
    warehouses: {
      filename: "warehouses_template.xlsx",
      headers: ["Name", "Location", "Capacity (sq ft)", "Number of Shelves"],
      sampleData: [
        ["Main Warehouse", "New York, NY", "10000", "250"],
        ["Secondary Warehouse", "Los Angeles, CA", "8000", "200"],
      ],
    },
    customers: {
      filename: "customers_template.xlsx",
      headers: ["Company Name", "Email", "Phone", "Address", "Type"],
      sampleData: [
        ["ABC Corporation", "contact@abc.com", "+1 555-123-4567", "123 Business Ave, NY", "Enterprise"],
        ["XYZ Limited", "info@xyz.com", "+1 555-234-5678", "456 Commerce St, CA", "SMB"],
      ],
    },
  }

  const template = templates[type]

  // Create CSV content (simplified Excel format)
  const csvContent = [template.headers.join(","), ...template.sampleData.map((row) => row.join(","))].join("\n")

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = template.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function exportData(type: "products" | "warehouses" | "customers", data: any[]) {
  const exportConfigs = {
    products: {
      filename: "products_export.csv",
      headers: ["ID", "Name", "SKU", "Category", "Price", "Stock", "Min Stock", "Status"],
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
      headers: ["ID", "Name", "Location", "Capacity", "Occupied", "Shelves", "Workers", "Status"],
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
      headers: ["ID", "Name", "Email", "Phone", "Address", "Type", "Total Orders", "Total Value", "Status"],
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
  }

  const config = exportConfigs[type]
  const csvContent = [config.headers.join(","), ...data.map((item) => config.mapData(item).join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = config.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function ImportExportButtons({
  type,
  data,
  onImport,
}: {
  type: "products" | "warehouses" | "customers"
  data: any[]
  onImport: (file: File) => void
}) {
  const { toast } = useToast()

  const handleDownloadTemplate = useCallback(
    (type: "products" | "warehouses" | "customers") => {
      downloadTemplate(type)
      toast({
        title: "Şablon Yükləndi",
        description: `${type}_template.xlsx uğurla yükləndi.`,
      })
    },
    [toast],
  )

  const handleExportData = useCallback(
    (type: "products" | "warehouses" | "customers", data: any[]) => {
      exportData(type, data)
      toast({
        title: "Məlumatlar İxrac Edildi",
        description: `${type}_export.csv uğurla yükləndi.`,
      })
    },
    [toast],
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImport(file)
    }
  }

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
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
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
  )
}
