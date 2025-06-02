"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  Package,
  MapPin,
  CheckCircle,
  Clock,
  User,
  Building,
  Truck,
  Calendar,
  AlertTriangle,
} from "lucide-react"

interface OrderDetailsPageProps {
  task: any
  onBack: () => void
  onCompleteProduct: (taskId: string, productId: string) => void
}

export function OrderDetailsPage({ task, onBack, onCompleteProduct }: OrderDetailsPageProps) {
  const getTaskProgress = () => {
    const completedCount = task.products.filter((p: any) => p.completed).length
    return (completedCount / task.products.length) * 100
  }

  const getTaskStatus = () => {
    const completedCount = task.products.filter((p: any) => p.completed).length
    const totalCount = task.products.length

    if (completedCount === 0) return "Not Started"
    if (completedCount === totalCount) return "Completed"
    return `In Progress (${completedCount}/${totalCount})`
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-purple-primary">Order Details</h1>
            <p className="text-gray-600">Complete order processing tasks</p>
          </div>
        </div>
        <Badge variant={getPriorityColor(task.priority)} className="text-sm px-3 py-1">
          {task.priority} Priority
        </Badge>
      </div>

      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant={task.orderType === "Outgoing" ? "default" : "secondary"} className="text-sm">
                {task.orderType === "Outgoing" ? (
                  <ArrowLeft className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-1" />
                )}
                {task.orderType} Order
              </Badge>
              <CardTitle className="text-xl">{task.orderId}</CardTitle>
            </div>
            <Badge variant="outline" className="text-sm">
              {getTaskStatus()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Section */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="text-gray-600">{Math.round(getTaskProgress())}% Complete</span>
            </div>
            <Progress value={getTaskProgress()} className="h-3" />
          </div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              {task.orderType === "Outgoing" ? (
                <User className="h-5 w-5 text-gray-400" />
              ) : (
                <Building className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm text-gray-600">{task.orderType === "Outgoing" ? "Customer" : "Vendor"}</p>
                <p className="font-medium">{task.customer || task.vendor}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="font-medium">{task.products.length} Products</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Assigned Time</p>
                <p className="font-medium">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium">Today, 6:00 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Products to Process</CardTitle>
          <CardDescription>
            {task.orderType === "Outgoing"
              ? "Pick these items from their locations"
              : "Put away these items to their designated locations"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {task.products.map((product: any, index: number) => (
              <div
                key={product.id}
                className={`border rounded-lg p-4 transition-all ${
                  product.completed ? "bg-green-50 border-green-200" : "bg-white hover:bg-gray-50"
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
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="font-mono">{product.shelf}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {product.taskType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {product.completed ? (
                      <div className="flex items-center space-x-2">
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    ) : (
                      <Button
                        onClick={() => onCompleteProduct(task.id, product.id)}
                        className="bg-purple-primary hover:bg-purple-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>

                {/* Future expansion area for machine assignment, special instructions, etc. */}
                {!product.completed && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Machine: <span className="font-medium">Auto-assign</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Special handling: <span className="font-medium">None</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Est. time: <span className="font-medium">15 min</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Task List
        </Button>

        <div className="flex space-x-3">
          {getTaskProgress() === 100 ? (
            <Badge variant="default" className="bg-green-600 text-white px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Order Completed
            </Badge>
          ) : (
            <Badge variant="secondary" className="px-4 py-2">
              {task.products.filter((p: any) => !p.completed).length} items remaining
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
