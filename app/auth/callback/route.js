import { NextResponse } from 'next/server'
import { createSupabaseServer } from '../../../lib/supabase/server'
import { supabaseAdmin } from '../../../lib/supabase/service'

// Magic-link landing. Supabase redirects here with ?code=... after the user
// clicks the email link. We exchange it for a session, make sure a users row
// exists, then send them on to `next` (default /dashboard).
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = await createSupabaseServer()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=exchange`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    // Idempotent — creates the row on first login, leaves it untouched after.
    await supabaseAdmin
      .from('users')
      .upsert({ id: user.id, email: user.email }, { onConflict: 'id', ignoreDuplicates: true })
  }

  return NextResponse.redirect(`${origin}${next}`)
}
