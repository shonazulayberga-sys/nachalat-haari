import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticatedRequest } from '@/lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // כל /admin/* מוגן, חוץ מדף ההתחברות עצמו (/admin)
  const isAdminRoute = pathname.startsWith('/admin/') && pathname !== '/admin'

  if (isAdminRoute && !isAuthenticatedRequest(request)) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
