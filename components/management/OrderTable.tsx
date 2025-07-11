"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { formatDate } from "@/utils/dateFormat"
import { Order } from "@/types/order"

interface OrderTableProps {
  orders: Order[]
  outgoingOrders: Order[]
  incomingOrders: Order[]
  onViewOrder: (order: Order) => void
  getStatusColor: (status: string) => string
}

export function OrderTable({ 
  orders, 
  outgoingOrders, 
  incomingOrders, 
  onViewOrder,
  getStatusColor 
}: OrderTableProps) {
  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">Bütün Sifarişlər ({orders.length})</TabsTrigger>
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
              <TableHead>Status</TableHead>
              <TableHead>Yaradılıb</TableHead>
              <TableHead>Son Tarix</TableHead>
              <TableHead>Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center w-fit">
                    {order.customer ? (
                      <ArrowUpCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownCircle className="h-3 w-3 mr-1" />
                    )}
                    {order.customer ? "Çıxan" : "Daxil"}
                  </Badge>
                </TableCell>
                <TableCell>{order.customer || "-"}</TableCell>
                <TableCell>₼{order.totalPrice?.toLocaleString?.() ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                </TableCell>
                <TableCell>{formatDate(order.opened, "dd MMM yy HH:mm")}</TableCell>
                <TableCell>{formatDate(order.closed, "dd MMM yy HH:mm")}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onViewOrder(order)}>
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
              <TableHead>Status</TableHead>
              <TableHead>Yaradılıb</TableHead>
              <TableHead>Son Tarix</TableHead>
              <TableHead>Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outgoingOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>₼{order.totalPrice?.toLocaleString?.() ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                </TableCell>
                <TableCell>{formatDate(order.opened, "dd MMM yy HH:mm")}</TableCell>
                <TableCell>{formatDate(order.closed, "dd MMM yy HH:mm")}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onViewOrder(order)}>
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
              <TableHead>Müştəri</TableHead>
              <TableHead>Dəyər</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Yaradılıb</TableHead>
              <TableHead>Son Tarix</TableHead>
              <TableHead>Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomingOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer || "-"}</TableCell>
                <TableCell>₼{order.totalPrice?.toLocaleString?.() ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                </TableCell>
                <TableCell>{formatDate(order.opened, "dd MMM yy HH:mm")}</TableCell>
                <TableCell>{formatDate(order.closed, "dd MMM yy HH:mm")}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onViewOrder(order)}>
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
  )
}
