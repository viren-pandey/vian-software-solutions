'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { User, Quotation, AdminStats } from '@/types/api'

interface AdminDashboardProps {
  stats: AdminStats
  users: User[]
  quotations: Quotation[]
  user: User
}

export function AdminDashboard({ stats, users, quotations, user }: AdminDashboardProps) {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('all')

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Welcome back, {user.name}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
            {user.role}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user.email}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard value={stats.quotations} label="Quotations" />
        <StatCard value={stats.users} label="Users" />
        <StatCard value={stats.projects} label="Projects" />
        <StatCard value={formatCurrency(stats.revenue)} label="Revenue" />
      </div>

      <h3 style={{ marginBottom: 12 }}>Recent Users</h3>
      <div className="overflow-x-auto border border-[var(--border)] rounded-lg" style={{ marginBottom: 32 }}>
        <table className="admin-table">
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
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No users yet</td></tr>
            ) : (
              users.slice(0, 10).map((u) => (
                <tr key={u.id}>
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

      <h3 style={{ marginBottom: 12 }}>Recent Quotations</h3>
      <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {quotations.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No quotations yet</td></tr>
            ) : (
              quotations.slice(0, 10).map((q) => (
                <tr key={q.id}>
                  <td>{q.user?.name || 'Unknown'}</td>
                  <td><strong>{q.title}</strong></td>
                  <td><Badge variant={q.status}>{q.status.replace(/_/g, ' ')}</Badge></td>
                  <td>{formatDate(q.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
