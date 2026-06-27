'use client'

import { useNotifications } from '@/components/notifications/NotificationProvider'
import { formatDateTime } from '@/lib/utils'
import type { Notification } from '@/types/api'

interface NotificationsPageProps {
  notifications: Notification[]
  unread: number
}

export function NotificationsPage({ notifications: initial }: NotificationsPageProps) {
  const { notifications, unreadCount, markRead } = useNotifications()
  const all = notifications.length > 0 ? notifications : initial
  const hasUnread = unreadCount > 0 || all.some((n) => !n.readAt)

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Notifications</h1>
          <p className="subtitle">Stay updated on your quotations, invoices, and payments</p>
        </div>
      </div>
      {all.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-[var(--border)] rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No notifications</h3>
          <p className="text-sm text-[var(--text-secondary)]">You&apos;re all caught up!</p>
        </div>
      ) : (
        <>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {all.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--border-light)',
                  background: n.readAt ? 'transparent' : 'var(--surface-hover)',
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: n.readAt ? 400 : 600,
                  }}
                >
                  {(n.payload as any)?.message || n.type}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {formatDateTime(n.createdAt)}
                </div>
              </div>
            ))}
          </div>
          {hasUnread && (
            <button
              className="btn btn-secondary"
              style={{ marginTop: 16 }}
              onClick={() => markRead()}
            >
              Mark all as read
            </button>
          )}
        </>
      )}
    </>
  )
}
