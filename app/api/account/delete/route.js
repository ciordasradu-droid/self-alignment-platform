import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '../../../../lib/supabase/service'
import { getSessionUser } from '../../../../lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Ștergere cont (secț. 8 — GDPR). Anulează abonamentul Stripe activ (dacă
// există), șterge toate datele legate de user_id, apoi contul de auth
// însuși (public.users se șterge automat prin cascade, vezi
// supabase/migration_auth.sql — FK cu on delete cascade).
const OWNED_TABLES = [
  'calculated_profiles', 'interpreted_profiles', 'checkins', 'streaks',
  'compatibility_profiles', 'daily_insights', 'weekly_reviews',
  'weekly_resets', 'patterns_insights', 'invites', 'subscriptions',
  'rate_limits',
]

export async function POST() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (sub?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id)
    } catch (e) {
      console.error('Stripe cancel on account delete failed:', e.message)
    }
  }

  for (const table of OWNED_TABLES) {
    await supabaseAdmin.from(table).delete().eq('user_id', user.id)
  }

  await supabaseAdmin
    .from('referrals')
    .delete()
    .or(`new_user_id.eq.${user.id},referred_by.eq.${user.id}`)

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)
  if (error) {
    console.error('Account delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
