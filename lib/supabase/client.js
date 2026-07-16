// Browser Supabase client — for auth actions (magic link) and reading the
// current session on the client. Cookie-based, so it stays in sync with the server.
import { createBrowserClient } from '@supabase/ssr'

let cached = null

export function createSupabaseBrowser() {
  if (cached) return cached
  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return cached
}
