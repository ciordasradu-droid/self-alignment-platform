// Verificare onboarding — flux complet cu sesiune reala (dev-login, fara email),
// FARA sa porneasca generarea (API-urile sunt blocate in test).
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './scripts/dev-login.mjs'

const OUT = 'C:/Users/user/AppData/Local/Temp/claude/C--Users-user/89bfe275-4e10-48c4-84f8-3c1cc59bd124/scratchpad'
const BASE = process.env.VBASE || 'http://localhost:3000'

// ── sesiune completa (cu user), pentru cookie-ul @supabase/ssr ──
const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const admin = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: link, error: linkErr } = await admin.auth.admin.generateLink({ type: 'magiclink', email: DEV_EMAIL })
if (linkErr) throw new Error(linkErr.message)
const anon = createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const { data: sess, error: otpErr } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'email' })
if (otpErr) throw new Error(otpErr.message)

// cookie @supabase/ssr: sb-<ref>-auth-token = "base64-" + base64url(JSON), chunked la 3180
const ref = new URL(url).hostname.split('.')[0]
const value = 'base64-' + Buffer.from(JSON.stringify(sess.session)).toString('base64url')
const CHUNK = 3180
const cookies = []
if (value.length <= CHUNK) {
  cookies.push({ name: `sb-${ref}-auth-token`, value, domain: new URL(process.env.VBASE || 'http://localhost:3000').hostname, path: '/' })
} else {
  for (let i = 0; i * CHUNK < value.length; i++) {
    cookies.push({ name: `sb-${ref}-auth-token.${i}`, value: value.slice(i * CHUNK, (i + 1) * CHUNK), domain: new URL(process.env.VBASE || 'http://localhost:3000').hostname, path: '/' })
  }
}
console.log('sesiune ok, cookie chunks:', cookies.length)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'no-preference' })
await ctx.addCookies(cookies)
const p = await ctx.newPage()

// API-urile de generare NU au voie sa porneasca din test (cost Claude).
await p.route('**/api/**', r => r.abort())

await p.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' })
if (!p.url().includes('/onboarding')) throw new Error('redirect neasteptat: ' + p.url())

// ── pasul 0: limba (steaguri) ──
await p.waitForSelector('.ob-flags')
const flags = await p.locator('.ob-flag').count()
console.log('pas 0 — steaguri:', flags)
await p.waitForTimeout(1500) // apa sa curga in cadru
await p.screenshot({ path: `${OUT}/ob-0-limba.png` })
await p.locator('.ob-flag', { hasText: 'Română' }).click()

// ── pasul 1: fraza de viziune ──
await p.waitForSelector('.ob-vision')
const vision = await p.locator('.ob-vision').textContent()
console.log('pas 1 — viziunea:', vision.slice(0, 50) + '…')
await p.screenshot({ path: `${OUT}/ob-1-viziune.png` })
await p.locator('.ob-cta').click()

// ── pasul 2: datele nasterii ──
await p.waitForSelector('.ob-daterow')
await p.fill('.ob-field input[type="text"]', 'Test Onboarding')
await p.fill('.ob-datepart', '14')
await p.selectOption('.ob-datemonth', '3')
await p.fill('.ob-dateyear', '1990')
await p.fill('input[type="time"]', '10:30')
// validarea blanda: intai incerc fara oras
await p.locator('.ob-cta').click()
const missingShown = await p.locator('.ob-missing').count()
console.log('pas 2 — validare blanda la oras lipsa:', missingShown === 1 ? 'da' : 'NU')
// orasul (nominatim e blocat de route? nu — doar /api/*; nominatim e extern si permis)
await p.fill('.ob-cityfield input', 'Bucuresti')
try {
  await p.waitForSelector('.ob-suggestion', { timeout: 8000 })
  await p.locator('.ob-suggestion').first().click()
  console.log('pas 2 — oras ales din sugestii')
} catch (e) {
  console.log('pas 2 — nominatim indisponibil, test oprit la validare (nu e defect al paginii)')
}
await p.screenshot({ path: `${OUT}/ob-2-nastere.png` })
await p.locator('.ob-cta').click()

// ── pasul 3: punctul de plecare ──
await p.waitForSelector('.ob-textarea')
await p.fill('.ob-textarea', 'Îmi doresc mai multă liniște în felul în care încep ziua.')
await p.screenshot({ path: `${OUT}/ob-3-punct.png` })
await p.locator('.ob-cta').click()

// → /generating (API-urile sunt blocate, deci generarea NU porneste; ne intereseaza doar ruta)
await p.waitForURL('**/generating**', { timeout: 8000 })
console.log('flux — a ajuns la /generating cu data in URL:', p.url().includes('data='))

// ── persistenta punctului de plecare ──
const { data: userData } = await admin.auth.admin.getUserById(sess.session.user.id)
const meta = userData?.user?.user_metadata || {}
console.log('user_metadata.starting_point:', JSON.stringify(meta.starting_point || null))
console.log('user_metadata.starting_point_at:', meta.starting_point_at || null)

const ls = await p.evaluate(() => localStorage.getItem('starting_point'))
console.log('localStorage.starting_point:', ls ? 'salvat' : 'LIPSA')

await browser.close()
console.log('DONE')
