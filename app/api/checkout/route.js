import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { formData } = body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/generating?data=${encodeURIComponent(JSON.stringify(formData))}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
      metadata: {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        time_of_birth: formData.time_of_birth,
        city: formData.city
      }
    })

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}