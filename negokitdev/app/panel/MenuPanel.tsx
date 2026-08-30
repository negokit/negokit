'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { generarQrDataUrl } from '@/lib/qr'
import LogoServix from '@/components/LogoServix'
import AvatarNegocio from '@/components/AvatarNegocio'

export default function MenuPanel({ emprendedor }: { emprendedor: any }) {
  const pathname = usePathname()
  const [abierto, setAbierto] = useState(false)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [qrVisible, setQrVisible] = useState(false)

  async function cerrarSesion() {
    await supabase.auth.signOut()
    // Navegación completa (no del router de Next) a propósito: así se descarta
    // cualquier dato en memoria de la sesión anterior, y no se puede volver
    // "hacia atrás" a una vista del panel que quedó cacheada como si siguieras dentro.
    window.location.href = '/login'
  }

  async function alternarQR() {
    if (qrVisible) {
      setQrVisible(false)
      return
    }
    if (!qrUrl && emprendedor) {
      setQrUrl(await generarQrDataUrl(emprendedor.id))
    }
    setQrVisible(true)
  }

  const enlaces = [
    { href: '/panel', texto: 'Mis servicios' },
    { href: '/panel/editar', texto: 'Editar mi negocio' },
    { href: '/panel/suscripcion', texto: 'Mi suscripción' },
  ]

  return (
    <>
      <button
        type="button"
        className="boton-hamburguesa-flotante"
        onClick={() => setAbierto(true)}
        aria-label="Abrir menú"
        aria-expanded={abierto}
      >
        <span />
        <span />
        <span />
      </button>

      {abierto && <div className="panel-drawer-fondo" onClick={() => setAbierto(false)} />}

      <aside className={`panel-drawer${abierto ? ' abierto' : ''}`}>
        <div className="panel-drawer-cabecera">
          <LogoServix tamano={24} />
          <button
            type="button"
            className="boton-cerrar-drawer"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {emprendedor && (
          <div className="panel-drawer-identidad">
            <AvatarNegocio emprendedor={emprendedor} tamano={40} />
            <div style={{ minWidth: 0 }}>
              <strong style={{ display: 'block', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {emprendedor.nombre_negocio}
              </strong>
              {emprendedor.oficio && (
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted)' }}>{emprendedor.oficio}</span>
              )}
            </div>
          </div>
        )}

        <nav className="panel-drawer-nav">
          <p className="panel-drawer-seccion-titulo">Accesos rápidos</p>

          <button className="secundario" style={{ width: '100%' }} onClick={alternarQR}>
            {qrVisible ? 'Ocultar código QR' : 'Ver código QR'}
          </button>

          {qrVisible && qrUrl && (
            <div style={{ textAlign: 'center', margin: '10px 0 4px' }}>
              <img
                src={qrUrl}
                alt="Código QR de tu página"
                style={{ width: 150, height: 150, borderRadius: 8, margin: '0 auto 8px' }}
              />
              <a href={qrUrl} download={`qr-${emprendedor?.slug || 'negocio'}.png`}>
                <button className="secundario" style={{ width: '100%' }}>Descargar QR</button>
              </a>
            </div>
          )}

          {emprendedor?.slug && (
            <a href={`/${emprendedor.slug}`} target="_blank" rel="noopener noreferrer">
              <button className="secundario" style={{ width: '100%' }}>Ver mi página →</button>
            </a>
          )}

          <p className="panel-drawer-seccion-titulo" style={{ marginTop: 22 }}>Menú</p>

          {enlaces.map((e) => (
            <a key={e.href} href={e.href} onClick={() => setAbierto(false)}>
              <button className={pathname === e.href ? '' : 'secundario'} style={{ width: '100%' }}>
                {e.texto}
              </button>
            </a>
          ))}

          <button className="peligro" style={{ width: '100%', marginTop: 22 }} onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </nav>
      </aside>
    </>
  )
}
