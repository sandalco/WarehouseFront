"use client"
import { SubscriptionDashboard } from "./subscription-dashboard"
import { SubscriptionPlans } from "./subscription-plans"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Package, BarChart3 } from "lucide-react"
import { BillingHistory } from "./BillingHistory"

export function SubscriptionManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple-primary">Abunəlik İdarəetməsi</h2>
        <p className="text-gray-600">Abunəlik planınızı və ödənişlərinizi idarə edin</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>İcmal</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Planlar</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Ödənişlər</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SubscriptionDashboard />
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Planınızı Seçin</CardTitle>
              <CardDescription>Anbar idarəetmə ehtiyaclarınıza ən uyğun planı seçin</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionPlans />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Ödəniş Tarixçəsi</CardTitle>
              <CardDescription>Ödəniş tarixçənizi görün və faktura yükləyin</CardDescription>
            </CardHeader>
            <CardContent>
              <BillingHistory/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
