// Runda 2, punctul 3 — mesajele de progres nu au voie sa regreseze.
// Esantioneaza textul afisat la fiecare 15s in timpul unei generari reale.
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './dev-login.mjs'

const BASE = process.env.VBASE || 'http://localhost:3000'

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
const cookies = [{ name: `sb-${ref}-auth-token`, value, domain: new URL(BASE).hostname, path: '/' }]

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
await ctx.addCookies(cookies)
const p = await ctx.newPage()

await p.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' })
await p.waitForSelector('.ob-flags')
await p.locator('.ob-flag', { hasText: 'Română' }).click()
await p.waitForSelector('.ob-vision')
await p.locator('.ob-cta').click()
await p.waitForSelector('.ob-daterow')
await p.fill('.ob-field input[type="text"]', 'Test Progres R2')
await p.fill('.ob-datepart', '3')
await p.selectOption('.ob-datemonth', '11')
await p.fill('.ob-dateyear', '1992')
await p.locator('input[type="checkbox"]').check()
await p.fill('.ob-cityfield input', 'Cluj-Napoca')
try {
  await p.waitForSelector('.ob-suggestion', { timeout: 8000 })
  await p.locator('.ob-suggestion').first().click()
} catch (e) {}
await p.locator('.ob-cta').click()
await p.waitForSelector('.ob-textarea')
await p.fill('.ob-textarea', 'Test runda 2 — mesaje de progres.')
await p.locator('input[type="checkbox"]').check()
await p.locator('.ob-cta').click()

await p.waitForURL('**/generating**', { timeout: 8000 })

const t0 = Date.now()
let done = false
p.waitForURL('**/profile**', { timeout: 300000 }).then(() => { done = true }).catch(() => {})

while (!done) {
  await p.waitForTimeout(15000)
  const elapsed = Math.round((Date.now() - t0) / 1000)
  if (done) { console.log(`+${elapsed}s: already on /profile`); break }
  try {
    const text = await p.evaluate(() => document.querySelector('main p')?.textContent ?? null)
    console.log(`+${elapsed}s: ${text === null ? '(no <main p> found — url: ' + p.url() + ')' : `"${text}"`}`)
  } catch (e) {
    console.log(`+${elapsed}s: evaluate failed — ${e.message}`)
  }
}
console.log('a ajuns la /profile, generare completa')

await browser.close()
console.log('DONE')
