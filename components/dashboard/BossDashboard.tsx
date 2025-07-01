"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Warehouse,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function BossDashboard() {
  // Sample data for charts
  const monthlyRevenue = [
    { name: 'Yan', revenue: 4000, orders: 240 },
    { name: 'Fev', revenue: 3000, orders: 139 },
    { name: 'Mar', revenue: 2000, orders: 980 },
    { name: 'Apr', revenue: 2780, orders: 390 },
    { name: 'May', revenue: 1890, orders: 480 },
    { name: 'İyun', revenue: 2390, orders: 380 },
    { name: 'İyul', revenue: 3490, orders: 430 },
  ]

  const warehouseData = [
    { name: 'Anbar 1', value: 400, color: '#0088FE' },
    { name: 'Anbar 2', value: 300, color: '#00C49F' },
    { name: 'Anbar 3', value: 300, color: '#FFBB28' },
    { name: 'Anbar 4', value: 200, color: '#FF8042' },
  ]

  const productStats = [
    { name: 'Elektronika', satılan: 12, stok: 24 },
    { name: 'Geyim', satılan: 19, stok: 13 },
    { name: 'Ev əşyaları', satılan: 3, stok: 98 },
    { name: 'Kitablar', satılan: 5, stok: 39 },
    { name: 'Kosmetika', satılan: 2, stok: 48 },
  ]

  const dailyOrders = [
    { name: 'B.', orders: 65 },
    { name: 'Ç.A', orders: 59 },
    { name: 'Ç', orders: 80 },
    { name: 'C.A', orders: 81 },
    { name: 'C', orders: 56 },
    { name: 'Ş', orders: 55 },
    { name: 'B', orders: 40 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Warehouse məlumatlarınıza və statistikalarınıza nəzər salın
        </p>
      </div>

      {/* Statistik Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ümumi Gəlir</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₼45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% keçən aydan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sifarişlər</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% keçən aydan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Məhsullar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% keçən aydan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Müştərilər</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 keçən aydan</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Aylıq Gəlir Qrafiki */}
        <Card>
          <CardHeader>
            <CardTitle>Aylıq Gəlir Tendensiyası</CardTitle>
            <CardDescription>Son 7 ayın gəlir və sifariş statistikası</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Gəlir (₼)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Anbar Bölgüsü */}
        <Card>
          <CardHeader>
            <CardTitle>Anbar Məhsul Bölgüsü</CardTitle>
            <CardDescription>Hər anbarda mövcud məhsul sayı</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={warehouseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {warehouseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Məhsul Statistikası */}
        <Card>
          <CardHeader>
            <CardTitle>Kategoriya üzrə Satış</CardTitle>
            <CardDescription>Satılan və stokda qalan məhsullar</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="satılan" fill="#8884d8" name="Satılan" />
                <Bar dataKey="stok" fill="#82ca9d" name="Stokda" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Günlük Sifarişlər */}
        <Card>
          <CardHeader>
            <CardTitle>Həftəlik Sifariş Tendensiyası</CardTitle>
            <CardDescription>Son həftənin gündəlik sifariş sayı</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  name="Sifarişlər"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anbar Doluluq</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">1,200 / 1,764 məhsul</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiv İşçilər</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/30</div>
            <Progress value={80} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">6 işçi məzuniyyətdə</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sifariş Statusu</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Tamamlanmış</span>
                <Badge variant="secondary">120</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Gözləyən</span>
                <Badge variant="outline">45</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">İşlənilən</span>
                <Badge>23</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
