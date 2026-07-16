// scripts/verify-water.mjs
// Verifica ce NU se vede intr-o captura statica:
//  1. apa CHIAR se misca (doua cadre, comparate pixel cu pixel)
//  2. tap-ul CHIAR naste o unda (legea 2)
//  3. fundalul e apa (indigo->pruna), nu negru plat
//  4. prefers-reduced-motion opreste miscarea
//
// Masuram pe capturi reale, nu prin readPixels: contextul WebGL al aplicatiei
// e creat fara preserveDrawingBuffer (asa trebuie, e mai rapid), deci
// readPixels de dinafara intoarce zero-uri si ar minti.
//
//   node scripts/verify-water.mjs

import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { devLogin } from './dev-login.mjs'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const session = await devLogin()
const browser = await chromium.launch()

async function setup(ctx) {
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
}

// zona de apa curata: sus, deasupra cardurilor
const WATER = { x: 0, y: 60, width: 390, height: 260 }

const shot = (page, clip) => page.screenshot({ clip: clip || WATER })
const raw = async (buf) => sharp(buf).raw().toBuffer({ resolveWithObject: true })

// Diferenta intre doua capturi: media SI maximul.
// Media singura minte pentru un inel subtire — se dilueaza in restul cadrului.
// Pentru unda de la atingere conteaza varful, nu media.
async function delta(a, b) {
  const [x, y] = await Promise.all([raw(a), raw(b)])
  let sum = 0, max = 0
  for (let i = 0; i < x.data.length; i += 4) {
    const d = Math.abs(x.data[i] - y.data[i]) + Math.abs(x.data[i+1] - y.data[i+1]) + Math.abs(x.data[i+2] - y.data[i+2])
    sum += d
    if (d > max) max = d
  }
  return { medie: Math.round(sum / (x.data.length / 4)), varf: max }
}

const results = []
const ok = (name, pass, detail) => results.push({ name, pass, detail })

// ── 1, 2, 3 ──
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await setup(ctx)
  const page = await ctx.newPage()
  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2200)

  const a = await shot(page)
  await page.waitForTimeout(1600)
  const b = await shot(page)
  const moved = await delta(a, b)
  ok('apa se misca (2 cadre / 1.6s)', moved.medie >= 1, `medie ${moved.medie} | varf ${moved.varf}`)

  // culoarea apei: media zonei de sus
  const st = await sharp(a).stats()
  const [r, g, bl] = st.channels.map(c => Math.round(c.mean))
  ok('fundalul nu e negru plat', (r + g + bl) > 24, `RGB mediu = ${r},${g},${bl}`)
  ok('nuanta indigo/pruna (albastru domina)', bl > r && bl > g, `RGB mediu = ${r},${g},${bl}`)

  // ── ripple la tap ──
  const before = await shot(page)
  await page.mouse.click(195, 190)
  await page.waitForTimeout(260)
  const after = await shot(page)
  const rippled = await delta(before, after)
  // inelul e subtire: conteaza VARFUL, nu media pe tot cadrul
  ok('tap -> unda vizibila', rippled.varf >= 25, `varf ${rippled.varf} | medie ${rippled.medie}`)

  await ctx.close()
}

// ── 4 ──
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await setup(ctx)
  const page = await ctx.newPage()
  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2200)
  const a = await shot(page)
  await page.waitForTimeout(1600)
  const b = await shot(page)
  const d = await delta(a, b)
  ok('reduced-motion: apa sta pe loc', d.varf === 0, `varf ${d.varf}`)
  await ctx.close()
}

await browser.close()

let failed = 0
for (const r of results) {
  console.log(`  ${r.pass ? 'DA ' : 'NU '} ${r.name.padEnd(36)} ${r.detail}`)
  if (!r.pass) failed++
}
console.log(failed ? `\n${failed} verificari picate` : '\nToate verificarile trec.')
process.exit(failed ? 1 : 0)
