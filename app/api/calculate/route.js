import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { calculateFullProfile } from '../../../lib/calculations/index'
import { getLogicalDay } from '../../../lib/logicalDay'

export const maxDuration = 60

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await request.json()
    const { full_name, date_of_birth, time_of_birth, city, lat, lng, language, time_unknown, tz } = body
    const tzOffset = Number(tz) || 0

    const calculatedData = calculateFullProfile(
      full_name,
      date_of_birth,
      time_of_birth,
      lat,
      lng,
      language || 'en',
      !!time_unknown
    )

    // Punctul 1 (audit 26.07): pana acum se scriau DOAR rezultatele calculate
    // (astro_data/numerology_data/hd_data) — datele brute de nastere si
    // full_name nu se salvau nicaieri, iar `calculated_data` (blob unificat,
    // pe care /api/profile si /api/patterns il asteptau deja) nu exista.
    // Ireversibil: profilurile create INAINTE de aceasta reparatie raman
    // fara aceste campuri — nu exista recuperare retroactiva.
    const { data, error } = await supabaseAdmin
      .from('calculated_profiles')
      .insert([{
        user_id: user.id,
        full_name: full_name || null,
        birth_date: date_of_birth || null,
        birth_time: time_unknown ? null : (time_of_birth || null),
        birth_city: city || null,
        birth_lat: (lat !== undefined && lat !== null && lat !== '') ? Number(lat) : null,
        birth_lng: (lng !== undefined && lng !== null && lng !== '') ? Number(lng) : null,
        astro_data: calculatedData.astrology,
        numerology_data: calculatedData.numerology,
        hd_data: calculatedData.human_design,
        calculated_data: calculatedData,
      }])
      .select()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Un profil nou trebuie să înceapă cu o zi curată — altfel un check-in
    // făcut mai devreme azi (cu profilul vechi) rămâne agățat de user_id și
    // ritualul de seară apare "deja făcut" pe profilul proaspăt. Ștergem
    // DOAR check-in-urile de azi, nu tot istoricul (streak-ul/Prezența rămân).
    // Audit getLogicalDay (29.07): "azi" trebuie sa fie ZIUA LOGICA a userului
    // (cutoff 04:00 local), nu data calendaristica UTC a serverului — altfel
    // un check-in facut aproape de cutoff putea sa nu fie sters (sau sa fie
    // sters gresit), reintroducand exact bug-ul rezolvat la Runda 6.
    const todayLogical = getLogicalDay(Date.now(), tzOffset)
    const { data: todaysCheckins } = await supabaseAdmin
      .from('checkins')
      .select('id, created_at')
      .eq('user_id', user.id)
    const idsToDelete = (todaysCheckins || [])
      .filter(c => getLogicalDay(new Date(c.created_at).getTime(), tzOffset) === todayLogical)
      .map(c => c.id)
    if (idsToDelete.length > 0) {
      await supabaseAdmin.from('checkins').delete().in('id', idsToDelete)
    }

    return NextResponse.json({
      success: true,
      calculated_profile_id: data[0].id,
      data: calculatedData
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}