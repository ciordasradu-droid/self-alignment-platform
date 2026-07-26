// Runda 5, punctul 2 — masoara opacitatile la frecventa inalta (100ms) in
// timpul unei generari REALE (nu o pagina linistita), ca sa vedem daca
// incrucisarea curge sau sare cand pagina e ocupata.
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
await p.fill('.ob-field input[type="text"]', 'Test Runda5b')
await p.fill('.ob-datepart', '2')
await p.selectOption('.ob-datemonth', '6')
await p.fill('.ob-dateyear', '1988')
await p.locator('input[type="checkbox"]').check()
await p.fill('.ob-cityfield input', 'Brasov')
try {
  await p.waitForSelector('.ob-suggestion', { timeout: 8000 })
  await p.locator('.ob-suggestion').first().click()
} catch (e) {}
await p.locator('.ob-cta').click()
await p.waitForSelector('.ob-textarea')
await p.fill('.ob-textarea', 'Test runda 5 — crossfade.')
await p.locator('input[type="checkbox"]').check()
await p.locator('.ob-cta').click()

await p.waitForURL('**/generating**', { timeout: 8000 })
console.log('la /generating — esantionare opacitati incepe (generare reala in curs)')

// esantioneaza 25s la fiecare 100ms (~2.6 bucle complete de 9.6s)
const samples = []
const t0 = Date.now()
while (Date.now() - t0 < 25000) {
  const s = await p.evaluate(() => {
    const vids = document.querySelectorAll('.watervideo-el')
    return Array.from(vids).map(v => ({ op: v.style.opacity, ct: v.currentTime }))
  })
  samples.push({ t: Date.now() - t0, v0op: s[0]?.op, v0ct: s[0]?.ct, v1op: s[1]?.op, v1ct: s[1]?.ct })
  await p.waitForTimeout(100)
}

// gaseste sariturile mari de opacitate intre esantioane consecutive (ar
// insemna ca incrucisarea a sarit, nu a curs)
let maxJump = 0
let jumpAt = null
for (let i = 1; i < samples.length; i++) {
  const prev = parseFloat(samples[i - 1].v0op || '0')
  const cur = parseFloat(samples[i].v0op || '0')
  const jump = Math.abs(cur - prev)
  if (jump > maxJump) { maxJump = jump; jumpAt = samples[i].t }
}

console.log('total esantioane:', samples.length)
console.log('cea mai mare saritura de opacitate intre esantioane consecutive (100ms):', maxJump.toFixed(3), 'la +' + jumpAt + 'ms')
console.log('(o incrucisare care curge normal, esantionata la 100ms pe o fereastra de 1100ms, ar avea sarituri de ~0.09-0.15 intre esantioane; o saritura mult mai mare ar insemna cadre sarite)')

// afiseaza fereastra din jurul celei mai mari treceri (opacitate intre 0.05 si 0.95)
const transitionSamples = samples.filter(s => {
  const o = parseFloat(s.v0op || '0')
  return o > 0.02 && o < 0.98
})
console.log('esantioane in timpul unei treceri (opacitate intre 0.02 si 0.98):', transitionSamples.length)
console.log(JSON.stringify(transitionSamples.slice(0, 20), null, 2))

await browser.close()
console.log('DONE')
