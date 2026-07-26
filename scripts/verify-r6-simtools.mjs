// Runda 6, punctul 2 — sim_ritual trebuie sa functioneze in dev, sa fie
// inert in productie (next start, acelasi build ca live).
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './dev-login.mjs'

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const admin = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function sessionCookie(base) {
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({ type: 'magiclink', email: DEV_EMAIL })
  if (linkErr) throw new Error(linkErr.message)
  const anon = createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
  const { data: sess, error: otpErr } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'email' })
  if (otpErr) throw new Error(otpErr.message)
  const ref = new URL(url).hostname.split('.')[0]
  const value = 'base64-' + Buffer.from(JSON.stringify(sess.session)).toString('base64url')
  return { name: `sb-${ref}-auth-token`, value, domain: new URL(base).hostname, path: '/' }
}

async function checkRitual(base, label) {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.addCookies([
    await sessionCookie(base),
    { name: 'try_free', value: '1', domain: new URL(base).hostname, path: '/' },
  ])
  const p = await ctx.newPage()
  await p.goto(`${base}/dashboard`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1000)
  const before = await p.evaluate(() => document.body.innerText.slice(0, 400))

  // e ~01:09 real acum, deci natural arata "evening" (confirma si punctul 1) —
  // fortam OPUSUL (morning) ca sa avem un contrast real, nu o coincidenta.
  await p.evaluate(() => localStorage.setItem('sim_ritual', 'morning'))
  await p.reload({ waitUntil: 'networkidle' })
  await p.waitForTimeout(1000)
  const after = await p.evaluate(() => document.body.innerText.slice(0, 400))

  console.log(`--- ${label} (${base}) ---`)
  console.log('inainte de sim_ritual=morning (natural):', JSON.stringify(before.split('\n')[0] || before.slice(0, 60)))
  console.log('dupa sim_ritual=morning:                ', JSON.stringify(after.split('\n')[0] || after.slice(0, 60)))
  console.log('s-a schimbat (asteptat: DA in dev, NU in prod):', before !== after)

  await browser.close()
}

await checkRitual('http://localhost:3000', 'DEV (next dev)')
await checkRitual('http://localhost:3001', 'PROD (next start)')
console.log('DONE')
