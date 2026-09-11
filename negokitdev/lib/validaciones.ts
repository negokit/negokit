import { isValidPhoneNumber } from 'libphonenumber-js'

export function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

// Filtra en tiempo real lo que se escribe en el campo de enlace: minúsculas,
// letras sin acentos, números y guiones — nada más. Así lo que se ve mientras
// se escribe ya coincide con lo que se va a guardar (slugify() sigue
// aplicándose al guardar, por si acaso, pero esto evita que lleguen a
// escribirse acentos o símbolos en primer lugar).
export function sanitizarSlugInput(valor: string) {
  return valor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
}

// Convierte "14,99" (como lo escribe cualquier persona en España) a "14.99"
// (lo que entiende parseFloat de JS) — sin esto, guardar "14,99" tal cual
// truncaba el precio a 14 al hacer parseFloat.
export function normalizarPrecio(valor: string) {
  return valor.trim().replace(',', '.')
}

export function validarPrecio(valor: string) {
  if (!valor) return true
  const normalizado = normalizarPrecio(valor)
  return /^\d+(\.\d{1,2})?$/.test(normalizado) && parseFloat(normalizado) > 0
}

// Limpia y normaliza un número de WhatsApp: quita espacios/guiones,
// y si no lleva prefijo de país, asume España (+34) por defecto.
export function normalizarWhatsapp(valor: string) {
  let limpio = valor.replace(/[\s-()]/g, '')
  if (!limpio.startsWith('+')) {
    limpio = limpio.replace(/^0+/, '')
    limpio = '+34' + limpio
  }
  return limpio
}

// Filtra en tiempo real lo que se escribe en el campo de WhatsApp: si
// alguien empieza escribiendo un "+" (para poner el prefijo de otro país),
// dejamos ese "+" y solo dígitos después; si no, es un móvil español y solo
// dejamos pasar dígitos (nada de letras ni símbolos mientras se escribe).
export function filtrarWhatsappInput(valor: string) {
  const tienePrefijo = valor.trim().startsWith('+')
  const soloDigitos = valor.replace(/\D/g, '')
  return tienePrefijo ? '+' + soloDigitos : soloDigitos
}

// Antes esto solo comprobaba que hubiera entre 8 y 15 dígitos, sin mirar si
// esa cantidad tenía sentido para el país del prefijo — así se podían guardar
// números con dígitos de más o de menos (ej. un +593 de Ecuador con 12 dígitos
// en vez de 9) que WhatsApp luego rechaza como "no es un número válido" cuando
// un cliente intenta escribir. libphonenumber-js conoce la longitud real de
// cada país y prefijo del mundo, así que valida de verdad, no solo por rango.
export function validarWhatsapp(valor: string) {
  const limpio = valor.trim()
  if (limpio.startsWith('+')) {
    return isValidPhoneNumber(limpio)
  }
  // Sin prefijo asumimos España.
  return isValidPhoneNumber(limpio, 'ES')
}

export function validarTitulo(valor: string) {
  return valor.trim().length > 0 && valor.length <= 50
}

// Límites de longitud compartidos — se usan tanto en el atributo maxLength
// del input (feedback inmediato) como aquí (para que no se pueda saltar
// pegando texto o editando el HTML a mano).
export const LONGITUD_MAXIMA = {
  nombreNegocio: 60,
  nombreContacto: 60,
  oficio: 40,
  ciudad: 40,
  direccionNegocio: 150,
  descripcion: 200,
  slug: 60,
  nombreCliente: 60,
  telefonoCliente: 20,
  direccionCliente: 150,
  insigniaPersonalizada: 40,
  preguntaServicio: 80,
  respuestaPregunta: 300,
}

function textoValido(valor: string, min: number, max: number) {
  const limpio = valor.trim()
  return limpio.length >= min && limpio.length <= max
}

// Solo letras (con acentos y ñ), espacios y separadores típicos de nombres
// compuestos ("María José", "Pérez-García") — para campos que son siempre
// un nombre de persona o de oficio, nunca números ni símbolos.
const SOLO_LETRAS_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/

