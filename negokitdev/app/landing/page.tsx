import type { Metadata } from 'next'
import LogoServix from '@/components/LogoServix'
import { PLAN_PRECIO, WHATSAPP_SOPORTE } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Cómo funciona Emprenia',
  description:
    'Tu página para que tus clientes te encuentren y te escriban directo por WhatsApp. Cómo funciona, qué incluye y el precio.',
}

function IconoWhatsapp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}

const PASOS = [
  {
    titulo: 'Subes tus fotos y tus servicios',
    texto:
      'Tú mismo, en un par de minutos, desde el móvil o el ordenador, estés donde estés. No hace falta que sepas nada de webs.',
  },
  {
    titulo: 'La compartes',
    texto: 'Con tu enlace o tu código QR: en tarjetas, tu furgoneta, tu escaparate, donde quieras.',
  },
  {
    titulo: 'Te escriben por WhatsApp',
    texto: 'Quien la vea puede escribirte con un toque, sin buscarte entre publicaciones ni rellenar formularios raros.',
  },
]

const CARACTERISTICAS = [
  {
    titulo: 'Tu página, con tus fotos y tus servicios',
    texto: 'Se ve profesional desde el primer minuto, aunque nunca hayas tenido una página web.',
  },
  {
    titulo: 'Código QR permanente',
    texto: 'Lo imprimes una vez, en tarjetas o en tu furgoneta. Aunque cambies tu página, nunca deja de funcionar.',
  },
  {
    titulo: 'Contacto directo por WhatsApp',
    texto: 'Con la app que ya usas todo el día. Sin comisiones por cliente, sin intermediarios de por medio.',
  },
  {
    titulo: 'Cero cosas técnicas que aprender',
    texto: 'Subes tus fotos, escribes qué haces, y tu página ya está lista para que te encuentren.',
  },
]

// Estilo "conversación de WhatsApp": la duda como mensaje recibido, la
// respuesta como si contestaras tú — encaja con el propio producto y se
// lee mucho más cercano que una lista de preguntas frecuentes.
const OBJECIONES = [
  {
    pregunta: 'No tengo tiempo para esto.',
    respuesta: 'No hace falta tiempo: subes 2-3 fotos y escribes qué ofreces. En minutos tu página está lista.',
  },
  {
    pregunta: 'No entiendo de tecnología.',
    respuesta: 'No hace falta que entiendas nada. Si sabes escribir por WhatsApp, ya sabes usar Emprenia.',
  },
  {
    pregunta: 'Ya tengo Instagram, ¿para qué quiero esto?',
    respuesta:
      'Tu Instagram es para que te vean. Emprenia es para que te escriban — ahí mandas a quien esté interesado, directo a tu WhatsApp, sin que tenga que buscarte entre publicaciones.',
  },
  {
    pregunta: '¿Y si no me funciona?',
    respuesta: 'Por eso hay 7 días de prueba gratis, sin compromiso. Si no te aporta nada, lo dejas y no pasa nada.',
  },
  {
    pregunta: 'No tengo tarjeta.',
    respuesta: 'No pasa nada — también puedes pagar con tu cuenta bancaria (domiciliación), sin necesidad de tarjeta.',
  },
]

const SERVICIOS_EXTRA = [
  { titulo: 'Página web a medida', texto: 'Si quieres algo más completo que tu página de Emprenia.' },
  { titulo: 'Flyers profesionales', texto: 'Para repartir o imprimir, listos para usar.' },
]

const mensajeWhatsapp = encodeURIComponent('¡Hola! Vi la página de Emprenia y tengo una idea / una duda.')

