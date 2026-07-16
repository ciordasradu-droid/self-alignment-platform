import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await request.json()
    const { referred_by } = body

    const { error } = await supabaseAdmin
      .from('referrals')
      .insert([{
        referred_by,
        new_user_id: user.id,
        created_at: new Date().toISOString()
      }])

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Referral error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}