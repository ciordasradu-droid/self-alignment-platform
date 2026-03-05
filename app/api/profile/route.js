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

    return NextResponse.json({
      success: true,
      sections: data.sections,
      swot: data.swot,
      alignment_plan: data.alignment_plan
    })

  } catch (err) {
    console.error('Profile GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}