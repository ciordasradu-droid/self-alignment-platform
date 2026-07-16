import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ subscribed: false })
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return NextResponse.json({ subscribed: false })
    }

    return NextResponse.json({
      subscribed: true,
      plan: data.plan,
      current_period_end: data.current_period_end
    })

  } catch (err) {
    console.error('Subscription check error:', err.message)
    return NextResponse.json({ subscribed: false })
  }
}