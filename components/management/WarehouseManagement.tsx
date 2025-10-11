"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Warehouse, MapPin } from "lucide-react";
import { ImportExportButtons } from "../import-export-utils";
import { useToast } from "@/hooks/use-toast";
import {
  CreateWarehouseDto,
  Warehouse as WarehouseType,
} from "@/types/warehouse";
import { createWarehouse, deleteWarehouse, getWarehouses } from "@/lib/api/warehouse";

export function WarehouseManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [warehousesList, setWarehousesList] = useState<WarehouseType[]>([]);
  const [newWarehouse, setNewWarehouse] = useState<CreateWarehouseDto>({
    name: "",
    shelves: 0,
    googleMaps: "",
    city: "",
    state: "",
    street: "",
    zipCode: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  //const [warehousesList, setWarehousesList] = useState(warehouses)

  useEffect(() => {
    getWarehouses().then(setWarehousesList);
  }, []);

  const handleImport = (file: File) => {
    toast({
      title: "İdxal Başladı",
      description: `${file.name} işlənir. Bu bir neçə dəqiqə çəkə bilər.`,
    });

    setTimeout(() => {
      toast({
        title: "İdxal Tamamlandı",
        description: "Anbarlar uğurla idxal edildi.",
      });
    }, 2000);
  };

  const handleAddWarehouse = () => {
    if (!newWarehouse.name || !newWarehouse.shelves) {
      toast({
        title: "Xəta",
        description: "Ad və rəf sayı mütləqdir.",
        variant: "destructive",
      });
      return;
    }
    createWarehouse(newWarehouse)
      .then((warehouse) => {
        setWarehousesList((prev) => [...prev, warehouse]);
        setIsAddDialogOpen(false);
        setNewWarehouse({
          name: "",
          shelves: 0,
          googleMaps: "",
          city: "",
          state: "",
          street: "",
          zipCode: "",
        });
        toast({
          title: "Anbar əlavə olundu",
          description: `${warehouse.name} uğurla əlavə edildi.`,
        });
      })
      .catch(() => {
        toast({
          title: "Xəta",
          description: "Anbar əlavə edilərkən xəta baş verdi.",
          variant: "destructive",
        });
      });
  };

  const handleDeleteWarehouse = (id: string) => {
    deleteWarehouse(id)
      .then(() => {
        setWarehousesList((prev) => prev.filter((w) => w.id !== id));
        toast({ title: "Anbar silindi" });
      })
      .catch(() => {
        toast({
          title: "Xəta",
          description: "Anbar silinərkən xəta baş verdi.",
          variant: "destructive",
        });
      });
  };

  // Modalda təsdiqlə silmək üçün
  const confirmDelete = () => {
    if (deleteId) {
      handleDeleteWarehouse(deleteId);
      setDeleteId(null);
    }
  };

  const filteredWarehouses = warehousesList.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (warehouse.city?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">
            Anbar İdarəetməsi
          </h2>
          <p className="text-gray-600">
            Anbar yerlərinizi və tutumunu idarə edin
          </p>
        </div>
        <div className="flex space-x-3">
          <ImportExportButtons
            type="warehouses"
            data={warehousesList}
            onImport={handleImport}
          />
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
                <DialogDescription>
                  Yeni anbar üçün məlumatları daxil edin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="warehouseName">Anbar Adı</Label>
                  <Input
                    id="warehouseName"
                    placeholder="Anbar adını daxil edin"
                    value={newWarehouse.name}
                    onChange={(e) =>
                      setNewWarehouse({ ...newWarehouse, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="shelves">Rəf sayı</Label>
                  <Input
                    id="shelves"
                    type="number"
                    placeholder="0"
                    value={
                      isNaN(newWarehouse.shelves) ? "" : newWarehouse.shelves
                    }
                    onChange={(e) =>
                      setNewWarehouse({
                        ...newWarehouse,
                        shelves:
                          e.target.value === ""
                            ? 0
                            : parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="googleMaps">Google Maps Linki</Label>
                  <Input
                    id="googleMaps"
                    placeholder="https://maps.app..."
                    value={newWarehouse.googleMaps}
                    onChange={(e) =>
                      setNewWarehouse({
                        ...newWarehouse,
                        googleMaps: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="city">Şəhər</Label>
                  <Input
                    id="city"
                    placeholder="Şəhər"
                    value={newWarehouse.city}
                    onChange={(e) =>
                      setNewWarehouse({ ...newWarehouse, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">Rayon</Label>
                  <Input
                    id="state"
                    placeholder="Rayon"
                    value={newWarehouse.state}
                    onChange={(e) =>
                      setNewWarehouse({
                        ...newWarehouse,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="street">Küçə</Label>
                  <Input
                    id="street"
                    placeholder="Küçə"
                    value={newWarehouse.street}
                    onChange={(e) =>
                      setNewWarehouse({
                        ...newWarehouse,
                        street: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Poçt Kodu</Label>
                  <Input
                    id="zipCode"
                    placeholder="AZxxxx"
                    value={newWarehouse.zipCode}
                    onChange={(e) =>
                      setNewWarehouse({
                        ...newWarehouse,
                        zipCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Ləğv Et
                  </Button>
                  <Button onClick={handleAddWarehouse}>Anbar Əlavə Et</Button>
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
                {/* <span>{warehouse.location}</span> */}
                <span>{warehouse.city}, {warehouse.state}, {warehouse.street}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Rəf İstifadəsi</span>
                  <span>
                    {Math.round(
                      warehouse.occupancyRate * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        warehouse.occupancyRate * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  {/* <span>{warehouse.occupied.toLocaleString()} kv m</span>
                  <span>{warehouse.capacity.toLocaleString()} kv m</span> */}
                  <span>{warehouse.usedShelves}</span>
                  <span>{warehouse.shelves}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Rəflər</p>
                  <p className="font-medium">{warehouse.shelves}</p>
                </div>
                <div>
                  <p className="text-gray-600">İşçilər</p>
                  <p className="font-medium">{warehouse.employeeCount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="default">{warehouse.status}</Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(warehouse.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Anbarı silmək istədiyinizə əminsiniz?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu əməliyyat geri qaytarıla bilməz. Anbar və ona aid bütün məlumatlar silinəcək.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                          Ləğv et
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
