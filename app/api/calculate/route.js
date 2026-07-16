import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { calculateFullProfile } from '../../../lib/calculations/index'

export const maxDuration = 60

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await request.json()
    const { full_name, date_of_birth, time_of_birth, lat, lng, language } = body

    const calculatedData = calculateFullProfile(
      full_name,
      date_of_birth,
      time_of_birth,
      lat,
      lng,
      language || 'en'
    )

    const { data, error } = await supabaseAdmin
      .from('calculated_profiles')
      .insert([{
        user_id: user.id,
        astro_data: calculatedData.astrology,
        numerology_data: calculatedData.numerology,
        hd_data: calculatedData.human_design
      }])
      .select()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
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