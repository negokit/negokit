import LogoServix from '@/components/LogoServix'

export default function Home() {
  return (
    <div className="contenedor" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <LogoServix tamano={56} />
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Tu página, lista para que te escriban.
      </p>
      <a href="/login" style={{ display: 'block', maxWidth: 260, margin: '0 auto' }}>
        <button className="boton-pill">Entrar →</button>
      </a>
    </div>
  )
}
