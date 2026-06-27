import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AdminPaymentsList } from '@/components/admin/AdminPaymentsList'

export default async function AdminPaymentsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const payments = await api.admin.payments.list().catch(() => [])

  return <AdminPaymentsList payments={payments} />
}
