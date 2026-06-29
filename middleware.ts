import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROUTES = ['/admin', '/admin/quotations', '/admin/users', '/admin/projects', '/admin/payments', '/admin/chats', '/admin/audit-log', '/admin/blog']
const DASHBOARD_ROUTES = ['/dashboard', '/dashboard/quotations', '/dashboard/invoices', '/dashboard/payments', '/dashboard/support']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const API_URL = process.env.NEXT_PUBLIC_API_URL || new URL(request.url).origin

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))
  const isDashboardRoute = DASHBOARD_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))

  if (!isAdminRoute && !isDashboardRoute) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('access_token')?.value

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const data = await res.json()
    const user = data.user

    if (isAdminRoute && user.role !== 'admin' && user.role !== 'reviewer') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isDashboardRoute && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const response = NextResponse.next()
    response.headers.set('X-User-Role', user.role)
    response.headers.set('X-User-Name', user.name)
    response.headers.set('X-User-Id', user.id)
    return response
  } catch {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
