import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

// Crea una sesión del Portal de Clientes de Stripe, donde el emprendedor
// puede cambiar su tarjeta, ver facturas o cancelar la suscripción por su
// cuenta, sin que tengamos que construir nada de eso nosotros.
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
    .select('stripe_customer_id')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!emprendedor?.stripe_customer_id) {
    return NextResponse.json({ error: 'Todavía no tienes una suscripción' }, { status: 400 })
  }

  const origen = req.headers.get('origin') || ''

  const session = await stripe.billingPortal.sessions.create({
    customer: emprendedor.stripe_customer_id,
    return_url: `${origen}/panel/suscripcion`,
  })

  return NextResponse.json({ url: session.url })
}
