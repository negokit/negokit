'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PaginaPublica() {
  const params = useParams()
  const slug = params.slug as string

  const [emprendedor, setEmprendedor] = useState<any>(null)
  const [servicios, setServicios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cargar()
  }, [slug])

  async function cargar() {
    setLoading(true)
    const { data: emp } = await supabase
      .from('emprendedores')
      .select('*')
      .eq('slug', slug)
      .single()
    setEmprendedor(emp)

    if (emp) {
      const { data: servs } = await supabase
        .from('servicios')
        .select('*')
        .eq('emprendedor_id', emp.id)
        .eq('activo', true)
        .order('orden', { ascending: true })
      setServicios(servs || [])
    }
    setLoading(false)
  }

  function abrirContacto(servicioId: string) {
    setServicioSeleccionado(servicioId)
    setEnviado(false)
    setError('')
  }

  async function enviarFormulario(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) {
      setError('El nombre solo puede tener letras y espacios.')
      return
    }
    if (telefono.length < 9) {
      setError('Escribe un teléfono válido.')
      return
    }
    if (direccion.length < 5) {
      setError('Escribe una dirección válida.')
      return
    }

    const { error } = await supabase.from('leads').insert({
      servicio_id: servicioSeleccionado,
      nombre_cliente: nombre,
      telefono_cliente: telefono,
      direccion_cliente: direccion,
    })
    if (error) { setError(error.message); return }

    const servicio = servicios.find((s) => s.id === servicioSeleccionado)
    const mensaje = `Hola, soy ${nombre}. Me interesa el servicio "${servicio?.titulo}". Mi teléfono es ${telefono} y mi dirección es ${direccion}.`
    const numeroLimpio = emprendedor.whatsapp_number.replace(/\D/g, '')
    const url = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
    setEnviado(true)
  }

  if (loading) return <p>Cargando...</p>
  if (!emprendedor) return <p>No se encontró esta página.</p>

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h1>{emprendedor.nombre_negocio}</h1>

      <h2>Servicios</h2>
      <ul>
        {servicios.map((s) => (
          <li key={s.id} style={{ marginBottom: 20 }}>
            <strong>{s.titulo}</strong>
            <p>{s.descripcion}</p>
            {s.mostrar_precio && s.precio && <p>{s.precio} €</p>}
            <button onClick={() => abrirContacto(s.id)}>Contactar</button>
          </li>
        ))}
      </ul>

      {servicioSeleccionado && !enviado && (
        <form onSubmit={enviarFormulario} style={{ border: '1px solid #ccc', padding: 20 }}>
          <h3>Contactar</h3>
          <div>
            <label>Servicio: </label>
            <select value={servicioSeleccionado} onChange={(e) => setServicioSeleccionado(e.target.value)}>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>{s.titulo}</option>
              ))}
            </select>
          </div>
          <div><input placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div><input placeholder="Tu teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required /></div>
          <div><input placeholder="Tu dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required /></div>
          <button type="submit">Enviar por WhatsApp</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}

      {enviado && <p>¡Listo! Se abrió WhatsApp con tu mensaje.</p>}
    </div>
  )
}