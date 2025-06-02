"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Package,
  MapPin,
  CheckCircle,
  Clock,
  User,
  Building,
  Warehouse,
  Calendar,
  Edit,
  Save,
  X,
  Truck,
  Eye,
} from "lucide-react"

interface OrderDetailsPageBossProps {
  order: any
  onBack: () => void
}

export function OrderDetailsPageBoss({ order, onBack }: OrderDetailsPageBossProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedOrder, setEditedOrder] = useState(order)

  const getOrderProgress = () => {
    if (!order.products) return 0
    const completedCount = order.products.filter((p: any) => p.completed).length
    return (completedCount / order.products.length) * 100
  }

  const getOrderStatus = () => {
    if (!order.products) return order.status
    const completedCount = order.products.filter((p: any) => p.completed).length
    const totalCount = order.products.length

    if (completedCount === 0) return "Pending"
    if (completedCount === totalCount) return "Completed"
    return "In Progress"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      case "Processing":
        return "secondary"
      case "Pending":
        return "outline"
      case "Shipped":
        return "default"
      case "In Transit":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleSaveChanges = () => {
    // Save logic here
    setIsEditing(false)
    toast({
      title: "Order Updated",
      description: "Order details have been updated successfully",
    })
  }

  const handleCancelEdit = () => {
    setEditedOrder(order)
    setIsEditing(false)
  }

  const handleStatusChange = (newStatus: string) => {
    setEditedOrder({ ...editedOrder, status: newStatus })
  }

  const handlePriorityChange = (newPriority: string) => {
    setEditedOrder({ ...editedOrder, priority: newPriority })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sifarişlərə Qayıt
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-purple-primary">Sifariş Təfərrüatları</h1>
            <p className="text-gray-600">Sifariş məlumatlarını görün və idarə edin</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-purple-primary hover:bg-purple-600">
              <Edit className="h-4 w-4 mr-2" />
              Sifarişi Redaktə Et
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSaveChanges} className="bg-purple-primary hover:bg-purple-600">
                <Save className="h-4 w-4 mr-2" />
                Dəyişiklikləri Saxla
              </Button>
              <Button onClick={handleCancelEdit} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Ləğv Et
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant={order.type === "Outgoing" ? "default" : "secondary"} className="text-sm">
                {order.type === "Outgoing" ? (
                  <ArrowLeft className="h-4 w-4 mr-1" />
                ) : (
                  <Package className="h-4 w-4 mr-1" />
                )}
                {order.type} Order
              </Badge>
              <CardTitle className="text-xl">{order.id}</CardTitle>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={getPriorityColor(editedOrder.priority)}>{editedOrder.priority} Priority</Badge>
              <Badge variant={getStatusColor(getOrderStatus())}>{getOrderStatus()}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Section */}
          {order.products && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Order Progress</span>
                <span className="text-gray-600">{Math.round(getOrderProgress())}% Complete</span>
              </div>
              <Progress value={getOrderProgress()} className="h-3" />
            </div>
          )}

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              {order.type === "Outgoing" ? (
                <User className="h-5 w-5 text-gray-400" />
              ) : (
                <Building className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm text-gray-600">{order.type === "Outgoing" ? "Customer" : "Vendor"}</p>
                <p className="font-medium">{order.customer || order.vendor}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Warehouse className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Warehouse</p>
                <p className="font-medium">Main Distribution Center</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="font-medium">{order.createdAt}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium">{order.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="status">Order Status</Label>
                <Select value={editedOrder.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={editedOrder.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Sifariş Məhsulları</CardTitle>
          <CardDescription>
            Bu sifarişə daxil olan məhsullar
            {order.products && ` (${order.products.length} məhsul)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.products ? (
              order.products.map((product: any, index: number) => (
                <div
                  key={product.id || index}
                  className={`border rounded-lg p-4 transition-all ${
                    product.completed ? "bg-green-50 border-green-200" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                        {index + 1}
                      </div>
                      <Package className="h-6 w-6 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-lg">{product.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>
                            Quantity: <span className="font-medium">{product.quantity}</span>
                          </span>
                          <span>
                            Price: <span className="font-medium">${product.price}</span>
                          </span>
                          {product.shelf && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="font-mono">{product.shelf}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                        {product.completed ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Clock className="h-4 w-4 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No product details available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maliyyə Xülasəsi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">${order.totalValue?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span className="font-medium">${((order.totalValue || 0) * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-medium">$25.00</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${((order.totalValue || 0) * 1.1 + 25).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sifariş Zaman Qrafiki</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Order Created</p>
                <p className="text-sm text-gray-600">{order.createdAt}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">Processing Started</p>
                <p className="text-sm text-gray-600">In progress</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-400">Shipped</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-400">Delivered</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sifariş Qeydləri</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              placeholder="Add notes about this order..."
              value={editedOrder.notes || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
              rows={4}
            />
          ) : (
            <p className="text-gray-600">{order.notes || "No additional notes for this order."}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
