"use client"

import { useAuth } from "@/components/auth-provider"
import { SubscriptionManagement } from "@/components/subscription-management"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SubscriptionPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "boss")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "boss") {
    return null
  }

  return <SubscriptionManagement />
}
