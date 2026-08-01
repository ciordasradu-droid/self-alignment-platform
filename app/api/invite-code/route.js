import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

// GCAO A6 (01.08.2026) — atribuirea unui cod de invitație de influencer
// (invite_codes/invite_code_referrals, vezi supabase/migration_invite_codes.sql).
// NU dă nicio reducere — servește doar la atribuirea userului către
// influencer, pentru comisionul manual de €3/profil vândut. Un user =
// maximum o atribuire, la prima înregistrare (unique pe user_id, primul
// apel câștigă — apelurile ulterioare nu suprascriu).
export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 })

    const { code } = await request.json()
    const trimmed = (code || '').trim()
    if (!trimmed) return NextResponse.json({ success: false, reason: 'empty_code' })

    const { data: codeRow } = await supabaseAdmin
      .from('invite_codes')
      .select('code')
      .eq('code', trimmed)
      .eq('active', true)
      .maybeSingle()

    if (!codeRow) return NextResponse.json({ success: false, reason: 'invalid_code' })

    const { data: existing } = await supabaseAdmin
      .from('invite_code_referrals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) return NextResponse.json({ success: false, reason: 'already_attributed' })

    const { error } = await supabaseAdmin
      .from('invite_code_referrals')
      .insert([{ invite_code: trimmed, user_id: user.id }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Invite code redeem error:', err.message)
    return NextResponse.json({ success: false, reason: 'error' }, { status: 500 })
  }
}
