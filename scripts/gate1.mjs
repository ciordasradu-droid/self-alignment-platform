// scripts/gate1.mjs — materialele pentru Poarta 1.
// Compune: (a) ziua 1 vs ziua 90 alaturi, (b) banda de cadre cu miscarea apei.
// Daca exista o referinta (poze/referinta-7-stadii.*), o pune in stanga.
//
//   node scripts/gate1.mjs

import { chromium } from '@playwright/test'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { devLogin } from './dev-login.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, '.screenshots')
const BASE = 'http://localhost:3000'
fs.mkdirSync(OUT, { recursive: true })

const session = await devLogin()
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const ref = new URL(session.supabase_url).hostname.split('.')[0]
const payload = Buffer.from(JSON.stringify({
  access_token: session.access_token, refresh_token: session.refresh_token,
  expires_at: Math.floor(Date.now() / 1000) + 3600, expires_in: 3600,
  token_type: 'bearer', user: { id: session.user_id, email: session.email },
})).toString('base64')
await ctx.addCookies([
  { name: `sb-${ref}-auth-token`, value: 'base64-' + payload, url: BASE },
  { name: 'try_free', value: 'true', url: BASE },
])

// zona apei (hero), fara carduri
const HERO = { x: 0, y: 60, width: 390, height: 400 }

async function grab(url, clip = HERO, settle = 2600) {
  const p = await ctx.newPage()
  await p.goto(BASE + url, { waitUntil: 'networkidle' })
  await p.waitForTimeout(settle)
  const b = await p.screenshot({ clip })
  await p.close()
  return b
}

const label = (text, w) => Buffer.from(
  `<svg width="${w}" height="46"><rect width="${w}" height="46" fill="#0d0b18"/>` +
  `<text x="${w/2}" y="30" font-family="sans-serif" font-size="19" fill="#f4ecd9" text-anchor="middle">${text}</text></svg>`
)

// ── (a) ziua 1 vs ziua 90 ──
const d1 = await grab('/dashboard?day=1')
const d90 = await grab('/dashboard?day=90')
const W = 780, H = 800   // 390x400 @2x

await sharp({ create: { width: W * 2 + 24, height: H + 46, channels: 3, background: '#0d0b18' } })
  .composite([
    { input: label('ZIUA 1 — First Drop', W), top: 0, left: 0 },
    { input: label('ZIUA 90 — The Ocean', W), top: 0, left: W + 24 },
    { input: d1, top: 46, left: 0 },
    { input: d90, top: 46, left: W + 24 },
  ]).png().toFile(path.join(OUT, 'gate1-stadii.png'))
console.log('  gate1-stadii.png       (ziua 1 vs ziua 90)')

// ── (b) banda de miscare: 3 cadre la ~1.2s ──
const page = await ctx.newPage()
await page.goto(BASE + '/dashboard?day=30', { waitUntil: 'networkidle' })
await page.waitForTimeout(2600)
const frames = []
for (let i = 0; i < 3; i++) {
  frames.push(await page.screenshot({ clip: HERO }))
  await page.waitForTimeout(1200)
}
await page.close()

await sharp({ create: { width: W * 3 + 48, height: H + 46, channels: 3, background: '#0d0b18' } })
  .composite([
    { input: label('cadrul 1', W), top: 0, left: 0 },
    { input: label('+1.2s', W), top: 0, left: W + 24 },
    { input: label('+2.4s', W), top: 0, left: (W + 24) * 2 },
    ...frames.map((f, i) => ({ input: f, top: 46, left: (W + 24) * i })),
  ]).png().toFile(path.join(OUT, 'gate1-miscare.png'))
console.log('  gate1-miscare.png      (3 cadre, apa in miscare)')

// ── (c) hero + fundal pe telefon, cadru intreg ──
const full = await grab('/dashboard?day=1', { x: 0, y: 0, width: 390, height: 844 })
fs.writeFileSync(path.join(OUT, 'gate1-telefon.png'), full)
console.log('  gate1-telefon.png      (ecran intreg, 390x844)')

await browser.close()
