"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { SubscriptionPlan, UserSubscription, SubscriptionContextType } from "@/types/subscription"
import { getSubscriptionPackages, getCurrentSubscription, subscribeToPackage, type SubscriptionPackage } from "@/lib/api/subscription"
import { useAuth } from "./auth/AuthProvider"

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

// Transform backend data to frontend types
const transformSubscriptionPackageToFrontend = (backendPackage: SubscriptionPackage): SubscriptionPlan => {
  let tier: "bronze" | "silver" | "gold" = "bronze"
  
  // Determine tier based on price or name
  if (backendPackage.name.toLowerCase().includes("gold") || backendPackage.price >= 100) {
    tier = "gold"
  } else if (backendPackage.name.toLowerCase().includes("silver") || backendPackage.price >= 50) {
    tier = "silver"
  } else {
    tier = "bronze"
  }

  return {
    id: backendPackage.id.toString(),
    name: backendPackage.name,
    tier,
    code: backendPackage.code,
    price: backendPackage.price,
    billingCycle: "monthly", // Default to monthly, can be modified based on backend data
    features: backendPackage.features,
    limits: {
      warehouses: backendPackage.maxWarehouses === -1 ? -1 : backendPackage.maxWarehouses,
      users: backendPackage.maxWorkers === -1 ? -1 : backendPackage.maxWorkers,
      orders: backendPackage.maxOrders === -1 ? -1 : backendPackage.maxOrders,
      storage: backendPackage.maxProducts > 1000 ? "Unlimited" : `${Math.round(backendPackage.maxProducts / 100)}GB`,
    },
    popular: tier === "silver", // Mark silver as popular
  }
}

// Mock current subscription - replace with real API data when available
const mockCurrentSubscription: UserSubscription = {
  id: "sub-123",
  planId: "2", // Default to Silver plan
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
  const { user } = useAuth() // Assuming you have a useAuth hook to get company ID

  // Placeholder notification function - notifications will come from SignalR
  const addNotification = (notification: any) => {
    // This is just a placeholder - actual notifications come via SignalR
  }

  const fetchSubscriptionData = async () => {
    setIsLoading(true)
    try {
      const backendPackages = await getSubscriptionPackages()
      const frontendPlans = backendPackages.map(transformSubscriptionPackageToFrontend)
      setAvailablePlans(frontendPlans)
      
      // Try to fetch current subscription from backend
      try {
        const currentSub = await getCurrentSubscription()
        if (currentSub) {
          // Transform backend subscription to frontend format
          const frontendSub: UserSubscription = {
            id: "current-subscription",
            planId: currentSub.packageName?.toLowerCase() || "unknown",
            tier: currentSub.packageName?.toLowerCase().includes("gold") ? "gold" : 
                  currentSub.packageName?.toLowerCase().includes("silver") ? "silver" : "bronze",
            status: currentSub.isActive ? "active" : "expired",
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: currentSub.expirationDate || new Date().toISOString(),
            cancelAtPeriodEnd: false,
            usage: {
              warehouses: 0, // These would come from actual usage data
              users: 0,
              orders: 0,
              storageUsed: "0GB",
            },
          }
          setCurrentSubscription(frontendSub)
        } else {
          setCurrentSubscription(null)
        }
      } catch (error) {
        console.error("Failed to fetch current subscription:", error)
        setCurrentSubscription(null)
      }
      
    } catch (error) {
      console.error("Failed to fetch subscription data:", error)
      addNotification({
        title: "Error",
        message: "Failed to fetch subscription data",
        type: "xəta",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToPlan = async (packageCode: string) => {
    try {
      const companyId = user?.companyId || "1b1b9723-62fa-4f55-a04a-140862f13b6d"; // Use actual company ID from auth context
      
      const result = await subscribeToPackage({
        CompanyId: companyId,
        PackageCode: packageCode
      })
      // Fetch updated subscription data after successful subscription
      await fetchSubscriptionData()
      
      addNotification({
        title: "Subscription Activated",
        message: `You have successfully subscribed to the ${packageCode} plan!`,
        type: "uğur",
      })
    } catch (error) {
      console.error("Failed to subscribe to plan:", error)
      addNotification({
        title: "Subscription Failed",
        message: "Failed to subscribe to the selected plan. Please try again.",
        type: "xəta",
      })
    }
  }

  const upgradePlan = async (planId: string) => {
    try {
      // Get the plan details to determine the package code
      const selectedPlan = availablePlans.find(plan => plan.id === planId)
      if (!selectedPlan) {
        throw new Error("Selected plan not found")
      }

      const companyId = user?.companyId || "1b1b9723-62fa-4f55-a04a-140862f13b6d"
      
      // Use the package code from the plan
      const packageCode = selectedPlan.code || selectedPlan.tier // fallback to tier if code is not available

      await subscribeToPackage({
        CompanyId: companyId,
        PackageCode: packageCode
      })

      await fetchSubscriptionData()
      addNotification({
        title: "Plan Upgraded",
        message: "Your subscription has been successfully upgraded!",
        type: "uğur",
      })
    } catch (error) {
      console.error("Failed to upgrade plan:", error)
      addNotification({
        title: "Upgrade Failed",
        message: "Failed to upgrade your plan. Please try again.",
        type: "xəta",
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
        type: "xəta",
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
        type: "xəta",
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
          type: "uğur",
        })
      }
    } catch (error) {
      addNotification({
        title: "Resume Failed",
        message: "Failed to resume subscription. Please try again.",
        type: "xəta",
      })
    }
  }

  useEffect(() => {
    if (user) {
      // Login olduqdan sonra subscription data-sını fetch et
      fetchSubscriptionData()
    } else {
      // Logout olduqda subscription data-sını təmizlə
      setCurrentSubscription(null)
      setAvailablePlans([])
      setIsLoading(false)
    }
  }, [user]) // user state-i dəyişdikdə çalışacaq

  const value: SubscriptionContextType = {
    currentSubscription,
    availablePlans,
    isLoading,
    subscribeToPlan,
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
