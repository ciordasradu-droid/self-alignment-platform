import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/service'
import { getSessionUser } from '../../../../lib/supabase/server'

// UNEALTĂ DE TEST — NU un feature de produs. Rescrie users.created_at
// (vechimea contului) ca să poți verifica ecranele încuiate pe timp
// (z14/z30/z60) fără să aștepți zilele. ȘTERGE acest fișier + app/qa
// înainte de lansarea publică — oricine cu QA_KEY își poate falsifica
// vechimea propriului cont (nu poate atinge alte conturi, nu poate
// debloca nimic plătit direct — doar conținutul time-gated).
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

  const days = Math.max(1, parseInt(searchParams.get('days') || '1', 10))
  const newCreatedAt = new Date(Date.now() - (days - 1) * 86400000).toISOString()

  await supabaseAdmin
    .from('users')
    .upsert({ id: user.id, email: user.email || null, created_at: newCreatedAt }, { onConflict: 'id' })

  const url = request.nextUrl.clone()
  url.pathname = '/dashboard'
  url.search = ''
  return NextResponse.redirect(url)
}
