"use client"

import { useSubscription } from "../subscription-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  CreditCard,
  Users,
  Warehouse,
  ShoppingCart,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentSubscription } from "@/lib/api/subscription"
import { set } from "date-fns"
import { ActiveSubscription } from "@/types/subscription/subscriptionhistory"

export function SubscriptionDashboard() {
  const { currentSubscription, availablePlans, cancelSubscription, resumeSubscription, isLoading } = useSubscription()
  const [subscription, setCurrentSubscription] = useState<ActiveSubscription | undefined>();

  useEffect(() => {
    getCurrentSubscription()
      .then((result) => {
        if (result) {
          setCurrentSubscription(result);
        } else {
          setCurrentSubscription(undefined);
        }
      });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>You don't have an active subscription. Choose a plan to get started.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const currentPlan = availablePlans.find((plan) => plan.id === currentSubscription.planId)

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "expired":
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon(currentSubscription.status)}
                <span>Cari Abunəlik</span>
              </CardTitle>
              <CardDescription>
                {/* {currentPlan?.name} Planı - {currentSubscription.status} */}
                {subscription?.packageName} Planı
              </CardDescription>
            </div>
            <Badge variant={currentSubscription.status === "active" ? "default" : "secondary"} className="capitalize">
              {currentSubscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Plan</span>
              </div>
              {/* <p className="text-lg font-semibold capitalize">{currentPlan?.name}</p> */}
              <p className="text-lg font-semibold capitalize">{subscription?.packageName}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Növbəti Ödəniş</span>
              </div>
              {/* <p className="text-lg">{formatDate(currentSubscription.currentPeriodEnd)}</p> */}
              <p className="text-lg">
                {subscription?.expirationDate ? formatDate(subscription.expirationDate) : "-"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Usage Statistics */}
          <div className="space-y-4">
            <h4 className="font-semibold">İstifadə İcmalı</h4>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Warehouses */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Warehouse className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Anbarlar</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${getUsageColor(
                      getUsagePercentage(currentSubscription.usage.warehouses, currentPlan?.limits.warehouses || 0),
                    )}`}
                  >
                    {currentSubscription.usage.warehouses} /{" "}
                    {currentPlan?.limits.warehouses === -1 ? "∞" : currentPlan?.limits.warehouses}
                  </span>
                </div>
                {currentPlan?.limits.warehouses !== -1 && (
                  <Progress
                    value={getUsagePercentage(
                      currentSubscription.usage.warehouses,
                      currentPlan?.limits.warehouses || 0,
                    )}
                    className="h-2"
                  />
                )}
              </div>

              {/* Users */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">İstifadəçilər</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${getUsageColor(
                      getUsagePercentage(currentSubscription.usage.users, currentPlan?.limits.users || 0),
                    )}`}
                  >
                    {currentSubscription.usage.users} /{" "}
                    {currentPlan?.limits.users === -1 ? "∞" : currentPlan?.limits.users}
                  </span>
                </div>
                {currentPlan?.limits.users !== -1 && (
                  <Progress
                    value={getUsagePercentage(currentSubscription.usage.users, currentPlan?.limits.users || 0)}
                    className="h-2"
                  />
                )}
              </div>

              {/* Orders */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Sifarişlər (bu ay)</span>
                  </div>
                  <span
                    className={`text-sm font-medium ${getUsageColor(
                      getUsagePercentage(currentSubscription.usage.orders, currentPlan?.limits.orders || 0),
                    )}`}
                  >
                    {currentSubscription.usage.orders} /{" "}
                    {currentPlan?.limits.orders === -1 ? "∞" : currentPlan?.limits.orders}
                  </span>
                </div>
                {currentPlan?.limits.orders !== -1 && (
                  <Progress
                    value={getUsagePercentage(currentSubscription.usage.orders, currentPlan?.limits.orders || 0)}
                    className="h-2"
                  />
                )}
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Yaddaş</span>
                  </div>
                  <span className="text-sm font-medium">
                    {currentSubscription.usage.storageUsed} / {currentPlan?.limits.storage}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex space-x-4">
            {currentSubscription.status === "active" && !currentSubscription.cancelAtPeriodEnd && (
              <Button variant="outline" onClick={cancelSubscription}>
                Abunəliyi Ləğv Et
              </Button>
            )}

            {currentSubscription.cancelAtPeriodEnd && (
              <Button onClick={resumeSubscription}>Abunəliyi Davam Etdir</Button>
            )}
          </div>

          {/* Cancellation Notice */}
          {currentSubscription.cancelAtPeriodEnd && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Abunəlik Ləğv Edilib</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Abunəliyiniz {formatDate(currentSubscription.currentPeriodEnd)} tarixində bitəcək. O vaxta qədər
                istənilən vaxt onu bərpa edə bilərsiniz.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
