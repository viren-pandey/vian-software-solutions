import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const [quotationsRes, projectsRes, invoicesRes] = await Promise.allSettled([
    api.quotations.list().catch(() => []),
    api.projects.list().catch(() => []),
    api.invoices.list().catch(() => []),
  ])

  const quotations = quotationsRes.status === 'fulfilled' ? quotationsRes.value : []
  const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : []
  const invoices = invoicesRes.status === 'fulfilled' ? invoicesRes.value : []

  return <DashboardContent user={user} quotations={quotations} projects={projects} invoices={invoices} />
}
