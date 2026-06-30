'use client'

import { useState, useCallback } from 'react'
import { formatDateTime } from '@/lib/utils'
import { api } from '@/lib/api'
import type { Notification } from '@/types/api'
import { Bell, CheckCheck, Filter } from 'lucide-react'

interface AdminNotificationsProps {
  notifications: Notification[]
  unread: number
}

const TYPE_LABELS: Record<string, string> = {
  quotation_update: 'Quotation Update',
  payment_received: 'Payment Received',
  new_user: 'New User',
  project_update: 'Project Update',
  message_received: 'New Message',
  system: 'System',
}

const TYPE_COLORS: Record<string, string> = {
  quotation_update: '#3B82F6',
  payment_received: '#10B981',
  new_user: '#8B5CF6',
  project_update: '#F59E0B',
  message_received: '#EC4899',
  system: '#6B7280',
}

export function AdminNotifications({ notifications: initial, unread: initialUnread }: AdminNotificationsProps) {
  const [notifications, setNotifications] = useState(initial)
  const [unreadCount, setUnreadCount] = useState(initialUnread)
  const [filter, setFilter] = useState<string>('all')
  const [marking, setMarking] = useState<string | null>(null)

  const types = Array.from(new Set(notifications.map((n) => n.type)))

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter)

  const handleMarkRead = useCallback(async (id: string) => {
    setMarking(id)
    try {
      await api.notifications.markRead([id])
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
    } finally {
      setMarking(null)
    }
  }, [])

  const handleMarkAllRead = useCallback(async () => {
    try {
      await api.notifications.markRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })))
      setUnreadCount(0)
    } catch {
    }
  }, [])

  return (
    <>
      <div className="dash-welcome">
        <div>
          <h2>Notifications</h2>
          <p>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.`
              : 'No unread notifications.'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleMarkAllRead}>
            <CheckCheck size={14} />
            Mark All Read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={14} style={{ color: 'var(--text-secondary)', marginRight: 4 }} />
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 12px', fontSize: 12 }}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            className={`btn ${filter === type ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: 12 }}
            onClick={() => setFilter(type)}
          >
            {TYPE_LABELS[type] || type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="dash-table-wrap">
        {filtered.length === 0 ? (
          <div className="dash-empty">
            <Bell size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>No notifications found</p>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th style={{ width: 24 }}></th>
                <th>Type</th>
                <th>Message</th>
                <th>Date</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => {
                const isUnread = !n.readAt
                const message = (n.payload?.message as string) || (n.payload?.subject as string) || JSON.stringify(n.payload)
                return (
                  <tr key={n.id} style={{ opacity: isUnread ? 1 : 0.65 }}>
                    <td>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: isUnread ? TYPE_COLORS[n.type] || '#3B82F6' : 'transparent',
                          border: isUnread ? 'none' : '1px solid var(--border)',
                        }}
                      />
                    </td>
                    <td>
                      <span
                        className="dash-badge"
                        style={{
                          background: `${TYPE_COLORS[n.type] || '#6B7280'}18`,
                          color: TYPE_COLORS[n.type] || '#6B7280',
                          border: `1px solid ${TYPE_COLORS[n.type] || '#6B7280'}30`,
                        }}
                      >
                        {TYPE_LABELS[n.type] || n.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontWeight: isUnread ? 600 : 400 }}>{message}</strong>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatDateTime(n.createdAt)}</td>
                    <td>
                      {isUnread && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '3px 10px', fontSize: 11 }}
                          onClick={() => handleMarkRead(n.id)}
                          disabled={marking === n.id}
                        >
                          {marking === n.id ? '...' : 'Read'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
