"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Calculator, Check, AlertCircle } from "lucide-react"
import FinanceAPI from "@/lib/api/finance"
import type { IncomeStatementData } from "@/lib/api"

interface OperatingExpensesFormProps {
  currentData: IncomeStatementData
  onSuccess?: () => void
}

export function OperatingExpensesForm({ currentData, onSuccess }: OperatingExpensesFormProps) {
  const [formData, setFormData] = useState({
    salaries: 0,
    rent: 0,
    utilities: 0,
    marketing: 0,
    otherExpenses: 0
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const formatCurrency = (amount: number) => {
    return `₼${amount.toFixed(2)}`
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }))
  }

  const calculateNewTotal = (current: number, additional: number) => {
    return current + additional
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      console.log('FinanceAPI object:', FinanceAPI)
      console.log('updateOperatingExpenses method:', FinanceAPI.updateOperatingExpenses)

      // Cari dəyərlərin üzərinə əlavə et
      const updatedExpenses = {
        salaries: calculateNewTotal(currentData.salaries, formData.salaries),
        rent: calculateNewTotal(currentData.rent, formData.rent),
        utilities: calculateNewTotal(currentData.utilities, formData.utilities),
        marketing: calculateNewTotal(currentData.marketing, formData.marketing),
        otherExpenses: calculateNewTotal(currentData.otherExpenses, formData.otherExpenses)
      }

      console.log('Sending expenses:', updatedExpenses)
      await FinanceAPI.updateOperatingExpenses(updatedExpenses)
      
      setSuccess(true)
      // Formu sıfırla
      setFormData({
        salaries: 0,
        rent: 0,
        utilities: 0,
        marketing: 0,
        otherExpenses: 0
      })
      
      // 2 saniyə sonra success state-ini sıfırla
      setTimeout(() => setSuccess(false), 2000)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error('Operating expenses update error:', err)
      setError(typeof err === 'string' ? err : err.message || 'Xərclər yenilənməsi zamanı xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  const hasAnyExpense = Object.values(formData).some(value => value > 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <CardTitle>Əməliyyat Xərclərini Əlavə Et</CardTitle>
        </div>
        <CardDescription>
          Mövcud xərclərə əlavə məbləğlər daxil edin. Yeni cəm avtomatik hesablanacaq.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Əməliyyat xərcləri uğurla yeniləndi!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Salaries */}
          <div className="space-y-2">
            <Label htmlFor="salaries">Əmək haqqı əlavəsi</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="salaries"
                type="number"
                step="0.01"
                min="0"
                value={formData.salaries || ''}
                onChange={(e) => handleInputChange('salaries', e.target.value)}
                placeholder="0.00"
              />
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>Cari: {formatCurrency(currentData.salaries)}</span>
                {formData.salaries > 0 && (
                  <Badge variant="outline" className="ml-2">
                    Yeni: {formatCurrency(calculateNewTotal(currentData.salaries, formData.salaries))}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Rent */}
          <div className="space-y-2">
            <Label htmlFor="rent">İcarə əlavəsi</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="rent"
                type="number"
                step="0.01"
                min="0"
                value={formData.rent || ''}
                onChange={(e) => handleInputChange('rent', e.target.value)}
                placeholder="0.00"
              />
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>Cari: {formatCurrency(currentData.rent)}</span>
                {formData.rent > 0 && (
                  <Badge variant="outline" className="ml-2">
                    Yeni: {formatCurrency(calculateNewTotal(currentData.rent, formData.rent))}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Utilities */}
          <div className="space-y-2">
            <Label htmlFor="utilities">Kommunal xidmətlər əlavəsi</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="utilities"
                type="number"
                step="0.01"
                min="0"
                value={formData.utilities || ''}
                onChange={(e) => handleInputChange('utilities', e.target.value)}
                placeholder="0.00"
              />
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>Cari: {formatCurrency(currentData.utilities)}</span>
                {formData.utilities > 0 && (
                  <Badge variant="outline" className="ml-2">
                    Yeni: {formatCurrency(calculateNewTotal(currentData.utilities, formData.utilities))}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Marketing */}
          <div className="space-y-2">
            <Label htmlFor="marketing">Marketinq əlavəsi</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="marketing"
                type="number"
                step="0.01"
                min="0"
                value={formData.marketing || ''}
                onChange={(e) => handleInputChange('marketing', e.target.value)}
                placeholder="0.00"
              />
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>Cari: {formatCurrency(currentData.marketing)}</span>
                {formData.marketing > 0 && (
                  <Badge variant="outline" className="ml-2">
                    Yeni: {formatCurrency(calculateNewTotal(currentData.marketing, formData.marketing))}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Other Expenses */}
          <div className="space-y-2">
            <Label htmlFor="otherExpenses">Digər xərclər əlavəsi</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="otherExpenses"
                type="number"
                step="0.01"
                min="0"
                value={formData.otherExpenses || ''}
                onChange={(e) => handleInputChange('otherExpenses', e.target.value)}
                placeholder="0.00"
              />
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>Cari: {formatCurrency(currentData.otherExpenses)}</span>
                {formData.otherExpenses > 0 && (
                  <Badge variant="outline" className="ml-2">
                    Yeni: {formatCurrency(calculateNewTotal(currentData.otherExpenses, formData.otherExpenses))}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={loading || !hasAnyExpense}
              className="w-full"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {loading ? 'Yenilənir...' : 'Xərcləri Yenilə'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
