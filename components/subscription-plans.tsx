"use client"

import { useState } from "react"
import { useSubscription } from "./subscription-provider"
import { useAuth } from "./auth/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Star, Zap, Crown } from "lucide-react"
import type { SubscriptionPlan } from "@/types/subscription"

export function SubscriptionPlans() {
  const { currentSubscription, availablePlans, subscribeToPlan, upgradePlan, downgradePlan, isLoading } = useSubscription()
  const { user } = useAuth()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  // Authentication yoxla
  if (!user) {
    return (
      <div className="text-center py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-gray-600">Subscription planlarını görmək üçün giriş edin</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "bronze":
        return <Star className="h-5 w-5 text-amber-600" />
      case "silver":
        return <Zap className="h-5 w-5 text-gray-600" />
      case "gold":
        return <Crown className="h-5 w-5 text-yellow-600" />
      default:
        return null
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "border-amber-200 bg-amber-50"
      case "silver":
        return "border-gray-200 bg-gray-50"
      case "gold":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200"
    }
  }

  const handlePlanChange = async (plan: SubscriptionPlan) => {    
    if (!currentSubscription) {
      // Yeni subscription
      await subscribeToPlan(plan.code)
      return
    }

    const currentTierOrder = ["bronze", "silver", "gold"]
    const currentIndex = currentTierOrder.indexOf(currentSubscription.tier)
    const newIndex = currentTierOrder.indexOf(plan.tier)

    await upgradePlan(plan.id)
    // if (newIndex > currentIndex) {
    //   await upgradePlan(plan.id)
    // } else if (newIndex < currentIndex) {
    //   await downgradePlan(plan.id)
    // }
  }

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.planId === planId
  }

  const getButtonText = (plan: SubscriptionPlan) => {
    if (isCurrentPlan(plan.id)) {
      return "Cari Plan"
    }

    if (!currentSubscription) {
      return "Başla"
    }

    const currentTierOrder = ["bronze", "silver", "gold"]
    const currentIndex = currentTierOrder.indexOf(currentSubscription.tier)
    const newIndex = currentTierOrder.indexOf(plan.tier)

    if (newIndex > currentIndex) {
      return "Yüksəlt"
    } else if (newIndex < currentIndex) {
      return "Endir"
    }

    return "Planı Seç"
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-toggle">Aylıq</Label>
        <Switch
          id="billing-toggle"
          checked={billingCycle === "yearly"}
          onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
        />
        <Label htmlFor="billing-toggle">
          İllik
          <Badge variant="secondary" className="ml-2">
            20% Endirim
          </Badge>
        </Label>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {availablePlans
          .filter((plan) => plan.billingCycle === billingCycle)
          .map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${getTierColor(plan.tier)} ${
                plan.popular ? "ring-2 ring-purple-500" : ""
              } ${isCurrentPlan(plan.id) ? "ring-2 ring-green-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                </div>
              )}

              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white">Current</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {getTierIcon(plan.tier)}
                  <CardTitle className="text-2xl capitalize">{plan.name}</CardTitle>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    ${billingCycle === "yearly" ? Math.round(plan.price * 0.8) : plan.price}
                    <span className="text-lg font-normal text-gray-600">
                      /{billingCycle === "yearly" ? "il" : "ay"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <div className="text-sm text-gray-500">
                      <span className="line-through">${plan.price * 12}</span>
                      <span className="ml-2 text-green-600">İldə ${plan.price * 12 * 0.2} qənaət edin</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                {/* <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul> */}

                {/* Limits */}
                <div className="border-t pt-4 space-y-2">
                  <h4 className="font-semibold text-sm">Limitlər:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Anbarlar: {plan.limits.warehouses === -1 ? "Limitsiz" : plan.limits.warehouses}</div>
                    <div>İstifadəçilər: {plan.limits.users === -1 ? "Limitsiz" : plan.limits.users}</div>
                    <div>Sifarişlər/ay: {plan.limits.orders === -1 ? "Limitsiz" : plan.limits.orders}</div>
                    <div>Yaddaş: {plan.limits.storage}</div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={isCurrentPlan(plan.id) ? "secondary" : "default"}
                  disabled={isCurrentPlan(plan.id)}
                  onClick={() => handlePlanChange(plan)}
                >
                  {getButtonText(plan)}
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
