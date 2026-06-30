'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { useNotifications } from '@/components/notifications/NotificationProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { User, Quotation, Project, Invoice } from '@/types/api'
import { FileText, FolderKanban, DollarSign, CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react'

interface DashboardContentProps {
  user: User
  quotations: Quotation[]
  projects: Project[]
  invoices: Invoice[]
}

export function DashboardContent({ user, quotations, projects, invoices }: DashboardContentProps) {
  const router = useRouter()
  const { notifications } = useNotifications()
  const prevCount = useRef(notifications.length)

  useEffect(() => {
    if (notifications.length > prevCount.current) {
      prevCount.current = notifications.length
      router.refresh()
    }
  }, [notifications.length, router])

  useEffect(() => {
    const onFocus = () => router.refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [router])

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

  const statCards = [
    { value: active.length, label: 'Active Quotations', icon: <FileText size={18} />, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
    { value: activeProjects.length, label: 'Active Projects', icon: <FolderKanban size={18} />, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
    { value: paidCount, label: 'Completed', icon: <CheckCircle size={18} />, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { value: unpaidInvoices.length, label: 'Pending Payments', icon: <DollarSign size={18} />, color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  ]

  return (
    <>
      <div className="dash-welcome">
        <div>
          <h2>Welcome back, {user.name}</h2>
          <p>Track your projects, quotations, and payments at a glance.</p>
        </div>
        <Link href="/dashboard/quotations" className="btn btn-primary">
          Request a Quote
        </Link>
      </div>

      {/* Pending Verification Alert */}
      {pendingInvoices.length > 0 && (
        <div className="dash-card" style={{ marginBottom: 20, borderLeft: '3px solid #D97706' }}>
          <div className="dash-section-header" style={{ marginBottom: 12 }}>
            <h3 style={{ color: '#D97706', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} /> Verification Pending
            </h3>
          </div>
          {pendingInvoices.map((inv) => {
            const pendingPay = inv.payments?.find((p) => p.status === 'pending')
            return (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Invoice {inv.invoiceNumber}</div>
                  <div style={{ fontWeight: 600 }}>{inv.quotation?.title || inv.description || 'Project Payment'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#D97706' }}>{formatCurrency(Number(inv.amount))}</div>
                  <Badge variant="pending">Pending</Badge>
                </div>
              </div>
            )
          })}
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 10 }}>Payment submitted. Awaiting admin verification.</p>
        </div>
      )}

      {/* Pending Payments */}
      {unpaidInvoices.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="dash-section-header">
            <h3 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} /> Pending Payments
            </h3>
          </div>
          {unpaidInvoices.map((inv) => (
            <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className="dash-card" style={{ display: 'block', marginBottom: 10, borderLeft: '3px solid var(--accent)', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Invoice {inv.invoiceNumber}</div>
                  <div style={{ fontWeight: 600 }}>{inv.quotation?.title || inv.description || 'Project Payment'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatCurrency(Number(inv.amount))}</div>
                  <Badge variant="issued">Payment Required</Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="dash-stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="dash-stat-card">
            <div className="stat-top">
              <div className="stat-label">{card.label}</div>
              <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="dash-card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Ready to start a project?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
          Tell us about your requirements and we&apos;ll get back to you with a tailored quote within 1-2 business days.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/dashboard/quotations" className="btn btn-primary">
            Request a Quote
          </Link>
          <Link href="/dashboard/support" className="btn btn-secondary">
            Contact Support
          </Link>
        </div>
      </div>

      {/* Quotation History */}
      <div className="dash-section-header">
        <h3>Quotation History</h3>
        <Link href="/dashboard/quotations" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>View All</Link>
      </div>

      {quotations.length === 0 ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: 40, marginBottom: 20 }}>
          <FileText size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No quotations yet.</p>
          <Link href="/dashboard/quotations" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
            Request a Quote
          </Link>
        </div>
      ) : (
        <div className="dash-table-wrap" style={{ marginBottom: 20 }}>
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
                <tr key={q.id} className="clickable" onClick={() => window.location.href = `/dashboard/quotations/${q.id}`}>
                  <td><strong>{q.title}</strong></td>
                  <td>{q.service?.name || '-'}</td>
                  <td>{q.quotedAmount != null ? formatCurrency(Number(q.quotedAmount)) : '-'}</td>
                  <td><Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge></td>
                  <td>{formatDate(q.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Past Records */}
      {pastRecords.length > 0 && (
        <>
          <div className="dash-section-header" style={{ marginTop: 8 }}>
            <h3>Past Records</h3>
            <Link href="/dashboard/quotations" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>View All</Link>
          </div>
          <div className="dash-table-wrap" style={{ opacity: 0.85, marginBottom: 20 }}>
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
                  <tr key={q.id} className="clickable" onClick={() => window.location.href = `/dashboard/quotations/${q.id}`}>
                    <td><strong>{q.title}</strong></td>
                    <td>{q.service?.name || '-'}</td>
                  <td>{q.quotedAmount != null ? formatCurrency(Number(q.quotedAmount)) : '-'}</td>
                    <td><Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge></td>
                    <td>{formatDate(q.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <>
          <div className="dash-section-header">
            <h3>Completed Projects</h3>
          </div>
          <div className="dash-table-wrap" style={{ opacity: 0.85, marginBottom: 20 }}>
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
