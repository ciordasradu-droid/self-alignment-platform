import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSessionUser } from '../../../lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
      metadata: {
        user_id: user.id
      }
    })

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Subscription checkout failed' }, { status: 500 })
  }
}