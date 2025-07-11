import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, User, Building, Warehouse, Calendar, Clock } from "lucide-react"
import { formatDate } from "@/utils/dateFormat"

interface OrderSummaryCardProps {
  order: any
  editedOrder: any
  isEditing: boolean
  onStatusChange: (status: string) => void
  onPriorityChange: (priority: string) => void
  getOrderProgress: () => number
  getOrderStatus: () => string
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
}

export function OrderSummaryCard({ 
  order, 
  editedOrder, 
  isEditing, 
  onStatusChange, 
  onPriorityChange,
  getOrderProgress,
  getOrderStatus,
  getPriorityColor,
  getStatusColor 
}: OrderSummaryCardProps) {
  // Safety check to prevent errors when order is not yet loaded
  if (!order) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant={order?.customer ? "default" : "secondary"} className="text-sm">
              {order?.customer ? (
                <ArrowLeft className="h-4 w-4 mr-1" />
              ) : (
                <Package className="h-4 w-4 mr-1" />
              )}
              {order?.customer ? "Outgoing" : "Incoming"} Order
            </Badge>
            <CardTitle className="text-xl">{order?.id}</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={getPriorityColor(editedOrder?.priority || "Medium") as any}>
              {editedOrder?.priority || "Medium"} Priority
            </Badge>
            <Badge variant={getStatusColor(getOrderStatus()) as any}>{getOrderStatus()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Section */}
        {order?.products && (
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
            {order?.customer ? (
              <User className="h-5 w-5 text-gray-400" />
            ) : (
              <Building className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="text-sm text-gray-600">{order?.customer ? "Customer" : "Vendor"}</p>
              <p className="font-medium">{order?.customer || order?.vendor || "-"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Warehouse className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Warehouse</p>
              <p className="font-medium">{order?.warehouse || order?.warehouseName || "Main Distribution Center"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Created Date</p>
              <p className="font-medium">{formatDate(order?.opened)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Closed Date</p>
              <p className="font-medium">{formatDate(order?.closed)}</p>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select value={editedOrder?.status} onValueChange={onStatusChange}>
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
              <Select value={editedOrder?.priority || "Medium"} onValueChange={onPriorityChange}>
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
  )
}
