'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { WHATSAPP_SOPORTE, EMAIL_SOPORTE } from '@/lib/config'
import MenuPanel from '../MenuPanel'

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

  return (
    <div className="contenedor" style={{ paddingTop: 96 }}>
      <MenuPanel emprendedor={emprendedor} />

      <h1>Mi suscripción</h1>

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

      <div className="card">
        <p className="etiqueta-seccion" style={{ marginBottom: 4 }}>Servicio incluido</p>
        <p style={{ marginTop: 0 }}><strong>Portfolio de servicios</strong> — tu página, tus servicios y tu código QR.</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 0 }}>
          Es el primer servicio de Servix. Si en el futuro se añaden más (agenda, presupuestos, etc.), aparecerán
          aquí para que los actives cuando quieras.
        </p>
      </div>

      <div className="card">
        {tieneSuscripcion ? (
          <>
            <p><strong>Estado:</strong> {ESTADOS[estado || ''] || estado}</p>
            <p>Para cambiar tu método de pago, ver tus facturas o cancelar, usa el portal de Stripe.</p>
            <button onClick={() => llamarApi('/api/stripe/portal')} disabled={procesando}>
              {procesando ? 'Abriendo...' : 'Gestionar suscripción'}
            </button>
          </>
        ) : (
          <>
            <p>Todavía no tienes una suscripción activa.</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Empieza tu prueba gratuita de 7 días — no se te cobra nada hasta que termine, y puedes cancelar cuando quieras.
            </p>
            <button onClick={() => llamarApi('/api/stripe/checkout')} disabled={procesando}>
              {procesando ? 'Abriendo...' : 'Empezar prueba gratuita de 7 días'}
            </button>
          </>
        )}

        {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: 8 }}>{error}</p>}

        <button className="peligro" style={{ width: '100%', marginTop: 14 }} onClick={solicitarBaja}>
          Cancelar suscripción
        </button>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 8, marginBottom: 0 }}>
          {avisoBaja
            ? 'Todavía no hay un canal de baja configurado — escribe directamente a quien te dio de alta.'
            : 'También puedes cancelar directamente desde "Gestionar suscripción" arriba, sin esperar respuesta.'}
        </p>
      </div>
    </div>
  )
}
