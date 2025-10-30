import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { CustomerSortBy } from "@/types/customer"

interface CustomerFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  cityFilter: string
  setCityFilter: (value: string) => void
  sortBy: CustomerSortBy
  setSortBy: (value: CustomerSortBy) => void
  sortDescending: boolean
  setSortDescending: (value: boolean) => void
}

export function CustomerFilters({
  searchTerm,
  setSearchTerm,
  cityFilter,
  setCityFilter,
  sortBy,
  setSortBy,
  sortDescending,
  setSortDescending,
}: CustomerFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Search */}
      <div className="flex-1 min-w-[250px]">
        <Label htmlFor="search" className="text-xs text-muted-foreground mb-1">
          Axtarış (Ad/Email/Telefon)
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Müştəri axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* City Filter */}
      <div className="w-[200px]">
        <Label htmlFor="city-filter" className="text-xs text-muted-foreground mb-1">
          Şəhər
        </Label>
        <Input
          id="city-filter"
          placeholder="Şəhər daxil edin..."
          value={cityFilter === "all" ? "" : cityFilter}
          onChange={(e) => setCityFilter(e.target.value || "all")}
        />
      </div>

      {/* Sort By */}
      <div className="w-[200px]">
        <Label htmlFor="sort-by" className="text-xs text-muted-foreground mb-1">
          Sıralama
        </Label>
        <Select
          value={sortBy.toString()}
          onValueChange={(value) => setSortBy(Number(value) as CustomerSortBy)}
        >
          <SelectTrigger id="sort-by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CustomerSortBy.Name.toString()}>Ad</SelectItem>
            <SelectItem value={CustomerSortBy.OrderCount.toString()}>Sifariş Sayı</SelectItem>
            <SelectItem value={CustomerSortBy.LastOrder.toString()}>Son Sifariş</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order */}
      <div className="w-[150px]">
        <Label htmlFor="sort-order" className="text-xs text-muted-foreground mb-1">
          Sıra
        </Label>
        <Select
          value={sortDescending ? "desc" : "asc"}
          onValueChange={(value) => setSortDescending(value === "desc")}
        >
          <SelectTrigger id="sort-order">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Artan</SelectItem>
            <SelectItem value="desc">Azalan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
