// scripts/screenshots.mjs
// Capturi automate pentru auto-verificare. Se logheaza fara email (dev-login),
// deci nu depinde de niciun inbox.
//
//   node scripts/screenshots.mjs                 -> toate, la 390x844 si 1440x900
//   node scripts/screenshots.mjs --only=home     -> doar unul
//
// Capturile ies in .screenshots/ (ignorate de git).

import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { devLogin } from './dev-login.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, '.screenshots')
const BASE = process.env.BASE_URL || 'http://localhost:3000'

const VIEWPORTS = [
  { name: 'telefon', width: 390, height: 844, mobile: true },
  { name: 'laptop', width: 1440, height: 900, mobile: false },
]

// Apa se misca: asteptam ca shaderul sa aiba ce arata inainte de captura.
const SETTLE = 2500

const SHOTS = [
  { id: 'landing', path: '/' },
  { id: 'login', path: '/login' },
  { id: 'home', path: '/dashboard', auth: true },
  { id: 'home-ziua90', path: '/dashboard?day=90', auth: true },
  { id: 'morning', path: '/dashboard', auth: true },
  { id: 'evening', path: '/dashboard', auth: true, click: 'seara' },
  { id: 'profil', path: '/profile', auth: true },
  { id: 'playground', path: '/dev/water' },
]

const only = process.argv.find(a => a.startsWith('--only='))?.split('=')[1]

fs.mkdirSync(OUT, { recursive: true })

const session = await devLogin()
console.log('logat ca', session.email, '(fara email)\n')

const browser = await chromium.launch()
let n = 0

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    colorScheme: 'dark',
  })

  // sesiunea intra in cookie-uri prin clientul de browser, exact ca la un login real
  const page = await ctx.newPage()
  await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' })
  await page.evaluate(async (s) => {
    const { createBrowserClient } = await import('/_next/static/chunks/supabase-shim.js').catch(() => ({}))
    // fallback: folosim clientul deja incarcat de aplicatie
    if (window.__setDevSession) return window.__setDevSession(s)
  }, session).catch(() => {})

  // calea sigura: punem cookie-ul de sesiune direct, in formatul @supabase/ssr
  const ref = new URL(session.supabase_url).hostname.split('.')[0]
  const payload = Buffer.from(JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: 'bearer',
    user: { id: session.user_id, email: session.email },
  })).toString('base64')
  await ctx.addCookies([
    { name: `sb-${ref}-auth-token`, value: 'base64-' + payload, url: BASE },
    { name: 'try_free', value: 'true', url: BASE },   // poarta de abonament
  ])

  for (const shot of SHOTS) {
    if (only && shot.id !== only) continue
    const p = await ctx.newPage()
    const errors = []
    p.on('pageerror', e => errors.push(e.message))
    try {
      await p.goto(BASE + shot.path, { waitUntil: 'networkidle', timeout: 30000 })
      if (shot.click) {
        await p.getByRole('button', { name: new RegExp(shot.click, 'i') }).first().click({ timeout: 3000 }).catch(() => {})
      }
      await p.waitForTimeout(SETTLE)
      const file = path.join(OUT, `${shot.id}-${vp.name}.png`)
      await p.screenshot({ path: file, fullPage: false })
      n++
      console.log(`  ${shot.id.padEnd(14)} ${vp.name.padEnd(8)} ${errors.length ? 'ERORI: ' + errors[0].slice(0, 60) : 'ok'}`)
    } catch (e) {
      console.log(`  ${shot.id.padEnd(14)} ${vp.name.padEnd(8)} ESUAT: ${e.message.slice(0, 70)}`)
    }
    await p.close()
  }
  await ctx.close()
}

await browser.close()
console.log(`\n${n} capturi in .screenshots/`)
