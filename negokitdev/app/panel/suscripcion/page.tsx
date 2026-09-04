'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { WHATSAPP_SOPORTE, EMAIL_SOPORTE, PLAN_NOMBRE, PLAN_PRECIO, GRACIA_HORAS_SIN_INICIAR } from '@/lib/config'
import { calcularAcceso } from '@/lib/acceso'
import MenuPanel from '../MenuPanel'

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

const ESTADOS: Record<string, string> = {
  trialing: 'En periodo de prueba gratuita',
  active: 'Activa',
  past_due: 'Pago pendiente — revisa tu método de pago',
  unpaid: 'Pago fallido',
  canceled: 'Cancelada',
  incomplete: 'Pago sin completar',
  incomplete_expired: 'Pago sin completar (caducado)',
}

// Insignia de color junto al nombre del plan — de un vistazo, sin tener que
// leer texto largo. Verde = todo bien, ámbar = necesita atención, rojo =
// problema, gris = ya no está activa.
const INSIGNIA_ESTADO: Record<string, { texto: string; fondo: string; color: string }> = {
  trialing: { texto: 'Prueba gratis', fondo: '#eafaf0', color: '#1f7a43' },
  active: { texto: 'Activo', fondo: '#eafaf0', color: '#1f7a43' },
  past_due: { texto: 'Pago pendiente', fondo: '#fff4e0', color: '#a15c00' },
  unpaid: { texto: 'Pago fallido', fondo: '#fdecea', color: '#c0392b' },
  incomplete: { texto: 'Pago sin completar', fondo: '#fff4e0', color: '#a15c00' },
  incomplete_expired: { texto: 'Caducado', fondo: '#fdecea', color: '#c0392b' },
  canceled: { texto: 'Cancelada', fondo: '#eee', color: '#666' },
}

// Servicios extra que Gabriela ofrece aparte de Servix — no se cobran aquí
// (no hay Stripe de por medio, el precio se acuerda hablando por WhatsApp),
// así que cada uno es solo una tarjeta informativa con un botón de contacto.
const SERVICIOS_ADICIONALES = [
  {
    titulo: 'Página web a medida',
    texto: '¿Quieres además una web propia, más completa que tu página Servix? Te la diseño yo misma.',
  },
  {
    titulo: 'Flyers profesionales',
    texto: '¿Necesitas flyers o carteles para repartir o imprimir? Te los diseño yo misma.',
  },
  {
    titulo: 'Gestión de redes sociales',
    texto: '¿Necesitas ayuda llevando tus redes sociales? Podemos verlo juntas.',
  },
]

// useSearchParams() obliga a envolver la página en Suspense, si no Next.js
// falla al construir la web (no es un bug nuestro, es cómo funciona Next).
export default function SuscripcionPage() {
  return (
    <Suspense fallback={<div className="contenedor"><p>Cargando...</p></div>}>
      <SuscripcionContenido />
    </Suspense>
  )
}

