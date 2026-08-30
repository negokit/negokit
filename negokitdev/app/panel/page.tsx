'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import QRCode from 'qrcode'
import { validarPrecio, validarTitulo } from '@/lib/validaciones'
import MenuPanel from './MenuPanel'
import AvatarNegocio from '@/components/AvatarNegocio'

const TAMANO_MAXIMO_FOTO = 5 * 1024 * 1024 // 5 MB
const TIPOS_FOTO_PERMITIDOS = ['image/png', 'image/jpeg']

export default function PanelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [emprendedor, setEmprendedor] = useState<any>(null)
  const [servicios, setServicios] = useState<any[]>([])

  const [servicioEditando, setServicioEditando] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [mostrarPrecio, setMostrarPrecio] = useState(false)
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoActualUrl, setFotoActualUrl] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [qrVisible, setQrVisible] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }

    const { data: emp } = await supabase
      .from('emprendedores')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (!emp) {
      // Sin página todavía: la crea en "Editar mi negocio" (un único
      // formulario para crear y editar, sin duplicarlo en /registro).
      router.replace('/panel/editar')
      return
    }

    setEmprendedor(emp)

    const { data: servs } = await supabase
      .from('servicios')
      .select('*')
      .eq('emprendedor_id', emp.id)
      .order('orden', { ascending: true })
    setServicios(servs || [])

    setLoading(false)
  }

  function limpiarFormulario() {
    setServicioEditando(null)
    setTitulo('')
    setDescripcion('')
    setPrecio('')
    setMostrarPrecio(false)
    setFoto(null)
    setFotoActualUrl(null)
    setError('')
  }

  function iniciarEdicion(s: any) {
    setServicioEditando(s.id)
    setTitulo(s.titulo || '')
    setDescripcion(s.descripcion || '')
    setPrecio(s.precio != null ? String(s.precio) : '')
    setMostrarPrecio(!!s.mostrar_precio)
    setFoto(null)
    setFotoActualUrl(s.foto_url || null)
    setError('')
  }

  async function guardarServicio(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!emprendedor) return

    if (!validarTitulo(titulo)) {
      setError('El título es obligatorio y no puede pasar de 50 caracteres.')
      return
    }

    if (!servicioEditando && servicios.length >= 12) {
      setError('Ya tienes el máximo de 12 servicios.')
      return
    }

    if (precio && !validarPrecio(precio)) {
      setError('El precio debe ser un número positivo con hasta 2 decimales.')
      return
    }

    if (foto) {
      if (!TIPOS_FOTO_PERMITIDOS.includes(foto.type)) {
        setError('La foto debe ser un archivo .png o .jpg/.jpeg.')
        return
      }
      if (foto.size > TAMANO_MAXIMO_FOTO) {
        setError('La foto pesa demasiado (máximo 5 MB). Prueba con otra o hazle una captura más pequeña.')
        return
      }
    }

    setGuardando(true)

    let foto_url = fotoActualUrl
    if (foto) {
      const nombreArchivo = `${emprendedor.id}/${Date.now()}-${foto.name}`
      const { error: errorSubida } = await supabase.storage.from('fotos').upload(nombreArchivo, foto)
      if (errorSubida) {
        setError('Error subiendo la foto: ' + errorSubida.message)
        setGuardando(false)
        return
      }
      const { data } = supabase.storage.from('fotos').getPublicUrl(nombreArchivo)
      foto_url = data.publicUrl
    }

    const valores = {
      titulo,
      descripcion,
      precio: precio ? parseFloat(precio) : null,
      mostrar_precio: mostrarPrecio,
      foto_url,
    }

    if (servicioEditando) {
      const { error } = await supabase.from('servicios').update(valores).eq('id', servicioEditando)
      if (error) { setError(error.message); setGuardando(false); return }
    } else {
      const { error } = await supabase.from('servicios').insert({
        emprendedor_id: emprendedor.id,
        ...valores,
        orden: servicios.length + 1,
      })
      if (error) { setError(error.message); setGuardando(false); return }
    }

    setGuardando(false)
    limpiarFormulario()
    cargarDatos()
  }

  async function alternarActivo(s: any) {
    await supabase.from('servicios').update({ activo: !s.activo }).eq('id', s.id)
    cargarDatos()
  }

  async function eliminarServicio(id: string) {
    await supabase.from('servicios').delete().eq('id', id)
    if (servicioEditando === id) limpiarFormulario()
    cargarDatos()
  }

  async function alternarQR() {
    if (qrVisible) {
      setQrVisible(false)
      return
    }
    if (!qrUrl && emprendedor) {
      const url = `${window.location.origin}/e/${emprendedor.id}`
      const dataUrl = await QRCode.toDataURL(url, { width: 400, margin: 2 })
      setQrUrl(dataUrl)
    }
    setQrVisible(true)
  }

  if (loading) return <div className="contenedor"><p>Cargando...</p></div>
  if (!emprendedor) return <div className="contenedor"><p>Cargando...</p></div>

  return (
    <div className="contenedor" style={{ paddingTop: 96 }}>
      <MenuPanel emprendedor={emprendedor} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <AvatarNegocio emprendedor={emprendedor} tamano={44} conAnillo />
        <h1 style={{ margin: 0 }}>Panel de {emprendedor.nombre_negocio}</h1>
      </div>

      {servicios.length === 0 && (
        <div className="card" style={{ borderColor: 'var(--accent)' }}>
          <strong>¡Bienvenida, {emprendedor.nombre_contacto || emprendedor.nombre_negocio}!</strong>
          <p style={{ margin: '8px 0 0' }}>Tu página ya existe, pero todavía está vacía. Para dejarla lista solo faltan 3 pasos:</p>
          <ol style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            <li>Añade tu primer servicio abajo (con foto si puedes).</li>
            <li>Revisa cómo se ve tu página con el botón "Ver mi página →" del menú.</li>
            <li>Descarga tu código QR y compártelo o imprímelo.</li>
          </ol>
        </div>
      )}

      {servicios.length > 0 && servicios.every((s) => !s.foto_url) && (
        <div className="card" style={{ borderColor: 'var(--accent)' }}>
          <strong>Tu página se ve mejor con fotos</strong>
          <p style={{ margin: '4px 0 0' }}>
            Ninguno de tus servicios tiene foto todavía. Sube al menos una — inspira mucha más confianza que solo texto.
          </p>
        </div>
      )}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Tu código QR</h2>
        <button onClick={alternarQR} className="secundario">
          {qrVisible ? 'Ocultar código QR' : 'Ver código QR'}
        </button>
        {qrVisible && qrUrl && (
          <div style={{ marginTop: 14 }}>
            <p>
              Este código lleva siempre a tu página, aunque en el futuro cambies el nombre de tu negocio.
              Imprímelo donde quieras — nunca deja de funcionar.
            </p>
            <img src={qrUrl} alt="Código QR de tu página" style={{ width: 200, height: 200, display: 'block', marginBottom: 10 }} />
            <a href={qrUrl} download={`qr-${emprendedor.slug}.png`}>
              <button>Descargar QR</button>
            </a>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Tus servicios ({servicios.length}/12)</h2>
        <ul>
          {servicios.map((s) => (
            <li key={s.id} className="servicio">
              <div style={{ display: 'flex', gap: 12 }}>
                {s.foto_url ? (
                  <img
                    src={s.foto_url}
                    alt={s.titulo}
                    style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: 'var(--border)',
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{s.titulo}</strong> — {s.descripcion}
                  {s.mostrar_precio && s.precio != null && <span> — {s.precio} €</span>}
                  {!s.activo && <span className="desactivado"> (desactivado)</span>}
                  <div className="acciones">
                    <button onClick={() => iniciarEdicion(s)} className="secundario">Editar</button>
                    <button onClick={() => alternarActivo(s)} className="secundario">
                      {s.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button onClick={() => eliminarServicio(s.id)} className="peligro">Eliminar</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>{servicioEditando ? 'Editar servicio' : 'Añadir servicio'}</h2>
        <form onSubmit={guardarServicio}>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={50}
            required
          />
          <textarea
            placeholder="Descripción (máx. 200 caracteres)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={200}
            required
          />
          <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>{descripcion.length}/200</p>

          <input
            type="text"
            placeholder="Precio (opcional)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={mostrarPrecio}
              onChange={(e) => setMostrarPrecio(e.target.checked)}
            />
            Mostrar precio en la página pública
          </label>

          {fotoActualUrl && !foto && (
            <div style={{ marginBottom: 10 }}>
              <img src={fotoActualUrl} alt="Foto actual" style={{ maxWidth: 150, display: 'block', marginBottom: 4, borderRadius: 8 }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Foto actual (sube una nueva para reemplazarla)</span>
            </div>
          )}
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>
            Foto del servicio (opcional)
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            capture="environment"
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
          />
          {foto && <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: -6 }}>Seleccionada: {foto.name}</p>}

          <div className="acciones">
            <button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : servicioEditando ? 'Guardar cambios' : '+ Añadir servicio'}
            </button>
            {servicioEditando && (
              <button type="button" onClick={limpiarFormulario} className="secundario">
                Cancelar
              </button>
            )}
          </div>
          {error && <p style={{ color: 'var(--peligro)', marginTop: 10 }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}
