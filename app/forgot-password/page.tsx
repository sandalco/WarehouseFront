"use client"

import { useState } from "react"
import { forgotPassword } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await forgotPassword(email)
      
      if (response.isSuccess) {
        setIsSuccess(true)
      } else {
        setError(response.errors?.join(", ") || "Xəta baş verdi")
      }
    } catch (error: any) {
      setError(error.message || "Sorğu göndərilərkən xəta baş verdi")
    } finally {
      setIsLoading(false)
    }
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
            <CardTitle className="text-2xl font-bold text-purple-primary">E-poçt Göndərildi</CardTitle>
            <CardDescription>Parol sıfırlama təlimatları e-poçtunuza göndərildi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">{email} ünvanına parol sıfırlama linki göndərildi.</p>
                  <p className="text-sm text-muted-foreground">
                    E-poçtunuzu yoxlayın və parolunuzu sıfırlamaq üçün linkə klikləyin. 
                    Link 24 saat ərzində etibarlıdır.
                  </p>
                </AlertDescription>
              </Alert>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>E-poçt gəlməyibsə:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Spam qovluğunu yoxlayın</li>
                  <li>E-poçt ünvanının düzgün yazıldığını təsdiqləyin</li>
                  <li>Bir neçə dəqiqə gözləyin</li>
                </ul>
              </div>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Giriş səhifəsinə qayıt
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
            <img src="/logo.png" alt="Şirkət Loqosu" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-purple-primary">Şifrəni Unutmuşam</CardTitle>
          <CardDescription>Parolunuzu sıfırlamaq üçün e-poçt ünvanınızı daxil edin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-poçt</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-poçt ünvanınızı daxil edin"
                required
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full bg-purple-primary hover:bg-purple-600" disabled={isLoading}>
              {isLoading ? "Göndərilir..." : "Sıfırlama Linki Göndər"}
            </Button>
            
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Giriş səhifəsinə qayıt
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
