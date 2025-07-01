"use client"

import { useState } from "react"
import { EnhancedOrderManagement } from "@/components/management/EnhancedOrderManagement"
import { OrderDetailsPageBoss } from "@/components/pages/OrderDetailsPageBoss"
import { CreateOrderPage } from "@/components/pages/CreateOrderPage"

export default function BossOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [showCreateOrder, setShowCreateOrder] = useState(false)

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
  }

  const handleBackToOrders = () => {
    setSelectedOrder(null)
    setShowCreateOrder(false)
  }

  const handleCreateOrder = () => {
    setShowCreateOrder(true)
  }

  return (
    <>
      {selectedOrder ? (
        <OrderDetailsPageBoss order={selectedOrder} onBack={handleBackToOrders} />
      ) : showCreateOrder ? (
        <CreateOrderPage onBack={handleBackToOrders} />
      ) : (
        <EnhancedOrderManagement 
          onViewOrder={handleViewOrder} 
          onCreateOrder={handleCreateOrder}
        />
      )}
    </>
  )
}
