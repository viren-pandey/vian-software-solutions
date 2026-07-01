'use client'

import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Payment, PaymentRequest } from '@/types/api'
import { CreditCard, FileText } from 'lucide-react'

interface PaymentsListProps {
  payments: Payment[]
  paymentRequests: PaymentRequest[]
}

export function PaymentsList({ payments, paymentRequests }: PaymentsListProps) {
  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Payments</h1>
          <p className="subtitle">View your payment history and pending payment requests</p>
        </div>
      </div>

      {paymentRequests.length > 0 && (
        <>
          <h3 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} /> Pending Payment Requests
          </h3>
          <div className="overflow-x-auto border border-[var(--border)] rounded-lg" style={{ marginBottom: 28 }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentRequests.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.description}</strong></td>
                    <td>{formatCurrency(Number(r.amount))}</td>
                    <td><Badge variant={r.status === 'paid' ? 'success' : r.status === 'cancelled' ? 'error' : 'pending'}>{r.status}</Badge></td>
                    <td>{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h3 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileText size={18} /> Payment History
      </h3>
      {payments.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="Payments will appear here once you make a payment."
        />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.paytmTransactionId}</strong></td>
                  <td>{p.invoice?.quotation?.title || '-'}</td>
                  <td>{formatCurrency(Number(p.amount))}</td>
                  <td><Badge variant={p.status}>{p.status}</Badge></td>
                  <td>{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}