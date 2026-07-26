// Utilitar de test: verifica/curata randurile vechi din onboarding_sessions.
// Ruleaza cu --clean ca sa stearga tot ce e deja acolo (randuri orfane,
// dinainte de fix-ul din runda 3 care sterge randul la succesul generarii).
import { createClient } from '@supabase/supabase-js'
import { loadEnv } from './dev-login.mjs'

const env = loadEnv()
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

if (process.argv.includes('--clean')) {
  const { error, count } = await admin.from('onboarding_sessions').delete({ count: 'exact' }).neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('deleted rows:', count, 'error:', error?.message || null)
} else {
  const { data, error, count } = await admin.from('onboarding_sessions').select('id, user_id, created_at', { count: 'exact' })
  console.log('total rows:', count, 'error:', error?.message || null)
  console.log(JSON.stringify(data, null, 2))
}
