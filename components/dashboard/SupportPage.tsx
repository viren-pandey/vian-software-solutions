'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { api, ApiError } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import type { SupportTicket } from '@/types/api'

interface SupportPageProps {
  tickets: SupportTicket[]
}

export function SupportPage({ tickets }: SupportPageProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (showForm) {
    return (
      <TicketForm
        onCancel={() => setShowForm(false)}
        onSubmit={async (subject) => {
          setSubmitting(true)
          try {
            await api.support.create(subject)
            showToast('Ticket created successfully!', 'success')
            setShowForm(false)
            router.refresh()
          } catch (e) {
            showToast(e instanceof ApiError ? e.message : 'Failed to create ticket', 'error')
          }
          setSubmitting(false)
        }}
        submitting={submitting}
      />
    )
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Support</h1>
          <p className="subtitle">Contact support and view your tickets</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          New Ticket
        </button>
      </div>
      {tickets.length === 0 ? (
        <EmptyState
          title="No support tickets"
          description="Create a ticket and we'll get back to you."
        />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.subject}</strong></td>
                  <td><Badge variant={t.status}>{t.status}</Badge></td>
                  <td>{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

function TicketForm({
  onCancel,
  onSubmit,
  submitting,
}: {
  onCancel: () => void
  onSubmit: (subject: string) => void
  submitting: boolean
}) {
  const [subject, setSubject] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) return
    onSubmit(subject.trim())
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>New Support Ticket</h1>
          <p className="subtitle">How can we help you?</p>
        </div>
      </div>
      <form className="dash-form" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Brief description of your issue"
          />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
