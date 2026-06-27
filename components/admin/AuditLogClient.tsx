'use client'

import { formatDateTime } from '@/lib/utils'
import type { AuditLogEntry } from '@/types/api'

interface AuditLogClientProps {
  logs: AuditLogEntry[]
  total: number
}

export function AuditLogClient({ logs, total }: AuditLogClientProps) {
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Audit Log</h1>
          <p className="subtitle">Chronological record of status, role, and payment changes ({total} entries)</p>
        </div>
      </div>
      {logs.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-[var(--border)] rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
          <p className="text-sm text-[var(--text-secondary)]">Audit entries will appear here as admin actions are performed.</p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table className="dash-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{formatDateTime(entry.createdAt)}</td>
                  <td style={{ fontSize: 13 }}>{entry.actor?.name || 'System'}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      background: entry.action.includes('approve') ? '#065F4620' : entry.action.includes('reject') ? '#DC262620' : 'var(--surface-hover)',
                      color: entry.action.includes('approve') ? '#059669' : entry.action.includes('reject') ? '#DC2626' : 'var(--text-secondary)',
                    }}>
                      {entry.action.replace('status:', '')}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{entry.entityType}:{entry.entityId.slice(0, 8)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.newState ? JSON.stringify(entry.newState).slice(0, 80) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
