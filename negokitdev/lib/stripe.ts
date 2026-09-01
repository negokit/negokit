// Cliente de Stripe para usar SOLO en el servidor (API routes), nunca en
// componentes de cliente — usa la clave secreta.
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
