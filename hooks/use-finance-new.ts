"use client"

import { useState, useEffect } from 'react'
import { FinanceAPI, type IncomeStatementData } from '@/lib/api'
import { createApiCall } from '@/lib/api-helpers'

export function useIncomeStatement() {
  const [data, setData] = useState<IncomeStatementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIncomeStatement = () => {
    createApiCall(
      FinanceAPI.getCurrentIncomeStatement,
      setLoading,
      (result) => {
        setData(result)
        setError(null)
      },
      (errorMessage) => {
        setError(errorMessage)
        setData(null)
      }
    )
  }

  useEffect(() => {
    fetchIncomeStatement()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchIncomeStatement,
  }
}

export function useHistoricalIncomeStatement() {
  const [data, setData] = useState<IncomeStatementData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchHistoricalData = (year: number, month: number) => {
    createApiCall(
      () => FinanceAPI.getIncomeStatementByMonth(year, month),
      setLoading,
      (result) => {
        setData(prev => [...prev, result])
      },
      (errorMessage) => {
        console.error('Error fetching historical data:', errorMessage)
      }
    )
  }

  return {
    data,
    loading,
    fetchHistoricalData,
  }
}

export function useFinancialTrends() {
  const [data, setData] = useState<{
    labels: string[]
    revenue: number[]
    expenses: number[]
    netIncome: number[]
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchTrends = (period: 'week' | 'month' | 'quarter' | 'year') => {
    createApiCall(
      () => FinanceAPI.getFinancialTrends(period),
      setLoading,
      (result) => {
        setData(result)
      },
      (errorMessage) => {
        console.error('Error fetching financial trends:', errorMessage)
      }
    )
  }

  return {
    data,
    loading,
    fetchTrends,
  }
}

export function useOperatingExpenses() {
  const [loading, setLoading] = useState(false)

  const updateExpenses = (expenses: {
    salaries: number
    rent: number
    utilities: number
    marketing: number
    otherExpenses: number
  }) => {
    createApiCall(
      () => FinanceAPI.updateOperatingExpenses(expenses),
      setLoading,
      () => {
        // Success handled by createApiCall toast
      },
      (errorMessage) => {
        console.error('Error updating expenses:', errorMessage)
      }
    )
  }

  return {
    loading,
    updateExpenses,
  }
}
