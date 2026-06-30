'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { api, ApiError } from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import type { Payment, PaymentRequest, PaymentLogEntry, User } from '@/types/api'
import { MessageSquare, Plus, X, Search, ExternalLink } from 'lucide-react'

type Tab = 'payments' | 'requests' | 'logs'

interface AdminPaymentsListProps {
  payments: Payment[]
  requests: PaymentRequest[]
  logs: PaymentLogEntry[]
  users: User[]
}

export function AdminPaymentsList({ payments, requests, logs, users }: AdminPaymentsListProps) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('payments')

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Payments</h1>
          <p className="subtitle">Manage payments, requests, and view all transaction logs</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['payments', 'requests', 'logs'] as const).map((t) => (
          <button
            key={t}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', fontSize: 13, textTransform: 'capitalize' }}
            onClick={() => setTab(t)}
          >
            {t === 'payments' ? `Payments (${payments.length})` : t === 'requests' ? `Requests (${requests.length})` : `Logs (${logs.length})`}
          </button>
        ))}
      </div>

      {tab === 'payments' && <PaymentsTab payments={payments} router={router} />}
      {tab === 'requests' && <RequestsTab requests={requests} users={users} router={router} />}
      {tab === 'logs' && <LogsTab logs={logs} />}
    </>
  )
}

function PaymentsTab({ payments, router }: { payments: Payment[]; router: ReturnType<typeof useRouter> }) {
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
                <th>Initiated</th>
                <th>Date</th>
                <th>Chat</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.user?.name || 'Unknown'}</strong><div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.user?.email}</div></td>
                  <td style={{ fontSize: 12 }}>{p.paytmTransactionId}</td>
                  <td><strong>{formatCurrency(Number(p.amount))}</strong></td>
                  <td><Badge variant={p.status}>{p.status === 'pending' ? 'Pending Verification' : p.status}</Badge></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {p.initiatedAt ? formatDateTime(p.initiatedAt) : '-'}
                  </td>
                  <td style={{ fontSize: 12 }}>{formatDateTime(p.createdAt)}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => {
                        const qId = p.invoice?.quotation?.title || p.invoiceId
                        if (p.user) router.push(`/admin/chats?userId=${p.user.id}`)
                      }}
                      title="Chat with client"
                    >
                      <MessageSquare size={12} /> Chat
                    </button>
                  </td>
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
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left' }}>
            <h3 style={{ marginBottom: 16 }}>Payment Details</h3>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Client</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{selectedPayment.user?.name || 'Unknown'}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Email</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{selectedPayment.user?.email || '-'}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Transaction ID</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{selectedPayment.paytmTransactionId}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Amount</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{formatCurrency(Number(selectedPayment.amount))}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Initiated</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{selectedPayment.initiatedAt ? formatDateTime(selectedPayment.initiatedAt) : 'Not recorded'}</td></tr>
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

function RequestsTab({ requests, users, router }: { requests: PaymentRequest[]; users: User[]; router: ReturnType<typeof useRouter> }) {
  const [showCreate, setShowCreate] = useState(false)
  const [formUserId, setFormUserId] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formUserId || !formAmount || !formDescription) return
    setCreating(true)
    try {
      await api.admin.paymentRequests.create({
        userId: formUserId,
        amount: parseFloat(formAmount),
        description: formDescription,
      })
      showToast('Payment request created', 'success')
      setShowCreate(false)
      setFormUserId('')
      setFormAmount('')
      setFormDescription('')
      router.refresh()
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Failed to create request', 'error')
    }
    setCreating(false)
  }

  const handleCancel = async (id: string) => {
    try {
      await api.admin.paymentRequests.cancel(id)
      showToast('Payment request cancelled', 'success')
      router.refresh()
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Failed to cancel', 'error')
    }
  }

  const selectedUser = users.find((u) => u.id === formUserId)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Create and manage payment requests for users.</p>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowCreate(true)}>
          <Plus size={16} /> New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No payment requests" description="Create a payment request for a user to get started." />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.user?.name || 'Unknown'}</strong><div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{r.user?.email}</div></td>
                  <td><strong>{formatCurrency(Number(r.amount))}</strong></td>
                  <td style={{ fontSize: 13, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</td>
                  <td><Badge variant={r.status}>{r.status}</Badge></td>
                  <td style={{ fontSize: 12 }}>{formatDateTime(r.createdAt)}</td>
                  <td>
                    {r.status === 'pending' ? (
                      <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 11, color: 'var(--error)' }} onClick={() => handleCancel(r.id)}>
                        Cancel
                      </button>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left', maxWidth: 520, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3>Create Payment Request</h3>
              <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowCreate(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Select User</label>
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13 }}
                  />
                </div>
                <div style={{ maxHeight: 160, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  {filteredUsers.length === 0 ? (
                    <div style={{ padding: 12, textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>No users found</div>
                  ) : (
                    filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        style={{
                          padding: '8px 12px', cursor: 'pointer', fontSize: 13,
                          background: formUserId === u.id ? 'var(--accent-light)' : 'transparent',
                          borderBottom: '1px solid var(--border-light)',
                        }}
                        onClick={() => { setFormUserId(u.id); setSearch('') }}
                      >
                        <strong>{u.name}</strong> <span style={{ color: 'var(--text-tertiary)' }}>{u.email}</span>
                      </div>
                    ))
                  )}
                </div>
                {selectedUser && (
                  <div style={{ marginTop: 6, fontSize: 12, color: 'var(--accent)' }}>
                    Selected: {selectedUser.name} ({selectedUser.email})
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14 }}
                  required
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="What is this payment for?"
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, resize: 'vertical' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating || !formUserId || !formAmount || !formDescription}>
                  {creating ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function LogsTab({ logs }: { logs: PaymentLogEntry[] }) {
  return (
    <>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        All payment events: initiations, callbacks, verifications, and more.
      </p>
      {logs.length === 0 ? (
        <EmptyState title="No payment logs" description="Payment events will appear here as users interact with payments." />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>User</th>
                <th>Payment ID</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td><Badge variant={log.logType === 'callback' ? 'success' : log.logType === 'initiation' ? 'pending' : 'info'}>{log.logType}</Badge></td>
                  <td>
                    {log.payment?.user ? (
                      <span><strong>{log.payment.user.name}</strong><div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{log.payment.user.email}</div></span>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)' }}>-</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>{log.paymentId ? log.paymentId.substring(0, 8) + '...' : '-'}</td>
                  <td style={{ fontSize: 12, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.logType === 'initiation' ? `Invoice: ${(log.rawPayload as any)?.invoiceId || ''}` : ''}
                    {log.logType === 'callback' ? `Signature valid: ${log.signatureValid !== null ? (log.signatureValid ? 'Yes' : 'No') : 'Unknown'}` : ''}
                    {log.logType === 'verify' ? 'Admin verification' : ''}
                  </td>
                  <td style={{ fontSize: 12 }}>{formatDateTime(log.receivedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
