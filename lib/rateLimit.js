// Rate limiting pentru rutele care apelează Claude (cost per request).
// Fixed-window per user_id + route, ținut în tabela public.rate_limits
// (vezi supabase/migration_rate_limits.sql — trebuie rulată o singură dată).
// Fail-open: dacă tabela nu există încă sau apare orice eroare de rețea,
// cererea e permisă — mai bine o generare în plus decât un produs picat.
import { supabaseAdmin } from './supabase/service'

export async function checkRateLimit(userId, route, { limit = 10, windowSeconds = 3600 } = {}) {
  try {
    const now = Date.now()
    const { data: existing } = await supabaseAdmin
      .from('rate_limits')
      .select('window_start,count')
      .eq('user_id', userId)
      .eq('route', route)
      .maybeSingle()

    const windowStart = existing ? new Date(existing.window_start).getTime() : null
    const windowExpired = !existing || (now - windowStart) > windowSeconds * 1000

    if (windowExpired) {
      await supabaseAdmin
        .from('rate_limits')
        .upsert({ user_id: userId, route, window_start: new Date(now).toISOString(), count: 1 }, { onConflict: 'user_id,route' })
      return { allowed: true }
    }

    if (existing.count >= limit) {
      const retryAfter = Math.max(1, Math.ceil((windowSeconds * 1000 - (now - windowStart)) / 1000))
      return { allowed: false, retryAfter }
    }

    await supabaseAdmin
      .from('rate_limits')
      .update({ count: existing.count + 1 })
      .eq('user_id', userId)
      .eq('route', route)
    return { allowed: true }
  } catch (e) {
    console.error(`rateLimit check failed for ${route}, failing open:`, e.message)
    return { allowed: true }
  }
}
