"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { useNotifications } from "./notification-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Building, Calendar, Edit, Save, X } from "lucide-react"

export function ProfilePage() {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street, New York, NY 10001",
    bio: "Experienced warehouse professional with 5+ years in logistics and inventory management.",
    department: user?.role === "boss" ? "Management" : "Warehouse Operations",
    joinDate: "January 15, 2023",
  })

  const handleSave = () => {
    setIsEditing(false)
    addNotification({
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      type: "success",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "+1 (555) 123-4567",
      address: "123 Business Street, New York, NY 10001",
      bio: "Experienced warehouse professional with 5+ years in logistics and inventory management.",
      department: user?.role === "boss" ? "Management" : "Warehouse Operations",
      joinDate: "January 15, 2023",
    })
  }

  const stats =
    user?.role === "boss"
      ? [
          { label: "Total Orders Managed", value: "1,234" },
          { label: "Active Warehouses", value: "8" },
          { label: "Team Members", value: "45" },
          { label: "Revenue Generated", value: "$2.4M" },
        ]
      : [
          { label: "Tasks Completed", value: "456" },
          { label: "Orders Processed", value: "234" },
          { label: "Accuracy Rate", value: "98.5%" },
          { label: "Performance Score", value: "Excellent" },
        ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">My Profile</h2>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-purple-primary hover:bg-purple-600">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-purple-primary hover:bg-purple-600">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
                  <AvatarFallback className="text-lg">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <Badge variant="secondary" className="capitalize">
                    {user?.role}
                  </Badge>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{formData.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{formData.department}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{formData.address}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{formData.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
              <CardDescription>Your key performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formData.joinDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <Badge variant="secondary" className="capitalize">
                  {user?.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
