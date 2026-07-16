// scripts/dev-login.mjs
// Login de DEZVOLTARE, fara email. Niciun test nu mai asteapta un link.
//
//   node scripts/dev-login.mjs            -> creeaza/refoloseste userul de test si scoate tokenii
//   node scripts/dev-login.mjs --json     -> doar JSON (pentru alte scripturi)
//
// Foloseste service_role, deci RULEAZA DOAR LOCAL. Nu importa nimic din asta in
// aplicatie. Userul de test e confirmat direct (email_confirm: true), deci
// Supabase nu trimite niciun email si limita de rate nu ne mai atinge.

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')

export function loadEnv() {
  const file = path.join(ROOT, '.env.local')
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split(/\r?\n/)
      .filter(l => l.includes('=') && !l.trim().startsWith('#'))
      .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  )
}

export const DEV_EMAIL = 'dev+water@self-alignment.local'

export async function devLogin({ email = DEV_EMAIL } = {}) {
  const env = loadEnv()
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const admin = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

  // 1. userul de test — confirmat din start, deci zero emailuri
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
  let user = list?.users?.find(u => u.email === email)
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      password: crypto.randomUUID() + 'Aa1!',
      user_metadata: { dev: true },
    })
    if (error) throw new Error('createUser: ' + error.message)
    user = data.user
  }

  // 2. randul din users (in aplicatie il creeaza /auth/callback)
  await admin.from('users').upsert({ id: user.id, email }, { onConflict: 'id', ignoreDuplicates: true })

  // 3. sesiune reala, fara sa deschidem vreun inbox:
  //    generateLink ne da token_hash-ul, verifyOtp il preschimba in sesiune.
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({ type: 'magiclink', email })
  if (linkErr) throw new Error('generateLink: ' + linkErr.message)

  const anon = createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
  const { data: sess, error: otpErr } = await anon.auth.verifyOtp({
    token_hash: link.properties.hashed_token,
    type: 'email',
  })
  if (otpErr) throw new Error('verifyOtp: ' + otpErr.message)

  return {
    user_id: user.id,
    email,
    access_token: sess.session.access_token,
    refresh_token: sess.session.refresh_token,
    supabase_url: url,
    anon_key: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

// rulat direct din linia de comanda
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('dev-login.mjs')) {
  const s = await devLogin()
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(s))
  } else {
    console.log('Login de dev reusit — fara email.')
    console.log('  user  :', s.email)
    console.log('  id    :', s.user_id)
    console.log('  token :', s.access_token.slice(0, 24) + '…')
  }
}
