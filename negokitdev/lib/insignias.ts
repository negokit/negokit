// Insignias de confianza: hasta 3 "sellos" que el emprendedor elige para
// mostrar en su página pública (ej. "Respuesta en menos de 24h",
// "+200 clientes atendidos"). Antes existían como dos campos sueltos
// (mostrar_insignia_respuesta + insignia_personalizada, una sola); ahora es
// una lista de hasta 3, elegidas de una lista de sugeridas o escritas a mano.

export const INSIGNIAS_PRESET = [
  'Respuesta en menos de 24h',
  '+200 clientes atendidos',
  'Precios claros, sin sorpresas',
  'Trabajo garantizado',
  'Más de 10 años de experiencia',
  'Presupuesto gratuito',
]

export const MAX_INSIGNIAS = 3
export const LONGITUD_MAXIMA_INSIGNIA = 40

// Lee la lista de insignias de un negocio. Si todavía no tiene la columna
// nueva rellena (porque se creó antes de este cambio y no ha vuelto a
// guardar el formulario), la reconstruye a partir de los dos campos
// antiguos, para que ninguna página se quede sin insignias de un día para
// otro solo por este cambio.
export function obtenerInsignias(emprendedor: any): string[] {
  if (Array.isArray(emprendedor?.insignias) && emprendedor.insignias.length > 0) {
    return emprendedor.insignias
  }
  const heredadas: string[] = []
  if (emprendedor?.mostrar_insignia_respuesta !== false) heredadas.push('Respuesta en menos de 24h')
  if (emprendedor?.insignia_personalizada) heredadas.push(emprendedor.insignia_personalizada)
  return heredadas
}

export function validarInsignias(valores: string[]) {
  if (valores.length > MAX_INSIGNIAS) return false
  return valores.every((v) => v.trim().length > 0 && v.trim().length <= LONGITUD_MAXIMA_INSIGNIA)
}
