"use client"

import { EnhancedOrderManagement } from "@/components/management/EnhancedOrderManagement"
import { CreateOrderPage } from "@/components/pages/CreateOrderPage"
import { useState } from "react"

export default function BossOrdersPage() {
  const [showCreateOrder, setShowCreateOrder] = useState(false)

  const handleBackToOrders = () => {
    setShowCreateOrder(false)
  }

  const handleCreateOrder = () => {
    setShowCreateOrder(true)
  }

  return (
    <>
      {showCreateOrder ? (
        <CreateOrderPage onBack={handleBackToOrders} />
      ) : (
        <EnhancedOrderManagement 
          onCreateOrder={handleCreateOrder}
        />
      )}
    </>
  )
}