function SuscripcionContenido() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [emprendedor, setEmprendedor] = useState<any>(null)
  const [avisoBaja, setAvisoBaja] = useState(false)
  const [emailBaja, setEmailBaja] = useState('')
  const [bajaEnviada, setBajaEnviada] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }

    const { data: emp } = await supabase
      .from('emprendedores')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (!emp) { router.replace('/registro'); return }

    setEmprendedor(emp)
    setLoading(false)
  }

  async function llamarApi(ruta: string) {
    setError('')
    setProcesando(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/login'); return }

      const resp = await fetch(ruta, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const datos = await resp.json()

      if (!resp.ok) {
        setError(datos.error || 'Algo salió mal, inténtalo de nuevo.')
        setProcesando(false)
        return
      }

      window.location.href = datos.url
    } catch (e) {
      setError('No se pudo conectar con Stripe. Inténtalo de nuevo.')
      setProcesando(false)
    }
  }

  function solicitarBaja() {
    const mensaje = `Hola, quiero cancelar la suscripción de "${emprendedor.nombre_negocio}" (${emprendedor.slug}).`
    if (WHATSAPP_SOPORTE) {
      window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent(mensaje)}`, '_blank')
      return
    }
    // Ojo: NO usamos mailto aquí a propósito — igual que pasaba con los
    // enlaces "tel:", un mailto puede no abrir nada si el dispositivo no
    // tiene un cliente de correo configurado. Mejor un formulario sencillo
    // que guarda la petición directamente en la base de datos.
    setAvisoBaja(true)
  }

  async function enviarSolicitudBaja(e: React.FormEvent) {
    e.preventDefault()
    if (!emailBaja.trim()) return
    await supabase
      .from('emprendedores')
      .update({ baja_solicitada_en: new Date().toISOString(), baja_contacto_email: emailBaja.trim() })
      .eq('id', emprendedor.id)
    setBajaEnviada(true)
  }

  if (loading || !emprendedor) return <div className="contenedor"><p>Cargando...</p></div>

  const estado = emprendedor.stripe_subscription_status as string | null
  const tieneSuscripcion = !!emprendedor.stripe_subscription_id && estado !== 'canceled'
  const exito = searchParams.get('exito')
  const cancelado = searchParams.get('cancelado')
  const nueva = searchParams.get('nueva')
  const acceso = calcularAcceso(emprendedor)

  return (
    <div className="contenedor" style={{ paddingTop: 96 }}>
      <MenuPanel emprendedor={emprendedor} />

      <h1>Mi suscripción</h1>

      {acceso.bloqueado && (
        <div className="card" style={{ background: '#fdecea', borderColor: '#f2b8b5' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Tu panel está bloqueado por ahora</p>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: '0.9rem' }}>
            {acceso.motivo === 'sin_iniciar'
              ? `Pasaron más de ${GRACIA_HORAS_SIN_INICIAR} horas desde que creaste tu página sin empezar tu prueba gratuita. Empiézala aquí abajo para recuperar el acceso a tu panel — tu página pública y tus datos siguen intactos.`
              : 'Hay un problema con tu pago. Resuélvelo con el botón de abajo (o revisa tu método de pago) para recuperar el acceso a tu panel — tu página pública y tus datos siguen intactos.'}
          </p>
        </div>
      )}

      {nueva && !tieneSuscripcion && (
        <div className="card" style={{ background: '#eafaf0', borderColor: '#9fe0b8' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>¡Tu página ya está creada! 🎉</p>
          <p style={{ marginTop: 6, marginBottom: 0, fontSize: '0.9rem' }}>
            Un último paso: activa tu prueba gratuita de 7 días aquí abajo para que tu página y tu código QR queden
            disponibles. No se te cobra nada hasta que termine la prueba.
          </p>
        </div>
      )}

      {exito && (
        <div className="card" style={{ background: '#eafaf0', borderColor: '#9fe0b8' }}>
          <p style={{ margin: 0 }}>
            ¡Listo! Tu prueba gratuita de 7 días ha empezado. Puede tardar unos segundos en reflejarse aquí abajo.
          </p>
        </div>
      )}
      {cancelado && (
        <div className="card">
          <p style={{ margin: 0 }}>No se completó el pago. Puedes intentarlo de nuevo cuando quieras.</p>
        </div>
      )}

      {tieneSuscripcion ? (
        <>
          <div className="card" style={{ border: '2px solid var(--negro, #111)', background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
              <p className="etiqueta-seccion" style={{ margin: 0 }}>Tu plan activo</p>
              {INSIGNIA_ESTADO[estado || ''] && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: INSIGNIA_ESTADO[estado || ''].fondo,
                    color: INSIGNIA_ESTADO[estado || ''].color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {INSIGNIA_ESTADO[estado || ''].texto}
                </span>
              )}
            </div>
            <p style={{ marginTop: 0, marginBottom: 4, fontSize: '1.15rem' }}>
              <strong>{PLAN_NOMBRE}</strong>
            </p>
            <p style={{ marginTop: 0, marginBottom: 12, color: 'var(--muted)' }}>{PLAN_PRECIO}</p>

            {estado === 'trialing' && emprendedor.stripe_trial_ends_at && (
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Primer cobro: <strong>{formatearFecha(emprendedor.stripe_trial_ends_at)}</strong>
              </p>
            )}
            {estado === 'active' && emprendedor.stripe_proximo_cobro && (
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Próximo cobro: <strong>{formatearFecha(emprendedor.stripe_proximo_cobro)}</strong>
              </p>
            )}
            {!['trialing', 'active'].includes(estado || '') && (
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{ESTADOS[estado || ''] || estado}</p>
            )}
          </div>

          <div className="card">
            <p className="etiqueta-seccion" style={{ marginBottom: 4 }}>Gestionar suscripción</p>
            <p style={{ marginTop: 0, marginBottom: 12, color: 'var(--muted)', fontSize: '0.9rem' }}>
              Para cambiar tu método de pago, ver tus facturas o cancelar, usa el portal de Stripe.
            </p>
            <button onClick={() => llamarApi('/api/stripe/portal')} disabled={procesando}>
              {procesando ? 'Abriendo...' : 'Gestionar suscripción'}
            </button>

            {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 8 }}>{error}</p>}

            {!avisoBaja && (
              <p style={{ marginTop: 16, marginBottom: 4, fontSize: '0.8rem', color: 'var(--muted)' }}>
                ¿No puedes usar el botón de arriba?{' '}
                <button
                  onClick={solicitarBaja}
                  style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', color: 'inherit' }}
                >
                  Contáctanos para cancelar
                </button>
              </p>
            )}

            {avisoBaja && EMAIL_SOPORTE && (
              <p style={{ marginTop: 16, marginBottom: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
                Si quieres cancelar tu suscripción, envía un correo a{' '}
                <a href={`mailto:${EMAIL_SOPORTE}`}>{EMAIL_SOPORTE}</a> con el nombre de tu negocio.
              </p>
            )}

            {avisoBaja && !EMAIL_SOPORTE && !bajaEnviada && (
              <form onSubmit={enviarSolicitudBaja} style={{ marginTop: 16 }}>
                <p style={{ marginTop: 0, marginBottom: 6, fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Déjanos tu email y te ayudamos a cancelar la suscripción a mano.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={emailBaja}
                    onChange={(e) => setEmailBaja(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit">Enviar</button>
                </div>
              </form>
            )}

            {avisoBaja && !EMAIL_SOPORTE && bajaEnviada && (
              <p style={{ marginTop: 16, marginBottom: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
                Recibido. Te contactaremos a {emailBaja} para gestionar la cancelación.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="card">
          <p className="etiqueta-seccion" style={{ marginBottom: 4 }}>Servicio incluido</p>
          <p style={{ marginTop: 0, marginBottom: 4, fontSize: '1.15rem' }}>
            <strong>{PLAN_NOMBRE}</strong>
          </p>
          <p style={{ marginTop: 0, color: 'var(--muted)' }}>{PLAN_PRECIO} — tu página, tus servicios y tu código QR.</p>

          <p>Todavía no tienes una suscripción activa.</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            Empieza tu prueba gratuita de 7 días — no se te cobra nada hasta que termine, y puedes cancelar cuando quieras.
          </p>
          <button onClick={() => llamarApi('/api/stripe/checkout')} disabled={procesando}>
            {procesando ? 'Abriendo...' : 'Empezar prueba gratuita de 7 días'}
          </button>
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 8 }}>{error}</p>}

          <p style={{ marginTop: 12, marginBottom: 0, fontSize: '0.75rem', color: 'var(--muted)' }}>
            Al continuar aceptas nuestros <a href="/terminos" target="_blank" rel="noopener noreferrer">Términos y condiciones</a>{' '}
            y nuestra <a href="/privacidad" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
          </p>
        </div>
      )}

      {WHATSAPP_SOPORTE && (
        <div style={{ marginTop: 28 }}>
          <p className="etiqueta-seccion" style={{ marginBottom: 10 }}>¿Necesitas algo más?</p>
          {SERVICIOS_ADICIONALES.map((s) => (
            <div key={s.titulo} className="card">
              <p style={{ marginTop: 0, marginBottom: 4, fontWeight: 700 }}>{s.titulo}</p>
              <p style={{ marginTop: 0, marginBottom: 12, color: 'var(--muted)', fontSize: '0.9rem' }}>{s.texto}</p>
              <a
                href={`https://wa.me/${WHATSAPP_SOPORTE}?text=${encodeURIComponent(
                  `Hola, me interesa "${s.titulo}" para mi negocio "${emprendedor.nombre_negocio}".`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="boton-pill"
                style={{ textDecoration: 'none' }}
              >
                Hablemos por WhatsApp →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
