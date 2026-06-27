'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { api, ApiError } from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import type { Payment } from '@/types/api'

interface AdminPaymentsListProps {
  payments: Payment[]
}

export function AdminPaymentsList({ payments }: AdminPaymentsListProps) {
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const handleVerify = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.admin.payments.verify(id, action, action === 'reject' ? rejectReason : undefined)
      showToast(action === 'approve' ? 'Payment verified successfully' : 'Payment rejected', 'success')
      setSelectedPayment(null)
      setRejectReason('')
      router.refresh()
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Verification failed', 'error')
    }
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Payments</h1>
          <p className="subtitle">All payment transactions</p>
        </div>
      </div>
      {payments.length === 0 ? (
        <EmptyState title="No payments yet" description="Payments will appear when clients complete transactions." />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.user?.name || 'Unknown'}</td>
                  <td><strong>{p.paytmTransactionId}</strong></td>
                  <td>{formatCurrency(Number(p.amount))}</td>
                  <td><Badge variant={p.status}>{p.status === 'pending' ? 'Pending Verification' : p.status}</Badge></td>
                  <td>{formatDateTime(p.createdAt)}</td>
                  <td>
                    {p.status === 'pending' ? (
                      <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setSelectedPayment(p)}>
                        Review
                      </button>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPayment && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setSelectedPayment(null)}
        >
          <div
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              padding: 32, maxWidth: 480, width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 16 }}>Payment Details</h3>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Client</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{selectedPayment.user?.name || 'Unknown'}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Transaction ID</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{selectedPayment.paytmTransactionId}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Amount</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{formatCurrency(Number(selectedPayment.amount))}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Date</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{formatDateTime(selectedPayment.createdAt)}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Invoice</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{selectedPayment.invoice?.invoiceNumber || '-'}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Project</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{selectedPayment.invoice?.quotation?.title || '-'}</td></tr>
              </tbody>
            </table>
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Reject Reason (optional)</label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UTR mismatch"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => handleVerify(selectedPayment.id, 'approve')}>Verify</button>
              <button className="btn btn-secondary" style={{ color: 'var(--error)' }} onClick={() => handleVerify(selectedPayment.id, 'reject')}>Reject</button>
              <button className="btn btn-secondary" onClick={() => setSelectedPayment(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
