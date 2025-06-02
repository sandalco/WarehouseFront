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
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your account settings and set preferences.</p>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Profile Information</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
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
                <h4 className="text-sm font-medium">Preferences</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" defaultChecked />
                  <Label htmlFor="dark-mode">Enable dark mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="compact-view" />
                  <Label htmlFor="compact-view">Use compact view</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
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
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Change Password</h4>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="2fa" />
                  <Label htmlFor="2fa">Enable two-factor authentication</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring a verification code in addition to your
                  password.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Session Management</h4>
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
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Notifications</h4>
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
                <h4 className="text-sm font-medium">Push Notifications</h4>
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
                <h4 className="text-sm font-medium">Notification Frequency</h4>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Email Digest Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
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
