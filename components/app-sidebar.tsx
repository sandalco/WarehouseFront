"use client"

import type * as React from "react"
import { useAuth } from "./auth-provider"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Settings,
  User,
  LogOut,
  ChevronUp,
  CreditCard,
} from "lucide-react"

type NavigationItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
}

export function AppSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  const { user, logout } = useAuth()

  const bossNavigation: NavigationItem[] = [
    {
      title: "İdarə Paneli",
      url: "dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Məhsullar",
      url: "products",
      icon: Package,
    },
    {
      title: "Anbarlar",
      url: "warehouses",
      icon: Warehouse,
    },
    {
      title: "İşçilər",
      url: "workers",
      icon: Users,
    },
    {
      title: "Sifarişlər",
      url: "orders",
      icon: ShoppingCart,
    },
    {
      title: "Müştərilər",
      url: "customers",
      icon: Building,
    },
    {
      title: "Abunəlik",
      url: "subscription",
      icon: CreditCard,
    },
  ]

  const warehousemanNavigation: NavigationItem[] = [
    {
      title: "Mənim Tapşırıqlarım",
      url: "tasks",
      icon: ClipboardList,
    },
    {
      title: "İnventar",
      url: "inventory",
      icon: Package,
    },
    {
      title: "Tamamlanmış",
      url: "completed",
      icon: BarChart3,
    },
  ]

  const navigation = user?.role === "rəhbər" ? bossNavigation : warehousemanNavigation

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
                    onClick={() => onTabChange(item.url)}
                    isActive={activeTab === item.url}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => onTabChange("profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Mənim Profilim
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTabChange("settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Tənzimləmələr
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıxış
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
