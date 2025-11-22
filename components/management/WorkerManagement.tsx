"use client"

import { useEffect, useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Worker } from "@/types/worker"
import { LookupItem } from "@/types/api-response"
import { getPaginatedWorkers, getRolesLookup, WorkerFiltersRequest } from "@/lib/api/worker"
import { toast } from "@/hooks/use-toast"
import { getWarehouseLookup } from "@/lib/api/warehouse"

interface WorkerManagementProps {
  onViewWorker?: (workerId: string) => void
}

export function WorkerManagement({ onViewWorker }: WorkerManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)

  // Filter state
  const [warehouseFilter, setWarehouseFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  // Lookup data
  const [warehouses, setWarehouses] = useState<LookupItem[]>([])
  const [roles, setRoles] = useState<LookupItem[]>([])

  // Load lookups on mount
  useEffect(() => {
    loadLookups()
  }, [])

  // Load workers when filters or pagination change
  useEffect(() => {
    loadWorkers()
  }, [currentPage, pageSize, warehouseFilter, roleFilter])

  // Filter dəyişəndə səhifəni 1-ə qaytır
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [warehouseFilter, roleFilter])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1)
      } else {
        loadWorkers()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadLookups = async () => {
    try {
      const [warehousesResponse, rolesResponse] = await Promise.all([
        getWarehouseLookup(),
        getRolesLookup(),
      ])

      if (warehousesResponse.isSuccess && warehousesResponse.data) {
        setWarehouses(warehousesResponse.data)
      }

      if (rolesResponse.isSuccess && rolesResponse.data) {
        setRoles(rolesResponse.data)
      }
    } catch (error) {
      console.error("Error loading lookups:", error)
      toast({
        title: "Xəta",
        description: "Lookup məlumatları yüklənə bilmədi.",
        variant: "destructive",
      })
    }
  }

  const loadWorkers = async () => {
    setIsLoading(true)
    try {
      const filters: WorkerFiltersRequest = {
        searchTerm: searchTerm || null,
        warehouseId: warehouseFilter !== "all" ? warehouseFilter : null,
        roleId: roleFilter !== "all" ? roleFilter : null,
      }

      const response = await getPaginatedWorkers(currentPage, pageSize, filters)

      if (response.isSuccess && response.data) {
        setWorkers(response.data)
        setTotalPages(response.totalPages)
        setTotalCount(response.totalCount)
        setHasPreviousPage(response.hasPreviousPage)
        setHasNextPage(response.hasNextPage)
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "İşçilər yüklənə bilmədi.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading workers:", error)
      toast({
        title: "Xəta",
        description: "İşçiləri yükləyərkən xəta baş verdi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">İşçi İdarəetməsi</h2>
          <p className="text-gray-600">Anbar işçilərini və onların tapşırıqlarını idarə edin</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-primary hover:bg-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              İşçi Əlavə Et
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni İşçi Əlavə Et</DialogTitle>
              <DialogDescription>Yeni anbar işçisi üçün məlumatları daxil edin</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workerName">Tam Ad</Label>
                <Input id="workerName" placeholder="Tam adı daxil edin" />
              </div>
              <div>
                <Label htmlFor="email">E-poçt</Label>
                <Input id="email" type="email" placeholder="worker@company.com" />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warehouse">Anbar</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Anbar seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shift">Rol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Ləğv Et
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>İşçi Əlavə Et</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ümumi İşçilər</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Cəmi işçi sayı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Boss/Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.filter((w) => w.roles.includes("Boss") || w.roles.includes("Admin")).length}
            </div>
            <p className="text-xs text-muted-foreground">İdarəçilər</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Anbardarlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.filter((w) => w.roles.includes("WarehouseMan")).length}
            </div>
            <p className="text-xs text-muted-foreground">Anbar işçiləri</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Anbarsız</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.filter((w) => w.warehouse === "N/A").length}
            </div>
            <p className="text-xs text-muted-foreground">Anbar təyin edilməyib</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İşçilər</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="İşçiləri axtar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Anbar seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Anbarlar</SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Rollar</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İşçi</TableHead>
                <TableHead>Əlaqə</TableHead>
                <TableHead>Anbar</TableHead>
                <TableHead>Rollar</TableHead>
                <TableHead>Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    İşçi tapılmadı
                  </TableCell>
                </TableRow>
              ) : null}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Yüklənir...
                  </TableCell>
                </TableRow>
              ) : null}
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{worker.fullName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{worker.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{worker.phoneNumber}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={worker.warehouse === "N/A" ? "text-muted-foreground" : ""}>
                      {worker.warehouse}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {worker.roles.map((role: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onViewWorker?.(worker.id)}>
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
                    setPageSize(Number(value))
                    setCurrentPage(1) // Reset to first page when changing page size
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
  )
}