// Bloquea asteriscos y símbolos raros mientras sigue permitiendo números,
// comas, puntos y almohadillas — habituales en nombres de negocio reales
// ("Bar 2000", "Taller Nº 3") y en direcciones ("Calle Mayor 12, 2ºA").
const SIN_SIMBOLOS_RAROS_REGEX = /^[a-zA-Z0-9À-ÿ\s.,'ºª#/-]+$/

export function validarNombreNegocio(valor: string) {
  const limpio = valor.trim()
  return textoValido(valor, 2, LONGITUD_MAXIMA.nombreNegocio) && SIN_SIMBOLOS_RAROS_REGEX.test(limpio)
}

export function validarNombreContacto(valor: string) {
  return /^[a-zA-ZÀ-ÿ\s'-]{2,60}$/.test(valor.trim())
}

export function validarOficio(valor: string) {
  const limpio = valor.trim()
  return textoValido(valor, 2, LONGITUD_MAXIMA.oficio) && SOLO_LETRAS_REGEX.test(limpio)
}

export function validarCiudad(valor: string) {
  return /^[a-zA-ZÀ-ÿ\s'-]{2,40}$/.test(valor.trim())
}

// La dirección del negocio es opcional (vacío es válido) — quien no quiera
// mostrar su calle exacta puede dejarla en blanco y quedarse solo con la
// ciudad. Sin restricción de caracteres (una dirección real lleva números,
// comas, etc.), solo límite de longitud.
export function validarDireccionNegocio(valor: string) {
  const limpio = valor.trim()
  if (!limpio) return true
  return limpio.length <= LONGITUD_MAXIMA.direccionNegocio && SIN_SIMBOLOS_RAROS_REGEX.test(limpio)
}

// Descripción corta del negocio (opcional), se muestra arriba de todo en la
// página pública, justo debajo del nombre/oficio.
export function validarDescripcion(valor: string) {
  if (!valor.trim()) return true
  return valor.trim().length <= LONGITUD_MAXIMA.descripcion
}

// Nombre del cliente final en el formulario público de contacto.
export function validarNombreCliente(valor: string) {
  return /^[a-zA-ZÀ-ÿ\s'-]{2,60}$/.test(valor.trim())
}

// Teléfono del cliente final: solo dígitos, espacios, +, guiones y paréntesis,
// entre 9 y 20 caracteres — más permisivo que validarWhatsapp porque aquí no
// es obligatorio que use WhatsApp, solo que el emprendedor pueda llamarle.
export function validarTelefonoCliente(valor: string) {
  return /^[\d\s+()-]{9,20}$/.test(valor.trim())
}

export function validarDireccionCliente(valor: string) {
  return textoValido(valor, 5, LONGITUD_MAXIMA.direccionCliente)
}

// Insignia de confianza personalizable (ej. "+200 clientes atendidos").
// Es opcional: vacío es válido, y si se rellena solo se limita la longitud
// para no romper el diseño de la página pública.
export function validarInsigniaPersonalizada(valor: string) {
  if (!valor.trim()) return true
  return valor.trim().length <= LONGITUD_MAXIMA.insigniaPersonalizada
}

// Pregunta guiada que el propio emprendedor escribe al configurar un
// servicio (ej. "¿Cuántos metros tiene tu jardín?") — hasta 2 por servicio.
// Es opcional: dejarla vacía es válido, y esa pregunta simplemente no
// aparece en el formulario del cliente para ese servicio.
export function validarPreguntaServicio(valor: string) {
  if (!valor.trim()) return true
  return valor.trim().length <= LONGITUD_MAXIMA.preguntaServicio
}

// Respuesta del cliente final a una pregunta guiada — solo se llama a esto
// cuando esa pregunta existe para el servicio elegido, así que aquí sí es
// obligatoria (no puede quedar vacía) además del límite de caracteres.
export function validarRespuestaPregunta(valor: string) {
  return valor.trim().length > 0 && valor.trim().length <= LONGITUD_MAXIMA.respuestaPregunta
}
