"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  MapPin, 
  Warehouse,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { shelfApi } from "@/lib/api/shelf"
import type { Shelf } from "@/types/shelf"

export default function InventoryPage() {
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Rəfləri yüklə
  useEffect(() => {
    const loadShelves = async () => {
      try {
        setLoading(true)
        const response = await shelfApi.getAllShelves()        
        if (response.isSuccess) {
          setShelves(response.data)
        }
      } catch (error) {
        console.error('Rəflər yüklənərkən xəta:', error)
      } finally {
        setLoading(false)
      }
    }

    loadShelves()
  }, [])

  // Rəf seçildikdə yeni səhifəyə keç
  const handleShelfSelect = (shelf: Shelf) => {
    router.push(`/warehouseman/inventory/${shelf.code}`)
  }

  // Axtarış filtri
  const filteredShelves = shelves.filter(shelf =>
    shelf.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getShelfStatusBadge = (itemsCount: number) => {
    if (itemsCount === 0) {
      return <Badge variant="secondary">Boş</Badge>
    } else if (itemsCount < 5) {
      return <Badge variant="outline">Az Dolu</Badge>
    } else {
      return <Badge variant="default">Dolu</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">İnventar - Rəflər</h1>
          <p className="text-gray-600">Anbar rəfləri və məhsul sayları</p>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rəf kodunu axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredShelves.map((shelf) => (
          <Card 
            key={shelf.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleShelfSelect(shelf)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Warehouse className="h-5 w-5" />
                  Rəf {shelf.code}
                </CardTitle>
                {getShelfStatusBadge(shelf.itemsCount)}
              </div>
              <CardDescription>
                ID: {shelf.id.substring(0, 8)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Məhsul sayı: {shelf.itemsCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Kod: {shelf.code}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShelves.length === 0 && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Heç bir rəf tapılmadı</p>
        </div>
      )}
    </div>
  )
}