export default function LandingPage() {
  return (
    <div className="landing-pagina">
      <div className="landing-hero">
        <div className="landing-hero-contenido">
          <LogoServix tamano={28} />
          <p className="landing-eyebrow">¿CUÁNTOS CLIENTES SE TE HAN IDO A LA COMPETENCIA ESTA SEMANA?</p>
          <h1 className="landing-titulo">
            Tu negocio, listo para que te <em>encuentren</em>.
          </h1>
          <p className="landing-subtitulo">
            Tu propia página, con tus fotos y tus servicios, para que quien te busque te escriba directo por
            WhatsApp — sin páginas complicadas ni nada que aprender.
          </p>
          <div className="landing-cta-fila">
            <a href="/registro">
              <button type="button" className="boton-pill">Crear mi página gratis →</button>
            </a>
            <a href="/login">
              <button type="button" className="boton-pill-outline">Ya tengo cuenta</button>
            </a>
          </div>
          <p className="landing-confianza">
            <span>✓ 7 días gratis</span>
            <span>✓ Sin permanencia</span>
            <span>✓ Cancelas cuando quieras</span>
          </p>
        </div>
      </div>

      <div className="landing-ancho">
        <p className="etiqueta-seccion landing-centrado">CÓMO FUNCIONA</p>
        <h2 className="landing-h2 landing-centrado">De cero a tu página, en un rato.</h2>

        <div className="lista-pasos-landing">
          {PASOS.map((paso, i) => (
            <div key={paso.titulo} className="paso-landing">
              <span className="numero-paso-landing">{i + 1}</span>
              <div className="paso-landing-texto">
                <strong>{paso.titulo}</strong>
                <p>{paso.texto}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="etiqueta-seccion landing-centrado" style={{ marginTop: '2.75rem' }}>QUÉ INCLUYE</p>
        <h2 className="landing-h2 landing-centrado">Todo lo que necesitas, nada de más.</h2>

        <div className="rejilla-caracteristicas-landing">
          {CARACTERISTICAS.map((c) => (
            <div key={c.titulo} className="tarjeta-caracteristica-landing">
              <strong>{c.titulo}</strong>
              <p>{c.texto}</p>
            </div>
          ))}
        </div>

        <p className="etiqueta-seccion landing-centrado" style={{ marginTop: '2.75rem' }}>¿QUIERES IR MÁS ALLÁ?</p>
        <h2 className="landing-h2 landing-centrado">Y si algún día necesitas más.</h2>

        <div className="rejilla-servicios-extra">
          {SERVICIOS_EXTRA.map((s) => (
            <div key={s.titulo} className="tarjeta-servicio-extra">
              <strong>{s.titulo}</strong>
              <p>{s.texto}</p>
            </div>
          ))}
        </div>

        <p className="etiqueta-seccion landing-centrado" style={{ marginTop: '2.75rem' }}>LAS DUDAS QUE SEGURO TIENES</p>
        <h2 className="landing-h2 landing-centrado">Te leemos la mente un momento.</h2>

        <div className="chat-objeciones">
          {OBJECIONES.map((o) => (
            <div key={o.pregunta} className="chat-par">
              <div className="burbuja-duda">{o.pregunta}</div>
              <div className="burbuja-respuesta">{o.respuesta}</div>
            </div>
          ))}
        </div>

        <div className="tarjeta-contacto-personal">
          <p className="etiqueta-seccion">¿TIENES ALGO DISTINTO EN MENTE?</p>
          <h2 className="landing-h2-precio-titulo" style={{ fontSize: '1.15rem' }}>
            ¿Tienes una idea, quieres crear algo a medida o simplemente tienes dudas? Escríbeme directo, yo mismo te contesto.
          </h2>
          <a
            href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${mensajeWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: 10 }}
          >
            <button type="button" className="boton-pill-claro boton-whatsapp-personal">
              <IconoWhatsapp /> Escríbeme por WhatsApp
            </button>
          </a>
        </div>

        <div className="tarjeta-oscura landing-precio">
          <p className="etiqueta-oscura">SIN SORPRESAS</p>
          <h2 className="landing-h2-precio-titulo">Un precio claro, y no cambia.</h2>
          <p className="landing-precio-numero">{PLAN_PRECIO}</p>
          <p className="landing-precio-texto">
            Esto es lo que pagas por tu página, y no sube mientras sigas con nosotros. Si algún día quieres algo
            extra (una web a medida, flyers...), se habla aparte y decides tú. 7 días de prueba gratis. Cancela
            cuando quieras, sin permanencia.
          </p>
          <a href="/registro" style={{ display: 'block', marginTop: 8 }}>
            <button type="button" className="boton-pill-claro">Quiero mi página →</button>
          </a>
        </div>

        <p className="landing-pie">
          ¿Ya tienes tu página? <a href="/login">Inicia sesión →</a>
        </p>
      </div>
    </div>
  )
}
