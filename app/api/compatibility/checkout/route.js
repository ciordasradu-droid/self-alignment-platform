// T3 (calup arhitectura 30.07) — plata de €8 pentru compatibilitate, separata
// de abonament (un abonat activ plateste tot €8 aici, sect. 7 a documentului-
// mama o listeaza ca linie proprie). Sesiune Stripe unica de plata (mode
// 'payment', nu 'subscription'); price_data inline, fara STRIPE_PRICE_ID nou
// in .env — suma e fixa, nu are nevoie de un produs Stripe predefinit.
// Verificarea reala (payment_status==='paid') se face la intoarcere, direct
// in /api/compatibility POST — vezi acel fisier si migration_compatibility_payments.sql.

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSessionUser } from '../../../../lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: 800,
          product_data: { name: 'Compatibility profile' },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/compatibility?paid_session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/compatibility`,
      metadata: {
        user_id: user.id,
        kind: 'compatibility',
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('Compatibility checkout error:', err.message)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
