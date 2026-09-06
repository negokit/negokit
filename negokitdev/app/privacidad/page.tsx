import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de privacidad',
}

const SECCIONES = [
  { id: 'clientes', titulo: 'Datos de quienes contactan a través de una página Emprenia' },
  { id: 'emprendedores', titulo: 'Datos de quienes crean una cuenta en Emprenia' },
  { id: 'proveedores', titulo: 'Dónde se guardan los datos y quién los procesa' },
  { id: 'conservacion', titulo: 'Cuánto tiempo se guardan los datos' },
  { id: 'cookies', titulo: 'Cookies' },
  { id: 'derechos', titulo: 'Tus derechos' },
]

export default function PrivacidadPage() {
  return (
    <div className="contenedor pagina-legal">
      <div className="legal-cabecera">
        <h1>Política de privacidad</h1>
        <span className="legal-badge">Última actualización: septiembre de 2026</span>
      </div>

      <nav className="legal-indice" aria-label="Índice de la página">
        <p className="etiqueta-seccion">EN ESTA PÁGINA</p>
        <ol>
          {SECCIONES.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{i + 1}. {s.titulo}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div id="clientes" className="legal-seccion">
        <span className="legal-numero">1</span>
        <div>
          <h2>Datos de quienes contactan a través de una página Emprenia</h2>
          <p>
            Cuando rellenas el formulario de contacto de una página de Emprenia, se guardan tres datos: tu nombre,
            tu teléfono y tu dirección. Nada más — no se piden contraseñas, datos de pago ni ningún otro dato
            personal.
          </p>
          <p>
            Se usan únicamente para que el negocio al que has escrito (la persona dueña de la página que estabas
            viendo) pueda contactarte por el servicio que le has pedido. Al enviar el formulario, además, se abre
            WhatsApp con un mensaje ya escrito dirigido a esa persona. Pueden verlos el negocio al que escribiste y
            el equipo de Emprenia como responsable técnico de la plataforma. Se guardan mientras la página del
            negocio siga activa.
          </p>
        </div>
      </div>

      <div id="emprendedores" className="legal-seccion">
        <span className="legal-numero">2</span>
        <div>
          <h2>Datos de quienes crean una cuenta en Emprenia</h2>
          <p>
            Si te registras para tener tu propia página, se guardan además: tu email (para iniciar sesión mediante
            un enlace mágico, sin contraseñas), el nombre de tu negocio, tu descripción, dirección y teléfono de
            contacto, y las fotos o el logo que subas. Estos datos se usan para construir y mostrar tu página
            pública y para gestionar tu cuenta y tu suscripción.
          </p>
          <p>
            <strong>Datos de pago:</strong> Emprenia no almacena en ningún momento los datos de tu tarjeta o cuenta
            bancaria. La suscripción se gestiona directamente por Stripe, nuestra pasarela de pago, que actúa como
            encargado del tratamiento para esa parte. Emprenia solo recibe de Stripe el estado de tu suscripción
            (activa, en prueba, pago pendiente, etc.) y las fechas de cobro, nunca el número de tarjeta completo.
          </p>
        </div>
      </div>

      <div id="proveedores" className="legal-seccion">
        <span className="legal-numero">3</span>
        <div>
          <h2>Dónde se guardan los datos y quién los procesa</h2>
          <p>
            Los datos se guardan en una base de datos gestionada por Supabase, protegida con reglas de acceso que
            impiden que un negocio vea los datos de los clientes de otro negocio distinto. Para poder ofrecer el
            servicio, Emprenia se apoya en estos encargados del tratamiento, cada uno con sus propias medidas de
            seguridad y su propia política de privacidad:
          </p>
          <p>
            <strong>Supabase</strong> (base de datos y almacenamiento de archivos), <strong>Vercel</strong>{' '}
            (alojamiento de la aplicación web) y <strong>Stripe</strong> (procesamiento de los pagos de la
            suscripción). Estos proveedores pueden procesar datos en servidores fuera de la Unión Europea, siempre
            bajo garantías reconocidas por la normativa (como las Cláusulas Contractuales Tipo).
          </p>
          <p>No se venden ni se comparten datos con terceros para publicidad.</p>
        </div>
      </div>

      <div id="conservacion" className="legal-seccion">
        <span className="legal-numero">4</span>
        <div>
          <h2>Cuánto tiempo se guardan los datos</h2>
          <p>
            Los datos de quien contacta a través de una página se guardan mientras esa página siga activa. Los
            datos de la cuenta de un emprendedor se conservan mientras su suscripción o su cuenta sigan activas; si
            cancelas, los conservamos el tiempo razonable para atender obligaciones legales (por ejemplo,
            facturación) y después se eliminan.
          </p>
        </div>
      </div>

      <div id="cookies" className="legal-seccion">
        <span className="legal-numero">5</span>
        <div>
          <h2>Cookies</h2>
          <p>
            Emprenia solo usa la cookie técnica necesaria para mantener tu sesión iniciada. No usamos cookies de
            publicidad ni de analítica. Más detalle en nuestra{' '}
            <a href="/cookies">política de cookies</a>.
          </p>
        </div>
      </div>

      <div id="derechos" className="legal-seccion">
        <span className="legal-numero">6</span>
        <div>
          <h2>Tus derechos</h2>
          <p>
            Puedes pedir en cualquier momento acceder a tus datos, corregirlos o que los borremos, escribiendo al
            negocio correspondiente (si eres quien contactó a través de una página) o a Emprenia, usando los canales
            de contacto indicados en tu panel. Si consideras que no hemos atendido tu solicitud correctamente,
            también puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD),{' '}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.
          </p>
        </div>
      </div>

      <p className="legal-pie">
        Las condiciones de la suscripción (precio, prueba gratuita, facturación y cancelación) están en nuestros{' '}
        <a href="/terminos">Términos y condiciones</a>.
      </p>
    </div>
  )
}
