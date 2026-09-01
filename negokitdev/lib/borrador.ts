// Guarda en el propio navegador (localStorage) lo que alguien va escribiendo
// en un formulario, para que si sale sin pulsar "Guardar" (cierra la
// pestaña, se le va la cobertura, cambia de pantalla sin querer) no tenga
// que volver a escribirlo todo. No es una base de datos ni sustituye al
// guardado real — solo evita perder texto por accidente, en ese mismo
// móvil/navegador. Se borra en cuanto el formulario se guarda con éxito.

export function guardarBorrador(clave: string, datos: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`servix-borrador-${clave}`, JSON.stringify(datos))
  } catch {
    // Si el navegador bloquea localStorage (modo privado, etc.) simplemente
    // no hay borrador — no es un error que deba interrumpir al usuario.
  }
}

export function leerBorrador<T>(clave: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const guardado = window.localStorage.getItem(`servix-borrador-${clave}`)
    return guardado ? (JSON.parse(guardado) as T) : null
  } catch {
    return null
  }
}

export function borrarBorrador(clave: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(`servix-borrador-${clave}`)
  } catch {
    // Nada que hacer si no se puede borrar — no es crítico.
  }
}
