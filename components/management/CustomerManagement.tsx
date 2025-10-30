"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Edit,
  Trash2,
  Building,
  Mail,
  Phone,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Customer, CustomerSortBy } from "@/types/customer";
import { getPaginatedCustomers, CustomerFiltersRequest } from "@/lib/api/customer";
import { ImportExportButtons } from "../import-export-utils";
import { CustomerFilters } from "./CustomerFilters";

interface CustomerManagementProps {
  onViewCustomerOrders?: (customerId: string, customerName: string) => void;
}

export function CustomerManagement({
  onViewCustomerOrders,
}: CustomerManagementProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<CustomerSortBy>(CustomerSortBy.Name);
  const [sortDescending, setSortDescending] = useState(false);

  // Cities list for filter (extracted from data)
  const [cities, setCities] = useState<string[]>([]);

  // Load data
  useEffect(() => {
    loadCustomers();
  }, [currentPage, pageSize, cityFilter, sortBy, sortDescending]);

  // Filter dəyişəndə səhifəni 1-ə qaytır
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [cityFilter, sortBy, sortDescending]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadCustomers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const filters: CustomerFiltersRequest = {
        city: cityFilter !== "all" ? cityFilter : null,
        search: searchTerm || null,
        sortBy: sortBy,
        sortDescending: sortDescending,
      };

      const response = await getPaginatedCustomers(currentPage, pageSize, filters);

      if (response.isSuccess && response.data) {
        setCustomersList(response.data);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
        setHasPreviousPage(response.hasPreviousPage);
        setHasNextPage(response.hasNextPage);

        // Extract unique cities from data
        const uniqueCities = Array.from(
          new Set(response.data.map((c) => c.address.city))
        ).sort();
        setCities(uniqueCities);
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "Müştərilər yüklənə bilmədi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading customers:", error);
      toast({
        title: "Xəta",
        description: "Müştəriləri yükləyərkən xəta baş verdi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    toast({
      title: "Import Started",
      description: `Processing ${file.name}. This may take a few moments.`,
    });

    setTimeout(() => {
      toast({
        title: "Import Completed",
        description: "Customers have been imported successfully.",
      });
      loadCustomers();
    }, 2000);
  };

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
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              Cəmi müştəri sayı
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Səhifədəki Müştərilər</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersList.length}</div>
            <p className="text-xs text-muted-foreground">
              Cari səhifədə göstərilir
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ümumi Sifarişlər</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customersList.reduce((sum, c) => sum + c.orderCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Bütün müştərilərin sifarişləri
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Şəhər Sayı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cities.length}</div>
            <p className="text-xs text-muted-foreground">
              Fərqli şəhər sayı
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Müştərilər</CardTitle>
          <CardDescription>
            <CustomerFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              cityFilter={cityFilter}
              setCityFilter={setCityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDescending={sortDescending}
              setSortDescending={setSortDescending}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Müştəri</TableHead>
                <TableHead>Əlaqə</TableHead>
                <TableHead>Ünvan</TableHead>
                <TableHead>Sifarişlər</TableHead>
                <TableHead>Son Sifariş</TableHead>
                <TableHead>Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersList.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Müştəri tapılmadı
                  </TableCell>
                </TableRow>
              ) : null}
              {customersList.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Building className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{customer.fullName}</p>
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      <div>
                        <p>{customer.address.city}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.address.district}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.orderCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className={customer.lastOrderTime === "N/A" ? "text-muted-foreground" : ""}>
                      {customer.lastOrderTime}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/boss/customers/${customer.id}`)}
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Səhifə başına:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <span className="text-sm text-muted-foreground">
                {totalCount > 0 ? (
                  <>
                    {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} / {totalCount} arası göstərilir
                  </>
                ) : (
                  'Nəticə yoxdur'
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Səhifə {currentPage} / {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={!hasPreviousPage || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!hasNextPage || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
