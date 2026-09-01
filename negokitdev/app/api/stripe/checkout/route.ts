import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

// Crea una sesión de Stripe Checkout para que el emprendedor empiece su
// prueba gratuita de 7 días. El frontend llama a esto y redirige al usuario
// a la URL que devolvemos.
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data: emprendedor } = await supabase
    .from('emprendedores')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!emprendedor) {
    return NextResponse.json({ error: 'No se encontró el negocio' }, { status: 404 })
  }

  // Reutiliza el cliente de Stripe si ya existe (por ejemplo, si canceló el
  // checkout la primera vez e intenta de nuevo).
  let customerId: string | null = emprendedor.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { emprendedor_id: emprendedor.id },
    })
    customerId = customer.id

    await supabase
      .from('emprendedores')
      .update({ stripe_customer_id: customerId })
      .eq('id', emprendedor.id)
  }

  const origen = req.headers.get('origin') || ''

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${origen}/panel/suscripcion?exito=1`,
    cancel_url: `${origen}/panel/suscripcion?cancelado=1`,
    locale: 'es',
  })

  return NextResponse.json({ url: session.url })
}
