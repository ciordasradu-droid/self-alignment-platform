// Verificare Runda 2, punctul 1 — datele de nastere nu mai trec prin query string.
// Flux complet cu sesiune reala (dev-login, fara email), FARA sa porneasca generarea
// (API-urile de generare sunt blocate in test — /api/onboarding/session ramane
// permis, e doar handoff-ul server-side pentru id-ul opac, fara Claude).
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
const CHUNK = 3180
const cookies = []
if (value.length <= CHUNK) {
  cookies.push({ name: `sb-${ref}-auth-token`, value, domain: new URL(BASE).hostname, path: '/' })
} else {
  for (let i = 0; i * CHUNK < value.length; i++) {
    cookies.push({ name: `sb-${ref}-auth-token.${i}`, value: value.slice(i * CHUNK, (i + 1) * CHUNK), domain: new URL(BASE).hostname, path: '/' })
  }
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
await ctx.addCookies(cookies)
const p = await ctx.newPage()

// API-urile de generare NU au voie sa porneasca din test (cost Claude).
// /api/onboarding/session ramane permis — e doar handoff-ul server-side
// pentru id-ul opac, fara niciun apel catre Claude.
await p.route('**/api/**', r => {
  if (r.request().url().includes('/api/onboarding/session')) return r.continue()
  return r.abort()
})

await p.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' })
if (!p.url().includes('/onboarding')) throw new Error('redirect neasteptat: ' + p.url())

await p.waitForSelector('.ob-flags')
await p.locator('.ob-flag', { hasText: 'Română' }).click()

await p.waitForSelector('.ob-vision')
await p.locator('.ob-cta').click()

await p.waitForSelector('.ob-daterow')
await p.fill('.ob-field input[type="text"]', 'Test Runda2')
await p.fill('.ob-datepart', '21')
await p.selectOption('.ob-datemonth', '7')
await p.fill('.ob-dateyear', '1985')
await p.locator('input[type="checkbox"]').check()
await p.fill('.ob-cityfield input', 'Bucuresti')
try {
  await p.waitForSelector('.ob-suggestion', { timeout: 8000 })
  await p.locator('.ob-suggestion').first().click()
} catch (e) {
  console.log('nominatim indisponibil:', e.message)
}
await p.locator('.ob-cta').click()

await p.waitForSelector('.ob-textarea')
await p.fill('.ob-textarea', 'Test runda 2 — verificare query string.')
await p.locator('input[type="checkbox"]').check()
await p.locator('.ob-cta').click()

await p.waitForURL('**/generating**', { timeout: 8000 })
const finalUrl = p.url()
console.log('URL pe /generating:', finalUrl)

const leakPatterns = ['Test Runda2', 'Test%20Runda2', '1985', 'data=', 'full_name', 'date_of_birth']
const leaks = leakPatterns.filter(pat => finalUrl.includes(pat))
console.log('tipare de date personale gasite in URL:', leaks.length ? leaks.join(', ') : 'NICIUNUL')
console.log('id opac in URL:', /[?&]id=[0-9a-f-]{36}/.test(finalUrl) ? 'da' : 'NU (neasteptat)')

await browser.close()
console.log('DONE')
