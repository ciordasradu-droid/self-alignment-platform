export const maxDuration = 60

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { calculateFullProfile } from '../../../lib/calculations/index'

export async function POST(request) {
  try {
    const body = await request.json()
    const { full_name, date_of_birth, birth_data_id, user_id } = body

    const calculatedData = calculateFullProfile(full_name, date_of_birth)

    const { data, error } = await supabase
      .from('calculated_profiles')
      .insert([{
        user_id: user_id || null,
        birth_data_id: birth_data_id || null,
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
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}