'use client'

import Link from 'next/link'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { User, Quotation, Project, Invoice } from '@/types/api'

interface DashboardContentProps {
  user: User
  quotations: Quotation[]
  projects: Project[]
  invoices: Invoice[]
}

export function DashboardContent({ user, quotations, projects, invoices }: DashboardContentProps) {
  const active = quotations.filter((q) => !['REJECTED', 'CANCELLED', 'PAID'].includes(q.status))
  const pastRecords = quotations.filter((q) => ['REJECTED', 'CANCELLED', 'PAID'].includes(q.status))
  const activeProjects = projects.filter((p) => p.status === 'active')
  const completedProjects = projects.filter((p) => p.status === 'completed')
  const paidCount = quotations.filter((q) => q.status === 'PAID').length
  const unpaidInvoices = invoices.filter(
    (inv) => inv.status === 'issued' && !inv.payments?.some((p) => p.status === 'pending'),
  )
  const pendingInvoices = invoices.filter(
    (inv) => inv.payments?.some((p) => p.status === 'pending'),
  )

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back, {user.name}</p>
        </div>
      </div>

      {pendingInvoices.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12, color: '#F59E0B' }}>Verification Pending</h3>
          {pendingInvoices.map((inv) => {
            const pendingPay = inv.payments?.find((p) => p.status === 'pending')
            return (
              <div
                key={inv.id}
                style={{
                  border: '2px solid #F59E0B',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  background: 'var(--surface)',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      Invoice {inv.invoiceNumber}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {inv.quotation?.title || 'Project Payment'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#F59E0B' }}>
                      {formatCurrency(Number(inv.amount))}
                    </div>
                    <Badge variant="pending" className="mt-1">Verification Pending</Badge>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '1px solid var(--border-light)',
                    fontSize: 13,
                    color: 'var(--text-tertiary)',
                  }}
                >
                  Payment submitted. Awaiting admin verification. Typically verified within 24 hours.
                </div>
              </div>
            )
          })}
        </div>
      )}

      {unpaidInvoices.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12, color: 'var(--accent)' }}>Pending Payments</h3>
          {unpaidInvoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/dashboard/invoices/${inv.id}`}
              style={{
                display: 'block',
                cursor: 'pointer',
                border: '2px solid var(--accent)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                background: 'linear-gradient(135deg,var(--surface),var(--surface-hover))',
                marginBottom: 12,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
                    Invoice {inv.invoiceNumber}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {inv.quotation?.title || 'Project Payment'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>
                    {formatCurrency(Number(inv.amount))}
                  </div>
                  <Badge variant="issued" className="mt-1">Payment Required</Badge>
                </div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: '1px solid var(--border-light)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                }}
              >
                Click to view detailed breakdown & pay &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="stat-cards">
        <StatCard value={active.length} label="Active Quotations" />
        <StatCard value={activeProjects.length} label="Active Projects" />
        <StatCard value={paidCount} label="Paid" />
      </div>

      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          background: 'var(--surface)',
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Ready to start a project?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
          Tell us about your requirements and we&apos;ll get back to you with a tailored quote within 1-2 business days.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/dashboard/quotations" className="btn btn-primary">
            Request a Quote
          </Link>
          <Link href="/dashboard/support" className="btn btn-secondary">
            Contact Support
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3>Quotation History</h3>
        <Link href="/dashboard/quotations" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>View All</Link>
      </div>
      {quotations.length === 0 ? (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 40, textAlign: 'center', marginBottom: 24 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No quotations yet.</p>
          <Link href="/dashboard/quotations" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
            Request a Quote
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg" style={{ marginBottom: 24 }}>
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
              {quotations.slice(0, 5).map((q) => (
                <tr key={q.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/dashboard/quotations/${q.id}`}>
                  <td><strong>{q.title}</strong></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{q.service?.name || '-'}</td>
                  <td>{q.quotedAmount ? formatCurrency(Number(q.quotedAmount)) : '-'}</td>
                  <td><Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge></td>
                  <td>{formatDate(q.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pastRecords.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 24 }}>
            <h3>Past Records</h3>
            <Link href="/dashboard/quotations" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>View All</Link>
          </div>
          <div className="overflow-x-auto border border-[var(--border)] rounded-lg" style={{ marginBottom: 24, opacity: 0.85 }}>
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
                {pastRecords.slice(0, 5).map((q) => (
                  <tr key={q.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/dashboard/quotations/${q.id}`}>
                    <td><strong>{q.title}</strong></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{q.service?.name || '-'}</td>
                    <td>{q.quotedAmount ? formatCurrency(Number(q.quotedAmount)) : '-'}</td>
                    <td><Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge></td>
                    <td>{formatDate(q.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {completedProjects.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3>Completed Projects</h3>
          </div>
          <div className="overflow-x-auto border border-[var(--border)] rounded-lg" style={{ marginBottom: 24, opacity: 0.85 }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {completedProjects.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.quotation?.title || 'Project'}</strong></td>
                    <td><Badge variant={p.status}>{p.status}</Badge></td>
                    <td>{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
