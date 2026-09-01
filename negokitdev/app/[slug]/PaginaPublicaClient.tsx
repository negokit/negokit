'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import LogoServix from '@/components/LogoServix'
import AvatarNegocio from '@/components/AvatarNegocio'
import {
  validarNombreCliente,
  validarTelefonoCliente,
  validarDireccionCliente,
  LONGITUD_MAXIMA,
} from '@/lib/validaciones'
import { obtenerInsignias } from '@/lib/insignias'
import { guardarBorrador, leerBorrador, borrarBorrador } from '@/lib/borrador'

function IconoPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconoReloj() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function IconoCompartir() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </svg>
  )
}

function IconoGlobo() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}

function IconoChat() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  )
}

// Icono real de WhatsApp (no uno genérico de chat), para que el botón
// flotante se reconozca de un vistazo.
function IconoWhatsapp() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}

export default function PaginaPublicaClient({ slug }: { slug: string }) {
  const [emprendedor, setEmprendedor] = useState<any>(null)
  const [servicios, setServicios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [webSitio, setWebSitio] = useState('') // campo trampa anti-spam, no se muestra a personas
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [listoParaGuardarBorrador, setListoParaGuardarBorrador] = useState(false)

  useEffect(() => {
    cargar()
  }, [slug])

  // Recupera lo que el cliente ya había escrito en el formulario de
  // contacto, por si salió de la página sin llegar a enviarlo.
  useEffect(() => {
    const borrador = leerBorrador<{ nombre: string; telefono: string; direccion: string }>(`contacto-${slug}`)
    if (borrador) {
      setNombre(borrador.nombre)
      setTelefono(borrador.telefono)
      setDireccion(borrador.direccion)
    }
    setListoParaGuardarBorrador(true)
  }, [slug])

  useEffect(() => {
    if (!listoParaGuardarBorrador) return
    guardarBorrador(`contacto-${slug}`, { nombre, telefono, direccion })
  }, [listoParaGuardarBorrador, slug, nombre, telefono, direccion])

  useEffect(() => {
    if (servicioSeleccionado) {
      document.getElementById('formulario-contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [servicioSeleccionado])

  async function cargar() {
    setLoading(true)
    const { data: emp } = await supabase
      .from('emprendedores')
      .select('*')
      .eq('slug', slug)
      .eq('activo', true)
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

  function irAServicios() {
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function compartir() {
    const url = window.location.href
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      ;(navigator as any).share({ title: emprendedor?.nombre_negocio, url }).catch(() => {})
      return
    }
    navigator.clipboard?.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  function hablarPorWhatsapp() {
    if (!emprendedor?.whatsapp_number) return
    const numeroLimpio = emprendedor.whatsapp_number.replace(/\D/g, '')
    const mensaje = `Hola! Vi tu página y quería contarte lo que necesito.`
    window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  async function enviarFormulario(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Campo trampa: si un bot lo rellena, fingimos que todo fue bien y no hacemos nada más.
    if (webSitio) {
      setEnviado(true)
      return
    }

    if (!validarNombreCliente(nombre)) {
      setError('El nombre solo puede tener letras y espacios (2 a 60 caracteres).')
      return
    }
    if (!validarTelefonoCliente(telefono)) {
      setError('Escribe un teléfono válido (solo números, 9 a 20 caracteres).')
      return
    }
    if (!validarDireccionCliente(direccion)) {
      setError('Escribe una dirección válida (5 a 150 caracteres).')
      return
    }
    if (!aceptaDatos) {
      setError('Debes aceptar que este negocio use tus datos para contactarte.')
      return
    }

    setEnviando(true)

    const { error } = await supabase.from('leads').insert({
      servicio_id: servicioSeleccionado,
      nombre_cliente: nombre,
      telefono_cliente: telefono,
      direccion_cliente: direccion,
    })
    if (error) {
      setError(error.message)
      setEnviando(false)
      return
    }

    const servicio = servicios.find((s) => s.id === servicioSeleccionado)
    const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    const mensaje =
      `¡Hola! Vengo desde tu página y quiero contactarte por esto:\n\n` +
      `Servicio - "${servicio?.titulo}"\n` +
      `Nombre - ${nombre}\n` +
      `Teléfono - ${telefono}\n` +
      `Dirección - ${direccion}\n` +
      `Fecha - ${fecha}\n\n` +
      `Quedo pendiente, ¡gracias!`
    const numeroLimpio = emprendedor.whatsapp_number.replace(/\D/g, '')
    const url = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
    borrarBorrador(`contacto-${slug}`)
    setEnviando(false)
    setEnviado(true)
  }

  if (loading) return <div className="contenedor"><p>Cargando...</p></div>
  if (!emprendedor) return <div className="contenedor"><p>No se encontró esta página.</p></div>

  const insigniasNegocio = obtenerInsignias(emprendedor)
  const tieneRespuesta24h = insigniasNegocio.includes('Respuesta en menos de 24h')
  const otrasInsignias = insigniasNegocio.filter((i) => i !== 'Respuesta en menos de 24h')

  return (
    <div className="contenedor pagina-publica">
      <div className="fila-cabecera">
        <AvatarNegocio emprendedor={emprendedor} tamano={56} conAnillo />
        <div className="info-negocio">
          <h1>{emprendedor.nombre_negocio}</h1>
          {emprendedor.oficio && <p className="subtitulo-oficio">{emprendedor.oficio}</p>}
        </div>
        <div className="iconos-cabecera">
          {emprendedor.instagram_url && (
            <a
              href={emprendedor.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="icono-circular"
              title="Instagram"
              aria-label="Instagram"
            >
              IG
            </a>
          )}
          {emprendedor.tiktok_url && (
            <a
              href={emprendedor.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="icono-circular"
              title="TikTok"
              aria-label="TikTok"
            >
              TT
            </a>
          )}
          {emprendedor.web_url && (
            <a
              href={emprendedor.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="icono-circular"
              title="Página web"
              aria-label="Página web"
            >
              <IconoGlobo />
            </a>
          )}
          <button type="button" className="icono-circular" onClick={compartir} title="Compartir" aria-label="Compartir">
            <IconoCompartir />
          </button>
        </div>
      </div>

      {copiado && <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: -6 }}>Enlace copiado ✓</p>}

      <div className="meta-fila">
        {emprendedor.ciudad && (
          <span className="meta-item"><IconoPin /> {emprendedor.ciudad}</span>
        )}
        {tieneRespuesta24h && (
          <span className="meta-item"><IconoReloj /> Respuesta &lt; 24h</span>
        )}
      </div>

      {otrasInsignias.length > 0 && (
        <div className="etiquetas">
          {otrasInsignias.map((texto) => (
            <span key={texto} className="etiqueta">{texto}</span>
          ))}
        </div>
      )}

      {servicios.length > 0 && (
        <button type="button" className="boton-pill" onClick={irAServicios}>
          <IconoChat /> Contactar →
        </button>
      )}

      <div id="servicios" className="seccion-servicios">
        <p className="etiqueta-seccion">SERVICIOS</p>
        <h2>Elige lo que necesitas.</h2>

        {servicios.length === 0 && <p style={{ color: 'var(--muted)' }}>Todavía no hay servicios publicados.</p>}

        <div className="lista-servicios-nueva">
          {servicios.map((s) => (
            <div key={s.id} className="tarjeta-servicio-nueva">
              {s.foto_url && (
                <div className="imagen-servicio-nueva">
                  <img src={s.foto_url} alt={s.titulo} />
                </div>
              )}
              <div className="cuerpo-servicio-nueva">
                <div className="fila-titulo-precio">
                  <strong>{s.titulo}</strong>
                  {s.mostrar_precio && s.precio != null && <span className="precio-servicio-nueva">Desde {s.precio} €</span>}
                </div>
                <p>{s.descripcion}</p>
                <button type="button" className="boton-pill" onClick={() => abrirContacto(s.id)}>
                  Contactar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {servicioSeleccionado && !enviado && (
        <div className="card" id="formulario-contacto">
          <h2 style={{ marginTop: 0 }}>Contactar</h2>
          <form onSubmit={enviarFormulario}>
            <label style={{ display: 'block', marginBottom: 4 }}>Servicio</label>
            <select value={servicioSeleccionado} onChange={(e) => setServicioSeleccionado(e.target.value)}>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>{s.titulo}</option>
              ))}
            </select>

            <label style={{ display: 'block', marginBottom: 4 }}>Tu nombre</label>
            <input
              type="text"
              placeholder="Nombre y apellido"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={LONGITUD_MAXIMA.nombreCliente}
              required
            />

            <label style={{ display: 'block', marginBottom: 4 }}>Tu teléfono</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="600 123 456"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              maxLength={LONGITUD_MAXIMA.telefonoCliente}
              required
            />

            <label style={{ display: 'block', marginBottom: 4 }}>Tu dirección</label>
            <input
              type="text"
              placeholder="Calle, número, ciudad"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              maxLength={LONGITUD_MAXIMA.direccionCliente}
              required
            />

            {/* Campo trampa anti-spam: invisible para personas, los bots suelen rellenarlo igualmente */}
            <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
              <label htmlFor="sitio-web-campo-trampa">No rellenar este campo</label>
              <input
                id="sitio-web-campo-trampa"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={webSitio}
                onChange={(e) => setWebSitio(e.target.value)}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', margin: '10px 0' }}>
              <input
                type="checkbox"
                checked={aceptaDatos}
                onChange={(e) => setAceptaDatos(e.target.checked)}
                style={{ marginTop: 3, width: 'auto' }}
              />
              <span>
                Acepto que {emprendedor.nombre_negocio} use estos datos únicamente para contactarme sobre este servicio.
                Ver <a href="/privacidad" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
              </span>
            </label>

            <button type="submit" className="boton-pill" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar por WhatsApp →'}
            </button>
            {error && <p style={{ color: 'var(--peligro)', marginTop: 10 }}>{error}</p>}
          </form>
        </div>
      )}

      {enviado && (
        <div className="card">
          <p>¡Listo! Se abrió WhatsApp con tu mensaje.</p>
        </div>
      )}

      {emprendedor.whatsapp_number && (
        <div className="tarjeta-oscura">
          <p className="etiqueta-oscura">HABLEMOS</p>
          <h2 style={{ color: '#fff', border: 'none', margin: '4px 0 8px', paddingBottom: 0 }}>¿Tienes algo en mente?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Cuéntame qué necesitas y hablamos directamente por WhatsApp.</p>
          <button type="button" className="boton-pill-claro" onClick={hablarPorWhatsapp}>
            Hablar por WhatsApp →
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.75rem',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          Creado con <LogoServix variante="icono" tamano={16} />
          <strong style={{ color: 'var(--foreground)' }}>servix</strong>
        </a>
      </div>

      {emprendedor.whatsapp_number && (
        <button
          type="button"
          className="boton-whatsapp-flotante"
          onClick={hablarPorWhatsapp}
          title="Hablar por WhatsApp"
          aria-label="Hablar por WhatsApp"
        >
          <IconoWhatsapp />
        </button>
      )}
    </div>
  )
}
