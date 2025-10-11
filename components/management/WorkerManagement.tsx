"use client"

import { useEffect, useState } from "react"
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
import { Worker } from "@/types/worker"
import { getWorkers } from "@/lib/api/worker"
import { createApiCall } from "@/lib/api-helpers"
import { toast } from "@/hooks/use-toast"

interface WorkerManagementProps {
  onViewWorker?: (workerId: string) => void
}

export function WorkerManagement({ onViewWorker }: WorkerManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadWorkers()
  }, [])

  const loadWorkers = () => {
    createApiCall(
      getWorkers,
      setIsLoading,
      (data) => setWorkers(data),
      (error) => toast({ title: "Xəta", description: error, variant: "destructive" })
    )
  }

  const filteredWorkers = workers.filter(
    (worker) =>
      `${worker.firstName} ${worker.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">İşçi İdarəetməsi</h2>
          <p className="text-gray-600">Anbar işçilərini və onların tapşırıqlarını idarə edin</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-primary hover:bg-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              İşçi Əlavə Et
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni İşçi Əlavə Et</DialogTitle>
              <DialogDescription>Yeni anbar işçisi üçün məlumatları daxil edin</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workerName">Tam Ad</Label>
                <Input id="workerName" placeholder="Tam adı daxil edin" />
              </div>
              <div>
                <Label htmlFor="email">E-poçt</Label>
                <Input id="email" type="email" placeholder="worker@company.com" />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warehouse">Anbar</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Anbar seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wh1">Əsas Paylama Mərkəzi</SelectItem>
                      <SelectItem value="wh2">Qərb Sahili Mərkəzi</SelectItem>
                      <SelectItem value="wh3">Mərkəzi Anbar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shift">Növbə</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Növbə seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Səhər</SelectItem>
                      <SelectItem value="evening">Axşam</SelectItem>
                      <SelectItem value="night">Gecə</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Ləğv Et
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>İşçi Əlavə Et</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İşçilər</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="İşçiləri axtar..."
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
                <TableHead>İşçi</TableHead>
                <TableHead>Əlaqə</TableHead>
                <TableHead>Anbar</TableHead>
                <TableHead>Növbə</TableHead>
                <TableHead>Tapşırıqlar</TableHead>
                <TableHead>Performans</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {worker.firstName} {worker.lastName}
                        </p>
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
                        <span>{worker.phoneNumber}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{worker.warehouseId}</TableCell>
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
