'use client'
import { useEffect, useState } from 'react'

const CLAVE = 'servix-cookies-aceptadas'

// Aviso simple de cookies/privacidad, visible en toda la app hasta que se
// acepta una vez (se recuerda en este mismo navegador). Servix solo usa la
// cookie técnica de sesión (para mantenerte conectada), no cookies de
// publicidad ni de analítica.
export default function AvisoCookies() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CLAVE)) setVisible(true)
    } catch {
      // Si el navegador bloquea localStorage, simplemente no mostramos el
      // aviso — no es crítico.
    }
  }, [])

  function aceptar() {
    setVisible(false)
    try {
      window.localStorage.setItem(CLAVE, '1')
    } catch {
      // No pasa nada si no se puede recordar — solo volverá a aparecer.
    }
  }

  if (!visible) return null

  return (
    <div className="aviso-cookies">
      <p>
        Usamos únicamente cookies técnicas necesarias para que la web funcione (como mantener tu sesión iniciada).
        No usamos cookies de publicidad ni de analítica. Más información en nuestra{' '}
        <a href="/privacidad" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
      </p>
      <button type="button" onClick={aceptar}>Entendido</button>
    </div>
  )
}
