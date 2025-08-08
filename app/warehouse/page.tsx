"use client"

import { useAuth } from "@/components/auth/AuthProvider"
import WarehousemanDashboard from "@/components/dashboard/WarehousemanDashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WarehousePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "warehouseman")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Yüklənir...</div>
  }

  if (!user || user.role !== "warehouseman") {
    return null
  }

  return <WarehousemanDashboard />
}
