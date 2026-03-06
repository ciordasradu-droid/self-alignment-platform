import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard')) {
    const subscribed = request.cookies.get('subscribed')
    const tryFree = request.cookies.get('try_free')

    if (!subscribed && !tryFree) {
      return NextResponse.redirect(new URL('/subscribe', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
