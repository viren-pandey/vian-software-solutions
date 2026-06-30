'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { api, ApiError } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import type { SupportTicket, TicketStatus } from '@/types/api'

interface AdminSupportTicketsProps {
  tickets: SupportTicket[]
}

export function AdminSupportTickets({ tickets }: AdminSupportTicketsProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL')

  const filtered = statusFilter === 'ALL'
    ? tickets
    : tickets.filter((t) => t.status === statusFilter)

  const handleStatusUpdate = async (id: string, status: TicketStatus) => {
    try {
      await api.admin.support.update(id, { status })
      showToast(`Ticket updated to ${status}`, 'success')
      router.refresh()
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Update failed', 'error')
    }
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Support Tickets</h1>
          <p className="subtitle">Manage all client support tickets</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          className={`btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 12px', fontSize: 12 }}
          onClick={() => setStatusFilter('ALL')}
        >
          All ({tickets.length})
        </button>
        {(['open', 'pending', 'resolved', 'closed'] as TicketStatus[]).map((s) => {
          const count = tickets.filter((t) => t.status === s).length
          return (
            <button
              key={s}
              className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 12px', fontSize: 12 }}
              onClick={() => setStatusFilter(s)}
            >
              {s} ({count})
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No tickets found" description="Support tickets will appear here when clients submit them." />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.user?.name || 'Unknown'}</strong>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{t.user?.email}</div>
                  </td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <strong>{t.subject}</strong>
                  </td>
                  <td><Badge variant={t.status}>{t.status}</Badge></td>
                  <td style={{ fontSize: 12 }}>{formatDateTime(t.createdAt)}</td>
                  <td>
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusUpdate(t.id, e.target.value as TicketStatus)}
                      style={{
                        padding: '4px 8px', fontSize: 12,
                        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                        background: 'var(--surface)', color: 'var(--text)',
                      }}
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
