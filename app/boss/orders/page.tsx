"use client"

import { EnhancedOrderManagement } from "@/components/management/EnhancedOrderManagement"
import { CreateOrderPage } from "@/components/pages/CreateOrderPage"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function BossOrdersPage() {
  const searchParams = useSearchParams()
  const [showCreateOrder, setShowCreateOrder] = useState(false)
  const [initialCustomerId, setInitialCustomerId] = useState<string | null>(null)

  useEffect(() => {
    // Check if customerId is in URL params
    const customerId = searchParams.get("customerId")
    if (customerId) {
      setInitialCustomerId(customerId)
    }
  }, [searchParams])

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
          initialCustomerId={initialCustomerId}
        />
      )}
    </>
  )
}
