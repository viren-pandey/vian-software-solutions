'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import type { AdminStats } from '@/types/api'
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

interface AdminAnalyticsProps {
  stats: AdminStats
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const STATUSES = [
  { label: 'Submitted', value: 'SUBMITTED', color: '#3B82F6' },
  { label: 'Under Review', value: 'UNDER_REVIEW', color: '#F59E0B' },
  { label: 'Quoted', value: 'QUOTED', color: '#8B5CF6' },
  { label: 'Accepted', value: 'ACCEPTED', color: '#10B981' },
  { label: 'Paid', value: 'PAID', color: '#059669' },
  { label: 'Rejected', value: 'REJECTED', color: '#EF4444' },
  { label: 'Cancelled', value: 'CANCELLED', color: '#6B7280' },
]

function generateMockMonthlyRevenue(base: number): { month: string; revenue: number }[] {
  return MONTHS.map((month, i) => ({
    month,
    revenue: Math.round(base * (0.5 + Math.random() * 1) * (1 + i * 0.05)),
  }))
}

function generateMockStatusBreakdown(total: number): { label: string; value: number; color: string }[] {
  const weights = [0.25, 0.2, 0.15, 0.12, 0.1, 0.1, 0.08]
  return STATUSES.map((s, i) => ({
    ...s,
    value: Math.round(total * weights[i]),
  }))
}

const RECENT_ACTIVITIES = [
  { action: 'New user registered', time: '2 min ago', type: 'user' },
  { action: 'Quotation #Q-1024 was paid', time: '15 min ago', type: 'payment' },
  { action: 'New project started', time: '1 hr ago', type: 'project' },
  { action: 'Quotation #Q-1021 status changed to UNDER_REVIEW', time: '2 hr ago', type: 'quotation' },
  { action: 'Payment of ₹45,000 verified', time: '3 hr ago', type: 'payment' },
  { action: 'New blog post published', time: '5 hr ago', type: 'blog' },
  { action: 'User requested quotation revision', time: '1 day ago', type: 'quotation' },
  { action: 'Invoice #INV-2048 issued', time: '1 day ago', type: 'invoice' },
]

export function AdminAnalytics({ stats }: AdminAnalyticsProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const monthlyRevenue = generateMockMonthlyRevenue(stats.revenue > 0 ? stats.revenue / 12 : 50000)
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1)
  const statusBreakdown = generateMockStatusBreakdown(stats.quotations)
  const maxStatus = Math.max(...statusBreakdown.map((s) => s.value), 1)
  const conversionRate = stats.quotations > 0 ? ((stats.revenue > 0 ? 1 : 0) * 100).toFixed(1) : '0.0'

  const statCards = [
    { value: stats.users, label: 'Total Users', icon: <Users size={20} />, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { value: stats.quotations, label: 'Total Quotations', icon: <BarChart3 size={20} />, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
    { value: formatCurrency(stats.revenue), label: 'Total Revenue', icon: <DollarSign size={20} />, color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
    { value: `${conversionRate}%`, label: 'Conversion Rate', icon: <TrendingUp size={20} />, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  ]

  return (
    <>
      <div className="dash-welcome">
        <div>
          <h2>Analytics</h2>
          <p>Track your business performance and metrics.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['7d', '30d', '90d', 'all'] as const).map((range) => (
          <button
            key={range}
            className={`btn ${dateRange === range ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: 12 }}
            onClick={() => setDateRange(range)}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
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

      <div className="dash-grid-2">
        <div className="dash-card">
          <div className="dash-section-header">
            <h3>Revenue Overview</h3>
            <DollarSign size={16} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, padding: '16px 0' }}>
            {monthlyRevenue.map((m) => (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 32,
                    height: `${(m.revenue / maxRevenue) * 130}px`,
                    background: 'linear-gradient(to top, #2563EB, #60A5FA)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s',
                    minHeight: 4,
                  }}
                  title={`${m.month}: ${formatCurrency(m.revenue)}`}
                />
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-section-header">
            <h3>Quotations by Status</h3>
            <BarChart3 size={16} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 0' }}>
            {statusBreakdown.map((s) => (
              <div key={s.value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, width: 90, color: 'var(--text-secondary)' }}>{s.label}</span>
                <div style={{ flex: 1, height: 20, background: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(s.value / maxStatus) * 100}%`,
                      height: '100%',
                      background: s.color,
                      borderRadius: 4,
                      transition: 'width 0.3s',
                      minWidth: 4,
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, width: 30, textAlign: 'right' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <h3>Recent Activity</h3>
          <Activity size={16} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {RECENT_ACTIVITIES.map((activity, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < RECENT_ACTIVITIES.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: activity.type === 'payment' ? '#10B981' : activity.type === 'quotation' ? '#3B82F6' : activity.type === 'project' ? '#8B5CF6' : '#6B7280',
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontSize: 14 }}>{activity.action}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
