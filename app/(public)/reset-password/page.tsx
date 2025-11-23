"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { validateResetToken, resetPassword } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [uid, setUid] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Hydration problemini həll etmək üçün
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const tokenParam = searchParams.get("token")
    const uidParam = searchParams.get("uid")

    console.log("Token:", tokenParam)
    console.log("UID:", uidParam)

    if (!tokenParam || !uidParam) {
      setError("Keçərsiz sıfırlama linki")
      setIsValidating(false)
      return
    }

    setToken(tokenParam)
    setUid(uidParam)

    // Validate token
    const validate = async () => {
      try {
        console.log("Validating token...", tokenParam, uidParam)
        
        const response = await validateResetToken(tokenParam, uidParam)
        console.log("Validation response:", response)
        
        if (response.isSuccess && response.data === true) {
          setIsValid(true)
        } else {
          setError("Bu link artıq istifadə edilib və ya müddəti bitib")
        }
      } catch (error: any) {
        console.error("Validation error:", error)
        setError("Token yoxlanılarkən xəta baş verdi")
      } finally {
        setIsValidating(false)
      }
    }

    validate()
  }, [searchParams, isMounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (newPassword !== confirmPassword) {
      setError("Şifrələr uyğun gəlmir")
      return
    }

    if (newPassword.length < 6) {
      setError("Şifrə ən azı 6 simvoldan ibarət olmalıdır")
      return
    }

    if (!token || !uid) {
      setError("Token və ya istifadəçi ID-si tapılmadı")
      return
    }

    setIsLoading(true)

    try {
      console.log("Submitting new password...")
      const response = await resetPassword({
        newPassword,
        confirmPassword,
        token,
        userId: uid
      })
      
      console.log("Reset password response:", response)

      if (response.isSuccess) {
        setIsSuccess(true)
      } else {
        setError(response.errors?.join(", ") || "Şifrə yenilənərkən xəta baş verdi")
      }
    } catch (error: any) {
      console.error("Reset password error:", error)
      setError(error.message || "Şifrə yenilənərkən xəta baş verdi")
    } finally {
      setIsLoading(false)
    }
  }

  // Hydration problemi üçün ilk render-də loading göstər
  if (!isMounted || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-primary mb-4" />
            <p className="text-lg font-medium">Link yoxlanılır...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-purple-primary">Keçərsiz Link</CardTitle>
            <CardDescription>Parol sıfırlama linki etibarsızdır</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Bu link artıq istifadə edilib və ya müddəti bitib. Yeni parol sıfırlama linki əldə etmək üçün 
                aşağıdakı düyməyə klikləyin.
              </p>
              
              <Link href="/forgot-password" className="block">
                <Button className="w-full bg-purple-primary hover:bg-purple-600">
                  Yeni Link Əldə Et
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Giriş səhifəsinə qayıt
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-purple-primary">Şifrə Uğurla Yeniləndi</CardTitle>
            <CardDescription>Şifrəniz uğurla dəyişdirildi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Şifrəniz uğurla yeniləndi. İndi yeni şifrənizlə sistemə daxil ola bilərsiniz.
                </AlertDescription>
              </Alert>
              
              <Link href="/" className="block">
                <Button className="w-full bg-purple-primary hover:bg-purple-600">
                  Giriş Səhifəsinə Get
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-purple-primary">Yeni Şifrə Təyin Edin</CardTitle>
          <CardDescription>Hesabınız üçün yeni şifrə daxil edin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Yeni Şifrə</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni şifrənizi daxil edin"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ən azı 6 simvol olmalıdır
              </p>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Şifrəni Təsdiqləyin</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrəni təkrar daxil edin"
                required
                minLength={6}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-purple-primary hover:bg-purple-600"
              disabled={isLoading}
            >
              {isLoading ? "Yenilənir..." : "Şifrəni Yenilə"}
            </Button>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Ləğv et
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-purple-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
