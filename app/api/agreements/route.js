// Punctul 2 (audit 26.07): poarta de acorduri — server, nu localStorage.
// Un singur rand per user (upsert); validitatea se verifica prin
// interpreted_profile_id, care se invalideaza singur cand se genereaza un
// profil nou (vezi GET /api/profile: agreements_committed compara randul
// cu profilul CURENT afisat).

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { items, interpreted_profile_id, language } = await request.json()
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('user_agreements')
      .upsert([{
        user_id: user.id,
        items,
        accepted_at: new Date().toISOString(),
        interpreted_profile_id: interpreted_profile_id || null,
        language: language || null,
      }], { onConflict: 'user_id' })

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Agreements POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
