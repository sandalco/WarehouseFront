"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, Eye, Download, Calendar, DollarSign, Package, Building } from "lucide-react"

interface CustomerOrdersPageProps {
  customerId: string
  customerName: string
  onBack: () => void
  onViewOrder: (orderId: string) => void
}

export function CustomerOrdersPage({ customerId, customerName, onBack, onViewOrder }: CustomerOrdersPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Mock customer orders data
  const customerOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "Delivered",
      items: 3,
      total: 3899.97,
      warehouse: "Main Distribution Center",
      products: ["Laptop Dell XPS 13", "Wireless Mouse", "Monitor 24 inch"],
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      status: "Processing",
      items: 2,
      total: 1599.98,
      warehouse: "West Coast Hub",
      products: ["Laptop Dell XPS 13", "Keyboard Mechanical"],
    },
    {
      id: "ORD-2023-045",
      date: "2023-12-28",
      status: "Delivered",
      items: 5,
      total: 2299.95,
      warehouse: "Main Distribution Center",
      products: ["Wireless Mouse", "Monitor 24 inch", "Keyboard Mechanical"],
    },
    {
      id: "ORD-2023-038",
      date: "2023-12-15",
      status: "Cancelled",
      items: 1,
      total: 1299.99,
      warehouse: "Central Storage",
      products: ["Laptop Dell XPS 13"],
    },
    {
      id: "ORD-2023-029",
      date: "2023-11-30",
      status: "Delivered",
      items: 4,
      total: 1899.96,
      warehouse: "Main Distribution Center",
      products: ["Monitor 24 inch", "Keyboard Mechanical", "Wireless Mouse"],
    },
  ]

  const customerStats = {
    totalOrders: customerOrders.length,
    totalSpent: customerOrders.reduce((sum, order) => sum + order.total, 0),
    avgOrderValue: customerOrders.reduce((sum, order) => sum + order.total, 0) / customerOrders.length,
    lastOrderDate: customerOrders[0]?.date,
  }

  const filteredOrders = customerOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some((product) => product.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "recent" && new Date(order.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "older" && new Date(order.date) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Müştərilərə Qayıt
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-purple-primary">{customerName} üçün Sifarişlər</h1>
            <p className="text-gray-600">{customerId} • Sifariş Tarixçəsi</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Sifarişləri İxrac Et
        </Button>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ümumi Sifarişlər</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ümumi Xərclənmiş</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${customerStats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> vs last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orta Sifariş Dəyəri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${customerStats.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">per order</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Son Sifariş</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.lastOrderDate}</div>
            <p className="text-xs text-muted-foreground">most recent</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Sifariş Tarixçəsi</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-4 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Statuslar</SelectItem>
                  <SelectItem value="delivered">Çatdırılıb</SelectItem>
                  <SelectItem value="processing">Emal olunur</SelectItem>
                  <SelectItem value="cancelled">Ləğv edilib</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tarix Aralığı" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bütün Zamanlar</SelectItem>
                  <SelectItem value="recent">Son 30 Gün</SelectItem>
                  <SelectItem value="older">30 Gündən Köhnə</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sifariş ID</TableHead>
                <TableHead>Tarix</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Məhsullar</TableHead>
                <TableHead>Anbar</TableHead>
                <TableHead>Cəmi</TableHead>
                <TableHead>Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{order.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Processing"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{order.items} items</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm truncate">{order.products.join(", ")}</p>
                      <p className="text-xs text-gray-500">{order.products.length} products</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{order.warehouse}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-bold">${order.total.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => onViewOrder(order.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Bax
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
