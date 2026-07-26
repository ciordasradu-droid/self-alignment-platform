// Punctul 1 (audit 26.07, runda 2 — corectie): inlocuieste handoff-ul prin
// sessionStorage cu unul server-side, sub un id opac. Un refresh pe
// /generating recitește dupa acest id oricand, in loc sa piarda formularul
// (vezi migration_onboarding_sessions.sql pentru motiv complet).

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/service'
import { getSessionUser } from '../../../../lib/supabase/server'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { formData } = await request.json()
    if (!formData) return NextResponse.json({ error: 'formData required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('onboarding_sessions')
      .insert([{ user_id: user.id, form_data: formData }])
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Onboarding session POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('onboarding_sessions')
      .select('form_data')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) return NextResponse.json({ error: 'not found' }, { status: 404 })

    return NextResponse.json({ success: true, formData: data.form_data })
  } catch (err) {
    console.error('Onboarding session GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
