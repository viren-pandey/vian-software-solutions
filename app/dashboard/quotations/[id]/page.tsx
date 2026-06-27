import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect, notFound } from 'next/navigation'
import { QuotationDetail } from '@/components/dashboard/QuotationDetail'

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const { id } = await params
  const quotation = await api.quotations.get(id).catch(() => null)
  if (!quotation) notFound()

  return <QuotationDetail quotation={quotation} userId={user.id} />
}
