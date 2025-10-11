"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Building2, Search, Edit, Trash2, AlertCircle, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"
import { createApiCall } from "@/lib/api-helpers"
import { CompanyAPI } from "@/lib/api/company"
import { ApiResponse } from "@/types/api-response"

interface Company {
  id: string
  name: string
  warehouses: number
  subscription: string
}

interface CreateCompanyData {
  name: string
  description: string
  logoUrl: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formError, setFormError] = useState("")
  const [createFormData, setCreateFormData] = useState<CreateCompanyData>({
    name: "",
    description: "",
    logoUrl: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  })
  const { toast } = useToast()

  // Fetch companies
  const fetchCompanies = () => {
    createApiCall(
      CompanyAPI.getCompanies,
      setLoading,
      (data) => {
        setCompanies(data)
      },
      (errorMessage) => {
        toast({
          title: "Xəta",
          description: errorMessage,
          variant: "destructive",
        })
      }
    )
  }

  // Create company
  const createCompany = () => {
    setFormError("") // Clear previous errors
    
    createApiCall(
      () => CompanyAPI.createCompany(createFormData),
      () => {}, // No loading state for this operation
      () => {
        toast({
          title: "Uğurla əlavə edildi",
          description: "Şirkət uğurla yaradıldı",
        })
        setIsCreateDialogOpen(false)
        setCreateFormData({
          name: "",
          description: "",
          logoUrl: "",
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: ""
        })
        fetchCompanies()
      },
      (errorMessage) => {
        setFormError(errorMessage)
        toast({
          title: "Xəta",
          description: errorMessage,
          variant: "destructive",
        })
      }
    )
  }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSubscriptionBadgeVariant = (subscription: string) => {
    switch (subscription.toLowerCase()) {
      case 'gold':
        return 'default'
      case 'bronze':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Şirkət İdarəetməsi</h1>
          <p className="text-muted-foreground">Sistemdəki bütün şirkətləri idarə edin</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          if (!open) {
            setFormError("") // Clear error when closing dialog
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Şirkət
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Yeni Şirkət Əlavə Et</DialogTitle>
              <DialogDescription>
                Yeni şirkət yaratmaq üçün aşağıdaki məlumatları doldurun.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {formError}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Şirkət Məlumatları Bölməsi */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Şirkət Məlumatları</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Şirkət Adı *</Label>
                    <Input
                      id="name"
                      value={createFormData.name}
                      onChange={(e) => {
                        setCreateFormData({ ...createFormData, name: e.target.value })
                        setFormError("") // Clear error when user types
                      }}
                      placeholder="Şirkət adını daxil edin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      placeholder="Email adresi"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Təsvir</Label>
                    <Input
                      id="description"
                      value={createFormData.description}
                      onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                      placeholder="Şirkət təsviri"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={createFormData.logoUrl}
                      onChange={(e) => setCreateFormData({ ...createFormData, logoUrl: e.target.value })}
                      placeholder="Logo linki (isteğe bağlı)"
                    />
                  </div>
                </div>
              </div>

              {/* Ayırıcı Xətt */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Rəhbər Məlumatları</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad *</Label>
                    <Input
                      id="firstName"
                      value={createFormData.firstName}
                      onChange={(e) => setCreateFormData({ ...createFormData, firstName: e.target.value })}
                      placeholder="Rəhbərin adı"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad *</Label>
                    <Input
                      id="lastName"
                      value={createFormData.lastName}
                      onChange={(e) => setCreateFormData({ ...createFormData, lastName: e.target.value })}
                      placeholder="Rəhbərin soyadı"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Telefon Nömrəsi *</Label>
                  <Input
                    id="phoneNumber"
                    value={createFormData.phoneNumber}
                    onChange={(e) => setCreateFormData({ ...createFormData, phoneNumber: e.target.value })}
                    placeholder="+99455-123-12-12"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Ləğv et
              </Button>
              <Button onClick={createCompany}>
                Şirkət Yarat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Şirkətlər Siyahısı
              </CardTitle>
              <CardDescription>
                Sistemdə qeydiyyatdan keçmiş {companies.length} şirkət
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Şirkət axtar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Yüklənir...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Şirkət Adı</TableHead>
                  <TableHead>Anbar Sayı</TableHead>
                  <TableHead>Abunəlik</TableHead>
                  <TableHead className="text-right">Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {company.warehouses} anbar
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {company.subscription ? (
                        <Badge variant={getSubscriptionBadgeVariant(company.subscription)}>
                          {company.subscription}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Abunəlik yoxdur</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!loading && filteredCompanies.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                {searchTerm ? "Axtarılan şirkət tapılmadı" : "Hələ heç bir şirkət əlavə edilməyib"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
