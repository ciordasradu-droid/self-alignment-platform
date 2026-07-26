// Test explicit cerut de Alex: refresh pe /generating la 60s dupa start.
// Cu arhitectura server-side (id opac, onboarding_sessions), un refresh
// trebuie sa ramana pe /generating (recitind dupa id), nu sa trimita la
// /onboarding cu formularul pierdut.
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
await p.fill('.ob-field input[type="text"]', 'Test Refresh R2')
await p.fill('.ob-datepart', '9')
await p.selectOption('.ob-datemonth', '5')
await p.fill('.ob-dateyear', '1988')
await p.locator('input[type="checkbox"]').check()
await p.fill('.ob-cityfield input', 'Iasi')
try {
  await p.waitForSelector('.ob-suggestion', { timeout: 8000 })
  await p.locator('.ob-suggestion').first().click()
} catch (e) {}
await p.locator('.ob-cta').click()
await p.waitForSelector('.ob-textarea')
await p.fill('.ob-textarea', 'Test runda 2 — refresh la 60s.')
await p.locator('input[type="checkbox"]').check()
await p.locator('.ob-cta').click()

await p.waitForURL('**/generating**', { timeout: 8000 })
console.log('la /generating, url:', p.url())

await p.waitForTimeout(60000)
console.log('inainte de refresh, la 60s, url:', p.url())

await p.reload({ waitUntil: 'networkidle' })
await p.waitForTimeout(3000)
console.log('dupa refresh, url:', p.url())

if (p.url().includes('/onboarding')) {
  console.log('EȘUAT: refresh-ul la 60s trimite la /onboarding, formularul e pierdut.')
} else if (p.url().includes('/generating')) {
  console.log('OK: refresh-ul a ramas pe /generating (id-ul opac ramane in URL, datele se recitesc de pe server).')
} else {
  console.log('stare neasteptata:', p.url())
}

await browser.close()
console.log('DONE')
