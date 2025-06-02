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
import { Plus, Search, Edit, Trash2, Building, Mail, Phone, MapPin, Eye } from "lucide-react"
import { ImportExportButtons } from "./import-export-utils"
import { useToast } from "@/hooks/use-toast"

interface CustomerManagementProps {
  onViewCustomerOrders?: (customerId: string, customerName: string) => void
}

export function CustomerManagement({ onViewCustomerOrders }: CustomerManagementProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const customers = [
    {
      id: "CUST-001",
      name: "ABC Corporation",
      email: "contact@abccorp.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business Ave, New York, NY 10001",
      type: "Enterprise",
      totalOrders: 45,
      totalValue: 125000,
      status: "Active",
      lastOrder: "2024-01-15",
    },
    {
      id: "CUST-002",
      name: "XYZ Limited",
      email: "orders@xyzltd.com",
      phone: "+1 (555) 234-5678",
      address: "456 Commerce St, Los Angeles, CA 90001",
      type: "SMB",
      totalOrders: 23,
      totalValue: 67500,
      status: "Active",
      lastOrder: "2024-01-14",
    },
    {
      id: "CUST-003",
      name: "Tech Solutions Inc",
      email: "procurement@techsol.com",
      phone: "+1 (555) 345-6789",
      address: "789 Innovation Blvd, Austin, TX 73301",
      type: "Enterprise",
      totalOrders: 67,
      totalValue: 189000,
      status: "Active",
      lastOrder: "2024-01-13",
    },
    {
      id: "CUST-004",
      name: "Global Trade Co",
      email: "info@globaltrade.com",
      phone: "+1 (555) 456-7890",
      address: "321 Export Way, Miami, FL 33101",
      type: "SMB",
      totalOrders: 12,
      totalValue: 34500,
      status: "Inactive",
      lastOrder: "2023-12-20",
    },
  ]

  const [customersList, setCustomersList] = useState(customers)

  const handleImport = (file: File) => {
    toast({
      title: "Import Started",
      description: `Processing ${file.name}. This may take a few moments.`,
    })

    setTimeout(() => {
      toast({
        title: "Import Completed",
        description: "Customers have been imported successfully.",
      })
    }, 2000)
  }

  const filteredCustomers = customersList.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">Customer Management</h2>
          <p className="text-gray-600">Manage your customers and their order history</p>
        </div>
        <div className="flex space-x-3">
          <ImportExportButtons type="customers" data={customersList} onImport={handleImport} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-primary hover:bg-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Enter the details for the new customer</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Company Name</Label>
                  <Input id="customerName" placeholder="Enter company name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contact@company.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Full business address" />
                </div>
                <div>
                  <Label htmlFor="type">Customer Type</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Select type</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="SMB">Small/Medium Business</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Add Customer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersList.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersList.filter((c) => c.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersList.reduce((sum, c) => sum + c.totalOrders, 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customersList.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
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
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Building className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-xs">{customer.address}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.totalOrders}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${customer.totalValue.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "Active" ? "default" : "secondary"}>{customer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewCustomerOrders?.(customer.id, customer.name)}
                      >
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
