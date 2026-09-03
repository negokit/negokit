import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de cookies',
}

export default function CookiesPage() {
  return (
    <div className="contenedor">
      <h1>Política de cookies</h1>
      <div className="card">
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Última actualización: septiembre de 2026.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>¿Qué es una cookie?</h2>
        <p>
          Una cookie es un pequeño archivo que una web guarda en tu navegador para recordar información entre
          visitas, como si has iniciado sesión.
        </p>

        <h2>¿Qué cookies usa Servix?</h2>
        <p>
          Servix usa únicamente cookies técnicas, necesarias para que la web funcione:
        </p>
        <p>
          <strong>Cookie de sesión (Supabase Auth):</strong> te mantiene conectado a tu cuenta mientras usas el
          panel, para que no tengas que iniciar sesión en cada página.
        </p>
        <p>
          <strong>Aviso de cookies aceptado:</strong> un dato guardado en tu navegador (no una cookie propiamente,
          sino <code>localStorage</code>) que recuerda que ya cerraste el aviso de cookies, para no mostrártelo de
          nuevo.
        </p>

        <h2>¿Qué cookies NO usa Servix?</h2>
        <p>
          No usamos cookies de publicidad, de seguimiento entre webs, ni de analítica (como Google Analytics). No
          se comparte información de tu navegación con terceros con fines publicitarios.
        </p>

        <h2>¿Por qué no pedimos tu consentimiento para estas cookies?</h2>
        <p>
          La normativa permite usar sin consentimiento previo las cookies estrictamente necesarias para prestar el
          servicio que has pedido (como mantener tu sesión iniciada). Aun así, te avisamos de su uso mediante el
          aviso que aparece la primera vez que visitas la web.
        </p>

        <h2>¿Cómo puedo desactivarlas?</h2>
        <p>
          Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Ten en cuenta que si bloqueas
          la cookie de sesión, no podrás mantener la sesión iniciada en tu panel de Servix.
        </p>

        <h2>Más información</h2>
        <p>
          Consulta también nuestra <a href="/privacidad">política de privacidad</a>.
        </p>
      </div>
    </div>
  )
}
