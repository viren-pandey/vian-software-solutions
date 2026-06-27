import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AdminQuotationsList } from '@/components/admin/AdminQuotationsList'

export default async function AdminQuotationsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const quotations = await api.admin.quotations.list().catch(() => [])

  return <AdminQuotationsList quotations={quotations} />
}
