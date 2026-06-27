import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect, notFound } from 'next/navigation'
import { InvoiceDetail } from '@/components/dashboard/InvoiceDetail'

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const { id } = await params
  const invoice = await api.invoices.get(id).catch(() => null)
  if (!invoice) notFound()

  return <InvoiceDetail invoice={invoice} user={user} />
}
