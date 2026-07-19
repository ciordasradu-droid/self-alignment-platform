import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/service'
import { getSessionUser } from '../../../../lib/supabase/server'

// UNEALTĂ DE TEST — NU un feature de produs. Rescrie users.created_at
// (vechimea contului) ca să poți verifica ecranele încuiate pe timp
// (z14/z30/z60) fără să aștepți zilele. ȘTERGE acest fișier + app/qa
// înainte de lansarea publică — oricine cu QA_KEY își poate falsifica
// vechimea propriului cont (nu poate atinge alte conturi, nu poate
// debloca nimic plătit direct — doar conținutul time-gated).
//
// Data reală de creare se salvează O SINGURĂ DATĂ (la prima simulare) în
// custom_settings.qa_real_created_at, ca ?restore=1 să o poată readuce
// exact — altfel testul ar strica definitiv vechimea reală a contului.
const QA_KEY = 'e4c9669fcad5b7e113fd1897c766805b'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('key') !== QA_KEY) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const user = await getSessionUser()
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?next=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`
    return NextResponse.redirect(url)
  }

  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('created_at, custom_settings')
    .eq('id', user.id)
    .maybeSingle()

  const customSettings = existing?.custom_settings || {}
  const restore = searchParams.get('restore') === '1'

  if (restore) {
    const realCreatedAt = customSettings.qa_real_created_at
    if (realCreatedAt) {
      const { qa_real_created_at, ...rest } = customSettings
      await supabaseAdmin
        .from('users')
        .upsert({ id: user.id, email: user.email || null, created_at: realCreatedAt, custom_settings: rest }, { onConflict: 'id' })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  const days = Math.max(1, parseInt(searchParams.get('days') || '1', 10))
  const newCreatedAt = new Date(Date.now() - (days - 1) * 86400000).toISOString()

  // Prima simulare: salvează vechimea reală înainte s-o suprascrii.
  const nextSettings = customSettings.qa_real_created_at
    ? customSettings
    : { ...customSettings, qa_real_created_at: existing?.created_at || user.created_at }

  await supabaseAdmin
    .from('users')
    .upsert({ id: user.id, email: user.email || null, created_at: newCreatedAt, custom_settings: nextSettings }, { onConflict: 'id' })

  const url = request.nextUrl.clone()
  url.pathname = '/dashboard'
  url.search = ''
  return NextResponse.redirect(url)
}
