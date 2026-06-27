import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { PaymentsList } from '@/components/dashboard/PaymentsList'

export default async function PaymentsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const payments = await api.payments.list().catch(() => [])

  return <PaymentsList payments={payments} />
}
