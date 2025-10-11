"use client"

import { useState, useEffect } from 'react'
import { FinanceAPI, type IncomeStatementData } from '@/lib/api'

export function useIncomeStatement() {
  const [data, setData] = useState<IncomeStatementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIncomeStatement = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await FinanceAPI.getCurrentIncomeStatement()
      setData(result)
    } catch (err: any) {
      console.error('useIncomeStatement error:', err)
      setError(typeof err === 'string' ? err : err.message || 'Məlumat yüklənməsi zamanı xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomeStatement()
  }, [])

  const refetch = () => {
    fetchIncomeStatement()
  }

  const updateOperatingExpenses = async (expenses: {
    salaries: number
    rent: number
    utilities: number
    marketing: number
    otherExpenses: number
  }) => {
    await FinanceAPI.updateOperatingExpenses(expenses)
    // Update sonrası data-nı yenilə
    await fetchIncomeStatement()
  }

  return {
    data,
    loading,
    error,
    refetch,
    updateOperatingExpenses
  }
}

export function useHistoricalIncomeStatement() {
  const [data, setData] = useState<IncomeStatementData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPeriod, setCurrentPeriod] = useState<string>('')

  const fetchHistoricalData = async (year: number, month: number) => {
    try {
      setLoading(true)
      setError(null)
      const result = await FinanceAPI.getIncomeStatementByMonth(year, month)
      setData(result)
      
      const months = ['', 'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 
                     'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']
      setCurrentPeriod(`${months[month]} ${year}`)
    } catch (err: any) {
      console.error('useHistoricalIncomeStatement error:', err)
      setError(typeof err === 'string' ? err : err.message || 'Tarixi məlumat yüklənməsi zamanı xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    currentPeriod,
    fetchHistoricalData
  }
}

export function useFinancialTrends(period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
  const [data, setData] = useState<{
    labels: string[]
    revenue: number[]
    expenses: number[]
    netIncome: number[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrends = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await FinanceAPI.getFinancialTrends(period)
      setData(result)
    } catch (err: any) {
      console.error('useFinancialTrends error:', err)
      setError(typeof err === 'string' ? err : err.message || 'Trend məlumatları yüklənməsi zamanı xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrends()
  }, [period])

  const refetch = () => {
    fetchTrends()
  }

  return {
    data,
    loading,
    error,
    refetch,
    period
  }
}
