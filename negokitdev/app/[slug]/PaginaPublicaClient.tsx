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
import { calcularAcceso } from '@/lib/acceso'
import estilos from './pagina-publica.module.css'

function IconoPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

// Formatea un teléfono español (+34 y 9 dígitos) en grupos, para que se lea
// como un número de verdad y no como una fila de dígitos pegados. Cualquier
// otro prefijo se muestra tal cual, sin arriesgarse a formatear mal.
function formatearTelefono(numero: string) {
  if (/^\+34\d{9}$/.test(numero)) {
    const resto = numero.slice(3)
    return `+34 ${resto.slice(0, 3)} ${resto.slice(3, 5)} ${resto.slice(5, 7)} ${resto.slice(7, 9)}`
  }
  return numero
}

function IconoTelefono() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function IconoCompartir() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
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

// Icono de "cómo llegar" (flecha de navegación) para el botón que abre
// Google Maps con la dirección del negocio ya escrita.
function IconoRuta() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  )
}

function IconoRayo() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  )
}

function IconoCandado() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

// Icono real de WhatsApp (no uno genérico de chat), para que el botón
// flotante se reconozca de un vistazo.
function IconoWhatsapp() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
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
  const [bloqueada, setBloqueada] = useState(false)

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

    // Si el emprendedor no pagó (o nunca llegó a iniciar su prueba y ya pasó
    // el plazo), su página pública también se oculta — solo puede editar y
    // ver de nuevo su página en cuanto resuelva el pago desde su panel.
    if (emp && calcularAcceso(emp).bloqueado) {
      setBloqueada(true)
      setEmprendedor(null)
      setLoading(false)
      return
    }

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
    // location.href (no window.open con '_blank'): al abrir wa.me en una
    // pestaña nueva, dentro de navegadores restringidos (el navegador
    // interno de WhatsApp/Instagram, por ejemplo) el botón "atrás" cerraba
    // la pestaña nueva Y la propia página de Emprenia de golpe. Navegando
    // en la misma pestaña, "atrás" simplemente vuelve a Emprenia tal cual.
    window.location.href = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`
  }

  // Abre Google Maps ya centrado en la dirección del negocio — usamos texto
  // libre (dirección + ciudad), no coordenadas, porque es lo único que
  // tenemos guardado y Maps lo resuelve perfectamente igual.
  function comoLlegar() {
    const texto = [emprendedor?.direccion, emprendedor?.ciudad].filter(Boolean).join(', ')
    if (!texto) return
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(texto)}`, '_blank')
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
    // Mismo motivo que en hablarPorWhatsapp(): sin '_blank', para no dejar
    // al cliente "atrapado" al darle a atrás desde WhatsApp.
    window.location.href = url
    borrarBorrador(`contacto-${slug}`)
    setEnviando(false)
    setEnviado(true)
  }

  if (loading) return <div className="contenedor"><p>Cargando...</p></div>
  if (bloqueada) return <div className="contenedor"><p>Esta página no está disponible en este momento.</p></div>
  if (!emprendedor) return <div className="contenedor"><p>No se encontró esta página.</p></div>

  // Las insignias elegidas (hasta 2) se muestran siempre juntas y de la
  // misma forma.
  const insigniasNegocio = obtenerInsignias(emprendedor)

  // Oficio y nombre de contacto van en una sola línea (en vez de dos
  // líneas apiladas) — con datos de prueba iguales en ambos campos se veía
  // como si el nombre estuviera duplicado.
  const lineaOficioContacto = [emprendedor.oficio, emprendedor.nombre_contacto].filter(Boolean).join(' · ')
  // Dirección y ciudad juntas en una sola línea, como se escribirían en
  // una tarjeta de verdad, en vez de repetir el icono de ubicación dos veces.
  const lineaDireccion = [emprendedor.direccion, emprendedor.ciudad].filter(Boolean).join(', ')

  return (
    <div className={`contenedor ${estilos.pagina}`}>
      <div className={estilos.cabecera}>
        <div className={estilos.filaCabecera}>
          <AvatarNegocio emprendedor={emprendedor} tamano={60} conAnillo colorFondo="var(--pp-accent)" />
          <div className={estilos.infoNegocio}>
            <h1 className={estilos.nombre}>{emprendedor.nombre_negocio}</h1>
            {lineaOficioContacto && <p className={estilos.subtitulo}>{lineaOficioContacto}</p>}
          </div>
          <div className={estilos.iconosCabecera}>
            {emprendedor.instagram_url && (
              <a
                href={emprendedor.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className={estilos.iconoCircular}
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
                className={estilos.iconoCircular}
                title="TikTok"
                aria-label="TikTok"
              >
                TT
              </a>
            )}
            <button type="button" className={estilos.iconoCircular} onClick={compartir} title="Compartir" aria-label="Compartir">
              <IconoCompartir />
            </button>
          </div>
        </div>

        {emprendedor.descripcion && (
          <p className={estilos.descripcion}>{emprendedor.descripcion}</p>
        )}

        {copiado && <p className={estilos.avisoCopiado}>Enlace copiado ✓</p>}

        {(lineaDireccion || emprendedor.whatsapp_number) && (
          <div className={estilos.metaFila}>
            {lineaDireccion && (
              <a
                className={estilos.metaItem}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lineaDireccion)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <IconoPin /> {lineaDireccion}
              </a>
            )}
            {emprendedor.whatsapp_number && (
              <a className={estilos.metaItem} href={`tel:${emprendedor.whatsapp_number}`} style={{ textDecoration: 'none' }}>
                <IconoTelefono /> {formatearTelefono(emprendedor.whatsapp_number)}
              </a>
            )}
          </div>
        )}

        {insigniasNegocio.length > 0 && (
          <div className={estilos.badges}>
            {insigniasNegocio.map((texto) => (
              <span key={texto} className={estilos.badge}>{texto}</span>
            ))}
          </div>
        )}

        {emprendedor.whatsapp_number && (
          <div className={estilos.filaAcciones}>
            <button type="button" className={estilos.accionPrincipal} onClick={hablarPorWhatsapp}>
              <IconoChat /> Contactar por WhatsApp
            </button>
            <a className={estilos.accionSecundaria} href={`tel:${emprendedor.whatsapp_number}`} title="Llamar" aria-label="Llamar">
              <IconoTelefono />
            </a>
            {lineaDireccion && (
              <button type="button" className={estilos.accionSecundaria} onClick={comoLlegar} title="Cómo llegar" aria-label="Cómo llegar">
                <IconoRuta />
              </button>
            )}
          </div>
        )}
      </div>

      <div id="servicios" className={estilos.seccionServicios}>
        <p className={estilos.etiquetaSeccion}>SERVICIOS</p>
        <h2 className={estilos.tituloServicios}>Elige lo que necesitas</h2>

        {servicios.length === 0 && <p style={{ color: 'var(--pp-muted)' }}>Todavía no hay servicios publicados.</p>}

        <div className={estilos.listaServicios}>
          {servicios.map((s) => (
            <div key={s.id} className={estilos.tarjetaServicio}>
              {s.foto_url && (
                <div className={estilos.imagenServicio}>
                  <img src={s.foto_url} alt={s.titulo} />
                </div>
              )}
              <div className={estilos.cuerpoServicio}>
                <div className={estilos.filaTituloPrecio}>
                  <span className={estilos.tituloServicio}>{s.titulo}</span>
                  {s.mostrar_precio && s.precio != null && <span className={estilos.precioServicio}>Desde {s.precio} €</span>}
                </div>
                <p className={estilos.descripcionServicio}>{s.descripcion}</p>
                <button type="button" className={estilos.enlaceContactar} onClick={() => abrirContacto(s.id)}>
                  Contactar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {servicioSeleccionado && !enviado && (
        <div className={`card ${estilos.formCard}`} id="formulario-contacto">
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

            <button type="submit" className={`boton-pill ${estilos.botonEnviar}`} disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar por WhatsApp →'}
            </button>
            {error && <p style={{ color: 'var(--peligro)', marginTop: 10 }}>{error}</p>}
          </form>
        </div>
      )}

      {enviado && (
        <div className={`card ${estilos.formCard}`}>
          <p>¡Listo! Se abrió WhatsApp con tu mensaje.</p>
        </div>
      )}

      {emprendedor.whatsapp_number && (
        <div className={estilos.ctaFinal}>
          <div className={estilos.ctaFila}>
            <div className={estilos.ctaIcono}><IconoChat /></div>
            <div className={estilos.ctaTexto2}>
              <p className={estilos.ctaEtiqueta}>HABLEMOS</p>
              <h2 className={estilos.ctaTitulo}>¿Tienes algo en mente?</h2>
              <p className={estilos.ctaTexto}>Cuéntame qué necesitas y hablamos directamente por WhatsApp.</p>
            </div>
            <button type="button" className={estilos.ctaBoton} onClick={hablarPorWhatsapp}>
              <IconoChat /> Hablar por WhatsApp →
            </button>
          </div>
          <div className={estilos.ctaNotas}>
            <span className={estilos.ctaNota}><IconoRayo /> Respuesta rápida</span>
            <span className={estilos.ctaNota}><IconoCandado /> Sin compromiso</span>
          </div>
        </div>
      )}

      <div className={estilos.pie}>
        <a href="/login" className={estilos.pieEnlace}>
          Creado con <LogoServix variante="icono" tamano={16} />
          <strong>Emprenia</strong>
        </a>
        <span className={estilos.pieTagline}>Tu negocio, más lejos.</span>
      </div>

      {emprendedor.whatsapp_number && (
        <button
          type="button"
          className={estilos.flotante}
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
