"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Warehouse, MapPin } from "lucide-react"
import { ImportExportButtons } from "./import-export-utils"
import { useToast } from "@/hooks/use-toast"

export function WarehouseManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const warehouses = [
    {
      id: "ANB-001",
      name: "Əsas Paylama Mərkəzi",
      location: "Bakı, Azərbaycan",
      capacity: 10000,
      occupied: 7500,
      shelves: 250,
      workers: 15,
      status: "Aktiv",
    },
    {
      id: "ANB-002",
      name: "Qərb Sahili Mərkəzi",
      location: "Gəncə, Azərbaycan",
      capacity: 8000,
      occupied: 6200,
      shelves: 200,
      workers: 12,
      status: "Aktiv",
    },
    {
      id: "ANB-003",
      name: "Mərkəzi Anbar",
      location: "Sumqayıt, Azərbaycan",
      capacity: 6000,
      occupied: 4800,
      shelves: 150,
      workers: 8,
      status: "Aktiv",
    },
  ]

  const [warehousesList, setWarehousesList] = useState(warehouses)

  const handleImport = (file: File) => {
    toast({
      title: "İdxal Başladı",
      description: `${file.name} işlənir. Bu bir neçə dəqiqə çəkə bilər.`,
    })

    setTimeout(() => {
      toast({
        title: "İdxal Tamamlandı",
        description: "Anbarlar uğurla idxal edildi.",
      })
    }, 2000)
  }

  const filteredWarehouses = warehousesList.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">Anbar İdarəetməsi</h2>
          <p className="text-gray-600">Anbar yerlərinizi və tutumunu idarə edin</p>
        </div>
        <div className="flex space-x-3">
          <ImportExportButtons type="warehouses" data={warehousesList} onImport={handleImport} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-primary hover:bg-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Anbar Əlavə Et
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Anbar Əlavə Et</DialogTitle>
                <DialogDescription>Yeni anbar yeri üçün məlumatları daxil edin</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="warehouseName">Anbar Adı</Label>
                  <Input id="warehouseName" placeholder="Anbar adını daxil edin" />
                </div>
                <div>
                  <Label htmlFor="location">Yer</Label>
                  <Input id="location" placeholder="Şəhər, Ölkə" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Tutum (kv m)</Label>
                    <Input id="capacity" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="shelves">Rəf Sayı</Label>
                    <Input id="shelves" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Ləğv Et
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Anbar Əlavə Et</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Warehouse className="h-5 w-5" />
                <span>{warehouse.name}</span>
              </CardTitle>
              <CardDescription className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{warehouse.location}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tutum İstifadəsi</span>
                  <span>{Math.round((warehouse.occupied / warehouse.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(warehouse.occupied / warehouse.capacity) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{warehouse.occupied.toLocaleString()} kv m</span>
                  <span>{warehouse.capacity.toLocaleString()} kv m</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Rəflər</p>
                  <p className="font-medium">{warehouse.shelves}</p>
                </div>
                <div>
                  <p className="text-gray-600">İşçilər</p>
                  <p className="font-medium">{warehouse.workers}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="default">{warehouse.status}</Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
