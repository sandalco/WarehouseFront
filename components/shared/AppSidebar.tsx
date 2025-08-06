"use client"

import type * as React from "react"
import { useAuth } from "../auth/AuthProvider"
import { useSubscription } from "../subscription-provider"
import { useRouter, usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  ShoppingCart,
  Building,
  ClipboardList,
  BarChart3,
  CreditCard,
  Star,
  Zap,
  Crown,
  ArrowUp,
  History,
  Minus,
  Calculator,
} from "lucide-react"

type NavigationItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
  requiredTier?: "bronze" | "silver" | "gold"
  requiresSubscription?: boolean
  exactTier?: boolean // Yalnız həmin tier üçün
}

export function AppSidebar() {
  const { user } = useAuth()
  const { currentSubscription } = useSubscription()
  const router = useRouter()
  const pathname = usePathname()

  const getTierIcon = (tier: string | undefined) => {
    switch (tier) {
      case "bronze":
        return <Star className="h-4 w-4 text-amber-600" />
      case "silver":
        return <Zap className="h-4 w-4 text-gray-600" />
      case "gold":
        return <Crown className="h-4 w-4 text-yellow-600" />
      default:
        return <Star className="h-4 w-4 text-gray-400" />
    }
  }

  const canAccessFeature = (requiredTier?: "bronze" | "silver" | "gold", requiresSubscription?: boolean, exactTier?: boolean) => {
    if (!requiresSubscription) return true
    if (!currentSubscription) return false
    
    // Əgər exactTier true-dursa, yalnız o tier-ə sahib olanlar görə bilər
    if (exactTier) {
      return currentSubscription.tier === requiredTier
    }
    
    // Əks halda, o tier və yuxarısı görə bilər
    const tierOrder = { bronze: 1, silver: 2, gold: 3 }
    const currentTierLevel = tierOrder[currentSubscription.tier as keyof typeof tierOrder] || 0
    const requiredTierLevel = tierOrder[requiredTier || "bronze"]
    
    return currentTierLevel >= requiredTierLevel
  }

  const shouldShowFeature = (requiredTier?: "bronze" | "silver" | "gold", requiresSubscription?: boolean, exactTier?: boolean) => {
    if (!requiresSubscription) return true
    if (!currentSubscription) return true // Subscription olmayanlar bütün featureleri görsün (bağlı da olsa)
    
    const tierOrder = { bronze: 1, silver: 2, gold: 3 }
    const currentTierLevel = tierOrder[currentSubscription.tier as keyof typeof tierOrder] || 1
    const requiredTierLevel = tierOrder[requiredTier || "bronze"]
    
    // Əgər exactTier true-dursa, yalnız o tier görə bilər
    if (exactTier) {
      return currentTierLevel === requiredTierLevel
    }
    
    // Normal tier featurelər: o tier və yuxarısı görə bilər
    // Yəni currentTier >= requiredTier olmalıdır
    return currentTierLevel >= requiredTierLevel
  }

  const bossNavigation: NavigationItem[] = [
    {
      title: "İdarə Paneli",
      url: "/boss",
      icon: LayoutDashboard,
      requiresSubscription: false,
    },
    {
      title: "Məhsullar",
      url: "/boss/products",
      icon: Package,
      requiresSubscription: false, // Hər plan üçün əlçatan
    },
    
    {
      title: "Stok tarixçəsi",
      url: "/boss/stock-history",
      icon: History,
      requiresSubscription: false, // Hər plan üçün əlçatan
    },
    {
      title: "Stok azaltma",
      url: "/boss/stock-reduction",
      icon: Minus,
      requiredTier: "bronze", // Yalnız Bronze üçün
      requiresSubscription: true,
      exactTier: true, // Yalnız Bronze, Silver və Gold görməz
    },
    {
      title: "Anbarlar",
      url: "/boss/warehouses",
      icon: Warehouse,
      requiredTier: "silver", // Silver və Gold üçün
      requiresSubscription: true,
    },
    {
      title: "Sifarişlər",
      url: "/boss/orders",
      icon: ShoppingCart,
      requiredTier: "silver", // Silver və Gold üçün
      requiresSubscription: true,
    },
    {
      title: "Müştərilər",
      url: "/boss/customers",
      icon: Building,
      requiredTier: "silver", // Silver və Gold üçün
      requiresSubscription: true,
    },
    {
      title: "İşçilər",
      url: "/boss/workers",
      icon: Users,
      requiredTier: "gold", // Yalnız Gold üçün
      requiresSubscription: true,
    },
    {
      title: "Maaliyyə",
      url: "/boss/finance",
      icon: Calculator,
      requiredTier: "bronze", // Silver və Gold üçün
      requiresSubscription: true,
    },
    {
      title: "Abunəlik",
      url: "/boss/subscription",
      icon: CreditCard,
      requiresSubscription: false, // Hər zaman göstər
    },
  ]

  const warehousemanNavigation: NavigationItem[] = [
    {
      title: "Dashboard",
      url: "/warehouseman",
      icon: LayoutDashboard,
    },
    {
      title: "Məhsullar",
      url: "/warehouseman/products",
      icon: Package,
    },
    {
      title: "Mənim Tapşırıqlarım",
      url: "/warehouseman/tasks",
      icon: ClipboardList,
    },
    {
      title: "İnventar",
      url: "/warehouseman/inventory",
      icon: Package,
    },
    {
      title: "Tamamlanmış",
      url: "/warehouseman/completed",
      icon: BarChart3,
    },
  ]

  const navigation = user?.role === "boss" ? bossNavigation : warehousemanNavigation
  const filteredNavigation = navigation.filter(item => 
    shouldShowFeature(item.requiredTier, item.requiresSubscription, item.exactTier)
  )

  const handleNavigationClick = (item: NavigationItem) => {
    const hasAccess = canAccessFeature(item.requiredTier, item.requiresSubscription, item.exactTier)
    if (hasAccess) {
      router.push(item.url)
    } else {
      // Upgrade səhifəsinə yönləndir
      router.push("/boss/subscription")
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <img src="/logo.png" alt="Loqo" className="h-8 w-8" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Anbar</span>
            <span className="truncate text-xs">İdarəetməsi</span>
          </div>
        </div>
        
        {/* Subscription Status */}
        {currentSubscription && (
          <div className="flex items-center justify-between px-2 py-1 mx-2 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              {getTierIcon(currentSubscription.tier)}
              <span className="text-sm font-medium capitalize">{currentSubscription.tier}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentSubscription.status === "active" ? "Aktiv" : "Bitib"}
            </Badge>
          </div>
        )}
        
        {/* Upgrade CTA for Bronze/Silver users */}
        {currentSubscription && currentSubscription.tier !== "gold" && (
          <div className="px-2 py-1">
            <Button
              size="sm"
              className="w-full text-xs"
              variant="outline"
              onClick={() => router.push("/boss/subscription")}
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              Planı Yüksəlt
            </Button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Naviqasiya</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const hasAccess = canAccessFeature(item.requiredTier, item.requiresSubscription, item.exactTier)
                const isBlocked = item.requiresSubscription && !hasAccess
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={
                        isBlocked 
                          ? `${item.requiredTier?.toUpperCase()} planı tələb olunur` 
                          : item.title
                      }
                      onClick={() => handleNavigationClick(item)}
                      isActive={pathname === item.url}
                      disabled={isBlocked}
                      className={isBlocked ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex items-center justify-between w-full">
                        {item.title}
                        {isBlocked && (
                          <Badge variant="outline" className="text-xs ml-2">
                            {item.requiredTier?.toUpperCase()}
                          </Badge>
                        )}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || 'UN'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name || 'Unknown User'}</span>
                <span className="truncate text-xs">{user?.email || 'user@example.com'}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
