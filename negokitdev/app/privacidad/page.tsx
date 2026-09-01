import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de privacidad',
}

export default function PrivacidadPage() {
  return (
    <div className="contenedor">
      <h1>Política de privacidad</h1>
      <div className="card">
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Última actualización: agosto de 2026. Este es un texto básico, pensado para las primeras páginas creadas
          con Servix — antes de escalar a más usuarios conviene que lo revise un profesional.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>¿Qué datos se piden?</h2>
        <p>
          Cuando rellenas el formulario de contacto de una página de Servix, se guardan tres datos: tu nombre, tu
          teléfono y tu dirección. Nada más — no se piden contraseñas, datos de pago ni ningún otro dato personal.
        </p>

        <h2>¿Para qué se usan?</h2>
        <p>
          Únicamente para que el negocio al que has escrito (por ejemplo, la persona dueña de la página que estabas
          viendo) pueda contactarte por el servicio que le has pedido. Al enviar el formulario, además, se abre
          WhatsApp con un mensaje ya escrito dirigido a esa persona.
        </p>

        <h2>¿Quién puede ver estos datos?</h2>
        <p>
          El negocio al que escribiste, y el equipo de Servix como responsable técnico de la plataforma (para poder
          dar soporte y mantener el servicio funcionando). No se venden ni se comparten con terceros para
          publicidad, ni se usan para nada distinto de lo que se explica aquí.
        </p>

        <h2>¿Dónde se guardan?</h2>
        <p>
          En una base de datos gestionada por Supabase, protegida con reglas de acceso que impiden que un negocio
          vea los datos de los clientes de otro negocio distinto.
        </p>

        <h2>¿Cuánto tiempo se guardan?</h2>
        <p>
          Mientras la página del negocio siga activa. Si quieres que borremos tus datos antes de eso, puedes
          pedírselo directamente al negocio al que escribiste, o contactar con Servix.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes pedir en cualquier momento acceder a tus datos, corregirlos o que los borremos, escribiendo al
          negocio correspondiente o a Servix.
        </p>
      </div>
    </div>
  )
}
