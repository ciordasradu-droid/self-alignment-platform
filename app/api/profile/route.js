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

    // Get calculated profile for hd_data, personal_year, full_name
    let hdData = null
    let personalYear = null
    let fullName = ''
    let calculatedData = null

    if (data.calculated_profile_id) {
      const { data: calcData } = await supabaseAdmin
        .from('calculated_profiles')
        .select('full_name, calculated_data')
        .eq('id', data.calculated_profile_id)
        .single()

      if (calcData) {
        fullName = calcData.full_name || ''
        hdData = calcData.calculated_data?.human_design || null
        personalYear = calcData.calculated_data?.numerology?.personal_year || null
        calculatedData = calcData.calculated_data || null
      }
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
      personal_year: personalYear
    })

  } catch (err) {
    console.error('Profile GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}