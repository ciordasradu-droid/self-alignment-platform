import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, week_start, responses, score_avg } = body

    const { error } = await supabase
      .from('weekly_reviews')
      .upsert([{ user_id, week_start, responses, score_avg }],
        { onConflict: 'user_id,week_start' })

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Weekly review error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}