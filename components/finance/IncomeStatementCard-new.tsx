"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react"
import { useIncomeStatement } from "@/hooks/use-finance"
import type { IncomeStatementData } from "@/lib/api"

export function IncomeStatementCard() {
  const { data, loading, error, refetch } = useIncomeStatement()

  const formatCurrency = (amount: number) => {
    console.log('formatCurrency called with:', amount, typeof amount)
    // Sadə format istifadə et
    return `₼${amount.toFixed(2)}`
  }

  console.log('IncomeStatementCard render - data:', data, 'loading:', loading, 'error:', error)

  const calculateGrossProfit = (revenue: number, cogs: number) => {
    return revenue - cogs
  }

  const calculateTotalExpenses = (salaries: number, rent: number, utilities: number, marketing: number, otherExpenses: number) => {
    return salaries + rent + utilities + marketing + otherExpenses
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <CardTitle>Mənfəət və Zərər Hesabatı</CardTitle>
          </div>
          <CardDescription>Cari dövr üçün mənfəət və zərər hesabatı</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <CardTitle>Mənfəət və Zərər Hesabatı</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Yenidən cəhd et
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const grossProfit = calculateGrossProfit(data.revenue, data.costOfGoodsSold)
  const totalExpenses = calculateTotalExpenses(data.salaries, data.rent, data.utilities, data.marketing, data.otherExpenses)
  const isProfit = data.netIncome > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <CardTitle>Mənfəət və Zərər Hesabatı</CardTitle>
          </div>
          <Badge variant={isProfit ? "default" : "destructive"} className="flex items-center gap-1">
            {isProfit ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isProfit ? "Mənfəət" : "Zərər"}
          </Badge>
        </div>
        <CardDescription>Cari dövr üçün mənfəət və zərər hesabatı</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Revenue Section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-green-700">Gəlirlər</h4>
          <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
            <span>Satış gəlirləri</span>
            <span className="font-semibold text-green-700">{formatCurrency(data.revenue)}</span>
          </div>
        </div>

        {/* Cost of Goods Sold */}
        <div className="space-y-2">
          <h4 className="font-semibold text-orange-700">Satılan malların dəyəri</h4>
          <div className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
            <span>Satılan malların dəyəri</span>
            <span className="font-semibold text-orange-700">-{formatCurrency(data.costOfGoodsSold)}</span>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="border-t pt-2">
          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
            <span className="font-semibold">Ümumi mənfəət</span>
            <span className={`font-bold ${grossProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {formatCurrency(grossProfit)}
            </span>
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="space-y-2">
          <h4 className="font-semibold text-red-700">Əməliyyat xərcləri</h4>
          <div className="space-y-2 bg-red-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Əmək haqqı</span>
              <span className="text-red-700">-{formatCurrency(data.salaries)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>İcarə</span>
              <span className="text-red-700">-{formatCurrency(data.rent)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Kommunal xidmətlər</span>
              <span className="text-red-700">-{formatCurrency(data.utilities)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Marketinq</span>
              <span className="text-red-700">-{formatCurrency(data.marketing)}</span>
            </div>
            {data.otherExpenses > 0 && (
              <div className="flex justify-between items-center">
                <span>Digər xərclər</span>
                <span className="text-red-700">-{formatCurrency(data.otherExpenses)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Cəmi əməliyyat xərcləri</span>
                <span className="text-red-700">-{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Income */}
        <div className="border-t pt-4">
          <div className={`flex justify-between items-center p-4 rounded-lg font-bold text-lg ${
            isProfit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <span>Xalis mənfəət/zərər</span>
            <span>{formatCurrency(data.netIncome)}</span>
          </div>
        </div>

        {/* Additional insights */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">Ümumi mənfəət marjası</p>
            <p className="text-lg font-semibold">
              {data.revenue > 0 ? ((grossProfit / data.revenue) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Xalis mənfəət marjası</p>
            <p className="text-lg font-semibold">
              {data.revenue > 0 ? ((data.netIncome / data.revenue) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
