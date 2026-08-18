import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { toStripeLocale } from '../../../lib/stripeLocale'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { formData } = body

    // GCAO A4/A5 (01.08.2026): profilul costa €4 pentru toata lumea, fara
    // exceptie (C.3, oferta "primii 1.000" eliminata). FULL_ACCESS_MODE
    // (0.4, neatins ca mecanism — C.2) ramane singura poarta de test care
    // ocoleste plata reala, la fel ca peste tot in aplicatie.
    if (process.env.FULL_ACCESS_MODE === 'true') {
      return NextResponse.json({ free: true })
    }

    // Punctul 1 (audit 26.07, runda 2): datele de nastere NU mai trec prin
    // success_url — {CHECKOUT_SESSION_ID} e un token opac (Stripe il
    // completeaza automat la redirect), nu date personale. generating/page.js
    // reconstruieste formData server-side, din metadata sesiunii, prin
    // /api/checkout/session — vezi acel fisier.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'payment',
      // REPARATIE P0 06.08.2026 — Stripe cadea pe engleza indiferent de
      // limba aleasa in aplicatie; locale explicit, din limba formularului.
      locale: toStripeLocale(formData.language),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/generating?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
      metadata: {
        full_name: formData.full_name || '',
        date_of_birth: formData.date_of_birth || '',
        time_of_birth: formData.time_of_birth || '',
        time_unknown: formData.time_unknown ? '1' : '',
        city: formData.city || '',
        lat: formData.lat != null ? String(formData.lat) : '',
        lng: formData.lng != null ? String(formData.lng) : '',
        language: formData.language || 'en',
      }
    })

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}