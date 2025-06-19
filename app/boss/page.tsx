"use client"

import { useAuth } from "@/components/auth-provider"
import { BossDashboard } from "@/components/boss-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function BossPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "boss")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Yüklənir...</div>
  }

  if (!user || user.role !== "boss") {
    return null
  }

  return <BossDashboard />
}
