export interface Notification {
  id: string
  recipient: string
  content: string
  dateTime: string
  channel: number
  title: string
  timestamp?: Date
  read?: boolean
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  deleteNotification: (id: string) => void
  isConnected: boolean
}