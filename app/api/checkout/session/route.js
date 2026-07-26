// Punctul 1 (audit 26.07, runda 2): completeaza fluxul de plata pentru
// profilul de €4 — success_url trimite acum doar un session_id opac
// (Stripe {CHECKOUT_SESSION_ID}), nu datele de nastere. Aici le reconstruim
// server-side, din metadata sesiunii Stripe, ca sa nu treaca niciodata
// prin adresa paginii.

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSessionUser } from '../../../../lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'missing session_id' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'payment not completed' }, { status: 402 })
    }

    const m = session.metadata || {}
    return NextResponse.json({
      success: true,
      formData: {
        full_name: m.full_name || '',
        date_of_birth: m.date_of_birth || '',
        time_of_birth: m.time_of_birth || '',
        time_unknown: m.time_unknown === '1',
        city: m.city || '',
        lat: m.lat || '',
        lng: m.lng || '',
        language: m.language || 'en',
      }
    })

  } catch (err) {
    console.error('Checkout session GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
