import type { Metadata } from 'next'
import { PLAN_NOMBRE, PLAN_PRECIO, GRACIA_HORAS_SIN_INICIAR, GRACIA_DIAS_PAGO_PENDIENTE } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Términos y condiciones',
}

export default function TerminosPage() {
  return (
    <div className="contenedor">
      <h1>Términos y condiciones</h1>
      <div className="card">
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Última actualización: septiembre de 2026. Este es un texto básico, pensado para las primeras páginas
          creadas con Servix — antes de escalar a más usuarios conviene que lo revise un profesional.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>1. Qué es Servix</h2>
        <p>
          Servix es una plataforma que da a un negocio o profesional una página pública, un panel privado para
          gestionarla, un botón de contacto directo por WhatsApp y un código QR permanente para compartirla.
        </p>

        <h2>2. La suscripción</h2>
        <p>
          El plan actual es <strong>{PLAN_NOMBRE}</strong>, con un precio de <strong>{PLAN_PRECIO}</strong>. Incluye
          una prueba gratuita de 7 días desde que activas la suscripción: durante esos 7 días no se te cobra nada,
          y a partir del octavo día se realiza el primer cobro automáticamente, salvo que canceles antes. Después,
          el cobro se repite cada mes mientras la suscripción siga activa.
        </p>
        <p>
          Para empezar a usar tu página y tu panel es necesario introducir un método de pago (tarjeta o cuenta
          bancaria mediante domiciliación SEPA) al activar la prueba gratuita. Si creas tu página pero no llegas a
          activar la suscripción, tienes {GRACIA_HORAS_SIN_INICIAR} horas para probarla antes de que el acceso se
          bloquee temporalmente — tus datos y tu página no se borran, solo se ocultan hasta que actives la
          suscripción.
        </p>
        <p>
          Si ya tienes una suscripción activa y un cobro falla (por ejemplo, tarjeta caducada), tienes{' '}
          {GRACIA_DIAS_PAGO_PENDIENTE} días para actualizar tu método de pago antes de que el acceso se bloquee de
          la misma forma.
        </p>

        <h2>3. Pagos</h2>
        <p>
          Los pagos se procesan a través de Stripe. Servix no almacena en ningún momento los datos completos de tu
          tarjeta o cuenta bancaria. Puedes cambiar tu método de pago en cualquier momento desde el botón
          &quot;Gestionar suscripción&quot; de tu panel.
        </p>

        <h2>4. Cancelación</h2>
        <p>
          Puedes cancelar tu suscripción cuando quieras desde el portal de gestión de Stripe (botón &quot;Gestionar
          suscripción&quot; en tu panel), o escribiéndonos por los canales de contacto indicados ahí mismo. La
          cancelación deja de renovarse a partir del final del periodo ya pagado; no se realizan devoluciones de
          periodos ya cobrados.
        </p>

        <h2>5. Disponibilidad del servicio</h2>
        <p>
          Servix se ofrece &quot;tal cual&quot;, sin garantizar que vaya a estar disponible de forma ininterrumpida
          o libre de errores. Hacemos lo posible por mantenerlo funcionando correctamente y por avisar de cualquier
          incidencia relevante, pero no respondemos por pérdidas derivadas de caídas puntuales del servicio.
        </p>

        <h2>6. Uso correcto de la plataforma</h2>
        <p>
          El contenido de tu página (textos, fotos, datos de contacto) es tu responsabilidad. No está permitido
          usar Servix para publicar contenido ilegal, engañoso o que suplante a otra persona o negocio.
        </p>

        <h2>7. Cambios en estas condiciones</h2>
        <p>
          Podemos actualizar estos términos según evolucione el servicio. Si el cambio es relevante, te avisaremos
          por email o dentro de tu panel antes de que entre en vigor.
        </p>

        <h2>8. Ley aplicable</h2>
        <p>Estas condiciones se rigen por la legislación española.</p>

        <h2>Más información</h2>
        <p>
          Consulta también nuestra <a href="/privacidad">política de privacidad</a> y nuestra{' '}
          <a href="/cookies">política de cookies</a>.
        </p>
      </div>
    </div>
  )
}
