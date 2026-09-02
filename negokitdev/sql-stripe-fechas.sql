-- Guarda cuándo termina la prueba gratuita y cuándo es el próximo cobro,
-- para poder mostrarlo de forma clara en "Mi suscripción". También guarda
-- desde cuándo está en su estado actual (para saber cuántos días lleva en
-- "pago pendiente", por ejemplo) y la fecha en que se creó la página (para
-- dar un plazo antes de bloquear a quien nunca llegó a iniciar la prueba).
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).

alter table emprendedores
  add column if not exists stripe_trial_ends_at timestamptz,
  add column if not exists stripe_proximo_cobro timestamptz,
  add column if not exists stripe_estado_desde timestamptz,
  add column if not exists fecha_registro timestamptz not null default now();
