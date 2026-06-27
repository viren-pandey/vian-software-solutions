import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect, notFound } from 'next/navigation'
import { AdminQuotationDetail } from '@/components/admin/AdminQuotationDetail'

export default async function AdminQuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const { id } = await params
  const quotation = await api.admin.quotations.get(id).catch(() => null)
  if (!quotation) notFound()

  return <AdminQuotationDetail quotation={quotation} userId={user.id} />
}
