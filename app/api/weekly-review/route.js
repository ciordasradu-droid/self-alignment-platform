import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await request.json()
    const { week_start, responses, score_avg } = body

    const { error } = await supabaseAdmin
      .from('weekly_reviews')
      .upsert([{ user_id: user.id, week_start, responses, score_avg }],
        { onConflict: 'user_id,week_start' })

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Weekly review error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}