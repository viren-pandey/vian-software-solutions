'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { User, Quotation, AdminStats } from '@/types/api'
import { Users, FileText, FolderKanban, DollarSign, Clock } from 'lucide-react'

interface AdminDashboardProps {
  stats: AdminStats
  users: User[]
  quotations: Quotation[]
  user: User
}

export function AdminDashboard({ stats, users, quotations, user }: AdminDashboardProps) {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('all')
  const pastRecords = quotations.filter((q) => ['PAID', 'REJECTED', 'CANCELLED'].includes(q.status))
  const pendingQuotations = quotations.filter((q) => q.status === 'SUBMITTED' || q.status === 'UNDER_REVIEW')
  const activeProjects = stats.projects

  const statCards = [
    { value: stats.quotations, label: 'Total Quotations', icon: <FileText size={18} />, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
    { value: stats.users, label: 'Total Users', icon: <Users size={18} />, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { value: activeProjects, label: 'Projects', icon: <FolderKanban size={18} />, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
    { value: formatCurrency(stats.revenue), label: 'Total Revenue', icon: <DollarSign size={18} />, color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
    { value: pendingQuotations.length, label: 'Pending Review', icon: <Clock size={18} />, color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
  ]

  return (
    <>
      <div className="dash-welcome">
        <div>
          <h2>Welcome back, {user.name}</h2>
          <p>Here&apos;s what&apos;s happening with your business today.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dash-badge dash-badge-info">{user.role}</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user.email}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['today', '7d', '30d', 'all'] as const).map((range) => (
          <button
            key={range}
            className={`btn ${dateRange === range ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: 12 }}
            onClick={() => setDateRange(range)}
          >
            {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
          </button>
        ))}
      </div>

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

      <div className="dash-section-header">
        <h3>Recent Users</h3>
        <Link href="/admin/users" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>View All</Link>
      </div>
      <div className="dash-table-wrap" style={{ marginBottom: 28 }}>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={4}><div className="dash-empty"><p>No users yet</p></div></td></tr>
            ) : (
              users.slice(0, 8).map((u) => (
                <tr key={u.id} className="clickable" onClick={() => window.location.href = `/admin/users`}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><Badge variant={u.role}>{u.role}</Badge></td>
                  <td>{formatDate(u.createdAt || '')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="dash-section-header">
        <h3>Recent Quotations</h3>
        <Link href="/admin/quotations" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>View All</Link>
      </div>
      <div className="dash-table-wrap" style={{ marginBottom: 28 }}>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Title</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {quotations.length === 0 ? (
              <tr><td colSpan={6}><div className="dash-empty"><p>No quotations yet</p></div></td></tr>
            ) : (
              quotations.slice(0, 8).map((q) => (
                <tr key={q.id} className="clickable" onClick={() => window.location.href = `/admin/quotations/${q.id}`}>
                  <td>{q.user?.name || 'Unknown'}</td>
                  <td><strong>{q.title}</strong></td>
                  <td>{q.service?.name || '-'}</td>
                  <td>{q.quotedAmount != null ? formatCurrency(Number(q.quotedAmount)) : '-'}</td>
                  <td><Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge></td>
                  <td>{formatDate(q.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pastRecords.length > 0 && (
        <>
          <div className="dash-section-header">
            <h3>Past Records</h3>
            <Link href="/admin/quotations" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>View All</Link>
          </div>
          <div className="dash-table-wrap" style={{ opacity: 0.85 }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Title</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {pastRecords.slice(0, 8).map((q) => (
                  <tr key={q.id} className="clickable" onClick={() => window.location.href = `/admin/quotations/${q.id}`}>
                    <td>{q.user?.name || 'Unknown'}</td>
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
    </>
  )
}
