import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Truck, Eye } from "lucide-react"
import { formatDate } from "@/utils/dateFormat"

interface OrderFinancialSummaryProps {
  order: any
}

export function OrderFinancialSummary({ order }: OrderFinancialSummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Maliyyə Xülasəsi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">₼{order.totalPrice?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span className="font-medium">₼{((order.totalPrice || 0) * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-medium">₼0.00</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₼{((order.totalPrice || 0) * 1.1 + 0).toFixed(2)}</span>
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
              <p className="text-sm text-gray-600">{formatDate(order.opened)}</p>
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
  )
}
