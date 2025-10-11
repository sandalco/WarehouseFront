import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Edit, Save, X } from "lucide-react"
import { use, useEffect } from "react"

interface OrderHeaderProps {
  order: any
  editedOrder: any
  isEditing: boolean
  onBack: () => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  getOrderProgress: () => number
  getOrderStatus: () => string
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
}

export function OrderHeader({
  order,
  editedOrder,
  isEditing,
  onBack,
  onEdit,
  onSave,
  onCancel,
  getOrderProgress,
  getOrderStatus,
  getPriorityColor,
  getStatusColor,
}: OrderHeaderProps) {
    useEffect(() => {
        // This effect can be used for any side effects related to order changes
    }, [order]);

    // Safety check to prevent errors when order is not yet loaded
    if (!order) {
        return null;
    }
    
  return (
    <div className="space-y-4">
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
            <Button onClick={onEdit} className="bg-purple-primary hover:bg-purple-600">
              <Edit className="h-4 w-4 mr-2" />
              Sifarişi Redaktə Et
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={onSave} className="bg-purple-primary hover:bg-purple-600">
                <Save className="h-4 w-4 mr-2" />
                Dəyişiklikləri Saxla
              </Button>
              <Button onClick={onCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Ləğv Et
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Order Badge and Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant={order?.customer ? "default" : "secondary"} className="text-sm">
            {order?.customer ? "Çıxan" : "Daxil"} Sifariş
          </Badge>
          <h2 className="text-xl font-semibold">{order?.id}</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={getPriorityColor(editedOrder?.priority || "Medium") as any}>
            {editedOrder?.priority || "Orta"} Prioritet
          </Badge>
          <Badge variant={getStatusColor(getOrderStatus()) as any}>{getOrderStatus()}</Badge>
        </div>
      </div>

      {/* Progress Section */}
      {order?.products && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Sifariş Proqresi</span>
            <span className="text-gray-600">{Math.round(getOrderProgress())}% Tamamlandı</span>
          </div>
          <Progress value={getOrderProgress()} className="h-3" />
        </div>
      )}
    </div>
  )
}
