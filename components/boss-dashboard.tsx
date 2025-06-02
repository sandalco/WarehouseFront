"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Users, Warehouse, ShoppingCart, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { ProductManagement } from "./product-management"
import { WarehouseManagement } from "./warehouse-management"
import { WorkerManagement } from "./worker-management"
import { CustomerManagement } from "./customer-management"
import { EnhancedOrderManagement } from "./enhanced-order-management"
import { SettingsPage } from "./settings-page"
import { ProfilePage } from "./profile-page"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationBell } from "./notification-provider"
import { Separator } from "@/components/ui/separator"
import { SubscriptionManagement } from "./subscription-management"
import { useSubscription } from "./subscription-provider"
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
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import { CreateOrderPage } from "./create-order-page"
import { OrderDetailsPageBoss } from "./order-details-page-boss"
import { WorkerDetailsPage } from "./worker-details-page"
import { ProductDetailsPage } from "./product-details-page"
import { CustomerOrdersPage } from "./customer-orders-page"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import React Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export function BossDashboard() {
  const { user, logout } = useAuth()
  const { currentSubscription } = useSubscription()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null)
  const [dashboardPeriod, setDashboardPeriod] = useState("month")

  const stats = [
    {
      title: "Ümumi Məhsullar",
      value: "1,234",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
      trend: "up",
    },
    {
      title: "Aktiv İşçilər",
      value: "45",
      change: "+3%",
      icon: Users,
      color: "text-green-600",
      trend: "up",
    },
    {
      title: "Anbarlar",
      value: "8",
      change: "+1",
      icon: Warehouse,
      color: "text-purple-600",
      trend: "up",
    },
    {
      title: "Bugünkü Sifarişlər",
      value: "89",
      change: "+23%",
      icon: ShoppingCart,
      color: "text-orange-600",
      trend: "up",
    },
  ]

  const recentOrders = [
    { id: "SİF-001", customer: "ABC Korporasiyası", type: "Çıxan", status: "İşlənir", value: "2,450₼" },
    { id: "SİF-002", customer: "XYZ MMC", type: "Daxil olan", status: "Tamamlandı", value: "1,200₼" },
    { id: "SİF-003", customer: "Texnoloji Həllər", type: "Çıxan", status: "Gözləyir", value: "3,100₼" },
    { id: "SİF-004", customer: "Qlobal Ticarət", type: "Daxil olan", status: "İşlənir", value: "890₼" },
  ]

  // Chart data for monthly revenue
  const revenueData = {
    labels: ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"],
    datasets: [
      {
        label: "Gəlir",
        data: [12500, 14200, 13800, 15600, 16900, 18200, 17800, 19500, 21000, 22400, 24100, 25800],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Chart data for monthly sales
  const salesData = {
    labels: ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"],
    datasets: [
      {
        label: "Satışlar",
        data: [420, 380, 450, 520, 560, 610, 590, 640, 710, 780, 820, 890],
        backgroundColor: "rgb(99, 102, 241)",
        borderRadius: 4,
      },
    ],
  }

  // Chart data for product categories
  const productCategoryData = {
    labels: ["Elektronika", "Mebel", "Geyim", "Qida", "Digər"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "rgb(99, 102, 241)",
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(156, 163, 175)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Chart data for warehouse capacity
  const warehouseCapacityData = {
    labels: ["Anbar A", "Anbar B", "Anbar C", "Anbar D"],
    datasets: [
      {
        label: "İstifadə olunan tutum (%)",
        data: [85, 65, 72, 45],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderRadius: 4,
      },
    ],
  }

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
        },
      },
    },
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "İdarə Paneli"
      case "products":
        return selectedProductId ? "Məhsul Təfərrüatları" : "Məhsullar"
      case "warehouses":
        return "Anbarlar"
      case "workers":
        return selectedWorkerId ? "İşçi Təfərrüatları" : "İşçilər"
      case "orders":
        return "Sifarişlər"
      case "customers":
        return selectedCustomerId ? "Müştəri Sifarişləri" : "Müştərilər"
      case "settings":
        return "Tənzimləmələr"
      case "profile":
        return "Mənim Profilim"
      case "create-order":
        return "Sifariş Yarat"
      case "order-details":
        return "Sifariş Təfərrüatları"
      case "subscription":
        return "Abunəlik İdarəetməsi"
      default:
        return "İdarə Paneli"
    }
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setActiveTab("order-details")
  }

  const handleViewWorker = (workerId: string) => {
    setSelectedWorkerId(workerId)
  }

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId)
  }

  const handleViewCustomerOrders = (customerId: string, customerName: string) => {
    setSelectedCustomerId(customerId)
    setSelectedCustomerName(customerName)
  }

  const handleBackToWorkers = () => {
    setSelectedWorkerId(null)
  }

  const handleBackToProducts = () => {
    setSelectedProductId(null)
  }

  const handleBackToCustomers = () => {
    setSelectedCustomerId(null)
    setSelectedCustomerName(null)
  }

  const handleViewOrderFromCustomer = (orderId: string) => {
    // Find the order and navigate to order details
    const order = { id: orderId } // Mock order data
    setSelectedOrder(order)
    setActiveTab("order-details")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Subscription Status Card */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100 dark:from-purple-950/20 dark:to-blue-950/20 dark:border-purple-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Abunəlik Statusu</CardTitle>
                <CardDescription>Cari planınız və istifadə</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cari Plan</p>
                    <p className="text-2xl font-bold capitalize">{currentSubscription?.tier || "Plan Yoxdur"}</p>
                    <Badge variant="outline" className="mt-1">
                      {currentSubscription?.status || "Qeyri-aktiv"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Növbəti Ödəniş</p>
                    <p className="font-medium">15 İyun, 2023</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aylıq Xərc</p>
                    <p className="font-medium">49.99₼</p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab("subscription")} className="ml-auto">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Abunəliyi İdarə Et
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Period Selector */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">Analitika İcmalı</h2>
              <Tabs value={dashboardPeriod} onValueChange={setDashboardPeriod} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="week">Həftə</TabsTrigger>
                  <TabsTrigger value="month">Ay</TabsTrigger>
                  <TabsTrigger value="quarter">Rüb</TabsTrigger>
                  <TabsTrigger value="year">İl</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 text-purple-primary`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                      <span className="text-muted-foreground ml-1">keçən aydan</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Aylıq Gəlir</CardTitle>
                  <CardDescription>Keçən il ərzində gəlir tendensiyaları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line data={revenueData} options={lineOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Aylıq Satışlar</CardTitle>
                  <CardDescription>Aylıq işlənən sifarişlərin sayı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar data={salesData} options={barOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Product Categories Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Məhsul Kateqoriyaları</CardTitle>
                  <CardDescription>Məhsul növünə görə bölgü</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Doughnut data={productCategoryData} options={doughnutOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Warehouse Capacity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Anbar Tutumu</CardTitle>
                  <CardDescription>Anbar üzrə cari istifadə</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar data={warehouseCapacityData} options={barOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Son Sifarişlər</CardTitle>
                <CardDescription>Ən son anbar sifarişləri və onların statusu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={order.type === "Daxil olan" ? "default" : "secondary"}>{order.type}</Badge>
                        <p className="text-sm font-medium mt-1">{order.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "products":
        return selectedProductId ? (
          <ProductDetailsPage productId={selectedProductId} onBack={handleBackToProducts} />
        ) : (
          <ProductManagement onViewProduct={handleViewProduct} />
        )
      case "warehouses":
        return <WarehouseManagement />
      case "workers":
        return selectedWorkerId ? (
          <WorkerDetailsPage workerId={selectedWorkerId} onBack={handleBackToWorkers} />
        ) : (
          <WorkerManagement onViewWorker={handleViewWorker} />
        )
      case "orders":
        return (
          <EnhancedOrderManagement onViewOrder={handleViewOrder} onCreateOrder={() => setActiveTab("create-order")} />
        )
      case "customers":
        return selectedCustomerId && selectedCustomerName ? (
          <CustomerOrdersPage
            customerId={selectedCustomerId}
            customerName={selectedCustomerName}
            onBack={handleBackToCustomers}
            onViewOrder={handleViewOrderFromCustomer}
          />
        ) : (
          <CustomerManagement onViewCustomerOrders={handleViewCustomerOrders} />
        )
      case "settings":
        return <SettingsPage />
      case "profile":
        return <ProfilePage />
      case "create-order":
        return <CreateOrderPage onBack={() => setActiveTab("orders")} />
      case "order-details":
        return selectedOrder ? (
          <OrderDetailsPageBoss order={selectedOrder} onBack={() => setActiveTab("orders")} />
        ) : (
          <div>Sifariş seçilməyib</div>
        )
      case "subscription":
        return <SubscriptionManagement />
      default:
        return <div>Səhifə tapılmadı</div>
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Anbar İdarəetməsi</BreadcrumbLink>
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
                  <span>Mənim Profilim</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Tənzimləmələr</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıxış</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Helper Button component for the subscription card
function Button({ children, variant = "default", className = "", ...props }) {
  const variantClasses = {
    default: "bg-purple-600 text-white hover:bg-purple-700",
    outline: "bg-transparent border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900",
  }

  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
