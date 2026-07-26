// Runda 4 — verificare toate 3 punctele, profil ro, toate 11 limbile app.
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './dev-login.mjs'

const BASE = process.env.VBASE || 'http://localhost:3000'
const LANGS = ['en','ro','es','fr','de','it','pt','nl','pl','hu','ru']

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

for (const appLang of LANGS) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.addCookies(cookies)
  const p = await ctx.newPage()
  await p.addInitScript((l) => { localStorage.setItem('app_language', l) }, appLang)
  await p.goto(`${BASE}/profile`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)

  const gateButtons = await p.locator('button[aria-pressed]').count()
  if (gateButtons > 0) {
    for (let i = 0; i < gateButtons; i++) await p.locator('button[aria-pressed]').nth(i).click()
    await p.locator('button.cta-premium').click()
    await p.waitForTimeout(1200)
  }

  const result = await p.evaluate(() => {
    const nav = document.querySelector('.room-nav')
    const notice = Array.from(document.querySelectorAll('main p')).map(p => p.textContent)
      .find(t => /written in|scris în|escrito en|écrit en|geschrieben|scritto in|escrito em|geschreven in|napisany|íródott|написан/i.test(t)) || null
    const copyBtn = Array.from(document.querySelectorAll('button')).find(b => /copy|copiaz|copiar|copier|kopier|copia|kopiuj|másol|копир/i.test(b.textContent))?.textContent
    return {
      navAriaLabel: nav?.getAttribute('aria-label'),
      notice,
      copyBtn,
    }
  })
  console.log(`--- appLang=${appLang} ---`)
  console.log('  RoomNav aria-label:', result.navAriaLabel)
  console.log('  Honest line:', result.notice)
  console.log('  Copy button:', result.copyBtn)

  await ctx.close()
}

await browser.close()
console.log('DONE')
