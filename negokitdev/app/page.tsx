import AuthLayout from '@/components/AuthLayout'

// Datos estructurados (schema.org Organization) de la plataforma en sí,
// para que Google entienda qué es "Servix" cuando alguien lo busque
// (no confundir con los datos de cada negocio individual, que van en
// app/[slug]/page.tsx).
const datosEstructurados = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Servix',
  url: 'https://emprenia.com',
  description:
    'Tu propia página para que tus clientes te encuentren, vean tus servicios y te escriban directo por WhatsApp.',
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
      />
      <AuthLayout
      titulo={<>Tu oficio, con la página que <em>merece</em>.</>}
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
    </>
  )
}
