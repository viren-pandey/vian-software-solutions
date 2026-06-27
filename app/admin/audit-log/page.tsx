import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AuditLogClient } from '@/components/admin/AuditLogClient'

export default async function AuditLogPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')

  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)
  const data = await api.admin.auditLog.list(100, 0).catch(() => ({ logs: [], total: 0 }))

  return <AuditLogClient logs={data.logs} total={data.total} />
}
