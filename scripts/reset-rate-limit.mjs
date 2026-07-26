// Utilitar de test: reseteaza rate_limits pentru contul de dev, ca sa nu
// blocheze testele repetate din aceeasi ora (limita reala, 5/ora, ramane
// neschimbata pentru utilizatori reali).
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './dev-login.mjs'

const env = loadEnv()
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
const user = list.users.find(u => u.email === DEV_EMAIL)
const { error, count } = await admin.from('rate_limits').delete({ count: 'exact' }).eq('user_id', user.id)
console.log('deleted rows:', count, 'error:', error?.message || null)
