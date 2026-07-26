// Runda 3, punctul 1 — carcasa paginii Tu trebuie sa urmeze app_language,
// nu limba profilului. Foloseste profilul RO deja existent pe contul de dev
// (fara sa mai plateasca o generare noua), cu app_language=en.
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

// app_language, inainte de orice navigare (schimba aici pentru a doua/a treia combinatie)
const APP_LANG = process.env.APP_LANG || 'en'
await p.addInitScript((l) => { localStorage.setItem('app_language', l) }, APP_LANG)

await p.goto(`${BASE}/profile`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)

// daca apare poarta de acorduri (neacceptata inca pentru profilul curent),
// trece prin ea — bifeaza tot ce exista si apasa butonul.
const gateButtons = await p.locator('button[aria-pressed]').count()
if (gateButtons > 0) {
  for (let i = 0; i < gateButtons; i++) {
    await p.locator('button[aria-pressed]').nth(i).click()
  }
  await p.locator('button.cta-premium').click()
  await p.waitForTimeout(1500)
}

const result = await p.evaluate(() => {
  const roomNavLabels = Array.from(document.querySelectorAll('.room-nav-tab span')).map(e => e.textContent)
  const downloadBtn = Array.from(document.querySelectorAll('button')).find(b => /pdf/i.test(b.textContent))?.textContent
  const h1 = document.querySelector('h1')?.textContent
  const tag = document.querySelector('.tag')?.textContent
  const title = document.title
  const htmlLang = document.documentElement.lang
  // primul paragraf de continut generat (in interiorul unui .chapter, daca exista)
  const chapterText = document.querySelector('.chapter')?.textContent?.slice(0, 80) || null
  const allParagraphs = Array.from(document.querySelectorAll('main p')).map(p => p.textContent)
  const languageNotice = allParagraphs.find(p => /written in|scris în|escrito en|écrit en|geschrieben|scritto in|escrito em|geschreven in|napisany|íródott|написан/i.test(p)) || null
  return { roomNavLabels, downloadBtn, h1, tag, title, htmlLang, chapterText, languageNotice }
})

console.log('RoomNav labels:', result.roomNavLabels)
console.log('Download button:', result.downloadBtn)
console.log('H1 (page title):', result.h1)
console.log('Tag:', result.tag)
console.log('document.title:', result.title)
console.log('html lang:', result.htmlLang)
console.log('Sample chapter text (should stay RO):', result.chapterText)
console.log('Language notice (honest line):', result.languageNotice)

await browser.close()
console.log('DONE')
