'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { normalizarWhatsapp } from '@/lib/validaciones'
import { calcularAcceso } from '@/lib/acceso'
import MenuPanel from '../MenuPanel'

type Lead = {
  id: string
  servicio_id: string
  nombre_cliente: string
  telefono_cliente: string
  direccion_cliente: string
  created_at: string
  servicios: { titulo: string } | null
}

function IconoPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconoTelefono() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function IconoWhatsapp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function inicialesDe(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  return (partes.length >= 2 ? partes[0][0] + partes[1][0] : partes[0]?.slice(0, 2) || '?').toUpperCase()
}

export default function ClientesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [emprendedor, setEmprendedor] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])

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

    if (!emp) { router.replace('/panel/editar'); return }
    if (calcularAcceso(emp).bloqueado) { router.replace('/panel/suscripcion'); return }

    setEmprendedor(emp)

    // Solo los leads de los servicios de este negocio — nunca los de otro.
    const { data: leadsData } = await supabase
      .from('leads')
      .select('id, servicio_id, nombre_cliente, telefono_cliente, direccion_cliente, created_at, servicios!inner(titulo, emprendedor_id)')
      .eq('servicios.emprendedor_id', emp.id)
      .order('created_at', { ascending: false })

    setLeads((leadsData as any) || [])
    setLoading(false)
  }

  function hablarPorWhatsapp(lead: Lead) {
    const numero = normalizarWhatsapp(lead.telefono_cliente).replace(/\D/g, '')
    const mensaje = `¡Hola ${lead.nombre_cliente}! Te escribo de ${emprendedor?.nombre_negocio}, vi que me contactaste por mi página.`
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  if (loading) return <div className="contenedor"><p>Cargando...</p></div>

  return (
    <div className="contenedor" style={{ paddingTop: 96 }}>
      <MenuPanel emprendedor={emprendedor} />

      <h1>Clientes</h1>
      <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.9rem' }}>
        Personas que rellenaron el formulario de contacto de tu página y te escribieron por WhatsApp.
      </p>

      {leads.length === 0 && (
        <div className="card">
          <p style={{ margin: 0 }}>Todavía no tienes clientes que te hayan contactado desde tu página.</p>
        </div>
      )}

      <div className="lista-clientes">
        {leads.map((lead) => (
          <div key={lead.id} className="tarjeta-cliente">
            <div className="tarjeta-cliente-cabecera">
              <div className="avatar-cliente">{inicialesDe(lead.nombre_cliente)}</div>
              <div className="tarjeta-cliente-nombre-fecha">
                <strong>{lead.nombre_cliente}</strong>
                <span className="fecha-cliente">{formatearFecha(lead.created_at)}</span>
              </div>
            </div>
            {lead.servicios?.titulo && <span className="etiqueta">{lead.servicios.titulo}</span>}
            <div className="meta-columna">
              <span className="meta-item">
                <IconoPin /> {lead.direccion_cliente}
              </span>
              <span className="meta-item">
                <IconoTelefono /> {lead.telefono_cliente}
              </span>
            </div>
            <button type="button" className="boton-pill boton-pill-whatsapp" onClick={() => hablarPorWhatsapp(lead)}>
              <IconoWhatsapp /> Hablar por WhatsApp →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
