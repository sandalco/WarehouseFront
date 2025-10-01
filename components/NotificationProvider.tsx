"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import * as signalR from '@microsoft/signalr'
import type { Notification as NotificationType, NotificationContextType } from '@/types/notification'
import { useToast } from '@/hooks/use-toast'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length

  // Initialize SignalR connection
  useEffect(() => {
    const initializeConnection = async () => {
      // Get JWT token from localStorage or your auth context
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      
      if (!token) {
        console.warn('JWT token not found, cannot connect to notification hub')
        return
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
      const hubUrl = `${baseUrl}/hubs/notifications`

      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          transport: signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect()
        .build()

      try {
        // Set up event handlers before starting connection
        hubConnection.on('ReceiveNotification', (payload: NotificationType) => {
          console.log('RECV Notification:', payload)
          
          // Create notification with unique ID and timestamp
          const notification: NotificationType = {
            ...payload,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false
          }

          // Add to notifications list
          setNotifications(prev => [notification, ...prev])

          // Show toast
          toast({
            title: notification.title,
            description: notification.content,
            duration: 5000,
          })

          // Show browser notification if permission granted
          if (Notification && Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.content,
              icon: '/logo.png', // Add your app icon
            })
          }
        })

        // Connection state handlers
        hubConnection.onreconnecting(() => {
          console.log('SignalR Reconnecting...')
          setIsConnected(false)
        })

        hubConnection.onreconnected(() => {
          console.log('SignalR Reconnected')
          setIsConnected(true)
        })

        hubConnection.onclose(() => {
          console.log('SignalR Disconnected')
          setIsConnected(false)
        })

        // Start connection
        await hubConnection.start()
        console.log('SignalR Connected')
        setIsConnected(true)
        setConnection(hubConnection)

      } catch (error) {
        console.error('SignalR connection error:', error)
      }
    }

    initializeConnection()

    // Request browser notification permission
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Cleanup on unmount
    return () => {
      if (connection) {
        connection.stop()
      }
    }
  }, [])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isConnected,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}