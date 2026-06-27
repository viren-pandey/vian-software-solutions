import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { InvoicesList } from '@/components/dashboard/InvoicesList'

export default async function InvoicesPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const invoices = await api.invoices.list().catch(() => [])

  return <InvoicesList invoices={invoices} />
}
