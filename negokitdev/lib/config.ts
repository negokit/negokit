// Configuración general de la plataforma Servix (no de cada negocio individual).

// WhatsApp donde llegan las peticiones de soporte y de baja de suscripción,
// en formato internacional, solo números (ej. '34600000000').
// TODO Gabriela: pon aquí tu número de WhatsApp real para que el botón
// "Cancelar suscripción" funcione — mientras esté vacío, se lo pedimos
// al usuario por email en su lugar.
export const WHATSAPP_SOPORTE = ''

// Email de soporte, usado como alternativa si no hay WhatsApp configurado.
export const EMAIL_SOPORTE = ''

// Nombre y precio del plan tal como se muestran en "Mi suscripción". Como de
// momento solo hay un plan, se dejan fijos aquí — si el precio cambia en
// Stripe, actualiza también este texto para que coincida.
export const PLAN_NOMBRE = 'Servix — Plan fundador'
export const PLAN_PRECIO = '14,99 €/mes'
