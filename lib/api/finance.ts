import api from '../axios'
import { ApiResponse } from "@/types/api-response";

// Finance API types
export interface IncomeStatementData {
  revenue: number
  costOfGoodsSold: number
  salaries: number
  rent: number
  utilities: number
  marketing: number
  otherExpenses: number
  netIncome: number
}

// Finance API Services
/**
 * Get current income statement
 */
export async function getCurrentIncomeStatement(): Promise<ApiResponse<IncomeStatementData>> {
  return await api.get('/finance/current-income-statement')
}

/**
 * Get income statement for a specific month/year
 */
export async function getIncomeStatementByMonth(year: number, month: number): Promise<ApiResponse<IncomeStatementData>> {
  return await api.post('/finance/income-statement', {
    year,
    month
  })
}

/**
 * Get income statement for a specific date range
 */
export async function getIncomeStatementByPeriod(startDate: string, endDate: string): Promise<ApiResponse<IncomeStatementData>> {
  return await api.get('/finance/income-statement', {
    params: { startDate, endDate }
  })
}

/**
 * Get monthly financial summary
 */
export async function getMonthlyFinancialSummary(year: number, month: number): Promise<ApiResponse<IncomeStatementData>> {
  return await api.get('/finance/monthly-summary', {
    params: { year, month }
  })
}

/**
 * Update operating expenses
 */
export async function updateOperatingExpenses(expenses: {
  salaries: number
  rent: number
  utilities: number
  marketing: number
  otherExpenses: number
}): Promise<ApiResponse<any>> {
  return await api.patch('/finance/operating-expenses', expenses)
}

/**
 * Get financial trends (for charts)
 */
export async function getFinancialTrends(period: 'week' | 'month' | 'quarter' | 'year'): Promise<ApiResponse<{
  labels: string[]
  revenue: number[]
  expenses: number[]
  netIncome: number[]
}>> {
  return await api.get('/finance/trends', {
    params: { period }
  })
}

// Backward compatibility - class-based format üçün
export class FinanceAPI {
  static getCurrentIncomeStatement = getCurrentIncomeStatement
  static getIncomeStatementByMonth = getIncomeStatementByMonth
  static getIncomeStatementByPeriod = getIncomeStatementByPeriod
  static getMonthlyFinancialSummary = getMonthlyFinancialSummary
  static updateOperatingExpenses = updateOperatingExpenses
  static getFinancialTrends = getFinancialTrends
}

export default FinanceAPI
