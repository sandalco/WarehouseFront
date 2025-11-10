"use client"

import { EnhancedOrderManagement } from "@/components/management/EnhancedOrderManagement"
import { CreateOrderPage } from "@/components/pages/CreateOrderPage"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function OrdersContent() {
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

export default function BossOrdersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Yüklənir...</div>}>
      <OrdersContent />
    </Suspense>
  )
}
