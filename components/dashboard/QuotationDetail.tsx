'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { api, ApiError } from '@/lib/api'
import { showToast } from '@/components/ui/Toast'
import type { Quotation } from '@/types/api'

interface QuotationDetailProps {
  quotation: Quotation
  userId: string
}

export function QuotationDetail({ quotation, userId }: QuotationDetailProps) {
  const router = useRouter()
  const q = quotation
  const msgs = q.messages || []
  const atts = q.attachments || []
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const msgEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs.length])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    try {
      await api.quotations.sendMessage(q.id, message.trim())
      setMessage('')
      router.refresh()
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Failed to send', 'error')
    }
    setSending(false)
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>{q.title}</h1>
          <p className="subtitle">
            {q.service?.name} &middot; <Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge>
          </p>
        </div>
        <Link href="/dashboard/quotations" className="btn btn-secondary">
          Back
        </Link>
      </div>

      {atts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 8 }}>Attachments ({atts.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {atts.map((a) => {
              const isImg = a.mimeType?.startsWith('image/')
              return isImg ? (
                <a
                  key={a.id}
                  href={a.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    width: 100,
                    height: 80,
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-hover)',
                  }}
                >
                  <img
                    src={a.fileUrl}
                    alt={a.fileName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </a>
              ) : (
                <a
                  key={a.id}
                  href={a.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--surface-hover)',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  {a.fileName}
                </a>
              )
            })}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {q.description && (
          <DetailCard label="Description" value={q.description} />
        )}
        {q.goals && (
          <DetailCard label="Goals" value={q.goals} />
        )}
        {q.budgetRange && (
          <DetailCard label="Budget Range" value={q.budgetRange} />
        )}
        {q.timeline && (
          <DetailCard label="Timeline" value={q.timeline} />
        )}
        {q.preferredTechnologies?.length > 0 && (
          <DetailCard label="Technologies" value={q.preferredTechnologies.join(', ')} />
        )}
        {q.quotedAmount && (
          <DetailCard label="Quoted Amount" value={formatCurrency(Number(q.quotedAmount))} />
        )}
      </div>

      <h3 style={{ marginBottom: 12 }}>Discussion</h3>
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          marginBottom: 16,
          maxHeight: 400,
          overflowY: 'auto',
        }}
      >
        {msgs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 24 }}>
            No messages yet. Start the conversation below.
          </p>
        ) : (
          msgs.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: 12,
                padding: '10px 14px',
                background: m.senderId === userId ? 'var(--accent)' : 'var(--surface-hover)',
                color: m.senderId === userId ? '#fff' : 'var(--text)',
                borderRadius: 'var(--radius)',
                maxWidth: '80%',
                marginLeft: m.senderId === userId ? 'auto' : '0',
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>
                {m.sender.name} &middot; {formatDateTime(m.createdAt)}
              </div>
              {m.body}
            </div>
          ))
        )}
        <div ref={msgEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </>
  )
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 16,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <strong>{label}</strong>
      <p style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>{value}</p>
    </div>
  )
}
