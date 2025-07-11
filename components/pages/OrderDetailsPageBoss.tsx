"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { OrderHeader } from "@/components/order-details/OrderHeader"
import { OrderSummaryCard } from "@/components/order-details/OrderSummaryCard"
import { OrderProductsList } from "@/components/order-details/OrderProductsList"
import { OrderFinancialSummary } from "@/components/order-details/OrderFinancialSummary"
import { OrderNotes } from "@/components/order-details/OrderNotes"

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

  const handleNotesChange = (notes: string) => {
    setEditedOrder({ ...editedOrder, notes })
  }

  return (
    <div className="space-y-6">
      <OrderHeader
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        onBack={onBack}
        onEdit={() => setIsEditing(true)}
        onSave={handleSaveChanges}
        onCancel={handleCancelEdit}
        getOrderProgress={getOrderProgress}
        getOrderStatus={getOrderStatus}
        getPriorityColor={getPriorityColor}
        getStatusColor={getStatusColor}
      />

      <OrderSummaryCard
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        getOrderProgress={getOrderProgress}
        getOrderStatus={getOrderStatus}
        getPriorityColor={getPriorityColor}
        getStatusColor={getStatusColor}
      />

      <OrderProductsList order={order} />

      <OrderFinancialSummary order={order} />

      <OrderNotes
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        onNotesChange={handleNotesChange}
      />
    </div>
  )
}
