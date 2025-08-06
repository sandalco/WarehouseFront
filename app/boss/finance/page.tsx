"use client"

import { IncomeStatementCard, OperatingExpensesForm, HistoricalIncomeStatement } from "@/components/finance"
import { useIncomeStatement } from "@/hooks/use-finance"

export default function FinancePage() {
  const { data, loading, refetch } = useIncomeStatement()

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Maaliyyə</h2>
      </div>
      
      {/* Historical Income Statement - Top Priority */}
      <div className="w-full">
        <HistoricalIncomeStatement />
      </div>

      {/* Current Financial Data - Grid Layout */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Current Income Statement */}
        <div className="space-y-4">
          <IncomeStatementCard />
        </div>
        
        {/* Operating Expenses Form */}
        <div className="space-y-4">
          {data && !loading && (
            <OperatingExpensesForm 
              currentData={data} 
              onSuccess={refetch}
            />
          )}
        </div>
      </div>
    </div>
  )
}
