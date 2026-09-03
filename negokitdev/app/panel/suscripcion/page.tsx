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
    if (EMAIL_SOPORTE) {
      window.location.href = `mailto:${EMAIL_SOPORTE}?subject=${encodeURIComponent('Cancelar suscripción')}&body=${encodeURIComponent(mensaje)}`
      return
    }
    setAvisoBaja(true)
  }

  if (loading || !emprendedor) return <div className="contenedor"><p>Cargando...</p></div>

  const estado = emprendedor.stripe_subscription_status as string | null
  const tieneSuscripcion = !!emprendedor.stripe_subscription_id && estado !== 'canceled'
  const exito = searchParams.get('exito')
  const cancelado = searchParams.get('cancelado')
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
        <div className="card" style={{ border: '2px solid var(--negro, #111)', background: '#fafafa' }}>
          <p className="etiqueta-seccion" style={{ marginBottom: 4 }}>Tu plan activo</p>
          <p style={{ marginTop: 0, marginBottom: 4, fontSize: '1.15rem' }}>
            <strong>{PLAN_NOMBRE}</strong>
          </p>
          <p style={{ marginTop: 0, marginBottom: 12, color: 'var(--muted)' }}>{PLAN_PRECIO}</p>

          <p style={{ marginBottom: 4 }}>
            <strong>Estado:</strong> {ESTADOS[estado || ''] || estado}
          </p>
          {estado === 'trialing' && emprendedor.stripe_trial_ends_at && (
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 0 }}>
              Tu prueba gratuita termina el {formatearFecha(emprendedor.stripe_trial_ends_at)} — a partir de ese
              día se te cobrará {PLAN_PRECIO} automáticamente, salvo que canceles antes.
            </p>
          )}
          {estado === 'active' && emprendedor.stripe_proximo_cobro && (
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 0 }}>
              Próximo cobro: {formatearFecha(emprendedor.stripe_proximo_cobro)}.
            </p>
          )}

          <p style={{ marginTop: 12, marginBottom: 8 }}>
            Para cambiar tu método de pago, ver tus facturas o cancelar, usa el portal de Stripe.
          </p>
          <button onClick={() => llamarApi('/api/stripe/portal')} disabled={procesando}>
            {procesando ? 'Abriendo...' : 'Gestionar suscripción'}
          </button>

          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 8 }}>{error}</p>}

          <p style={{ marginTop: 16, marginBottom: 4, fontSize: '0.8rem', color: 'var(--muted)' }}>
            ¿No puedes usar el botón de arriba? {avisoBaja ? 'Escribe directamente a quien te dio de alta.' : (
              <button
                onClick={solicitarBaja}
                style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', color: 'inherit' }}
              >
                Contáctanos para cancelar
              </button>
            )}
          </p>
        </div>
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
        </div>
      )}
    </div>
  )
}
