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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Eye, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { Order } from "@/types/order"
import { getOrdersByCompany } from "@/lib/api/order"
import { createApiCall } from "@/lib/api-helpers"
import { toast } from "@/hooks/use-toast"

interface OrderManagementProps {
  onCreateOrder?: () => void
}

export function OrderManagement({ onCreateOrder }: OrderManagementProps = {}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    createApiCall(
      getOrdersByCompany,
      setIsLoading,
      (data) => setOrders(data),
      (error) => toast({ title: "Xəta", description: error, variant: "destructive" })
    )
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.warehouseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //const outgoingOrders = filteredOrders.filter((order) => order.type === "Outgoing")
  //const incomingOrders = filteredOrders.filter((order) => order.type === "Incoming")

  const outgoingOrders = filteredOrders.filter((order) => !!order.customerId)
  const incomingOrders = filteredOrders.filter((order) => !order.customerId)


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Processing":
        return "secondary"
      case "Pending":
        return "outline"
      case "In Transit":
        return "secondary"
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sifariş İdarəetməsi</h2>
          <p className="text-gray-600">Daxil olan və çıxan anbar sifarişlərini idarə edin</p>
        </div>
        <Button onClick={onCreateOrder}>
          <Plus className="h-4 w-4 mr-2" />
          Sifariş Yarat
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  <Label htmlFor="customer">Müştəri</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Müştəri seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc">ABC Corporation</SelectItem>
                      <SelectItem value="xyz">XYZ Limited</SelectItem>
                      <SelectItem value="tech">Tech Solutions</SelectItem>
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
                <Button onClick={() => setIsAddDialogOpen(false)}>Sifariş Yarat</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sifarişlər</CardTitle>
          <CardDescription>
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
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Bütün Sifarişlər</TabsTrigger>
              <TabsTrigger value="outgoing">Çıxan</TabsTrigger>
              <TabsTrigger value="incoming">Daxil olan</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sifariş ID</TableHead>
                    <TableHead>Növ</TableHead>
                    <TableHead>Müştəri/Təchizatçı</TableHead>
                    <TableHead>Dəyər</TableHead>
                    <TableHead>Prioritet</TableHead>
                    <TableHead>Status</TableHead>
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
                          {/* {order.type === "Incoming" ? (
                            <ArrowDownCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                          )}
                          {order.type} */}
                            <ArrowUpCircle className="h-3 w-3 mr-1" />

                        </Badge>
                      </TableCell>
                      {/* <TableCell>{order.customer || order.vendor}</TableCell> */}
                      <TableCell>{order.customerId}</TableCell>
                      {/* <TableCell>${order.totalValue.toLocaleString()}</TableCell> */}
                      {/* <TableCell>
                        <Badge variant={getPriorityColor(order.priority)}>{order.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell> */}
                      <TableCell>{order.closed}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
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
                    <TableHead>Prioritet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Son Tarix</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outgoingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      <TableCell>{order.customerId}</TableCell>
                      {/* <TableCell>${order.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(order.priority)}>{order.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell> */}
                      <TableCell>{order.closed}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
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
                    <TableHead>Son Tarix</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      {/* <TableCell>{order.vendor}</TableCell>
                      <TableCell>${order.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(order.priority)}>{order.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell> */}
                      <TableCell>{order.closed}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
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
