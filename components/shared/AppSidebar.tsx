"use client"

import type * as React from "react"
import { useAuth } from "../auth/AuthProvider"
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
} from "lucide-react"

type NavigationItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
}

export function AppSidebar() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const bossNavigation: NavigationItem[] = [
    {
      title: "İdarə Paneli",
      url: "/boss",
      icon: LayoutDashboard,
    },
    {
      title: "Məhsullar",
      url: "/boss/products",
      icon: Package,
    },
    {
      title: "Anbarlar",
      url: "/boss/warehouses",
      icon: Warehouse,
    },
    {
      title: "İşçilər",
      url: "/boss/workers",
      icon: Users,
    },
    {
      title: "Sifarişlər",
      url: "/boss/orders",
      icon: ShoppingCart,
    },
    {
      title: "Müştərilər",
      url: "/boss/customers",
      icon: Building,
    },
    {
      title: "Abunəlik",
      url: "/boss/subscription",
      icon: CreditCard,
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
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Naviqasiya</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => router.push(item.url)}
                    isActive={pathname === item.url}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
