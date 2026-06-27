import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { ProjectsList } from '@/components/dashboard/ProjectsList'

export default async function ProjectsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const projects = await api.projects.list().catch(() => [])

  return <ProjectsList projects={projects} />
}
