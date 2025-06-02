"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface WorkerDetailsPageProps {
  workerId: string
  onBack: () => void
}

export function WorkerDetailsPage({ workerId, onBack }: WorkerDetailsPageProps) {
  const [isEditing, setIsEditing] = useState(false)

  // Mock worker data - in real app, fetch based on workerId
  const worker = {
    id: "WRK-001",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    role: "warehouseman",
    warehouse: "Main Distribution Center",
    shift: "Morning",
    status: "Active",
    hireDate: "2023-01-15",
    department: "Fulfillment",
    supervisor: "Mike Johnson",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+1 (555) 987-6543",
      relationship: "Spouse",
    },
    performance: {
      rating: "Excellent",
      tasksCompleted: 245,
      accuracy: 98.5,
      efficiency: 95.2,
      attendance: 99.1,
    },
    recentTasks: [
      {
        id: "TASK-001",
        orderId: "ORD-2024-001",
        type: "Pick",
        status: "Completed",
        completedAt: "2024-01-15 14:30",
        duration: "25 min",
        accuracy: "100%",
      },
      {
        id: "TASK-002",
        orderId: "ORD-2024-002",
        type: "Pack",
        status: "Completed",
        completedAt: "2024-01-15 13:45",
        duration: "18 min",
        accuracy: "100%",
      },
      {
        id: "TASK-003",
        orderId: "ORD-2024-003",
        type: "Stock",
        status: "In Progress",
        startedAt: "2024-01-15 15:00",
        duration: "12 min",
        accuracy: "-",
      },
    ],
    certifications: [
      { name: "Forklift Operation", issueDate: "2023-02-01", expiryDate: "2025-02-01", status: "Valid" },
      { name: "Safety Training", issueDate: "2023-01-20", expiryDate: "2024-01-20", status: "Expired" },
      { name: "Warehouse Management", issueDate: "2023-03-15", expiryDate: "2026-03-15", status: "Valid" },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workers
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-purple-primary">{worker.name}</h1>
            <p className="text-gray-600">
              {worker.id} • {worker.role}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Worker
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="tasks">Recent Tasks</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={worker.name} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={worker.email} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={worker.phone} />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" defaultValue={worker.address} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>{worker.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>{worker.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{worker.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>{worker.address}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="warehouse">Warehouse</Label>
                      <Select defaultValue={worker.warehouse}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main Distribution Center">Main Distribution Center</SelectItem>
                          <SelectItem value="West Coast Hub">West Coast Hub</SelectItem>
                          <SelectItem value="Central Storage">Central Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="shift">Shift</Label>
                      <Select defaultValue={worker.shift}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                          <SelectItem value="Night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue={worker.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Warehouse:</span>
                      <span className="font-medium">{worker.warehouse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shift:</span>
                      <Badge variant="outline">{worker.shift}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{worker.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Supervisor:</span>
                      <span className="font-medium">{worker.supervisor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hire Date:</span>
                      <span className="font-medium">{worker.hireDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={worker.status === "Active" ? "default" : "secondary"}>{worker.status}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{worker.emergencyContact.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{worker.emergencyContact.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Relationship:</span>
                  <span className="font-medium">{worker.emergencyContact.relationship}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks Completed:</span>
                  <span className="font-bold text-green-600">{worker.performance.tasksCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy Rate:</span>
                  <span className="font-bold text-blue-600">{worker.performance.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-bold text-purple-600">{worker.performance.efficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-bold text-orange-600">{worker.performance.attendance}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Task Accuracy</span>
                    <span className="font-medium">{worker.performance.accuracy}%</span>
                  </div>
                  <Progress value={worker.performance.accuracy} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Efficiency Rating</span>
                    <span className="font-medium">{worker.performance.efficiency}%</span>
                  </div>
                  <Progress value={worker.performance.efficiency} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Attendance Rate</span>
                    <span className="font-medium">{worker.performance.attendance}%</span>
                  </div>
                  <Progress value={worker.performance.attendance} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Rating</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="text-center">
                  <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-purple-primary">{worker.performance.rating}</h3>
                  <p className="text-gray-600">Overall Performance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest task activities and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {worker.recentTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono text-sm">{task.id}</TableCell>
                      <TableCell className="font-mono text-sm">{task.orderId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.status === "Completed" ? "default" : "secondary"}>
                          {task.status === "Completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.duration}</TableCell>
                      <TableCell>
                        <span className={task.accuracy === "100%" ? "text-green-600 font-medium" : ""}>
                          {task.accuracy}
                        </span>
                      </TableCell>
                      <TableCell>{task.completedAt || task.startedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Training</CardTitle>
              <CardDescription>Worker certifications and training records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certification</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {worker.certifications.map((cert, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{cert.name}</TableCell>
                      <TableCell>{cert.issueDate}</TableCell>
                      <TableCell>{cert.expiryDate}</TableCell>
                      <TableCell>
                        <Badge variant={cert.status === "Valid" ? "default" : "destructive"}>
                          {cert.status === "Valid" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {cert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Certificate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
