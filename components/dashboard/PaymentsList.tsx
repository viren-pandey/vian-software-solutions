'use client'

import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Payment } from '@/types/api'

interface PaymentsListProps {
  payments: Payment[]
}

export function PaymentsList({ payments }: PaymentsListProps) {
  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Payments</h1>
          <p className="subtitle">View your payment history</p>
        </div>
      </div>
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
