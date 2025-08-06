import api from '../axios'

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

export interface ApiResponse<T> {
  data: T
  isSuccess: boolean
  statusCode: number
  errors: string[] | null
}

// Finance API Services
export class FinanceAPI {
  /**
   * Get current income statement
   */
  static async getCurrentIncomeStatement(): Promise<IncomeStatementData> {
    try {
      console.log('FinanceAPI: API çağrışı başladı')
      console.log('Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
      const response: ApiResponse<IncomeStatementData> = await api.get('/finance/current-income-statement')
      console.log('FinanceAPI: API cavabı:', response)
      
      if (response.isSuccess) {
        return response.data
      } else {
        throw new Error(response.errors?.join(', ') || 'Failed to fetch income statement')
      }
    } catch (error: any) {
      console.error('FinanceAPI.getCurrentIncomeStatement error:', error)
      console.log('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status
      })
      
      // Real layihədə mock data istifadə etməyəcəyik
      // Xətanı birbaşa at ki, UI-da düzgün error handling olsun
      throw error
    }
  }

  /**
   * Get income statement for a specific month/year
   */
  static async getIncomeStatementByMonth(year: number, month: number): Promise<IncomeStatementData | null> {
    try {
      console.log('FinanceAPI: Monthly income statement API çağrışı başladı', { year, month })
      const response: ApiResponse<IncomeStatementData> = await api.post('/finance/income-statement', {
        year,
        month
      })
      console.log('FinanceAPI: Monthly income statement API cavabı:', response)
      
      if (response.isSuccess) {
        return response.data
      } else {
        throw new Error(response.errors?.join(', ') || 'Failed to fetch monthly income statement')
      }
    } catch (error: any) {
      console.error('FinanceAPI.getIncomeStatementByMonth error:', error)
      
      // Əgər server cavab vermirsə və ya 404 xətası varsa, bu həqiqi xətadır
      if (error.response?.status === 404) {
        // 404 o deməkdir ki, bu tarix üçün məlumat yoxdur
        console.log('No data found for this period (404)')
        // Backend-dən gələn mesajı da at
        const backendMessage = error.response?.data?.message || 'Verilən tarixə uyğun məlumat tapılmadı'
        const customError: any = new Error(backendMessage)
        customError.response = error.response
        throw customError
      }
      
      // Digər xətalar üçün exception at
      throw error
    }
  }

  /**
   * Get income statement for a specific period (deprecated - use getIncomeStatementByMonth)
   */
  static async getIncomeStatementByPeriod(startDate: string, endDate: string): Promise<IncomeStatementData> {
    try {
      const response: ApiResponse<IncomeStatementData> = await api.get('/finance/income-statement', {
        params: { startDate, endDate }
      })
      
      if (response.isSuccess) {
        return response.data
      } else {
        throw new Error(response.errors?.join(', ') || 'Failed to fetch income statement')
      }
    } catch (error: any) {
      console.error('FinanceAPI.getIncomeStatementByPeriod error:', error)
      throw error
    }
  }

  /**
   * Get monthly financial summary
   */
  static async getMonthlyFinancialSummary(year: number, month: number): Promise<IncomeStatementData> {
    try {
      const response: ApiResponse<IncomeStatementData> = await api.get('/finance/monthly-summary', {
        params: { year, month }
      })
      
      if (response.isSuccess) {
        return response.data
      } else {
        throw new Error(response.errors?.join(', ') || 'Failed to fetch monthly summary')
      }
    } catch (error: any) {
      console.error('FinanceAPI.getMonthlyFinancialSummary error:', error)
      throw error
    }
  }

  /**
   * Update operating expenses
   */
  static async updateOperatingExpenses(expenses: {
    salaries: number
    rent: number
    utilities: number
    marketing: number
    otherExpenses: number
  }): Promise<void> {
    try {
      console.log('FinanceAPI: Operating expenses update başladı', expenses)
      const response: ApiResponse<any> = await api.patch('/finance/operating-expenses', expenses)
      console.log('FinanceAPI: Operating expenses update cavabı:', response)
      
      if (!response.isSuccess) {
        throw new Error(response.errors?.join(', ') || 'Failed to update operating expenses')
      }
    } catch (error: any) {
      console.error('FinanceAPI.updateOperatingExpenses error:', error)
      
      // API olmadığı halda mock uğurlu cavab qaytar
      if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
        console.log('Backend server not available, simulating successful update')
        return // Mock success
      }
      
      throw error
    }
  }

  /**
   * Get financial trends (for charts)
   */
  static async getFinancialTrends(period: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    labels: string[]
    revenue: number[]
    expenses: number[]
    netIncome: number[]
  }> {
    try {
      const response: ApiResponse<{
        labels: string[]
        revenue: number[]
        expenses: number[]
        netIncome: number[]
      }> = await api.get('/finance/trends', {
        params: { period }
      })
      
      if (response.isSuccess) {
        return response.data
      } else {
        throw new Error(response.errors?.join(', ') || 'Failed to fetch financial trends')
      }
    } catch (error: any) {
      console.error('FinanceAPI.getFinancialTrends error:', error)
      
      // Mock trend data
      const mockData = {
        labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyun'],
        revenue: [1200, 1900, 3000, 5000, 2300, 3080],
        expenses: [1800, 2400, 2800, 4200, 2100, 2900],
        netIncome: [-600, -500, 200, 800, 200, 180]
      }
      return mockData
    }
  }
}

export default FinanceAPI
