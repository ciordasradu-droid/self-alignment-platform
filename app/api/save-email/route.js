import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, email } = body

    const { error } = await supabase
      .from('user_emails')
      .upsert([{ user_id, email, created_at: new Date().toISOString() }], { onConflict: 'user_id' })

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Save email error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}