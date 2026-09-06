import type { Metadata } from 'next'
import LogoServix from '@/components/LogoServix'
import { PLAN_PRECIO } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Cómo funciona Emprenia',
  description:
    'Tu página para que tus clientes te encuentren y te escriban directo por WhatsApp. Cómo funciona, qué incluye y el precio del plan fundador.',
}

const PASOS = [
  {
    titulo: 'Subes tus fotos y tus servicios',
    texto:
      'Tú misma, en un par de minutos, desde el móvil o el ordenador, estés donde estés. No hace falta que sepas nada de webs.',
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

const OBJECIONES = [
  {
    pregunta: '"No tengo tiempo para esto."',
    respuesta: 'No hace falta tiempo: subes 2-3 fotos y escribes qué ofreces. En minutos tu página está lista.',
  },
  {
    pregunta: '"No entiendo de tecnología."',
    respuesta: 'No hace falta que entiendas nada. Si sabes escribir por WhatsApp, ya sabes usar Emprenia.',
  },
  {
    pregunta: '"Ya tengo Instagram, ¿para qué quiero esto?"',
    respuesta:
      'Emprenia no compite con tus redes — es donde mandas a la gente para que te contacte directo, sin que tengan que buscarte entre publicaciones.',
  },
  {
    pregunta: '"¿Y si no me funciona?"',
    respuesta: 'Por eso hay 7 días de prueba gratis, sin compromiso. Si no te aporta nada, lo dejas y no pasa nada.',
  },
  {
    pregunta: '"No tengo tarjeta."',
    respuesta: 'No pasa nada — también puedes pagar con tu cuenta bancaria (domiciliación), sin necesidad de tarjeta.',
  },
]

const SERVICIOS_EXTRA = [
  { titulo: 'Página web a medida', texto: 'Si quieres algo más completo que tu página de Emprenia.' },
  { titulo: 'Flyers profesionales', texto: 'Para repartir o imprimir, listos para usar.' },
  { titulo: 'Gestión de redes sociales', texto: 'Si no te da tiempo llevarlas tú misma.' },
]

export default function LandingPage() {
  return (
    <div className="landing-pagina">
      <div className="landing-hero">
        <div className="landing-hero-contenido">
          <LogoServix tamano={28} claro />
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
              <button type="button" className="boton-pill-claro">Ya tengo cuenta</button>
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

        <div className="lista-objeciones">
          {OBJECIONES.map((o) => (
            <div key={o.pregunta} className="objecion-landing">
              <strong>{o.pregunta}</strong>
              <p>{o.respuesta}</p>
            </div>
          ))}
        </div>

        <div className="tarjeta-oscura landing-precio">
          <p className="etiqueta-oscura">ACCESO ANTICIPADO</p>
          <h2 className="landing-h2-precio-titulo">Entra ahora y congela tu precio para siempre.</h2>
          <p className="landing-precio-numero">{PLAN_PRECIO}</p>
          <p className="landing-precio-texto">
            Esto es lo que pagas por tu página, y no sube mientras sigas con nosotras — aunque el precio normal
            suba más adelante. Si algún día quieres algo extra (una web a medida, flyers...), se habla aparte y
            decides tú. 7 días de prueba gratis. Cancela cuando quieras, sin permanencia.
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
