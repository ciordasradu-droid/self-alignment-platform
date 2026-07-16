// Service-role client — BYPASSES Row Level Security.
// Use ONLY on the server, and ONLY after you have verified WHO the user is
// (via getSessionUser). Never import this in client components.
// Public/no-session routes (Stripe webhook, spots count, cron reminders,
// public share pages) may use it directly.
//
// Lazy: the underlying client is created on first use, not at import time, so
// `next build` succeeds even before SUPABASE_SERVICE_ROLE_KEY is configured.
import { createClient } from '@supabase/supabase-js'

let _client = null

function getClient() {
  if (_client) return _client
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  _client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return _client
}

// Proxy so callers can keep using `supabaseAdmin.from(...)` etc. while the real
// client is only built (and env checked) on first property access.
export const supabaseAdmin = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getClient()
      const value = client[prop]
      return typeof value === 'function' ? value.bind(client) : value
    },
  }
)
