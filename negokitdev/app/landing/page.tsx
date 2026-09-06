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
    titulo: 'Creas tu página',
    texto: 'Nos mandas 2-3 fotos de tus trabajos y qué servicios ofreces. En minutos tienes tu página lista.',
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
    texto: 'Escribes lo que ofreces, subes tus fotos, y se ve profesional desde el primer día.',
  },
  {
    titulo: 'Código QR permanente',
    texto: 'Lo imprimes una vez. Aunque cambies cosas de tu página, el QR nunca deja de funcionar.',
  },
  {
    titulo: 'Contacto directo por WhatsApp',
    texto: 'Cada visita puede escribirte con un toque, sin intermediarios ni comisiones por cliente.',
  },
  {
    titulo: 'Sin líos técnicos',
    texto: 'No hace falta que sepas nada de webs. Tú solo mandas las fotos y listo, el resto lo montamos por ti.',
  },
]

export default function LandingPage() {
  return (
    <div className="landing-pagina">
      <div className="landing-hero">
        <div className="landing-hero-contenido">
          <LogoServix tamano={28} claro />
          <h1 className="landing-titulo">
            Tu negocio, listo para que te <em>encuentren</em>.
          </h1>
          <p className="landing-subtitulo">
            Tu propia página para que tus clientes te encuentren, vean tus servicios y te escriban directo por
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
        </div>
      </div>

      <div className="contenedor">
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

        <div className="tarjeta-oscura landing-precio">
          <p className="etiqueta-oscura">PLAN FUNDADOR</p>
          <h2 className="landing-h2-precio">{PLAN_PRECIO}</h2>
          <p className="landing-precio-texto">
            7 días de prueba gratis. Cancela cuando quieras, sin permanencia.
          </p>
          <a href="/registro" style={{ display: 'block', marginTop: 8 }}>
            <button type="button" className="boton-pill-claro">Crear mi página gratis →</button>
          </a>
        </div>

        <p className="landing-pie">
          ¿Ya tienes tu página? <a href="/login">Inicia sesión →</a>
        </p>
      </div>
    </div>
  )
}
