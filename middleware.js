import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Pages that require a logged-in user. Everything else (landing, /login,
// public share /r/[id], /subscribe, /api/*) stays open.
const PROTECTED = ['/dashboard', '/onboarding', '/generating', '/profile', '/compatibility']

export async function middleware(request) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(p + '/'))

  // 1. Auth gate — must be logged in for protected pages.
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // 2. Already logged in and visiting /login → send home.
  if (path === '/login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }

  // 3. Subscription gate — /dashboard needs an active subscription or free trial.
  if (path === '/dashboard' || path.startsWith('/dashboard/')) {
    const subscribed = request.cookies.get('subscribed')
    const tryFree = request.cookies.get('try_free')
    if (!subscribed && !tryFree) {
      return NextResponse.redirect(new URL('/subscribe', request.url))
    }
  }

  return response
}

export const config = {
  // Run on everything except static assets. (Also runs on /api to keep the
  // session cookie fresh; API routes are not in PROTECTED so they aren't redirected.)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
