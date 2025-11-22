"use client"

import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/notification"
import { deleteNotification } from "@/lib/api/notification"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification: deleteFromContext } = useNotifications()
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  console.log('🔔 NotificationBell render - notifications:', notifications.length, 'unread:', unreadCount)

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation() // Prevent marking as read
    
    setDeletingId(notificationId)
    try {
      const response = await deleteNotification(notificationId)
      
      if (response.isSuccess) {
        // Remove from local state
        deleteFromContext(notificationId)
        toast({
          title: "Uğurlu",
          description: "Bildiriş silindi",
        })
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "Bildiriş silinə bilmədi",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast({
        title: "Xəta",
        description: "Bildirişi silərkən xəta baş verdi",
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'İndicə'
    if (minutes < 60) return `${minutes} dəqiqə əvvəl`
    if (hours < 24) return `${hours} saat əvvəl`
    return `${days} gün əvvəl`
  }

  const getNotificationIcon = (title: string) => {
    if (title.includes('Stok') || title.includes('Məhsul')) {
      return '📦'
    }
    if (title.includes('Sifariş')) {
      return '🛒'
    }
    if (title.includes('Email')) {
      return '📧'
    }
    return '🔔'
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">Bildirişlər</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} oxunmamış bildiriş
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Hamısını oxunmuş et
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Heç bir bildiriş yoxdur
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.read && "bg-blue-50/50"
                  )}
                  onClick={() => notification.id && markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => handleDeleteNotification(e, notification.id)}
                            disabled={deletingId === notification.id}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.content}
                      </p>
                      {notification.timestamp && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
