export function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

export function validarPrecio(valor: string) {
  if (!valor) return true
  return /^\d+(\.\d{1,2})?$/.test(valor) && parseFloat(valor) > 0
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

export function validarWhatsapp(valor: string) {
  const limpio = normalizarWhatsapp(valor)
  // + seguido de 8 a 15 dígitos (formato internacional E.164 aproximado)
  return /^\+\d{8,15}$/.test(limpio)
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
  slug: 60,
  nombreCliente: 60,
  telefonoCliente: 20,
  direccionCliente: 150,
  insigniaPersonalizada: 40,
}

function textoValido(valor: string, min: number, max: number) {
  const limpio = valor.trim()
  return limpio.length >= min && limpio.length <= max
}

export function validarNombreNegocio(valor: string) {
  return textoValido(valor, 2, LONGITUD_MAXIMA.nombreNegocio)
}

export function validarNombreContacto(valor: string) {
  return /^[a-zA-ZÀ-ÿ\s'-]{2,60}$/.test(valor.trim())
}

export function validarOficio(valor: string) {
  return textoValido(valor, 2, LONGITUD_MAXIMA.oficio)
}

export function validarCiudad(valor: string) {
  return /^[a-zA-ZÀ-ÿ\s'-]{2,40}$/.test(valor.trim())
}

// La dirección del negocio es opcional (vacío es válido) — quien no quiera
// mostrar su calle exacta puede dejarla en blanco y quedarse solo con la
// ciudad. Sin restricción de caracteres (una dirección real lleva números,
// comas, etc.), solo límite de longitud.
export function validarDireccionNegocio(valor: string) {
  if (!valor.trim()) return true
  return valor.trim().length <= LONGITUD_MAXIMA.direccionNegocio
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
