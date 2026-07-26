// Utilitar de test: genereaza cookie-ul de sesiune (sb-<ref>-auth-token) pentru
// contul de dev, ca sa poata fi injectat manual intr-un tab de browser (ex.
// prin document.cookie in Claude Browser), fara Playwright.
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './dev-login.mjs'

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const admin = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: link, error: linkErr } = await admin.auth.admin.generateLink({ type: 'magiclink', email: DEV_EMAIL })
if (linkErr) throw new Error(linkErr.message)
const anon = createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const { data: sess, error: otpErr } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'email' })
if (otpErr) throw new Error(otpErr.message)

const ref = new URL(url).hostname.split('.')[0]
const value = 'base64-' + Buffer.from(JSON.stringify(sess.session)).toString('base64url')
console.log(`sb-${ref}-auth-token`)
console.log(value)
