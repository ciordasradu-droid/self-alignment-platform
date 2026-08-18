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

    // P0 continuare (06.08.2026) — vezi PATCH mai jos: randul mai retine acum
    // si progresul generarii (calculated_data, interpreted_profile_id), ca
    // /generating sa poata relua de la etapa lipsa, nu doar formularul brut.
    // Coloanele noi vin dintr-o migrare separata (migration_generation_resume.sql)
    // care trebuie rulata o singura data manual — pana atunci selectul de mai
    // jos ar pica pentru TOATA lumea daca ar cere direct coloanele lipsa, deci
    // incercam intai varianta extinsa si cadem inapoi pe form_data simplu.
    let { data, error } = await supabaseAdmin
      .from('onboarding_sessions')
      .select('form_data, calculated_data, interpreted_profile_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error && error.message && error.message.includes('does not exist')) {
      const fallback = await supabaseAdmin
        .from('onboarding_sessions')
        .select('form_data')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      data = fallback.data ? { ...fallback.data, calculated_data: null, interpreted_profile_id: null } : null
      error = fallback.error
    }

    if (error || !data) return NextResponse.json({ error: 'not found' }, { status: 404 })

    return NextResponse.json({
      success: true,
      formData: data.form_data,
      calculatedData: data.calculated_data || null,
      interpretedProfileId: data.interpreted_profile_id || null,
    })
  } catch (err) {
    console.error('Onboarding session GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// P0 continuare (06.08.2026) — reluare generala a generarii. Clientul scrie
// aici, imediat ce fiecare etapa lunga reuseste (calculate / pornirea
// interpret), progresul facut pana atunci. Daca tab-ul e evacuat din memorie
// de browserul mobil in fundal (cauza reala a blocajului lui Alex — vezi
// migration_generation_resume.sql), o revenire pe /generating remonteaza
// pagina de la zero, dar acum poate reciti progresul de aici si sari peste
// pasii deja facuti, in loc sa reporneasca orbeste sau sa astepte la infinit
// un client care nu mai exista.
export async function PATCH(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const body = await request.json()
    const patch = {}
    if (body.calculated_data !== undefined) patch.calculated_data = body.calculated_data
    if (body.interpreted_profile_id !== undefined) patch.interpreted_profile_id = body.interpreted_profile_id
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nothing to update' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('onboarding_sessions')
      .update(patch)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Onboarding session PATCH error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Punctul 3 (audit 26.07, runda 3): randul isi face treaba in cateva minute
// (cat dureaza generarea) si dupa aceea nu mai foloseste nimanui — dar
// ramanea la nesfarsit, cu numele/data/orasul nasterii inca in el. Stersa
// explicit de generating/page.js imediat ce profilul a fost creat cu succes.
export async function DELETE(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await supabaseAdmin
      .from('onboarding_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Onboarding session DELETE error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
