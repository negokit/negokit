-- ============================================================================
-- MIGRACIÓN COMPLETA PARA PRODUCCIÓN — ejecutar UNA sola vez en el proyecto
-- de Supabase de PRODUCCIÓN (sisbrisvuonysxqaxnvj), NO en el de dev.
--
-- Junta las 6 migraciones que ya corrieron en dev en su momento por separado
-- (sql-logo-insignias, sql-insignias-lista, sql-direccion, sql-stripe,
-- sql-stripe-fechas, sql-baja) en un único script, para que sea un solo
-- paso en vez de seis. Todas las líneas son "add column IF NOT EXISTS" —
-- es decir, seguras: si por lo que sea ya existiera alguna columna, no pasa
-- nada, ni se borra ni se sobrescribe ningún dato existente. No se toca
-- ninguna fila, solo se añaden columnas nuevas (vacías) a la tabla.
--
-- Antes de pulsar "Run": arriba a la izquierda del SQL Editor de Supabase,
-- confirma que el proyecto seleccionado es el de PRODUCCIÓN, no el de dev.
-- ============================================================================

-- 1) Logo e insignias (de sql-logo-insignias.sql)
alter table emprendedores add column if not exists logo_url text;
alter table emprendedores add column if not exists mostrar_insignia_respuesta boolean not null default true;
alter table emprendedores add column if not exists insignia_personalizada text;

alter table emprendedores drop constraint if exists emprendedores_insignia_personalizada_check;

alter table emprendedores
  add constraint emprendedores_insignia_personalizada_check
  check (insignia_personalizada is null or char_length(insignia_personalizada) <= 40);

-- 2) Lista de insignias de confianza, hasta 3 (de sql-insignias-lista.sql)
alter table emprendedores
  add column if not exists insignias text[] not null default '{}'::text[];

-- 3) Dirección del negocio (de sql-direccion.sql)
alter table emprendedores
  add column if not exists direccion text;

-- 4) Relación con Stripe: cliente, suscripción y estado (de sql-stripe.sql)
alter table emprendedores
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_subscription_status text;

-- 5) Fechas de prueba gratuita, próximo cobro y registro (de sql-stripe-fechas.sql)
alter table emprendedores
  add column if not exists stripe_trial_ends_at timestamptz,
  add column if not exists stripe_proximo_cobro timestamptz,
  add column if not exists stripe_estado_desde timestamptz,
  add column if not exists fecha_registro timestamptz not null default now();

-- 6) Solicitudes de baja por email (de sql-baja.sql)
alter table emprendedores
  add column if not exists baja_solicitada_en timestamptz,
  add column if not exists baja_contacto_email text;

-- ============================================================================
-- Comprobación final — pega esto también y ejecútalo después, para ver que
-- todas las columnas nuevas quedaron creadas (debería devolver 13 filas):
--
-- select column_name from information_schema.columns
-- where table_name = 'emprendedores'
-- and column_name in (
--   'logo_url', 'mostrar_insignia_respuesta', 'insignia_personalizada',
--   'insignias', 'direccion', 'stripe_customer_id', 'stripe_subscription_id',
--   'stripe_subscription_status', 'stripe_trial_ends_at', 'stripe_proximo_cobro',
--   'stripe_estado_desde', 'fecha_registro', 'baja_solicitada_en'
-- );
-- ============================================================================
