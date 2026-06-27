'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { api, ApiError } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import type { Project, ProjectStatus } from '@/types/api'

interface AdminProjectsListProps {
  projects: Project[]
}

export function AdminProjectsList({ projects }: AdminProjectsListProps) {
  const router = useRouter()

  const handleStatusChange = async (id: string, status: ProjectStatus) => {
    try {
      await api.admin.projects.update(id, { status })
      showToast('Project status updated', 'success')
      router.refresh()
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Update failed', 'error')
    }
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Projects</h1>
          <p className="subtitle">Manage all client projects</p>
        </div>
      </div>
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Projects are created when quotations are accepted." />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Project</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.user?.name || 'Unknown'}</td>
                  <td><strong>{p.quotation?.title || 'Untitled'}</strong></td>
                  <td><Badge variant={p.status}>{p.status}</Badge></td>
                  <td>{formatDate(p.createdAt)}</td>
                  <td>
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value as ProjectStatus)}
                      style={{ padding: '4px 8px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text)' }}
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
