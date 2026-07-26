// Destinație: app/api/profile/route.js  (ÎNLOCUIEȘTE COMPLET)
// Schimbare: răspunsul include acum și interpreted_profile_id + calculated_data,
// ca pagina de profil să poată regenera singură planul dacă lipsește.
// Restul rămâne identic.

export const maxDuration = 60

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    // Get interpreted profile
    const { data, error } = await supabaseAdmin
      .from('interpreted_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return NextResponse.json({ success: false }, { status: 404 })
    }

    // Get calculated profile for hd_data, personal_year, full_name, birth data
    let hdData = null
    let personalYear = null
    let fullName = ''
    let calculatedData = null
    let birthDate = null
    let birthTime = null
    let birthCity = null
    let birthLat = null
    let birthLng = null

    if (data.calculated_profile_id) {
      // Punctul 1 (audit 26.07): coloanele astea existau si inainte de
      // reparatie sub alte nume (full_name/calculated_data nu existau deloc
      // pe tabela) — de-aia veneau mereu goale, tacut, fara nicio eroare
      // vizibila. Acum logam eroarea explicit daca mai apare vreodata.
      const { data: calcData, error: calcError } = await supabaseAdmin
        .from('calculated_profiles')
        .select('full_name, calculated_data, birth_date, birth_time, birth_city, birth_lat, birth_lng')
        .eq('id', data.calculated_profile_id)
        .single()

      if (calcError) {
        console.error('calculated_profiles select error:', calcError.message)
      } else if (calcData) {
        fullName = calcData.full_name || ''
        hdData = calcData.calculated_data?.human_design || null
        personalYear = calcData.calculated_data?.numerology?.personal_year || null
        calculatedData = calcData.calculated_data || null
        birthDate = calcData.birth_date || null
        birthTime = calcData.birth_time || null
        birthCity = calcData.birth_city || null
        birthLat = calcData.birth_lat ?? null
        birthLng = calcData.birth_lng ?? null
      }
    }

    // Punctul 2 (audit 26.07): poarta de acorduri verifica SERVERUL, nu
    // localStorage. Valabila DOAR daca randul din user_agreements se leaga
    // de profilul CURENT (interpreted_profile_id) — asa se invalideaza
    // singura la un profil nou, fara nicio stergere manuala.
    let agreementsCommitted = false
    const { data: agreementRow } = await supabaseAdmin
      .from('user_agreements')
      .select('interpreted_profile_id')
      .eq('user_id', user.id)
      .maybeSingle()
    if (agreementRow && agreementRow.interpreted_profile_id === data.id) {
      agreementsCommitted = true
    }

    return NextResponse.json({
      success: true,
      interpreted_profile_id: data.id,
      sections: data.sections,
      swot: data.swot,
      alignment_plan: data.alignment_plan,
      calculated_data: calculatedData,
      language: data.language || 'en',
      full_name: fullName,
      hd_data: hdData,
      personal_year: personalYear,
      birth_date: birthDate,
      birth_time: birthTime,
      birth_city: birthCity,
      birth_lat: birthLat,
      birth_lng: birthLng,
      agreements_committed: agreementsCommitted
    })

  } catch (err) {
    console.error('Profile GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}