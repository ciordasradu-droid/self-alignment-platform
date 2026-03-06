import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { referred_by, new_user_id } = body

    const { error } = await supabase
      .from('referrals')
      .insert([{
        referred_by,
        new_user_id,
        created_at: new Date().toISOString()
      }])

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Referral error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}