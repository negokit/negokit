'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { WHATSAPP_SOPORTE, EMAIL_SOPORTE } from '@/lib/config'
import MenuPanel from '../MenuPanel'

export default function SuscripcionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [emprendedor, setEmprendedor] = useState<any>(null)
  const [avisoBaja, setAvisoBaja] = useState(false)

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

  const tieneSuscripcionActiva = !!emprendedor.stripe_subscription_id

  return (
    <div className="contenedor" style={{ paddingTop: 96 }}>
      <MenuPanel emprendedor={emprendedor} />

      <h1>Mi suscripción</h1>

      <div className="card">
        <p className="etiqueta-seccion" style={{ marginBottom: 4 }}>Servicio activo</p>
        <p style={{ marginTop: 0 }}><strong>Portfolio de servicios</strong> — tu página, tus servicios y tu código QR.</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 0 }}>
          Es el primer servicio de Servix. Si en el futuro se añaden más (agenda, presupuestos, etc.), aparecerán
          aquí para que los actives cuando quieras.
        </p>
      </div>

      <div className="card">
        {tieneSuscripcionActiva ? (
          <>
            <p><strong>Estado:</strong> Activa</p>
            <p>Para cambiar tu método de pago o ver tus facturas, usa el portal de gestión de Stripe.</p>
            <button disabled title="Se activa en cuanto se conecte Stripe">
              Gestionar suscripción
            </button>
          </>
        ) : (
          <>
            <p>
              Todavía no tienes una suscripción de pago activa. Mientras tanto, tu acceso se gestiona
              directamente con quien te dio de alta.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              En cuanto el cobro automático esté activo, aquí podrás ver tu plan y cambiar tu tarjeta.
            </p>
          </>
        )}

        <button className="peligro" style={{ width: '100%', marginTop: 14 }} onClick={solicitarBaja}>
          Cancelar suscripción
        </button>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 8, marginBottom: 0 }}>
          {avisoBaja
            ? 'Todavía no hay un canal de baja configurado — escribe directamente a quien te dio de alta.'
            : 'Te contactaremos para confirmar la baja — no se cancela al instante.'}
        </p>
      </div>
    </div>
  )
}
