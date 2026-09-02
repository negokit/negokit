-- Guarda cuándo termina la prueba gratuita y cuándo es el próximo cobro,
-- para poder mostrarlo de forma clara en "Mi suscripción".
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).

alter table emprendedores
  add column if not exists stripe_trial_ends_at timestamptz,
  add column if not exists stripe_proximo_cobro timestamptz;
