import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, CheckCircle, Clock, MapPin } from "lucide-react"

interface OrderProductsListProps {
  order: any
}

export function OrderProductsList({ order }: OrderProductsListProps) {
  return (
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
                          Price: <span className="font-medium">₼{product.unitPrice}</span>
                        </span>
                        {product.shelfCode && (
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
                      <p className="font-medium">₼{(product.unitPrice * product.quantity).toFixed(2)}</p>
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
  )
}
