"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Calendar, BarChart3, TrendingUp, TrendingDown, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import FinanceAPI from "@/lib/api/finance"
import type { IncomeStatementData } from "@/lib/api"

interface HistoricalIncomeStatementProps {
  onDataChange?: (data: IncomeStatementData | null, period: string) => void
}

export function HistoricalIncomeStatement({ onDataChange }: HistoricalIncomeStatementProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const [selectedMonth, setSelectedMonth] = useState<number>(7)
  const [data, setData] = useState<IncomeStatementData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [hasSearched, setHasSearched] = useState(false) // Axtarış edilib-edilmədiyini izləyəcək
  const [backendMessage, setBackendMessage] = useState<string | null>(null) // Backend mesajı üçün

  const formatCurrency = (amount: number) => {
    return `₼${amount.toFixed(2)}`
  }

  const months = [
    { value: 1, label: "Yanvar" },
    { value: 2, label: "Fevral" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Aprel" },
    { value: 5, label: "May" },
    { value: 6, label: "İyun" },
    { value: 7, label: "İyul" },
    { value: 8, label: "Avqust" },
    { value: 9, label: "Sentyabr" },
    { value: 10, label: "Oktyabr" },
    { value: 11, label: "Noyabr" },
    { value: 12, label: "Dekabr" }
  ]

  // Generate years from 2020 to current year + 1
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i)

  const handleFetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      setBackendMessage(null) // Backend mesajını sıfırla
      setHasSearched(true) // Axtarış edildi işarə et
      
      const result = await FinanceAPI.getIncomeStatementByMonth(selectedYear, selectedMonth)
      setData(result)
      
      // Parent komponente məlumat göndər
      const periodString = `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
      if (onDataChange) {
        onDataChange(result, periodString)
      }
    } catch (err: any) {
      console.error('Historical income statement fetch error:', err)
      
      // Backend-dən gələn mesajı yoxla
      const backendMsg = err.response?.data?.message || err || null
      console.log('Backend message:', backendMsg);
      
      
      // Əgər 404 xətası varsa və ya backend-dən xüsusi mesaj varsa
      if (err.response?.status === 404 || (backendMsg && backendMsg.includes('tapılmadı'))) {
        setError(null) // Error göstərmə
        setBackendMessage(backendMsg) // Backend mesajını saxla
        setData(null)  // Sadəcə data yoxdur
      } else {
        // Digər xətalar üçün error mesajı göstər
        setError(backendMsg || 'Tarixçə məlumatları yüklənməsi zamanı xəta baş verdi')
        setBackendMessage(null)
        setData(null)
      }
      
      if (onDataChange) {
        onDataChange(null, '')
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateGrossProfit = (revenue: number, cogs: number) => {
    return revenue - cogs
  }

  const calculateTotalExpenses = (salaries: number, rent: number, utilities: number, marketing: number, otherExpenses: number) => {
    return salaries + rent + utilities + marketing + otherExpenses
  }

  const isProfit = data ? data.netIncome > 0 : false
  const grossProfit = data ? calculateGrossProfit(data.revenue, data.costOfGoodsSold) : 0
  const totalExpenses = data ? calculateTotalExpenses(data.salaries, data.rent, data.utilities, data.marketing, data.otherExpenses) : 0

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Tarixçə P&L Hesabatı</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {data && (
                    <Badge variant="outline" className="text-xs">
                      {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                    </Badge>
                  )}
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              <CardDescription>
                Keçmiş ayların mənfəət və zərər hesabatlarını görün
              </CardDescription>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4">
        {/* Period Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">İl</label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="İl seçin" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Ay</label>
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Ay seçin" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleFetchData} disabled={loading} className="w-full">
          <BarChart3 className="h-4 w-4 mr-2" />
          {loading ? 'Yüklənir...' : 'Hesabatı Gətir'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Xəta</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && !data && hasSearched && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center max-w-md">
              <div className="mb-4">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Məlumat Tapılmadı
              </h3>
              <p className="text-gray-500 mb-4">
                {backendMessage ? backendMessage : 
                  `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear} tarixi üçün maliyyə məlumatları mövcud deyil.`
                }
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      Məsləhətlər:
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Başqa ay və ya il seçməyi sınayın</li>
                      <li>• Bu tarix üçün məlumatların əlavə edildiyinə əmin olun</li>
                      <li>• Əgər problem davam edərsə, sistem administratoru ilə əlaqə saxlayın</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                {months.find(m => m.value === selectedMonth)?.label} {selectedYear} - P&L Xülasəsi
              </h4>
              <Badge variant={isProfit ? "default" : "destructive"} className="flex items-center gap-1">
                {isProfit ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isProfit ? "Mənfəət" : "Zərər"}
              </Badge>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Gəlirlər</p>
                <p className="text-lg font-bold text-green-800">{formatCurrency(data.revenue)}</p>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-orange-700 font-medium">COGS</p>
                <p className="text-lg font-bold text-orange-800">-{formatCurrency(data.costOfGoodsSold)}</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Ümumi Mənfəət</p>
                <p className={`text-lg font-bold ${grossProfit >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                  {formatCurrency(grossProfit)}
                </p>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-700 font-medium">Xərclər</p>
                <p className="text-lg font-bold text-red-800">-{formatCurrency(totalExpenses)}</p>
              </div>
            </div>

            {/* Net Income */}
            <div className={`p-4 rounded-lg font-bold text-center ${
              isProfit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="text-sm font-medium opacity-80">Xalis Mənfəət/Zərər</p>
              <p className="text-2xl">{formatCurrency(data.netIncome)}</p>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-2 text-sm">
              <h5 className="font-medium text-gray-700 border-b pb-1">Əməliyyat Xərcləri Təfsilati</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span>Əmək haqqı:</span>
                  <span className="font-medium">-{formatCurrency(data.salaries)}</span>
                </div>
                <div className="flex justify-between">
                  <span>İcarə:</span>
                  <span className="font-medium">-{formatCurrency(data.rent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kommunal:</span>
                  <span className="font-medium">-{formatCurrency(data.utilities)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marketinq:</span>
                  <span className="font-medium">-{formatCurrency(data.marketing)}</span>
                </div>
                {data.otherExpenses > 0 && (
                  <div className="flex justify-between col-span-2">
                    <span>Digər xərclər:</span>
                    <span className="font-medium">-{formatCurrency(data.otherExpenses)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
