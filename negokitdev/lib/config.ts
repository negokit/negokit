// Configuración general de la plataforma Emprenia (no de cada negocio individual).

// WhatsApp donde llegan las peticiones de soporte, de baja de suscripción, y
// de interés en los servicios adicionales (web a medida, flyers, redes),
// en formato internacional, solo números.
export const WHATSAPP_SOPORTE = '34692209204'

// Email de soporte — canal alternativo al WhatsApp, sobre todo para quien
// prefiere escribir (dudas, facturación, cancelaciones).
export const EMAIL_SOPORTE = 'emprenia.app@gmail.com'

// Nombre y precio del plan tal como se muestran en "Mi suscripción". Como de
// momento solo hay un plan, se dejan fijos aquí — si el precio cambia en
// Stripe, actualiza también este texto para que coincida. El nombre tiene
// que coincidir con el del producto en Stripe (Catálogo de productos) para
// que no se lean cosas distintas en la web y en el checkout/factura.
export const PLAN_NOMBRE = 'Emprenia — Portfolio comercial'
export const PLAN_PRECIO = '14,99 €/mes'

// Horas de margen para quien crea su página pero nunca llega a iniciar la
// prueba gratuita (para que no pueda usar la app gratis sin límite de
// tiempo). Pasadas estas horas, se bloquea hasta que ponga tarjeta o cuenta.
export const GRACIA_HORAS_SIN_INICIAR = 24

// Días de margen para quien YA tiene una suscripción pero le falló un cobro
// ("past_due") — más margen que el de arriba porque aquí ya es una clienta
// de pago, no alguien probando gratis; le damos tiempo a que actualice su
// método de pago antes de bloquearla.
export const GRACIA_DIAS_PAGO_PENDIENTE = 3
