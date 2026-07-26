// Utilitar de test: verifica daca exista deja un profil complet (ro) pentru
// contul de dev, ca sa nu mai platim o generare noua doar pentru un test de UI.
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './dev-login.mjs'

const env = loadEnv()
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
const user = list.users.find(u => u.email === DEV_EMAIL)
console.log('user_id:', user.id)

const { data, error } = await admin
  .from('interpreted_profiles')
  .select('id, language, sections, alignment_plan, created_at')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .limit(5)

console.log('error:', error?.message || null)
for (const row of data || []) {
  console.log({
    id: row.id,
    language: row.language,
    has_sections: !!row.sections,
    has_plan: !!row.alignment_plan,
    created_at: row.created_at,
  })
}

const { data: agreements, error: agreementsErr } = await admin
  .from('user_agreements')
  .select('user_id, interpreted_profile_id, accepted_at, language')
  .eq('user_id', user.id)
console.log('agreements:', agreementsErr?.message || JSON.stringify(agreements, null, 2))
