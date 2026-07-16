import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('invites')
      .upsert([{ user_id: user.id, created_at: new Date().toISOString() }], { onConflict: 'user_id' })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, invite_code: user.id })

  } catch (err) {
    console.error('Invite error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ success: false, referrals: 0 }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('invites')
      .select('*, referrals(count)')
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      invite_code: user.id,
      referrals: data.referrals?.[0]?.count || 0
    })

  } catch (err) {
    return NextResponse.json({ success: false, referrals: 0 })
  }
}
