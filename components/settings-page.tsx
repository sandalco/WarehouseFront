"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionManagement } from "./subscription-management"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSaveGeneral = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      })
    }, 1000)
  }

  const handleSaveSecurity = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Security settings saved",
        description: "Your security settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tənzimləmələr</h3>
        <p className="text-sm text-muted-foreground">
          Hesab tənzimləmələrinizi idarə edin və tərcihlərinizi təyin edin.
        </p>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Ümumi</TabsTrigger>
          <TabsTrigger value="security">Təhlükəsizlik</TabsTrigger>
          <TabsTrigger value="notifications">Bildirişlər</TabsTrigger>
          <TabsTrigger value="subscription">Abunəlik</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Ümumi Tənzimləmələr</CardTitle>
              <CardDescription>Hesab məlumatlarınızı və tərcihlərinizi idarə edin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Profil Məlumatı</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-poçt</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Şirkət</Label>
                    <Input id="company" defaultValue="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select defaultValue="boss">
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boss">Boss</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="worker">Worker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Tərcihləri</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" defaultChecked />
                  <Label htmlFor="dark-mode">Qaranlıq rejimi aktivləşdir</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="compact-view" />
                  <Label htmlFor="compact-view">Kompakt görünüş istifadə et</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Dil</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="az">Azerbaijani</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral} disabled={loading}>
                {loading ? "Saxlanılır..." : "Dəyişiklikləri Saxla"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Təhlükəsizlik Tənzimləmələri</CardTitle>
              <CardDescription>Şifrənizi və təhlükəsizlik tərcihlərinizi idarə edin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Şifrəni Dəyişdir</h4>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Cari Şifrə</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Yeni Şifrə</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Yeni Şifrəni Təsdiqləyin</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">İki Faktorlu Autentifikasiya</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="2fa" />
                  <Label htmlFor="2fa">İki faktorlu autentifikasiyanı aktivləşdir</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring a verification code in addition to your
                  password.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Sessiya İdarəetməsi</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">Chrome on Windows • Baku, Azerbaijan</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Mobile App</p>
                      <p className="text-xs text-muted-foreground">iPhone 13 • iOS 16.5</p>
                    </div>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Sign out of all devices
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity} disabled={loading}>
                {loading ? "Saxlanılır..." : "Dəyişiklikləri Saxla"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildiriş Tənzimləmələri</CardTitle>
              <CardDescription>Bildiriş və xəbərdarlıqları necə alacağınızı idarə edin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">E-poçt Bildirişləri</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="email-orders" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="email-orders" className="text-sm font-medium">
                        Order Updates
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive email notifications for order status changes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="email-inventory" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="email-inventory" className="text-sm font-medium">
                        Inventory Alerts
                      </Label>
                      <p className="text-xs text-muted-foreground">Get notified when inventory levels are low.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="email-reports" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="email-reports" className="text-sm font-medium">
                        Weekly Reports
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive weekly performance and analytics reports.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="email-marketing" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="email-marketing" className="text-sm font-medium">
                        Marketing Updates
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive news about new features and promotions.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Push Bildirişləri</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="push-orders" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="push-orders" className="text-sm font-medium">
                        Order Updates
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive push notifications for order status changes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="push-inventory" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="push-inventory" className="text-sm font-medium">
                        Inventory Alerts
                      </Label>
                      <p className="text-xs text-muted-foreground">Get notified when inventory levels are low.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Bildiriş Tezliyi</h4>
                <div className="space-y-2">
                  <Label htmlFor="frequency">E-poçt Xülasə Tezliyi</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Tezlik seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real vaxt</SelectItem>
                      <SelectItem value="daily">Gündəlik Xülasə</SelectItem>
                      <SelectItem value="weekly">Həftəlik Xülasə</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Dəyişiklikləri Saxla</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <SubscriptionManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
