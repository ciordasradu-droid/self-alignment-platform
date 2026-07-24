import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { loadEnv, DEV_EMAIL } from './dev-login.mjs'

const OUT = 'C:/Users/user/AppData/Local/Temp/claude/C--Users-user/89bfe275-4e10-48c4-84f8-3c1cc59bd124/scratchpad'
const BASE = 'http://localhost:3000'
const host = 'localhost'

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const admin = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: link } = await admin.auth.admin.generateLink({ type: 'magiclink', email: DEV_EMAIL })
const anon = createClient(url, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const { data: sess } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: 'email' })
const ref = new URL(url).hostname.split('.')[0]
const value = 'base64-' + Buffer.from(JSON.stringify(sess.session)).toString('base64url')

const MOCK_PROFILE = {
  success: true,
  full_name: 'Alex Testescu',
  language: 'ro',
  personal_year: { personal_year: 3, theme: 'Exprimare', focus: 'Anul in care vorbesti.', warning: 'Nu lasa tacerea sa vorbeasca in locul tau.' },
  hd_data: { type: 'Generator', profile: '3/5', strategy: 'Sa raspunda', authority: 'Sacrala' },
  astro_data: { sun_sign: 'Leu', element: 'Foc' },
  numerology_data: { life_path: 7 },
  interpreted_profile_id: 'mock-id-123',
  sections: {
    archetype: { name: 'Constructorul Tacut', description: 'Cel care muta muntii fara sa anunte.' },
    how_you_work: { surface: 'Calm la suprafata.', engine: 'Motor constant dedesubt.', core: 'Miez neclintit.' },
    friction_map: [
      { tension: 'Vrei sa te miști repede, dar corpul cere ritm propriu.', pull_a: 'Partea care vrea sa porneasca acum, din nerabdare.', pull_b: 'Partea care asteapta raspunsul corect, din designul sacral.', daily_experience: 'Se simte ca o tragere in doua directii.', resolution: 'Raspunde, nu initia.' },
    ],
    aligned_life: 'O viata in care raspunzi, nu impingi.',
    strengths: ['Consecventa', 'Perceptie fina asupra oamenilor'],
    vulnerabilities: ['Tinde sa amane odihna'],
    decision_system: ['Asteapta raspunsul sacral inainte sa te angajezi.'],
    energy_manual: { peak: 'Dimineata devreme.', drain: 'Intalniri lungi fara pauza.', rhythm: 'Valuri de 2-3 ore.', current_year: 'An de exprimare.' },
    warning_signals: [{ signal: 'Iritare fara motiv clar', pattern: 'Apare cand ai spus deja prea multe "da"', exit: 'O respiratie, apoi un "nu" simplu.' }],
  },
  swot: { opportunities: ['O colaborare noua'], threats: [] },
  alignment_plan: {
    directional_clarity: { life_direction: 'Spre exprimare constanta.', prioritize: ['Scrisul zilnic'], eliminate: ['Amanarea deciziilor mici'] },
    structured_plan: { thirty_day_focus: 'Ritmul de dimineata.', weekly_template: ['Luni: plan'], daily_template: ['Un rand scris'] },
    behavioral_anchors: { keystone_habits: ['Jurnal seara'], drains_to_notice: ['Sa raspunzi la mesaje inainte de a te trezi complet'], non_negotiables: ['O ora offline dupa 21:00'] },
  },
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'no-preference' })
await ctx.addCookies([
  { name: `sb-${ref}-auth-token`, value, domain: host, path: '/' },
  { name: 'try_free', value: '1', domain: host, path: '/' },
])
await ctx.route('**/api/profile*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_PROFILE) }))
await ctx.route('**/invite*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, referrals: 0 }) }))

const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

// Poarta de acorduri (o data, inaintea profilului) — bifez si accept.
const agreementBtns = page.locator('main button[aria-pressed]')
const n = await agreementBtns.count()
console.log('acorduri de bifat:', n)
for (let i = 0; i < n; i++) await agreementBtns.nth(i).click()
await page.waitForTimeout(200)
const readyBtn = page.locator('button', { hasText: /Sunt pregătit|I am ready/i })
if (await readyBtn.count()) { await readyBtn.click(); await page.waitForTimeout(600) }

console.log('page errors:', errors)

// TOC prezent?
const tocCount = await page.locator('.chapter-toc-item').count()
console.log('TOC items:', tocCount)

// Verific ca A/B NU mai apare ca eticheta bruta in friction map
const bareAB = await page.evaluate(() => {
  const spans = [...document.querySelectorAll('span')]
  return spans.filter(s => s.textContent.trim() === 'A' || s.textContent.trim() === 'B').length
})
console.log('etichete goale A/B ramase:', bareAB)

await page.screenshot({ path: `${OUT}/tu-full-top.png` })

// deschid un capitol (Friction Map) si verific persistenta la reload
const chapterBtn = page.locator('.chapter-head', { hasText: /Tensiuni Interioare/i }).first()
if (await chapterBtn.count()) {
  await chapterBtn.click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/tu-full-chapter-open.png` })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const stillOpen = await page.locator('.chapter-body').count()
  console.log('capitole deschise dupa reload (persistenta):', stillOpen)
}

// settings drawer
const settingsBtn = page.locator('button[aria-label="Setări"]')
const settingsCount = await settingsBtn.count()
console.log('settings icon gasit:', settingsCount)
if (settingsCount) {
  await settingsBtn.first().click()
  await page.waitForTimeout(500)
  const drawerVisible = await page.locator('text=Setări').count()
  console.log('text "Setari" vizibil dupa click:', drawerVisible)
  const dbg = await page.evaluate(() => {
    const all = [...document.querySelectorAll('*')].filter(e => e.textContent?.trim() === 'Setări')
    return all.map(e => {
      const r = e.getBoundingClientRect()
      const anc = e.closest('div')
      const ar = anc ? anc.getBoundingClientRect() : null
      return { tag: e.tagName, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, ancestorRect: ar ? { x: ar.x, y: ar.y, w: ar.width, h: ar.height } : null }
    })
  })
  console.log('debug Setari els:', JSON.stringify(dbg))
  await page.screenshot({ path: `${OUT}/tu-settings-drawer.png` })
}

await browser.close()
console.log('DONE')
