'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function PanelPage() {
  const [loading, setLoading] = useState(true)
  const [emprendedor, setEmprendedor] = useState<any>(null)
  const [servicios, setServicios] = useState<any[]>([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: emp } = await supabase
      .from('emprendedores')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    setEmprendedor(emp)

    if (emp) {
      const { data: servs } = await supabase
        .from('servicios')
        .select('*')
        .eq('emprendedor_id', emp.id)
        .order('orden', { ascending: true })
      setServicios(servs || [])
    }
    setLoading(false)
  }

  async function agregarServicio(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!emprendedor) return
    if (servicios.length >= 12) {
      setError('Ya tienes el máximo de 12 servicios.')
      return
    }
    const { error } = await supabase.from('servicios').insert({
      emprendedor_id: emprendedor.id,
      titulo,
      descripcion,
      orden: servicios.length + 1,
    })
    if (error) { setError(error.message); return }
    setTitulo('')
    setDescripcion('')
    cargarDatos()
  }

  async function eliminarServicio(id: string) {
    await supabase.from('servicios').delete().eq('id', id)
    cargarDatos()
  }

  if (loading) return <p>Cargando...</p>
  if (!emprendedor) return <p>No se encontró tu perfil de emprendedor. Revisa el paso del SQL insert.</p>

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h1>Panel de {emprendedor.nombre_negocio}</h1>

      <h2>Tus servicios ({servicios.length}/12)</h2>
      <ul>
        {servicios.map((s) => (
          <li key={s.id}>
            <strong>{s.titulo}</strong> — {s.descripcion}
            <button onClick={() => eliminarServicio(s.id)} style={{ marginLeft: 10 }}>Eliminar</button>
          </li>
        ))}
      </ul>

      <h2>Añadir servicio</h2>
      <form onSubmit={agregarServicio}>
        <div>
          <input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Descripción (máx. 200 caracteres)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={200}
            required
          />
          <p>{descripcion.length}/200</p>
        </div>
        <button type="submit">+ Añadir servicio</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}