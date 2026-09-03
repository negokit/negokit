import AuthLayout from '@/components/AuthLayout'

export default function Home() {
  return (
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
  )
}
