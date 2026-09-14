-- ============================================================================
-- URGENTE — corrige un fallo real que lleva rato pasando en silencio.
--
-- El webhook de Stripe (app/api/stripe/webhook/route.ts) actualiza una
-- columna llamada "stripe_cancela_al_final" en "emprendedores" cada vez que
-- Stripe avisa de un cambio en una suscripción (se crea, se actualiza, se
-- cancela...). Esa columna NUNCA se llegó a crear en la base de datos — no
-- está en ninguno de los sql-*.sql que hemos ido ejecutando.
--
-- Consecuencia real: cada vez que Stripe manda ese aviso, el guardado falla
-- (la columna no existe), así que "stripe_subscription_status" se queda
-- vacío para siempre después del primer pago. Y como el panel decide si
-- bloquear a alguien mirando esa columna (lib/acceso.ts), el resultado es
-- que un emprendedor que ACABA de pagar o de empezar su prueba gratis puede
-- aparecer como "impago" y quedarse bloqueado sin haber hecho nada mal.
--
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).
-- No borra ni modifica ninguna fila, solo añade la columna que falta.
-- ============================================================================

alter table emprendedores
  add column if not exists stripe_cancela_al_final boolean not null default false;

-- ============================================================================
-- Después de ejecutar esto: entra a Supabase → Table Editor → "emprendedores"
-- y mira la fila de tu cuenta (la que acaba de pagar). Si la columna
-- "stripe_subscription_status" está vacía o no dice "trialing"/"active",
-- ve a Stripe → Developers → Webhooks → tu endpoint → busca los eventos
-- recientes que fallaron (aparecen en rojo) y dale a "Resend" — con la
-- columna ya creada, esta vez sí se van a guardar bien.
-- ============================================================================
