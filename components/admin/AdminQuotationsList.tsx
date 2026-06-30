'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { api, ApiError } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import { QUOTATION_TRANSITIONS } from '@/types/api'
import type { Quotation, QuotationStatus } from '@/types/api'

interface AdminQuotationsListProps {
  quotations: Quotation[]
}

export function AdminQuotationsList({ quotations }: AdminQuotationsListProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | 'ALL'>('ALL')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = statusFilter === 'ALL'
    ? quotations
    : quotations.filter((q) => q.status === statusFilter)

  const handleBulkStatus = async (status: QuotationStatus) => {
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          api.admin.quotations.update(id, { status })
        ),
      )
      showToast(`Updated ${selected.size} quotations`, 'success')
      setSelected(new Set())
      router.refresh()
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Bulk update failed', 'error')
    }
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Quotations</h1>
          <p className="subtitle">Manage all client quotation requests</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          className={`btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 12px', fontSize: 12 }}
          onClick={() => setStatusFilter('ALL')}
        >
          All
        </button>
        {(['SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'PAYMENT_REQUESTED', 'INVOICED', 'PAID', 'REJECTED', 'CANCELLED'] as QuotationStatus[]).map((s) => (
          <button
            key={s}
            className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: 12 }}
            onClick={() => setStatusFilter(s)}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {selected.size > 0 && (
        <div style={{ marginBottom: 12, padding: 8, background: 'var(--surface-hover)', borderRadius: 'var(--radius)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13 }}>{selected.size} selected</span>
          {(['UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'PAYMENT_REQUESTED', 'CANCELLED'] as QuotationStatus[]).map((s) => (
            <button
              key={s}
              className="btn btn-secondary"
              style={{ padding: '2px 8px', fontSize: 11 }}
              onClick={() => handleBulkStatus(s)}
            >
              Set {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="No quotations yet" description="Quotations will appear when clients submit requests." />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) setSelected(new Set(filtered.map((q) => q.id)))
                      else setSelected(new Set())
                    }}
                    checked={selected.size === filtered.length && filtered.length > 0}
                  />
                </th>
                <th>Client</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(q.id)}
                      onChange={(e) => {
                        const next = new Set(selected)
                        if (e.target.checked) next.add(q.id)
                        else next.delete(q.id)
                        setSelected(next)
                      }}
                    />
                  </td>
                  <td>{q.user?.name || 'Unknown'}</td>
                  <td>
                    <strong>
                      <Link
                        href={`/admin/quotations/${q.id}`}
                        style={{ color: 'var(--accent)', textDecoration: 'none' }}
                      >
                        {q.title}
                      </Link>
                    </strong>
                    {q.service && (
                      <><br /><span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{q.service.name}</span></>
                    )}
                  </td>
                  <td>{q.quotedAmount != null ? formatCurrency(Number(q.quotedAmount)) : '-'}</td>
                  <td><Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge></td>
                  <td>{formatDate(q.createdAt)}</td>
                  <td>
                    <EditQuotationButton
                      quotation={q}
                      onDone={() => { setEditingId(null); router.refresh() }}
                    />
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

function EditQuotationButton({ quotation, onDone }: { quotation: Quotation; onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(quotation.status)
  const [amount, setAmount] = useState(quotation.quotedAmount?.toString() || '')
  const [validity, setValidity] = useState(quotation.quoteValidityDays?.toString() || '15')
  const [updating, setUpdating] = useState(false)

  const validNextStatuses = QUOTATION_TRANSITIONS[quotation.status as QuotationStatus] || []

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await api.admin.quotations.update(quotation.id, {
        status,
        quotedAmount: amount ? parseFloat(amount) : undefined,
        quoteValidityDays: validity ? parseInt(validity) : undefined,
      })
      showToast('Quotation updated successfully', 'success')
      setOpen(false)
      onDone()
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Update failed', 'error')
    }
    setUpdating(false)
  }

  if (!open) {
    return (
      <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => setOpen(true)}>
        Edit
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as QuotationStatus)}
        style={{ padding: '2px 6px', fontSize: 11, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text)' }}
      >
        <option value={quotation.status}>{quotation.status.replace(/_/g, ' ')} (current)</option>
        {validNextStatuses.map((s) => (
          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
        ))}
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        style={{ width: 80, padding: '2px 6px', fontSize: 11, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text)' }}
      />
      <input
        type="number"
        value={validity}
        onChange={(e) => setValidity(e.target.value)}
        placeholder="Days"
        style={{ width: 50, padding: '2px 6px', fontSize: 11, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text)' }}
      />
      <button className="btn btn-primary" style={{ padding: '2px 8px', fontSize: 11 }} onClick={handleUpdate} disabled={updating}>
        {updating ? '...' : 'Save'}
      </button>
      <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => setOpen(false)}>
        X
      </button>
    </div>
  )
}
