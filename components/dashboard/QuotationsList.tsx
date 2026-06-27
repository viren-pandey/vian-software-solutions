'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { api, ApiError } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import type { Quotation, Service } from '@/types/api'

interface QuotationsListProps {
  quotations: Quotation[]
  services: Service[]
}

export function QuotationsList({ quotations, services }: QuotationsListProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (showForm) {
    return (
      <QuotationForm
        services={services}
        onCancel={() => setShowForm(false)}
        onSubmit={async (data) => {
          setSubmitting(true)
          try {
            await api.quotations.create(data)
            showToast('Quotation submitted successfully!', 'success')
            setShowForm(false)
            router.refresh()
          } catch (e) {
            showToast(e instanceof ApiError ? e.message : 'Failed to submit', 'error')
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
          <h1>Quotations</h1>
          <p className="subtitle">View and manage your quotation requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          New Request
        </button>
      </div>
      {quotations.length === 0 ? (
        <EmptyState
          title="No quotations yet"
          description="Submit your first project requirement to get a quote."
        />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr
                  key={q.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/dashboard/quotations/${q.id}`)}
                >
                  <td><strong>{q.title}</strong></td>
                  <td>{q.service?.name || '-'}</td>
                  <td>{q.quotedAmount ? formatCurrency(Number(q.quotedAmount)) : '-'}</td>
                  <td><Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge></td>
                  <td>{formatDate(q.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

function QuotationForm({
  services,
  onCancel,
  onSubmit,
  submitting,
}: {
  services: Service[]
  onCancel: () => void
  onSubmit: (data: Parameters<typeof api.quotations.create>[0]) => void
  submitting: boolean
}) {
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const attachmentPromises = files.map(async (f) => {
      const b64 = await new Promise<string>((resolve) => {
        const r = new FileReader()
        r.onload = () => resolve((r.result as string).split(',')[1])
        r.readAsDataURL(f)
      })
      return { name: f.name, type: f.type, size: f.size, data: b64 }
    })

    Promise.all(attachmentPromises).then((attachments) => {
      onSubmit({
        serviceId: formData.get('serviceId') as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        goals: (formData.get('goals') as string) || undefined,
        budgetRange: (formData.get('budgetRange') as string) || undefined,
        timeline: (formData.get('timeline') as string) || undefined,
        preferredTechnologies: ((formData.get('preferredTechnologies') as string) || '')
          .split(',').map((s) => s.trim()).filter(Boolean),
        referenceLinks: ((formData.get('referenceLinks') as string) || '')
          .split(',').map((s) => s.trim()).filter(Boolean),
        notes: (formData.get('notes') as string) || undefined,
        attachments,
      })
    })
  }

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>New Quotation Request</h1>
          <p className="subtitle">Tell us about your project requirements</p>
        </div>
      </div>
      <form className="dash-form" onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div className="form-group">
          <label>Service Type</label>
          <select name="serviceId" required>
            <option value="">Select a service...</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Project Title</label>
          <input type="text" name="title" required placeholder="e.g. E-commerce Website" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows={4} required placeholder="Describe your project in detail..." />
        </div>
        <div className="form-group">
          <label>Goals (optional)</label>
          <textarea name="goals" rows={2} placeholder="What do you want to achieve?" />
        </div>
        <div className="form-group">
          <label>Budget Range (optional)</label>
          <input type="text" name="budgetRange" placeholder="e.g. ₹50,000 - ₹1,00,000" />
        </div>
        <div className="form-group">
          <label>Timeline (optional)</label>
          <input type="text" name="timeline" placeholder="e.g. 4-6 weeks" />
        </div>
        <div className="form-group">
          <label>Preferred Technologies (optional)</label>
          <input type="text" name="preferredTechnologies" placeholder="e.g. React, Node.js, PostgreSQL" />
        </div>
        <div className="form-group">
          <label>Reference Links (optional)</label>
          <input type="text" name="referenceLinks" placeholder="e.g. https://example.com" />
        </div>
        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea name="notes" rows={2} placeholder="Any additional information" />
        </div>
        <div className="form-group">
          <label>Attachments (optional)</label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
            style={{ padding: 8, fontSize: 13 }}
          />
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Max 5 files, 5MB each. Supported: images, PDF, DOC, TXT, ZIP
          </div>
          {files.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {files.map((f, i) => (
                <span
                  key={i}
                  style={{
                    padding: '4px 10px',
                    background: 'var(--surface-hover)',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    fontSize: 12,
                  }}
                >
                  {f.name} ({(f.size / 1024).toFixed(0)}KB)
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
