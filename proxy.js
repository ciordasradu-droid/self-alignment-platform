import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Pages that require a logged-in user. Everything else (landing, /login,
// public share /r/[id], /subscribe, /api/*) stays open.
// 'onboarding' (calup arhitectura 30.07, L1/O1) NU mai e in lista — intrarea
// e anonima, directa de pe landing ("Incepe"). Sesiunea anonima Supabase se
// stabileste in onboarding/page.js insusi, la montare; daca ramanea protejat
// aici, primul om necunoscut era redirectionat la /login inainte sa apuce sa
// primeasca acea sesiune.
const PROTECTED = ['/dashboard', '/drumul', '/generating', '/profile', '/compatibility']

export async function proxy(request) {
  // Playground-ul de apă e unealtă de lucru, nu produs. Nu exista in productie.
  if (request.nextUrl.pathname.startsWith('/dev')) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Not found', { status: 404 })
    }
    return NextResponse.next({ request })
  }

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

  // 2b. Landing = DOAR pentru necunoscuti (decizie v5, sect. 6).
  // User logat pe / → direct in Azi, fara opriri. Server-side, deci fara
  // flash de landing inainte de redirect.
  if (path === '/' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // 3. Gardianul de profil — Azi/Drumul/Tu cer un profil generat. Profilul
  // e usa produsului: fara el, ritualurile n-au ce sa afiseze si n-au ce sa
  // salveze. Un cont autentificat fara profil e trimis la onboarding, nu
  // la un ecran gol de ritual. Vine INAINTE de gardianul de abonament —
  // n-are sens sa ceri un abonament pentru un profil care nu exista inca.
  const needsProfile = ['/dashboard', '/drumul', '/profile'].some((p) => path === p || path.startsWith(p + '/'))
  if (needsProfile && user) {
    const { data: profileRow } = await supabase
      .from('interpreted_profiles')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()
    if (!profileRow) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      url.search = ''
      url.searchParams.set('reason', 'no_profile')
      return NextResponse.redirect(url)
    }
  }

  // 4. Subscription gate — Azi si Drumul (accountability) cer abonament sau
  // proba gratuita. Tu (profilul, platit separat cu 4€) ramane accesibil.
  // 25.07: gate-ul verifica acum starea REALA din DB (la fel ca gardianul de
  // profil de mai sus) — cookie-ul 'subscribed' nu era setat NICAIERI in
  // aplicatie (doar ca query param pe redirectul de succes Stripe), deci
  // orice abonat activ fara try_free era trimis inapoi la /subscribe la
  // fiecare vizita. Bug real, gasit prin investigarea unei alte probleme.
  // 0.4 (calup arhitectura 30.07): comutator de testare cu acces complet —
  // cat e pornit pe server, TOATE conturile trec de orice poarta de plata.
  // Nimic din logica de mai jos nu se sterge, doar se ocoleste. Se stinge
  // dintr-o singura miscare la lansare (variabila de mediu, nu client).
  const fullAccess = process.env.FULL_ACCESS_MODE === 'true'
  const needsSubscription = !fullAccess && ['/dashboard', '/drumul'].some((p) => path === p || path.startsWith(p + '/'))
  if (needsSubscription) {
    const tryFree = request.cookies.get('try_free')
    const { data: subRow } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()
    if (!subRow && !tryFree) {
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
