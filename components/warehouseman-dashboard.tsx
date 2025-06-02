"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { MapPin, CheckCircle, Clock, Search, ArrowRight, ArrowLeft, Eye, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsPage } from "./settings-page"
import { ProfilePage } from "./profile-page"
import { OrderDetailsPage } from "./order-details-page"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationBell } from "./notification-provider"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"

// Task Summary Card Component
function TaskSummaryCard({ task, onViewDetails }: { task: any; onViewDetails: (task: any) => void }) {
  const getTaskProgress = (task: any) => {
    const completedCount = task.products.filter((p: any) => p.completed).length
    return (completedCount / task.products.length) * 100
  }

  const getTaskStatus = (task: any) => {
    const completedCount = task.products.filter((p: any) => p.completed).length
    const totalCount = task.products.length

    if (completedCount === 0) return "Not Started"
    if (completedCount === totalCount) return "Completed"
    return `${completedCount}/${totalCount} Items`
  }

  return (
    <div className="border rounded-lg bg-white p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Badge variant={task.orderType === "Outgoing" ? "default" : "secondary"}>
            {task.orderType === "Outgoing" ? (
              <ArrowLeft className="h-3 w-3 mr-1" />
            ) : (
              <ArrowRight className="h-3 w-3 mr-1" />
            )}
            {task.orderType}
          </Badge>
          <Badge variant={task.priority === "High" ? "destructive" : "outline"}>{task.priority}</Badge>
          <span className="font-medium text-lg">{task.orderId}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">{task.customer || task.vendor}</p>
            <Badge variant="outline">{getTaskStatus(task)}</Badge>
          </div>
          <Button onClick={() => onViewDetails(task)} className="bg-purple-primary hover:bg-purple-600">
            <Eye className="h-4 w-4 mr-2" />
            Ətraflı Bax
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(getTaskProgress(task))}%</span>
        </div>
        <Progress value={getTaskProgress(task)} className="h-2" />
      </div>

      {/* Quick Info */}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <span>{task.products.length} products total</span>
        <span>Assigned 2 hours ago</span>
      </div>
    </div>
  )
}

// Completed Task Summary Card Component
function CompletedTaskSummaryCard({ task }: { task: any }) {
  return (
    <div className="border rounded-lg bg-green-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            {task.orderType}
          </Badge>
          <span className="font-medium">{task.orderId}</span>
          <span className="text-sm text-gray-600">{task.customer || task.vendor}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          {task.completedAt}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">{task.products.length} products completed</div>
    </div>
  )
}

