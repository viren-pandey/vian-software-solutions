'use client'

import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/types/api'

interface ProjectsListProps {
  projects: Project[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Projects</h1>
          <p className="subtitle">Track your ongoing and completed projects</p>
        </div>
      </div>
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Projects are created once a quotation is accepted."
        />
      ) : (
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.quotation?.title || 'Project'}</strong></td>
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
