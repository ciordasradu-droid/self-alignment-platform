// scripts/reset-account.mjs — sect. G (addendum 26.07). Unealtă de reset
// per cont: șterge consemnările, prezența, profilul și stările derivate,
// lăsând contul ca în prima zi. NU expusă în UI-ul public — doar operare,
// rulată local, cu service_role (aceeași disciplină ca dev-login.mjs).
//
// Folosire:
//   node scripts/reset-account.mjs <email> --yes
//
// NU se ating: subscriptions (facturare reală, nu date de test),
// spots (contor GLOBAL, nu per-cont), referrals unde contul e
// REFERITORUL altcuiva (nu e starea proprie a contului).

import { createClient } from '@supabase/supabase-js'
import { loadEnv } from './dev-login.mjs'

const email = process.argv[2]
const confirmed = process.argv.includes('--yes')

if (!email) {
  console.error('Folosire: node scripts/reset-account.mjs <email> --yes')
  process.exit(1)
}
if (!confirmed) {
  console.error('Lipsește --yes. Rulează din nou cu --yes ca să confirmi resetul (ireversibil).')
  process.exit(1)
}

const env = loadEnv()
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
const user = list?.users?.find(u => u.email === email)
if (!user) {
  console.error(`Niciun user cu email-ul ${email}.`)
  process.exit(1)
}
const userId = user.id
console.log(`Resetez contul ${email} (${userId})...\n`)

// Ordine importantă: interpreted_profiles are FK catre calculated_profiles
// (copilul se sterge inaintea parintelui, altfel Postgres refuza).
const PER_USER_TABLES = [
  'checkins',
  'streaks',
  'interpreted_profiles',
  'calculated_profiles',
  'patterns_insights',
  'weekly_reviews',
  'compatibility_profiles',
  'daily_insights',
  'rate_limits',
]

for (const table of PER_USER_TABLES) {
  const { error, count } = await admin.from(table).delete({ count: 'exact' }).eq('user_id', userId)
  if (error) console.log(`  [EROARE] ${table}: ${error.message}`)
  else console.log(`  ${table}: ${count ?? 0} rânduri șterse`)
}

// invites: un singur rand per user (invite_code = user_id), sters direct.
{
  const { error, count } = await admin.from('invites').delete({ count: 'exact' }).eq('user_id', userId)
  if (error) console.log(`  [EROARE] invites: ${error.message}`)
  else console.log(`  invites: ${count ?? 0} rânduri șterse`)
}

// referrals: doar randul in care ACEST cont a fost cel NOU (venit printr-o
// invitatie) — nu si randurile unde el a invitat pe altcineva, care nu tin
// de starea LUI, ci de a celuilalt.
{
  const { error, count } = await admin.from('referrals').delete({ count: 'exact' }).eq('new_user_id', userId)
  if (error) console.log(`  [EROARE] referrals (ca invitat): ${error.message}`)
  else console.log(`  referrals (ca invitat): ${count ?? 0} rânduri șterse`)
}

// users: nu se sterge randul (alte tabele au FK catre el) — se reseteaza
// varsta contului la "azi", ca ziua din Drum sa reporneasca de la 1.
{
  const { error } = await admin.from('users').update({
    created_at: new Date().toISOString(),
    current_unlocked_day: 1,
  }).eq('id', userId)
  if (error) console.log(`  [EROARE] users (reset varsta cont): ${error.message}`)
  else console.log('  users: created_at + current_unlocked_day resetate (ziua 1)')
}

// auth.users.user_metadata: sterge urmele de onboarding vechi (punctul de
// plecare scris, documentul de angajament) — contul arata ca inainte sa
// fi trecut prima data prin onboarding.
{
  const { error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: {},
  })
  if (error) console.log(`  [EROARE] user_metadata: ${error.message}`)
  else console.log('  auth.users.user_metadata: golit (starting_point, commitment_document etc.)')
}

console.log(`\nGata. Contul ${email} arată ca în prima zi.`)
console.log('NEATINSE, deliberat: subscriptions (facturare reală), spots (contor global), referrals unde acest cont a invitat pe altcineva.')
