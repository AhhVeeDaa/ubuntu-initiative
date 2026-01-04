import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.10.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log(`[Stripe Webhook] Received: ${event.type}`)

    // Only handle successful payments
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object

      // Initialize Supabase client
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL'),
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      )

      // Process donation
      const donationData = {
        stripe_payment_id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        donor_email: paymentIntent.receipt_email,
        donor_name: paymentIntent.metadata?.donor_name || null,
        message: paymentIntent.metadata?.message || null,
        fraud_check_status: paymentIntent.amount > 1000000 ? 'flagged' : 'approved' // $10k threshold
      }

      // Insert donation
      const { data: donation, error } = await supabase
        .from('donations')
        .insert(donationData)
        .select()
        .single()

      if (error) {
        console.error('Error inserting donation:', error)
        throw error
      }

      console.log(`[Stripe Webhook] Donation processed: $${donationData.amount}`)

      // Log to audit trail
      await supabase.from('agent_audit_log').insert({
        agent_id: 'agent_002_funding',
        action_type: 'process_donation',
        input_data: { stripe_event_id: event.id },
        output_data: { donation_id: donation.id },
        confidence_score: 1.0,
        reasoning: `Stripe payment processed successfully`
      })

      return new Response(
        JSON.stringify({ success: true, donation_id: donation.id }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Webhook error:', err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
