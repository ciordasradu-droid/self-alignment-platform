import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id } = body

    const { data, error } = await supabase
      .from('invites')
      .upsert([{ user_id, created_at: new Date().toISOString() }], { onConflict: 'user_id' })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, invite_code: user_id })

  } catch (err) {
    console.error('Invite error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    const { data, error } = await supabase
      .from('invites')
      .select('*, referrals(count)')
      .eq('user_id', user_id)
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      invite_code: user_id,
      referrals: data.referrals?.[0]?.count || 0
    })

  } catch (err) {
    return NextResponse.json({ success: false, referrals: 0 })
  }
}