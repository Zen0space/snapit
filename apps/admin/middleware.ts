import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/events']
const SESSION_COOKIE = 'snap_admin_session'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect dashboard and events routes
  if (PROTECTED.some((p) => path.startsWith(p))) {
    const session = request.cookies.get(SESSION_COOKIE)
    if (!session?.value) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/events/:path*'],
}
