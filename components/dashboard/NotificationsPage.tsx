'use client'

import { useRouter } from 'next/navigation'
import { useNotifications } from '@/components/notifications/NotificationProvider'
import { formatDateTime } from '@/lib/utils'
import type { Notification } from '@/types/api'

interface NotificationsPageProps {
  notifications: Notification[]
  unread: number
}

function getNotificationRoute(n: Notification): string | null {
  const p = n.payload as Record<string, any>
  switch (n.type) {
    case 'quotation_submitted':
    case 'quotation_accepted':
    case 'quotation_updated':
    case 'new_message':
      return p.quotationId ? `/dashboard/quotations/${p.quotationId}` : null
    case 'invoice_created':
    case 'payment_pending':
    case 'payment_verified':
    case 'payment_rejected':
      return p.invoiceId ? `/dashboard/invoices/${p.invoiceId}` : null
    case 'payment_request':
      return '/dashboard/payments'
    case 'ticket_updated':
      return '/dashboard/support'
    default:
      return null
  }
}

export function NotificationsPage({ notifications: initial }: NotificationsPageProps) {
  const router = useRouter()
  const { notifications, unreadCount, markRead } = useNotifications()
  const all = notifications.length > 0 ? notifications : initial
  const hasUnread = unreadCount > 0 || all.some((n) => !n.readAt)

  const handleClick = async (n: Notification) => {
    const route = getNotificationRoute(n)
    if (!n.readAt) await markRead([n.id])
    if (route) router.push(route)
  }

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
            {all.map((n) => {
              const route = getNotificationRoute(n)
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border-light)',
                    background: n.readAt ? 'transparent' : 'var(--surface-hover)',
                    cursor: route ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (route) (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = n.readAt ? 'transparent' : 'var(--surface-hover)' }}
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
              )
            })}
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
