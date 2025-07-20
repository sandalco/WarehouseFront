export type SubscriptionTier = "bronze" | "silver" | "gold"

export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionTier
  code: string
  price: number
  billingCycle: "monthly" | "yearly"
  features: string[]
  limits: {
    warehouses: number
    users: number
    orders: number
    storage: string
  }
  popular?: boolean
}

export interface UserSubscription {
  id: string
  planId: string
  tier: SubscriptionTier
  status: "active" | "cancelled" | "expired" | "pending"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  usage: {
    warehouses: number
    users: number
    orders: number
    storageUsed: string
  }
}

export interface SubscriptionContextType {
  currentSubscription: UserSubscription | null
  availablePlans: SubscriptionPlan[]
  isLoading: boolean
  subscribeToPlan: (planId: string) => Promise<void>
  upgradePlan: (planId: string) => Promise<void>
  downgradePlan: (planId: string) => Promise<void>
  cancelSubscription: () => Promise<void>
  resumeSubscription: () => Promise<void>
  fetchSubscriptionData: () => Promise<void>
}
