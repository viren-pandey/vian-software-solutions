import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_ROUTES = ['/admin', '/admin/quotations', '/admin/users', '/admin/projects', '/admin/payments', '/admin/chats', '/admin/audit-log', '/admin/blog']
const DASHBOARD_ROUTES = ['/dashboard', '/dashboard/quotations', '/dashboard/invoices', '/dashboard/payments', '/dashboard/support']

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
    const { payload } = await jwtVerify(accessToken, ACCESS_SECRET)
    const role = payload.role as string

    if (isAdminRoute && role !== 'admin' && role !== 'reviewer') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    const response = NextResponse.next()
    response.headers.set('X-User-Role', role)
    response.headers.set('X-User-Name', (payload.email as string) || '')
    response.headers.set('X-User-Id', (payload.userId as string) || '')
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