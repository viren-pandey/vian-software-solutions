'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { Notification } from '@/types/api'

interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  markRead: (ids?: string[]) => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markRead: async (_ids?: string[]) => {},
})

export function useNotifications() {
  return useContext(NotificationContext)
}

const API_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  : ''

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const esRef = useRef<EventSource | null>(null)
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchInitial = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread || 0)
    } catch {}
  }, [API_URL])

  const connect = useCallback(() => {
    if (esRef.current) return
    const es = new EventSource(`${API_URL}/api/notifications/stream`, { withCredentials: true })

    es.addEventListener('connected', () => {
      fetchInitial()
    })

    es.addEventListener('notification', (e) => {
      try {
        const { notification } = JSON.parse(e.data)
        setNotifications((prev) => [notification, ...prev].slice(0, 50))
        setUnreadCount((prev) => prev + 1)
      } catch {}
    })

    es.onerror = () => {
      es.close()
      esRef.current = null
      reconnectRef.current = setTimeout(connect, 5000)
    }

    esRef.current = es
  }, [API_URL, fetchInitial])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
      if (esRef.current) {
        esRef.current.close()
        esRef.current = null
      }
    }
  }, [connect])

  const markRead = useCallback(async (ids?: string[]) => {
    try {
      await fetch(`${API_URL}/api/notifications/read`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      if (ids) {
        setNotifications((prev) =>
          prev.map((n) => (ids.includes(n.id) ? { ...n, readAt: new Date().toISOString() } : n)),
        )
        setUnreadCount((prev) => Math.max(0, prev - ids.length))
      } else {
        setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })))
        setUnreadCount(0)
      }
    } catch {}
  }, [API_URL])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead }}>
      {children}
    </NotificationContext.Provider>
  )
}
