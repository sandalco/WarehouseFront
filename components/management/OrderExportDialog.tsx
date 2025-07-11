"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface OrderExportDialogProps {
  dateFrom: Date | undefined
  dateTo: Date | undefined
  setDateFrom: (date: Date | undefined) => void
  setDateTo: (date: Date | undefined) => void
  onExport: () => void
}

export function OrderExportDialog({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  onExport,
}: OrderExportDialogProps) {
  const [showDialog, setShowDialog] = useState(false)

  const setDateRangePreset = (preset: string) => {
    const today = new Date()
    let endDate = new Date(today)
    endDate.setHours(23, 59, 59, 999)
    
    let startDate = new Date(today)
    
    switch (preset) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'yesterday':
        startDate.setDate(today.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate.setDate(today.getDate() - 1)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'last7days':
        startDate.setDate(today.getDate() - 6)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'last30days':
        startDate.setDate(today.getDate() - 29)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        endDate = new Date(today.getFullYear(), today.getMonth(), 0)
        endDate.setHours(23, 59, 59, 999)
        break
      default:
        return
    }
    
    setDateFrom(startDate)
    setDateTo(endDate)
  }

  const clearDateRange = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const handleExport = () => {
    onExport()
    setShowDialog(false)
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          İxrac Et
          {dateFrom && dateTo && (
            <span className="ml-2 text-xs">
              ({format(dateFrom, "dd/MM/yy")} - {format(dateTo, "dd/MM/yy")})
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sifarişləri İxrac Et</DialogTitle>
          <DialogDescription>
            Tarix aralığını seçin və sifarişləri Excel faylına ixrac edin
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Hazır Tarix Aralıqları</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRangePreset('today')}
                className="justify-start"
              >
                Bu gün
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRangePreset('yesterday')}
                className="justify-start"
              >
                Dünən
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRangePreset('last7days')}
                className="justify-start"
              >
                Son 7 gün
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRangePreset('last30days')}
                className="justify-start"
              >
                Son 30 gün
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRangePreset('thisMonth')}
                className="justify-start"
              >
                Bu ay
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRangePreset('lastMonth')}
                className="justify-start"
              >
                Keçən ay
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
                    {dateFrom ? format(dateFrom, "dd/MM/yy") : "Seçin"}
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
                    {dateTo ? format(dateTo, "dd/MM/yy") : "Seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {dateFrom && dateTo && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Seçilmiş aralıq:</strong> {format(dateFrom, "dd MMMM yyyy")} - {format(dateTo, "dd MMMM yyyy")}
              </p>
            </div>
          )}

          <div className="flex justify-between space-x-2">
            <Button 
              variant="outline" 
              onClick={clearDateRange}
              disabled={!dateFrom && !dateTo}
            >
              Təmizlə
            </Button>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(false)}
              >
                Ləğv et
              </Button>
              <Button 
                onClick={handleExport}
                className="bg-purple-primary hover:bg-purple-600"
              >
                İxrac Et
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
