"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Customer } from "@/types/customer"

interface OrderCreateDialogProps {
  customers: Customer[]
  vendors: string[]
  onCreateOrder?: () => void
}

export function OrderCreateDialog({ customers, vendors, onCreateOrder }: OrderCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCreateOrder = () => {
    // TODO: Implement order creation logic
    setIsOpen(false)
    onCreateOrder?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-primary hover:bg-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Sifariş Yarat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Sifariş Yarat</DialogTitle>
          <DialogDescription>Yeni daxil olan və ya çıxan sifariş yaradın</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="orderType">Sifariş Növü</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sifariş növünü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incoming">Daxil olan</SelectItem>
                <SelectItem value="outgoing">Çıxan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Müştəri/Təchizatçı</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Müştəri/təchizatçı seçin" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.fullName}>
                      {customer.fullName}
                    </SelectItem>
                  ))}
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Prioritet</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Prioritet seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Yüksək</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="low">Aşağı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="dueDate">Son Tarix</Label>
            <Input id="dueDate" type="date" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Ləğv et
            </Button>
            <Button onClick={handleCreateOrder} className="bg-purple-primary hover:bg-purple-600">
              Sifariş Yarat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
