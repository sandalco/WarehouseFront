export interface Notification {
  recipient: string
  content: string
  channel: number
  title: string
  id?: string
  timestamp?: Date
  read?: boolean
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  isConnected: boolean
}