"use client"

import { useAuth } from "@/components/auth-provider"
import { WarehousemanDashboard } from "@/components/warehouseman-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WarehousePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "anbarçı")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Yüklənir...</div>
  }

  if (!user || user.role !== "anbarçı") {
    return null
  }

  return <WarehousemanDashboard />
}
