'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, Mail, Phone, Building2, Warehouse, Crown, Shield, Lock, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createApiCall } from '@/lib/api-helpers'
import { profileApi } from '@/lib/api/profile'
import { ProfileData } from '@/types/profile'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Password change states
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = () => {
    createApiCall(
      profileApi.getProfile,
      setLoading,
      (data) => {
        setProfileData(data)
        setError(null)
      },
      (errorMessage) => {
        setError(errorMessage)
        toast({ 
          title: "Xəta", 
          description: errorMessage, 
          variant: "destructive" 
        })
      }
    )
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'boss':
        return 'bg-purple-100 text-purple-800'
      case 'warehouseman':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'boss':
        return <Crown className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription.toLowerCase()) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const handleChangePassword = () => {
    // Clear previous errors and success
    setPasswordErrors([])
    setPasswordSuccess(false)
    
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordErrors(["Bütün sahələri doldurun"])
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrors(["Yeni şifrələr uyğun gəlmir"])
      return
    }

    if (newPassword.length < 6) {
      setPasswordErrors(["Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır"])
      return
    }

    createApiCall(
      () => profileApi.changePassword({
        oldPassword,
        newPassword,
        confirmPassword
      }),
      setChangingPassword,
      () => {
        toast({
          title: "Uğurlu",
          description: "Şifrə uğurla dəyişdirildi"
        })
        // Clear form and show success
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordErrors([])
        setPasswordSuccess(true)
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setPasswordSuccess(false)
        }, 5000)
      },
      (errorMessage) => {
        // Backend-dən gələn xətaları saxlayırıq
        setPasswordErrors([errorMessage])
      }
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profil</h1>
          <p className="text-muted-foreground">
            İstifadəçi və şirkət məlumatlarınızı görün
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profil</h1>
          <p className="text-muted-foreground">
            İstifadəçi və şirkət məlumatlarınızı görün
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!profileData) {
    return null
  }

  const { user, company } = profileData

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="text-muted-foreground">
          İstifadəçi və şirkət məlumatlarınızı görün
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              İstifadəçi Məlumatları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Ad və Soyad</p>
                  <p className="text-lg font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{user.phoneNumber}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rollar</p>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <Badge 
                      key={index} 
                      className={getRoleColor(role)}
                      variant="outline"
                    >
                      <span className="flex items-center gap-1">
                        {getRoleIcon(role)}
                        {role}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>

              {user.warehouseId && user.warehouseId !== 'N/A' && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Anbar ID</p>
                    <p className="font-mono text-sm">{user.warehouseId}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Şirkət Məlumatları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Şirkət Adı</p>
                <p className="text-lg font-medium">{company.companyName}</p>
              </div>

              <Separator />

              {company.warehouseName && (
                <>
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Anbar Adı</p>
                      <p className="font-medium">
                        {company.warehouseName || 'Təyin edilməyib'}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Abunəlik Planı</p>
                <Badge 
                  className={`${getSubscriptionColor(company.subscription)} text-base px-3 py-1`}
                  variant="outline"
                >
                  {company.subscription}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Card */}
      <Card className={changingPassword ? 'opacity-60' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Şifrəni Dəyiş
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {passwordErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {passwordSuccess && (
            <Alert className="border-green-500 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Şifrə uğurla dəyişdirildi
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Köhnə Şifrə</Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Köhnə şifrənizi daxil edin"
                disabled={changingPassword}
                className={passwordErrors.length > 0 ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowOldPassword(!showOldPassword)}
                disabled={changingPassword}
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Yeni Şifrə</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni şifrənizi daxil edin"
                disabled={changingPassword}
                className={passwordErrors.length > 0 ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={changingPassword}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Yeni Şifrə Təkrar</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Yeni şifrənizi təkrar daxil edin"
                disabled={changingPassword}
                className={passwordErrors.length > 0 ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={changingPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="w-full"
          >
            {changingPassword ? "Dəyişdirilir..." : "Şifrəni Dəyiş"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
