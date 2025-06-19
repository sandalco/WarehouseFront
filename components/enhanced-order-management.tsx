"use client"

import { useEffect, useState } from "react"
import { getOrdersByCompany } from "@/lib/api/order"
import { Order } from "@/types/order"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Search, Edit, Eye, ArrowUpCircle, ArrowDownCircle, Filter, CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { formatDate } from "@/utils/dateFormat"

interface EnhancedOrderManagementProps {
  onViewOrder?: (order: any) => void
  onCreateOrder?: () => void
}

export function EnhancedOrderManagement({ onViewOrder, onCreateOrder }: EnhancedOrderManagementProps = {}) {
  // Dummy data for customers and vendors; replace with real data as needed
  const customers: string[] = ["Müştəri 1", "Müştəri 2", "Müştəri 3"]
  const vendors: string[] = ["Təchizatçı 1", "Təchizatçı 2", "Təchizatçı 3"]

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [customerFilter, setCustomerFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [showFilters, setShowFilters] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    getOrdersByCompany().then(setOrders);
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.warehouseName && order.warehouseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()))

    // Status filter (əgər status varsa)
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    // Tarix filterləri (opened və ya closed istifadə et)
    const orderDate = new Date(order.opened)
    const matchesDateFrom = !dateFrom || orderDate >= dateFrom
    const matchesDateTo = !dateTo || orderDate <= dateTo

    // Prioritet və customer filterləri backend-də yoxdursa, onları filterdən çıxar
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
  })

  const outgoingOrders = filteredOrders.filter((order) => !!order.customer)
  const incomingOrders = filteredOrders.filter((order) => !order.customer)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      return "default"
      case "Processing":
      return "secondary"
      case "StockConfirmed":
      return "outline"
      case "In Transit":
      return "secondary"
      case "Shipped":
      return "default"
      case "Cancelled":
      return "destructive"
      default:
      return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setPriorityFilter("all")
    setCustomerFilter("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    setSearchTerm("")
  }

  const activeFiltersCount = [
    statusFilter !== "all",
    priorityFilter !== "all",
    customerFilter !== "all",
    dateFrom,
    dateTo,
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">Sifariş İdarəetməsi</h2>
          <p className="text-gray-600">Daxil olan və çıxan anbar sifarişlərini idarə edin</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={onCreateOrder} className="bg-purple-primary hover:bg-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Sifariş Yarat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni Sifariş Yarat</DialogTitle>
              <DialogDescription>Yeni daxil olan və ya çıxan sifariş yaradın</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderType">Sifariş Növü</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sifariş növünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incoming">Daxil olan</SelectItem>
                    <SelectItem value="outgoing">Çıxan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer">Müştəri/Təchizatçı</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Müştəri/təchizatçı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer} value={customer}>
                          {customer}
                        </SelectItem>
                      ))}
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor} value={vendor}>
                          {vendor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioritet</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioritet seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Yüksək</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Aşağı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="dueDate">Son Tarix</Label>
                <Input id="dueDate" type="date" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Ləğv et
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)} className="bg-purple-primary hover:bg-purple-600">
                  Sifariş Yarat
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sifarişlər</CardTitle>
          <CardDescription>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Sifarişləri axtar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrlər
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-purple-primary text-white">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearFilters} size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Təmizlə
                  </Button>
                )}
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="statusFilter">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bütün Statuslar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Bütün Statuslar</SelectItem>
                        <SelectItem value="Pending">Gözləyən</SelectItem>
                        <SelectItem value="StockConfirmed">Stok yoxlanılıb</SelectItem>
                        {/* <SelectItem value="Processing">Emal olunur</SelectItem> */}
                        {/* <SelectItem value="In Transit">Yoldadır</SelectItem> */}
                        <SelectItem value="Shipped">Göndərilib</SelectItem>
                        {/* <SelectItem value="Completed">Tamamlanıb</SelectItem> */}
                        <SelectItem value="Cancelled">İmtina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priorityFilter">Prioritet</Label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bütün Prioritetlər" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Bütün Prioritetlər</SelectItem>
                        <SelectItem value="High">Yüksək</SelectItem>
                        <SelectItem value="Medium">Orta</SelectItem>
                        <SelectItem value="Low">Aşağı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="customerFilter">Müştəri/Təchizatçı</Label>
                    <Select value={customerFilter} onValueChange={setCustomerFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bütün Müştərilər" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Bütün Müştərilər</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer} value={customer}>
                            {customer}
                          </SelectItem>
                        ))}
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>
                            {vendor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Başlanğıc Tarixi</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFrom && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP") : "Tarix seçin"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Son Tarix</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateTo && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP") : "Tarix seçin"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Bütün Sifarişlər ({filteredOrders.length})</TabsTrigger>
              <TabsTrigger value="outgoing">Çıxan ({outgoingOrders.length})</TabsTrigger>
              <TabsTrigger value="incoming">Daxil olan ({incomingOrders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sifariş ID</TableHead>
                    <TableHead>Növ</TableHead>
                    <TableHead>Müştəri/Təchizatçı</TableHead>
                    <TableHead>Dəyər</TableHead>
                    {/* <TableHead>Prioritet</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead>Yaradılıb</TableHead>
                    <TableHead>Son Tarix</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center w-fit">
                          {order.type === "Incoming" ? (
                            <ArrowDownCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                          )}
                          {order.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.customer || order.vendor}</TableCell>
                      <TableCell>₼{order.totalPrice?.toLocaleString?.() ?? "-"}</TableCell>
                      {/* <TableCell>
                        <Badge variant={getPriorityColor(order.priority)}>{order.priority}</Badge>
                      </TableCell> */}
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.opened, "dd MMM yy HH:mm")}</TableCell>
                      <TableCell>{formatDate(order.closed, "dd MMM yy HH:mm")}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => onViewOrder?.(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="outgoing">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sifariş ID</TableHead>
                    <TableHead>Müştəri</TableHead>
                    <TableHead>Dəyər</TableHead>
                    {/* <TableHead>Prioritet</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead>Yaradılıb</TableHead>
                    <TableHead>Son Tarix</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outgoingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>₼{order.totalPrice?.toLocaleString?.() ?? "-"}</TableCell>
                      {/* <TableCell>
                        <Badge variant={getPriorityColor(order.priority)}>{order.priority}</Badge>
                      </TableCell> */}
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.opened, "dd MMM yy HH:mm")}</TableCell>
                      <TableCell>{formatDate(order.closed, "dd MMM yy HH:mm")}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => onViewOrder?.(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="incoming">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sifariş ID</TableHead>
                    <TableHead>Təchizatçı</TableHead>
                    <TableHead>Dəyər</TableHead>
                    <TableHead>Prioritet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Yaradılıb</TableHead>
                    <TableHead>Son Tarix</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      <TableCell>{order.vendor}</TableCell>
                        <TableCell>₼{order.totalPrice?.toLocaleString?.() ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(order.priority)}>{order.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.opened, "dd MMM yy HH:mm")}</TableCell>
                      <TableCell>{formatDate(order.closed, "dd MMM yy HH:mm")}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => onViewOrder?.(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
