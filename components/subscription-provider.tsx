"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { SubscriptionPlan, UserSubscription, SubscriptionContextType } from "@/types/subscription"
import { useNotifications } from "./notification-provider"

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

// Mock data - replace with actual API calls
const mockPlans: SubscriptionPlan[] = [
  {
    id: "bronze-monthly",
    name: "Bronze",
    tier: "bronze",
    price: 29,
    billingCycle: "monthly",
    features: ["Up to 2 warehouses", "Up to 5 users", "Basic inventory tracking", "Email support", "Mobile app access"],
    limits: {
      warehouses: 2,
      users: 5,
      orders: 100,
      storage: "5GB",
    },
  },
  {
    id: "silver-monthly",
    name: "Silver",
    tier: "silver",
    price: 79,
    billingCycle: "monthly",
    popular: true,
    features: [
      "Up to 5 warehouses",
      "Up to 20 users",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom reports",
    ],
    limits: {
      warehouses: 5,
      users: 20,
      orders: 500,
      storage: "25GB",
    },
  },
  {
    id: "gold-monthly",
    name: "Gold",
    tier: "gold",
    price: 149,
    billingCycle: "monthly",
    features: [
      "Unlimited warehouses",
      "Unlimited users",
      "AI-powered insights",
      "24/7 phone support",
      "White-label options",
      "Advanced integrations",
      "Custom workflows",
    ],
    limits: {
      warehouses: -1, // -1 means unlimited
      users: -1,
      orders: -1,
      storage: "Unlimited",
    },
  },
]

const mockCurrentSubscription: UserSubscription = {
  id: "sub-123",
  planId: "silver-monthly",
  tier: "silver",
  status: "active",
  currentPeriodStart: "2024-01-01",
  currentPeriodEnd: "2024-02-01",
  cancelAtPeriodEnd: false,
  usage: {
    warehouses: 3,
    users: 12,
    orders: 234,
    storageUsed: "12GB",
  },
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null)
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addNotification } = useNotifications()

  const fetchSubscriptionData = async () => {
    setIsLoading(true)
    try {
      // Replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
      setCurrentSubscription(mockCurrentSubscription)
      setAvailablePlans(mockPlans)
    } catch (error) {
      addNotification({
        title: "Error",
        message: "Failed to fetch subscription data",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const upgradePlan = async (planId: string) => {
    try {
      // API call to upgrade plan
      const response = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (response.ok) {
        await fetchSubscriptionData()
        addNotification({
          title: "Plan Upgraded",
          message: "Your subscription has been successfully upgraded!",
          type: "success",
        })
      }
    } catch (error) {
      addNotification({
        title: "Upgrade Failed",
        message: "Failed to upgrade your plan. Please try again.",
        type: "error",
      })
    }
  }

  const downgradePlan = async (planId: string) => {
    try {
      const response = await fetch("/api/subscription/downgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (response.ok) {
        await fetchSubscriptionData()
        addNotification({
          title: "Plan Changed",
          message: "Your plan will be downgraded at the end of the current billing period.",
          type: "info",
        })
      }
    } catch (error) {
      addNotification({
        title: "Downgrade Failed",
        message: "Failed to change your plan. Please try again.",
        type: "error",
      })
    }
  }

  const cancelSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      })

      if (response.ok) {
        await fetchSubscriptionData()
        addNotification({
          title: "Subscription Cancelled",
          message: "Your subscription will be cancelled at the end of the current billing period.",
          type: "info",
        })
      }
    } catch (error) {
      addNotification({
        title: "Cancellation Failed",
        message: "Failed to cancel subscription. Please try again.",
        type: "error",
      })
    }
  }

  const resumeSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/resume", {
        method: "POST",
      })

      if (response.ok) {
        await fetchSubscriptionData()
        addNotification({
          title: "Subscription Resumed",
          message: "Your subscription has been successfully resumed!",
          type: "success",
        })
      }
    } catch (error) {
      addNotification({
        title: "Resume Failed",
        message: "Failed to resume subscription. Please try again.",
        type: "error",
      })
    }
  }

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const value: SubscriptionContextType = {
    currentSubscription,
    availablePlans,
    isLoading,
    upgradePlan,
    downgradePlan,
    cancelSubscription,
    resumeSubscription,
    fetchSubscriptionData,
  }

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
