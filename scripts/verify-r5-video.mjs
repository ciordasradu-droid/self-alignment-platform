// Runda 5 — verificare vizuala a fundalului de apa, pe o fila REALA, VIZIBILA
// (headless:false), cu generare reala in curs (nu o pagina linistita).
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './dev-login.mjs'

const BASE = process.env.VBASE || 'http://localhost:3000'
const OUT = 'C:/Users/user/AppData/Local/Temp/claude/C--Users-user/c6903210-ea69-4138-92a9-9c54db9c7a0f/scratchpad'

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

const videoRequests = []
p.on('request', req => {
  if (req.url().includes('ocean-base.mp4')) videoRequests.push({ url: req.url(), time: Date.now() })
})

await p.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' })
await p.waitForSelector('.ob-flags')
await p.locator('.ob-flag', { hasText: 'Română' }).click()
await p.waitForSelector('.ob-vision')
await p.locator('.ob-cta').click()
await p.waitForSelector('.ob-daterow')
await p.fill('.ob-field input[type="text"]', 'Test Runda5')
await p.fill('.ob-datepart', '14')
await p.selectOption('.ob-datemonth', '9')
await p.fill('.ob-dateyear', '1990')
await p.locator('input[type="checkbox"]').check()
await p.fill('.ob-cityfield input', 'Timisoara')
try {
  await p.waitForSelector('.ob-suggestion', { timeout: 8000 })
  await p.locator('.ob-suggestion').first().click()
} catch (e) {}
await p.locator('.ob-cta').click()
await p.waitForSelector('.ob-textarea')
await p.fill('.ob-textarea', 'Test runda 5 — fundal video.')
await p.locator('input[type="checkbox"]').check()
await p.locator('.ob-cta').click()

await p.waitForURL('**/generating**', { timeout: 8000 })
console.log('la /generating, verificare video incepe')

// Point 1: readyState al video[1] inainte de prima incrucisare
await p.waitForTimeout(2000)
const readyStates = await p.evaluate(() => {
  const vids = document.querySelectorAll('.watervideo-el')
  return Array.from(vids).map(v => ({ readyState: v.readyState, paused: v.paused, src: v.currentSrc.split('/').pop() }))
})
console.log('readyState-uri initiale (dupa amorsare):', JSON.stringify(readyStates))

await p.screenshot({ path: `${OUT}/r5-screenshot-1.png` })

// urmarim ~40s (ar trebui sa prindem cel putin o incrucisare daca placa e scurta;
// altfel doar confirmam ca nu e gol vizibil in acest interval)
for (let i = 0; i < 8; i++) {
  await p.waitForTimeout(5000)
  await p.screenshot({ path: `${OUT}/r5-screenshot-${i + 2}.png` })
}

console.log('cereri catre ocean-base.mp4:', videoRequests.length)
videoRequests.forEach((r, i) => console.log(`  #${i + 1} la +${r.time - videoRequests[0]?.time}ms`))

await browser.close()
console.log('DONE')
