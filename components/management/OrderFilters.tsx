"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { LookupItem } from "@/types/api-response"

interface OrderFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  customerFilter: string
  setCustomerFilter: (customer: string) => void
  dateFrom: Date | undefined
  setDateFrom: (date: Date | undefined) => void
  dateTo: Date | undefined
  setDateTo: (date: Date | undefined) => void
  customers: LookupItem[]
  vendors: string[]
}

export function OrderFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  customerFilter,
  setCustomerFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  customers,
  vendors,
}: OrderFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const clearFilters = () => {
    setStatusFilter("all")
    setCustomerFilter("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    setSearchTerm("")
  }

  const activeFiltersCount = [
    statusFilter !== "all",
    customerFilter !== "all",
    dateFrom,
    dateTo,
  ].filter(Boolean).length

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Sifarişləri axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtrlər
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-purple-primary text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-2" />
            Təmizlə
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="statusFilter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Bütün Statuslar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün Statuslar</SelectItem>
                <SelectItem value="InProgress">Hazırlanır</SelectItem>
                <SelectItem value="StockConfirmed">Stok yoxlanılıb</SelectItem>
                <SelectItem value="Prepared">Hazırlanıb</SelectItem>
                <SelectItem value="Shipped">Göndərilib</SelectItem>
                <SelectItem value="Cancelled">İmtina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customerFilter">Müştəri/Təchizatçı</Label>
            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Bütün Müştərilər" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün Müştərilər</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
                {vendors.map((vendor) => (
                  <SelectItem key={vendor} value={vendor}>
                    {vendor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Başlanğıc Tarixi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yy") : "Tarix seçin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Son Tarix</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yy") : "Tarix seçin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  )
}
