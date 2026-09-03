import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Stripe llama a esta URL directamente (no un navegador), avisándonos de
// cada cambio de la suscripción: cuando se paga, cuando falla un cobro,
// cuando se cancela, etc. Así mantenemos el estado en nuestra base de datos
// sin que el emprendedor tenga que hacer nada ni recargar la página.
export async function POST(req: NextRequest) {
  const firma = req.headers.get('stripe-signature')
  const cuerpo = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(cuerpo, firma!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Firma de webhook de Stripe inválida:', err)
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.customer && session.subscription) {
          await supabaseAdmin
            .from('emprendedores')
            .update({ stripe_subscription_id: session.subscription as string })
            .eq('stripe_customer_id', session.customer as string)
        }
        break
      }

      // trialing, active, past_due, unpaid, canceled, incomplete...
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const item = subscription.items.data[0]

        // Solo actualizamos "desde cuándo" está en este estado si de verdad
        // cambió — si no, se quedaría reseteando el contador cada vez que
        // Stripe reenvía el mismo evento, y el plazo de gracia nunca se
        // cumpliría.
        const { data: actual } = await supabaseAdmin
          .from('emprendedores')
          .select('stripe_subscription_status, stripe_estado_desde')
          .eq('stripe_customer_id', subscription.customer as string)
          .maybeSingle()

        const estadoCambio = !actual || actual.stripe_subscription_status !== subscription.status
        const estadoDesde = estadoCambio ? new Date().toISOString() : actual?.stripe_estado_desde

        await supabaseAdmin
          .from('emprendedores')
          .update({
            stripe_subscription_id: subscription.id,
            stripe_subscription_status: subscription.status,
            stripe_estado_desde: estadoDesde,
            stripe_trial_ends_at: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            stripe_proximo_cobro: item?.current_period_end
              ? new Date(item.current_period_end * 1000).toISOString()
              : null,
          })
          .eq('stripe_customer_id', subscription.customer as string)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await supabaseAdmin
          .from('emprendedores')
          .update({ stripe_subscription_status: 'canceled', stripe_estado_desde: new Date().toISOString() })
          .eq('stripe_customer_id', subscription.customer as string)
        break
      }
    }
  } catch (err) {
    console.error('Error procesando webhook de Stripe:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
