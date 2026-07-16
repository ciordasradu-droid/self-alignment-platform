import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '../../../../lib/supabase/service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.user_id
        const plan = session.metadata?.plan

        if (userId) {
          await supabaseAdmin
            .from('subscriptions')
            .upsert([{
              user_id: userId,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              plan: plan || 'monthly',
              status: 'active',
              current_period_end: null,
              updated_at: new Date().toISOString()
            }], { onConflict: 'user_id' })

          // Decrement first 1000 spots if applicable
          await supabaseAdmin.rpc('decrement_spots')
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer

        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('*')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sub) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('stripe_customer_id', customerId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', customerId)
        break
      }
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Nota: `export const config = { api: { bodyParser: false } }` era cod mort —
// e ignorat in App Router. Semnatura Stripe are nevoie de corpul brut, iar
// request.text() de mai sus il da deja brut, deci nu e nimic de configurat.