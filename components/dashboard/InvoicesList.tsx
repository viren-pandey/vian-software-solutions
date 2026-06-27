'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice } from '@/types/api'

interface InvoicesListProps {
  invoices: Invoice[]
}

export function InvoicesList({ invoices }: InvoicesListProps) {
  const router = useRouter()

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Invoices</h1>
          <p className="subtitle">View your invoices and payment status</p>
        </div>
      </div>
      {invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          description="Invoices are generated when a quotation is accepted."
        />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const hasPendingPay = inv.payments?.some((p) => p.status === 'pending')
                const displayStatus = hasPendingPay ? 'Pending Verification' : inv.status
                const statusClass = hasPendingPay ? 'pending' : inv.status
                return (
                  <tr key={inv.id}>
                    <td><strong>{inv.invoiceNumber}</strong></td>
                    <td>{inv.quotation?.title || '-'}</td>
                    <td>{formatCurrency(Number(inv.amount))}</td>
                    <td><Badge variant={statusClass}>{displayStatus}</Badge></td>
                    <td>{formatDate(inv.issuedAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                          onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}
                        >
                          View
                        </button>
                        {inv.status === 'issued' && !hasPendingPay && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                            onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}
                          >
                            Pay Now
                          </button>
                        )}
                        {hasPendingPay && (
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                            Awaiting verification
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
