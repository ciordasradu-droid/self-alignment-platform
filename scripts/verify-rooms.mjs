import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './scripts/dev-login.mjs'

const OUT = 'C:/Users/user/AppData/Local/Temp/claude/C--Users-user/89bfe275-4e10-48c4-84f8-3c1cc59bd124/scratchpad'
const BASE = process.env.VBASE || 'http://localhost:3000'
const host = new URL(BASE).hostname

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const admin = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: link } = await admin.auth.admin.generateLink({ type: 'magiclink', email: DEV_EMAIL })
const anon = createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const { data: sess } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'email' })
const ref = new URL(url).hostname.split('.')[0]
const value = 'base64-' + Buffer.from(JSON.stringify(sess.session)).toString('base64url')

const browser = await chromium.launch()

async function visit(page, path, label, viewport) {
  const errors = []
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
  page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message))
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1200)
  const finalUrl = page.url()
  await page.screenshot({ path: `${OUT}/room-${label}.png`, fullPage: false })
  console.log(`${label} [${viewport}] -> ${finalUrl} | errors: ${errors.length}`)
  if (errors.length) console.log('  ' + errors.slice(0, 5).join('\n  '))
  return { finalUrl, errors }
}

for (const [tag, vp] of [['mobile', { width: 390, height: 844, deviceScaleFactor: 2 }], ['desktop', { width: 1440, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'no-preference' })
  await ctx.addCookies([
    { name: `sb-${ref}-auth-token`, value, domain: host, path: '/' },
    { name: 'try_free', value: '1', domain: host, path: '/' },
  ])
  const page = await ctx.newPage()
  await visit(page, '/dashboard', `azi-${tag}`, tag)
  await visit(page, '/drumul', `drumul-${tag}`, tag)
  await visit(page, '/profile', `tu-${tag}`, tag)
  await ctx.close()
}

await browser.close()
console.log('DONE')
