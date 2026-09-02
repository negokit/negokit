import { GRACIA_DIAS_SIN_PAGAR } from './config'

export type Acceso =
  | { bloqueado: false }
  | { bloqueado: true; motivo: 'sin_iniciar' | 'impago' }

const DIA_MS = 24 * 60 * 60 * 1000

// Decide si un emprendedor puede usar su panel (editar negocio, servicios,
// etc.) o si hay que mandarlo a "Mi suscripción" a resolver algo primero.
// Reglas:
// - Si nunca llegó a iniciar ninguna prueba/suscripción, tiene
//   GRACIA_DIAS_SIN_PAGAR días desde que creó su página para hacerlo.
// - Si está en prueba o con la suscripción activa, acceso libre.
// - Si tiene un pago pendiente ("past_due"), tiene el mismo margen de días
//   para resolverlo antes de bloquearse.
// - Si el pago ya falló del todo ("unpaid"), se canceló, o quedó a medias,
//   se bloquea directamente.
export function calcularAcceso(emprendedor: any): Acceso {
  const ahora = Date.now()
  const graciaMs = GRACIA_DIAS_SIN_PAGAR * DIA_MS
  const estado = emprendedor?.stripe_subscription_status as string | null

  if (!emprendedor?.stripe_subscription_id) {
    const registrado = emprendedor?.fecha_registro ? new Date(emprendedor.fecha_registro).getTime() : ahora
    if (ahora - registrado > graciaMs) return { bloqueado: true, motivo: 'sin_iniciar' }
    return { bloqueado: false }
  }

  if (estado === 'trialing' || estado === 'active') return { bloqueado: false }

  if (estado === 'past_due') {
    const desde = emprendedor?.stripe_estado_desde ? new Date(emprendedor.stripe_estado_desde).getTime() : ahora
    if (ahora - desde > graciaMs) return { bloqueado: true, motivo: 'impago' }
    return { bloqueado: false }
  }

  // unpaid, canceled, incomplete, incomplete_expired...
  return { bloqueado: true, motivo: 'impago' }
}
