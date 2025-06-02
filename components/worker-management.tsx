"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Eye } from "lucide-react"

interface WorkerManagementProps {
  onViewWorker?: (workerId: string) => void
}

export function WorkerManagement({ onViewWorker }: WorkerManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const workers = [
    {
      id: "WRK-001",
      name: "John Smith",
      email: "john.smith@company.com",
      phone: "+1 (555) 123-4567",
      role: "warehouseman",
      warehouse: "Main Distribution Center",
      shift: "Morning",
      status: "Active",
      tasksCompleted: 45,
      performance: "Excellent",
    },
    {
      id: "WRK-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 234-5678",
      role: "warehouseman",
      warehouse: "West Coast Hub",
      shift: "Evening",
      status: "Active",
      tasksCompleted: 38,
      performance: "Good",
    },
    {
      id: "WRK-003",
      name: "Mike Davis",
      email: "mike.davis@company.com",
      phone: "+1 (555) 345-6789",
      role: "warehouseman",
      warehouse: "Central Storage",
      shift: "Night",
      status: "Active",
      tasksCompleted: 52,
      performance: "Excellent",
    },
    {
      id: "WRK-004",
      name: "Lisa Wilson",
      email: "lisa.wilson@company.com",
      phone: "+1 (555) 456-7890",
      role: "warehouseman",
      warehouse: "Main Distribution Center",
      shift: "Morning",
      status: "On Leave",
      tasksCompleted: 29,
      performance: "Good",
    },
  ]

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.warehouse.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">Worker Management</h2>
          <p className="text-gray-600">Manage warehouse staff and their assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-primary hover:bg-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Worker</DialogTitle>
              <DialogDescription>Enter the details for the new warehouse worker</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workerName">Full Name</Label>
                <Input id="workerName" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="worker@company.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wh1">Main Distribution Center</SelectItem>
                      <SelectItem value="wh2">West Coast Hub</SelectItem>
                      <SelectItem value="wh3">Central Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shift">Shift</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Add Worker</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workers</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-sm text-gray-500">{worker.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{worker.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{worker.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{worker.warehouse}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{worker.shift}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{worker.tasksCompleted}</span>
                    <span className="text-sm text-gray-500 ml-1">completed</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={worker.performance === "Excellent" ? "default" : "secondary"}>
                      {worker.performance}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={worker.status === "Active" ? "default" : "secondary"}>{worker.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onViewWorker?.(worker.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
