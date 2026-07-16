// INTRARE DE TEST — TEMPORARĂ. Ocolește emailul cât timp SMTP-ul nu e legat.
//
// Cum se folosește:
//   1. în Vercel adaugi DEV_LOGIN_SECRET (un șir lung, inventat de tine)
//      și DEV_LOGIN_EMAIL (contul cu care vrei să intri)
//   2. deschizi pe telefon:  https://<domeniu>/api/dev-login?key=<secretul>
//   3. ești logat, fără niciun email
//
// SE ȘTERGE variabila DEV_LOGIN_SECRET din Vercel când Resend e legat.
// Fără variabilă, ruta răspunde 404 — nu există. Nu poate loga pe altcineva
// decât contul din DEV_LOGIN_EMAIL, deci o cheie scăpată nu deschide alte conturi.

import { NextResponse } from 'next/server'
import { createSupabaseServer } from '../../../lib/supabase/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { createClient } from '@supabase/supabase-js'

const notFound = () => new NextResponse('Not found', { status: 404 })

export async function GET(request) {
  const secret = process.env.DEV_LOGIN_SECRET
  const email = process.env.DEV_LOGIN_EMAIL

  // fara secret configurat, ruta pur si simplu nu exista
  if (!secret || !email) return notFound()

  const key = new URL(request.url).searchParams.get('key')
  // comparatie simpla e suficienta: raspunsul e identic (404) la orice cheie gresita
  if (key !== secret) return notFound()

  try {
    // contul de test — confirmat direct, deci Supabase nu trimite niciun email
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 })
    let user = list?.users?.find(u => u.email === email)
    if (!user) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email, email_confirm: true, password: crypto.randomUUID() + 'Aa1!',
      })
      if (error) throw new Error('createUser: ' + error.message)
      user = data.user
    }
    await supabaseAdmin.from('users')
      .upsert({ id: user.id, email }, { onConflict: 'id', ignoreDuplicates: true })

    // generateLink ne da token_hash-ul; verifyOtp il preschimba in sesiune —
    // fara sa deschidem vreun inbox
    const { data: link, error: linkErr } = await supabaseAdmin.auth.admin
      .generateLink({ type: 'magiclink', email })
    if (linkErr) throw new Error('generateLink: ' + linkErr.message)

    const anon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false } }
    )
    const { data: sess, error: otpErr } = await anon.auth.verifyOtp({
      token_hash: link.properties.hashed_token, type: 'email',
    })
    if (otpErr) throw new Error('verifyOtp: ' + otpErr.message)

    // sesiunea intra in cookie-uri, exact ca la un login real
    const supabase = await createSupabaseServer()
    await supabase.auth.setSession({
      access_token: sess.session.access_token,
      refresh_token: sess.session.refresh_token,
    })

    const res = NextResponse.redirect(new URL('/dashboard', request.url))
    // poarta de abonament — ca sa ajungi direct in aplicatie
    res.cookies.set('try_free', 'true', { maxAge: 60 * 60 * 24 * 30, path: '/' })
    return res
  } catch (err) {
    console.error('dev-login:', err.message)
    return new NextResponse('dev-login: ' + err.message, { status: 500 })
  }
}
