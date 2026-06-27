import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { SupportPage } from '@/components/dashboard/SupportPage'

export default async function SupportRoute() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const tickets = await api.support.list().catch(() => [])

  return <SupportPage tickets={tickets} />
}
