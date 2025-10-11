"use client"

import { useState, useEffect } from 'react'
import FinanceAPI from '@/lib/api/finance'
import { createApiCall } from '@/lib/api-helpers'
import type { IncomeStatementData } from '@/lib/api'

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

  const refetch = () => {
    fetchIncomeStatement()
  }

  const updateOperatingExpenses = (expenses: {
    salaries: number
    rent: number
    utilities: number
    marketing: number
    otherExpenses: number
  }) => {
    createApiCall(
      () => FinanceAPI.updateOperatingExpenses(expenses),
      () => {}, // No separate loading for this
      () => {
        // Update sonrası data-nı yenilə
        fetchIncomeStatement()
      },
      (errorMessage) => {
        setError(errorMessage)
      }
    )
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

  const fetchHistoricalData = (year: number, month: number) => {
    createApiCall(
      () => FinanceAPI.getIncomeStatementByMonth(year, month),
      setLoading,
      (result) => {
        setData(result)
        setError(null)
        setCurrentPeriod(`${year}-${month.toString().padStart(2, '0')}`)
      },
      (errorMessage) => {
        setError(errorMessage)
        setData(null)
      }
    )
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

  const fetchTrends = () => {
    createApiCall(
      () => FinanceAPI.getFinancialTrends(period),
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
