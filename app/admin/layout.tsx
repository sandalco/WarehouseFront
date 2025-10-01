"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/shared/AppSidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Settings, User, LogOut, Building2, Check, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useNotifications } from "@/components/NotificationProvider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/admin":
      return "Admin Dashboard"
    case "/admin/company":
      return "Şirkətlər"
    default:
      return "Admin Panel"
  }
}

// Admin sidebar items
const adminSidebarItems = [
  {
    title: "Şirkətlər",
    url: "/admin/company",
    icon: Building2,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications, isConnected } = useNotifications()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Custom Admin Sidebar */}
        <div className="w-64 border-r bg-card text-card-foreground">
          <div className="flex h-14 items-center border-b px-6">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <div className="p-2">
            <nav className="space-y-1">
              {adminSidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.url 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
            
            <div className="ml-auto flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className={`h-4 w-4 ${!isConnected ? 'text-muted-foreground' : ''}`} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Bildirişlər</span>
                      {!isConnected && (
                        <Badge variant="outline" className="text-xs">
                          Bağlantı yoxdur
                        </Badge>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="h-6 px-2 text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Hamısını oxu
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearNotifications}
                          className="h-6 px-2 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Təmizlə
                        </Button>
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Bildiriş yoxdur
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-1">
                        {notifications.slice(0, 10).map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                              !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                            }`}
                            onClick={() => notification.id && markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className="font-medium text-sm">{notification.title}</div>
                              <div className="text-xs text-muted-foreground ml-2">
                                {notification.timestamp?.toLocaleTimeString('az-AZ', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground leading-relaxed">
                              {notification.content}
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full self-end"></div>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || ""} alt={user?.name || "Admin"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name ? getUserInitials(user.name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Tənzimləmələr</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıxış</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex-1 p-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
