-- Guarda la relación de cada negocio con Stripe: su cliente, su suscripción
-- y el estado actual (trialing, active, past_due, canceled, unpaid...).
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).

alter table emprendedores
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_subscription_status text;
