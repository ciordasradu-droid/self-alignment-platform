import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/service'
import { getSessionUser } from '../../../../lib/supabase/server'

// Toate tabelele care țin date legate de user_id (secț. 8 — export GDPR).
const OWNED_TABLES = [
  'calculated_profiles', 'interpreted_profiles', 'checkins', 'streaks',
  'compatibility_profiles', 'daily_insights', 'weekly_reviews',
  'weekly_resets', 'patterns_insights', 'invites', 'subscriptions',
]

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const data = { exported_at: new Date().toISOString(), user: { id: user.id, email: user.email, metadata: user.user_metadata } }

  for (const table of OWNED_TABLES) {
    const { data: rows, error } = await supabaseAdmin.from(table).select('*').eq('user_id', user.id)
    if (!error) data[table] = rows
  }

  const { data: referralRows } = await supabaseAdmin
    .from('referrals')
    .select('*')
    .or(`new_user_id.eq.${user.id},referred_by.eq.${user.id}`)
  data.referrals = referralRows || []

  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="my-data-${user.id}.json"`,
    },
  })
}