export function WarehousemanDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("tasks")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTask, setSelectedTask] = useState<any>(null)

  // Updated task structure with multiple products per order
  const pendingTasks = [
    {
      id: "TASK-001",
      orderId: "ORD-001",
      orderType: "Outgoing",
      customer: "ABC Corporation",
      priority: "High",
      products: [
        {
          id: "PROD-001",
          name: "Laptop Dell XPS 13",
          quantity: 5,
          shelf: "A-12-3",
          completed: false,
          taskType: "Pick",
        },
        {
          id: "PROD-002",
          name: "Wireless Mouse",
          quantity: 10,
          shelf: "B-05-2",
          completed: false,
          taskType: "Pick",
        },
        {
          id: "PROD-003",
          name: "USB Cable",
          quantity: 15,
          shelf: "C-08-1",
          completed: true,
          taskType: "Pick",
        },
      ],
    },
    {
      id: "TASK-002",
      orderId: "ORD-002",
      orderType: "Incoming",
      vendor: "Tech Supplies Inc",
      priority: "Medium",
      products: [
        {
          id: "PROD-004",
          name: "Monitor 24 inch",
          quantity: 8,
          shelf: "D-03-4",
          completed: false,
          taskType: "Put Away",
        },
        {
          id: "PROD-005",
          name: "Keyboard Mechanical",
          quantity: 12,
          shelf: "E-07-2",
          completed: false,
          taskType: "Put Away",
        },
      ],
    },
  ]

  const completedTasks = [
    {
      id: "TASK-003",
      orderId: "ORD-003",
      orderType: "Outgoing",
      customer: "XYZ Limited",
      completedAt: "2 hours ago",
      products: [
        {
          id: "PROD-006",
          name: "Tablet Samsung",
          quantity: 3,
          shelf: "F-01-1",
          taskType: "Pick",
        },
      ],
    },
  ]

  const shelfLocations = [
    { shelf: "A-12-3", product: "Laptop Dell XPS 13", quantity: 15, capacity: 20 },
    { shelf: "B-05-2", product: "Wireless Mouse", quantity: 45, capacity: 100 },
    { shelf: "C-08-1", product: "USB Cable", quantity: 85, capacity: 100 },
    { shelf: "D-03-4", product: "Monitor 24 inch", quantity: 8, capacity: 15 },
  ]

  const [pendingTasksList, setPendingTasksList] = useState(pendingTasks)
  const [completedTasksList, setCompletedTasksList] = useState(completedTasks)

  const handleCompleteProduct = (taskId: string, productId: string) => {
    setPendingTasksList(
      (prev) =>
        prev
          .map((task) => {
            if (task.id === taskId) {
              const updatedProducts = task.products.map((product) =>
                product.id === productId ? { ...product, completed: true } : product,
              )

              // Check if all products in the order are completed
              const allCompleted = updatedProducts.every((product) => product.completed)

              if (allCompleted) {
                // Move entire task to completed
                const completedTask = {
                  ...task,
                  products: updatedProducts,
                  completedAt: "Just now",
                }
                setCompletedTasksList((prev) => [completedTask, ...prev])
                return null // This task will be filtered out
              }

              return { ...task, products: updatedProducts }
            }
            return task
          })
          .filter(Boolean), // Remove null tasks (completed ones)
    )

    // Update selected task if it's currently being viewed
    if (selectedTask && selectedTask.id === taskId) {
      const updatedTask = pendingTasksList.find((task) => task.id === taskId)
      if (updatedTask) {
        const updatedProducts = updatedTask.products.map((product) =>
          product.id === productId ? { ...product, completed: true } : product,
        )
        setSelectedTask({ ...updatedTask, products: updatedProducts })
      }
    }
  }

  const handleViewTaskDetails = (task: any) => {
    setSelectedTask(task)
    setActiveTab("order-details")
  }

  const handleBackToTasks = () => {
    setSelectedTask(null)
    setActiveTab("tasks")
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "tasks":
        return "Mənim Tapşırıqlarım"
      case "order-details":
        return "Sifariş Təfərrüatları"
      case "inventory":
        return "İnventar"
      case "completed":
        return "Tamamlanmış"
      case "settings":
        return "Tənzimləmələr"
      case "profile":
        return "Mənim Profilim"
      default:
        return "Mənim Tapşırıqlarım"
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Gözləyən Sifarişlər</CardTitle>
              <CardDescription>
                Sizə təyin edilmiş sifarişlər - işləməyə başlamaq üçün "Ətraflı Bax" düyməsinə klikləyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasksList.map((task) => (
                  <TaskSummaryCard key={task.id} task={task} onViewDetails={handleViewTaskDetails} />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case "order-details":
        return selectedTask ? (
          <OrderDetailsPage task={selectedTask} onBack={handleBackToTasks} onCompleteProduct={handleCompleteProduct} />
        ) : (
          <div>No task selected</div>
        )
      case "inventory":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Shelf Inventory</CardTitle>
              <CardDescription>Current stock levels and locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="search">Search Products or Shelves</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by product name or shelf location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-4">
                {shelfLocations.map((location) => (
                  <div key={location.shelf} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {location.shelf}
                        </Badge>
                        <span className="font-medium">{location.product}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {location.quantity} / {location.capacity}
                        </p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(location.quantity / location.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case "completed":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>Your recently completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTasksList.map((task) => (
                  <CompletedTaskSummaryCard key={task.id} task={task} />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case "settings":
        return <SettingsPage />
      case "profile":
        return <ProfilePage />
      default:
        return <div>Page not found</div>
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab === "order-details" ? "tasks" : activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Warehouse Operations</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center space-x-4">
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  {user?.role}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="rounded-full h-8 w-8 bg-purple-100 flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold text-purple-primary">Mənim Tapşırıqlarım</h1>
          <p className="text-gray-600">Sizə təyin edilmiş tapşırıqlar</p>
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
