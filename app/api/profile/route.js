export const maxDuration = 60

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    // Get interpreted profile
    const { data, error } = await supabase
      .from('interpreted_profiles')
      .select('*')
      .eq('user_id', userId)
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

    if (data.calculated_profile_id) {
      const { data: calcData } = await supabase
        .from('calculated_profiles')
        .select('full_name, calculated_data')
        .eq('id', data.calculated_profile_id)
        .single()

      if (calcData) {
        fullName = calcData.full_name || ''
        hdData = calcData.calculated_data?.human_design || null
        personalYear = calcData.calculated_data?.numerology?.personal_year || null
      }
    }

    return NextResponse.json({
      success: true,
      sections: data.sections,
      swot: data.swot,
      alignment_plan: data.alignment_plan,
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