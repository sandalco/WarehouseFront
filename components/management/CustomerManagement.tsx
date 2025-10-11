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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building,
  Mail,
  Phone,
  MapPin,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/types/customer";
import { getCustomers } from "@/lib/api/customer";
import { createApiCall } from "@/lib/api-helpers";
import { ImportExportButtons } from "../import-export-utils";

interface CustomerManagementProps {
  onViewCustomerOrders?: (customerId: string, customerName: string) => void;
}

export function CustomerManagement({
  onViewCustomerOrders,
}: CustomerManagementProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    createApiCall(
      getCustomers,
      setIsLoading,
      (data) => setCustomersList(data),
      (error) => toast({ title: "Xəta", description: error, variant: "destructive" })
    )
  }

  const handleImport = (file: File) => {
    toast({
      title: "Import Started",
      description: `Processing ${file.name}. This may take a few moments.`,
    });

    setTimeout(() => {
      toast({
        title: "Import Completed",
        description: "Customers have been imported successfully.",
      });
    }, 2000);
  };

  const filteredCustomers = customersList.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">
            Müştəri İdarəetməsi
          </h2>
          <p className="text-gray-600">
            Müştərilərinizi və onların sifariş tarixçəsini idarə edin
          </p>
        </div>
        <div className="flex space-x-3">
          <ImportExportButtons
            type="customers"
            data={customersList}
            onImport={handleImport}
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-primary hover:bg-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Müştəri Əlavə Et
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Müştəri Əlavə Et</DialogTitle>
                <DialogDescription>
                  Yeni müştəri üçün məlumatları daxil edin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">Ad</Label>
                  <Input id="firstName" placeholder="Ad" />
                </div>
                <div>
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input id="lastName" placeholder="Soyad" />
                </div>
                <div>
                  <Label htmlFor="email">E-poçt</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" placeholder="+994..." />
                </div>
                <div>
                  <Label htmlFor="city">Şəhər</Label>
                  <Input id="city" placeholder="Şəhər" />
                </div>
                <div>
                  <Label htmlFor="district">Rayon</Label>
                  <Input id="district" placeholder="Rayon" />
                </div>
                <div>
                  <Label htmlFor="street">Küçə</Label>
                  <Input id="street" placeholder="Küçə" />
                </div>
                <div>
                  <Label htmlFor="zipCode">Poçt Kodu</Label>
                  <Input id="zipCode" placeholder="AZxxxx" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Ləğv Et
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>
                    Müştəri Əlavə Et
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ümumi Müştərilər
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersList.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktiv Müştərilər</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersList.filter((c) => c.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1</span> from last month
            </p>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ümumi Sifarişlər</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersList.reduce((sum, c) => sum + c.totalOrders, 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ümumi Gəlir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customersList.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> from last month
            </p>
          </CardContent>
        </Card> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Müştərilər</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Müştəriləri axtar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müştəri</TableHead>
                <TableHead>Əlaqə</TableHead>
                <TableHead>Növ</TableHead>
                <TableHead>Sifarişlər</TableHead>
                {/* <TableHead>Ümumi Dəyər</TableHead> */}
                <TableHead>Son Sifariş</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Building className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{customer.fullName}</p>
                        <p className="text-sm text-gray-500">{customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {/* <span className="truncate max-w-xs">{customer.address}</span> */}
                        <span className="truncate max-w-xs">
                          {customer.address.city}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.totalOrders}</span>
                  </TableCell>
                  {/* <TableCell>
                    <span className="font-medium">${customer.totalValue.toLocaleString()}</span>
                  </TableCell> */}
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onViewCustomerOrders?.(
                            customer.id,
                            customer.firstName
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
