import AuthLayout from '@/components/AuthLayout'
import { PLAN_PRECIO } from '@/lib/config'

// Datos estructurados (schema.org Organization) de la plataforma en sí,
// para que Google entienda qué es "Emprenia" cuando alguien lo busque
// (no confundir con los datos de cada negocio individual, que van en
// app/[slug]/page.tsx).
const datosEstructurados = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Emprenia',
  url: 'https://emprenia.com',
  description:
    'Tu propia página para que tus clientes te encuentren, vean tus servicios y te escriban directo por WhatsApp.',
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
      />
      <AuthLayout
        titulo={<>Tu negocio, listo para que te <em>encuentren</em>.</>}
        subtitulo="Tu propia página para que tus clientes te encuentren, vean tus servicios y te escriban directo por WhatsApp — sin páginas complicadas ni nada que aprender."
        puntos={['Página profesional', 'Código QR permanente', 'Contacto por WhatsApp', 'Sin conocimientos técnicos']}
      >
        <div className="card" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: 4 }}>Empecemos</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            ¿Ya tienes tu página o es tu primera vez por aquí?
          </p>
          <a href="/login" style={{ display: 'block', marginTop: 18 }}>
            <button className="boton-pill">Entrar →</button>
          </a>
          <a href="/registro" style={{ display: 'block', marginTop: 10 }}>
            <button type="button" className="secundario" style={{ width: '100%' }}>Crear mi página</button>
          </a>
        </div>
      </AuthLayout>

      <div className="contenedor" style={{ paddingTop: '3rem' }}>
        <p className="etiqueta-seccion" style={{ textAlign: 'center' }}>CÓMO FUNCIONA</p>
        <h2 style={{ textAlign: 'center', border: 'none', paddingBottom: 0 }}>De cero a tu página, en un rato.</h2>

        <div className="lista-pasos-landing">
          {PASOS.map((paso, i) => (
            <div key={paso.titulo} className="paso-landing">
              <span className="numero-paso-landing">{i + 1}</span>
              <div>
                <strong>{paso.titulo}</strong>
                <p>{paso.texto}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="etiqueta-seccion" style={{ textAlign: 'center', marginTop: '3rem' }}>QUÉ INCLUYE</p>
        <h2 style={{ textAlign: 'center', border: 'none', paddingBottom: 0 }}>Todo lo que necesitas, nada de más.</h2>

        <div className="rejilla-caracteristicas-landing">
          {CARACTERISTICAS.map((c) => (
            <div key={c.titulo} className="tarjeta-caracteristica-landing">
              <strong>{c.titulo}</strong>
              <p>{c.texto}</p>
            </div>
          ))}
        </div>

        <div className="tarjeta-oscura" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p className="etiqueta-oscura">PLAN FUNDADOR</p>
          <h2 style={{ color: '#fff', border: 'none', margin: '4px 0 8px', paddingBottom: 0 }}>{PLAN_PRECIO}</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>
            7 días de prueba gratis. Cancela cuando quieras, sin permanencia.
          </p>
          <a href="/registro" style={{ display: 'block', marginTop: 8 }}>
            <button type="button" className="boton-pill-claro">Crear mi página gratis →</button>
          </a>
        </div>
      </div>
    </>
  )
}
