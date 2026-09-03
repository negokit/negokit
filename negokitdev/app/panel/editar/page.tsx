'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import {
  slugify,
  validarWhatsapp,
  normalizarWhatsapp,
  validarNombreNegocio,
  validarNombreContacto,
  validarOficio,
  validarCiudad,
  validarDireccionNegocio,
  LONGITUD_MAXIMA,
} from '@/lib/validaciones'
import { INSIGNIAS_PRESET, MAX_INSIGNIAS, obtenerInsignias, validarInsignias } from '@/lib/insignias'
import { guardarBorrador, leerBorrador, borrarBorrador } from '@/lib/borrador'
import { calcularAcceso } from '@/lib/acceso'
import MenuPanel from '../MenuPanel'
import AvatarNegocio from '@/components/AvatarNegocio'

const TAMANO_MAXIMO_LOGO = 5 * 1024 * 1024 // 5 MB
const TIPOS_LOGO_PERMITIDOS = ['image/png', 'image/jpeg']

type BorradorNegocio = {
  nombre: string
  contacto: string
  oficio: string
  ciudad: string
  direccion: string
  slug: string
  whatsapp: string
  instagram: string
  tiktok: string
  web: string
  presetsSeleccionados: string[]
  otroTexto: string
}

export default function EditarNegocioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)
  // null = todavía no tiene página creada (viene recién registrado). Esta
  // misma pantalla sirve tanto para crearla por primera vez como para
  // editarla después — un único formulario, sin duplicar campos en /registro.
  const [emprendedor, setEmprendedor] = useState<any>(null)

  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [oficio, setOficio] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [direccion, setDireccion] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTocadoAMano, setSlugTocadoAMano] = useState(false)
  // El enlace es un campo delicado: una vez la página ya existe, se muestra
  // bloqueado por defecto (cambiarlo rompe los enlaces ya compartidos, aunque
  // no afecta al QR) — hace falta desbloquearlo a propósito para tocarlo.
  const [slugBloqueado, setSlugBloqueado] = useState(true)
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [web, setWeb] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [logoActualUrl, setLogoActualUrl] = useState<string | null>(null)
  const [presetsSeleccionados, setPresetsSeleccionados] = useState<string[]>([])
  const [otrosVisible, setOtrosVisible] = useState(false)
  const [otroTexto, setOtroTexto] = useState('')

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [guardadoOk, setGuardadoOk] = useState(false)

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    setUsuario(user)

    const { data: emp } = await supabase
      .from('emprendedores')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    // Solo bloqueamos a quien ya tiene página y no resolvió su suscripción —
    // nunca a quien todavía está creándola por primera vez.
    if (emp && calcularAcceso(emp).bloqueado) {
      router.replace('/panel/suscripcion')
      return
    }

    const heredadas = emp ? obtenerInsignias(emp) : []
    const presetsBase = heredadas.filter((i) => INSIGNIAS_PRESET.includes(i))
    const otroBase = heredadas.find((i) => !INSIGNIAS_PRESET.includes(i)) || ''

    setEmprendedor(emp || null)
    setSlugBloqueado(!!emp)

    // Si había cambios sin guardar de una visita anterior, se recuperan en
    // vez de partir de lo que ya está guardado de verdad.
    const borrador = leerBorrador<BorradorNegocio>(`negocio-${user.id}`)
    if (borrador) {
      setNombre(borrador.nombre)
      setContacto(borrador.contacto)
      setOficio(borrador.oficio)
      setCiudad(borrador.ciudad)
      setDireccion(borrador.direccion)
      setSlug(borrador.slug)
      setWhatsapp(borrador.whatsapp)
      setInstagram(borrador.instagram)
      setTiktok(borrador.tiktok)
      setWeb(borrador.web)
      setPresetsSeleccionados(borrador.presetsSeleccionados)
      setOtroTexto(borrador.otroTexto)
      setOtrosVisible(!!borrador.otroTexto)
      if (emp && borrador.slug !== emp.slug) setSlugBloqueado(false)
    } else {
      setNombre(emp?.nombre_negocio || '')
      setContacto(emp?.nombre_contacto || '')
      setOficio(emp?.oficio || '')
      setCiudad(emp?.ciudad || '')
      setDireccion(emp?.direccion || '')
      setSlug(emp?.slug || '')
      setWhatsapp(emp?.whatsapp_number || '')
      setInstagram(emp?.instagram_url || '')
      setTiktok(emp?.tiktok_url || '')
      setWeb(emp?.web_url || '')
      setPresetsSeleccionados(presetsBase)
      setOtroTexto(otroBase)
      setOtrosVisible(!!otroBase)
    }
    setLogoActualUrl(emp?.logo_url || null)
    setLoading(false)
  }

  // Guarda automáticamente lo que se va escribiendo, para no perderlo si
  // sale de la pantalla sin pulsar "Guardar" (el logo en sí no se puede
  // guardar así — un archivo no se puede meter en localStorage — pero todo
  // el texto sí).
  useEffect(() => {
    if (loading || !usuario) return
    guardarBorrador(`negocio-${usuario.id}`, {
      nombre, contacto, oficio, ciudad, direccion, slug, whatsapp, instagram, tiktok, web,
      presetsSeleccionados, otroTexto,
    } satisfies BorradorNegocio)
  }, [loading, usuario, nombre, contacto, oficio, ciudad, direccion, slug, whatsapp, instagram, tiktok, web, presetsSeleccionados, otroTexto])

  function alternarPreset(texto: string) {
    setError('')
    setPresetsSeleccionados((prev) => {
      if (prev.includes(texto)) return prev.filter((t) => t !== texto)
      const totalActual = prev.length + (otrosVisible && otroTexto.trim() ? 1 : 0)
      if (totalActual >= MAX_INSIGNIAS) {
        setError(`Puedes elegir hasta ${MAX_INSIGNIAS} insignias.`)
        return prev
      }
      return [...prev, texto]
    })
  }

  function alternarOtros() {
    if (otrosVisible) {
      setOtrosVisible(false)
      setOtroTexto('')
      return
    }
    if (presetsSeleccionados.length >= MAX_INSIGNIAS) {
      setError(`Puedes elegir hasta ${MAX_INSIGNIAS} insignias.`)
      return
    }
    setError('')
    setOtrosVisible(true)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setGuardadoOk(false)
    if (!usuario) return

    if (!validarNombreNegocio(nombre)) {
      setError('El nombre de tu negocio debe tener entre 2 y 60 caracteres.')
      return
    }
    if (!validarNombreContacto(contacto)) {
      setError('Tu nombre solo puede tener letras y espacios (2 a 60 caracteres).')
      return
    }
    if (!validarOficio(oficio)) {
      setError('Tu oficio debe tener entre 2 y 40 caracteres.')
      return
    }
    if (!validarCiudad(ciudad)) {
      setError('Tu ciudad solo puede tener letras y espacios (2 a 40 caracteres).')
      return
    }
    if (!validarDireccionNegocio(direccion)) {
      setError(`La dirección no puede pasar de ${LONGITUD_MAXIMA.direccionNegocio} caracteres.`)
      return
    }
    const slugLimpio = slugify(slug)
    if (!slugLimpio) {
      setError('El enlace de tu página no puede quedar vacío.')
      return
    }
    if (!validarWhatsapp(whatsapp)) {
      setError('Escribe un número de WhatsApp válido.')
      return
    }
    const insigniasFinal = [...presetsSeleccionados, ...(otrosVisible && otroTexto.trim() ? [otroTexto.trim()] : [])]
    if (!validarInsignias(insigniasFinal)) {
      setError(`Cada insignia puede tener hasta 40 caracteres, y hasta ${MAX_INSIGNIAS} en total.`)
      return
    }
    if (logo) {
      if (!TIPOS_LOGO_PERMITIDOS.includes(logo.type)) {
        setError('El logo debe ser un archivo .png o .jpg/.jpeg.')
        return
      }
      if (logo.size > TAMANO_MAXIMO_LOGO) {
        setError('El logo pesa demasiado (máximo 5 MB). Prueba con otro archivo.')
        return
      }
    }

    setGuardando(true)

    // Comprobar el enlace solo si es nuevo o si de verdad ha cambiado.
    if (!emprendedor || slugLimpio !== emprendedor.slug) {
      let consulta = supabase.from('emprendedores').select('id').eq('slug', slugLimpio)
      if (emprendedor) consulta = consulta.neq('id', emprendedor.id)
      const { data: existente } = await consulta.maybeSingle()
      if (existente) {
        setError('Ese enlace ya está en uso por otra página, prueba con otro.')
        setGuardando(false)
        return
      }
    }

    let instagramUrl = instagram.trim()
    if (instagramUrl && !/^https?:\/\//i.test(instagramUrl)) {
      instagramUrl = `https://instagram.com/${instagramUrl.replace(/^@/, '')}`
    }

    let tiktokUrl = tiktok.trim()
    if (tiktokUrl && !/^https?:\/\//i.test(tiktokUrl)) {
      tiktokUrl = `https://tiktok.com/@${tiktokUrl.replace(/^@/, '')}`
    }

    let webUrl = web.trim()
    if (webUrl && !/^https?:\/\//i.test(webUrl)) {
      webUrl = `https://${webUrl}`
    }

    const camposComunes = {
      nombre_negocio: nombre,
      nombre_contacto: contacto,
      oficio,
      ciudad,
      direccion: direccion.trim() || null,
      slug: slugLimpio,
      whatsapp_number: normalizarWhatsapp(whatsapp),
      instagram_url: instagramUrl || null,
      tiktok_url: tiktokUrl || null,
      web_url: webUrl || null,
      insignias: insigniasFinal,
    }

    if (emprendedor) {
      // Editando una página que ya existe.
      let logo_url = logoActualUrl
      if (logo) {
        const nombreArchivo = `${emprendedor.id}/logo-${Date.now()}-${logo.name}`
        const { error: errorSubida } = await supabase.storage.from('fotos').upload(nombreArchivo, logo)
        if (errorSubida) {
          setError('Error subiendo el logo: ' + errorSubida.message)
          setGuardando(false)
          return
        }
        const { data } = supabase.storage.from('fotos').getPublicUrl(nombreArchivo)
        logo_url = data.publicUrl
      }

      const { error } = await supabase
        .from('emprendedores')
        .update({ ...camposComunes, logo_url })
        .eq('id', emprendedor.id)

      setGuardando(false)
      if (error) { setError(error.message); return }

      borrarBorrador(`negocio-${usuario.id}`)
      setSlug(slugLimpio)
      setSlugBloqueado(true)
      setLogo(null)
      setGuardadoOk(true)
      cargar()
      return
    }

    // Primera vez: se crea la página. El logo se sube después de tener el
    // id nuevo, para que quede guardado en su propia carpeta.
    const { data: nuevo, error: errorCrear } = await supabase
      .from('emprendedores')
      .insert({
        ...camposComunes,
        auth_user_id: usuario.id,
        email: usuario.email,
        pais: 'España',
        activo: true,
      })
      .select()
      .single()

    if (errorCrear) {
      setError(errorCrear.message)
      setGuardando(false)
      return
    }

    if (logo) {
      const nombreArchivo = `${nuevo.id}/logo-${Date.now()}-${logo.name}`
      const { error: errorSubida } = await supabase.storage.from('fotos').upload(nombreArchivo, logo)
      if (!errorSubida) {
        const { data } = supabase.storage.from('fotos').getPublicUrl(nombreArchivo)
        await supabase.from('emprendedores').update({ logo_url: data.publicUrl }).eq('id', nuevo.id)
      }
      // Si falla la subida del logo aquí, no bloqueamos la creación de la
      // página — puede volver a subirlo después desde esta misma pantalla.
    }

    borrarBorrador(`negocio-${usuario.id}`)
    setGuardando(false)
    // Al panel normal, no directo a pedir la tarjeta — así el cliente puede
    // ver y probar cómo funciona primero (con Gabriela explicándoselo en
    // persona). Si le gusta, se le lleva a la pasarela de pago desde ahí.
    // El límite de 24h sin iniciar prueba (lib/config.ts) sigue protegiendo
    // de que alguien use la app gratis sin fecha límite.
    router.replace('/panel')
  }

  const logoPreviewUrl = useMemo(() => (logo ? URL.createObjectURL(logo) : logoActualUrl), [logo, logoActualUrl])

  if (loading || !usuario) return <div className="contenedor"><p>Cargando...</p></div>

  const esNueva = !emprendedor

  return (
    <div className="contenedor" style={{ paddingTop: esNueva ? 32 : 96 }}>
      {!esNueva && <MenuPanel emprendedor={emprendedor} />}

      <h1>{esNueva ? 'Crea tu página' : 'Editar mi negocio'}</h1>
      {esNueva && (
        <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.9rem' }}>
          Ya confirmaste tu correo — ahora completa estos datos para publicar tu página.
        </p>
      )}

      <div className="card">
        <form onSubmit={guardar}>
          <div className="seccion-formulario sin-borde">
            <p className="etiqueta-seccion">Tu negocio</p>

            <div className="zona-logo">
              <AvatarNegocio
                emprendedor={{ nombre_negocio: nombre, logo_url: logoPreviewUrl }}
                tamano={84}
                conAnillo
              />
              <label htmlFor="logo-input" className="boton-subir-archivo">
                {logoActualUrl || logo ? 'Cambiar logo' : 'Subir logo (cámara o galería)'}
              </label>
              <input
                id="logo-input"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }}
              />
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.82rem' }}>
                {logo ? `Seleccionado: ${logo.name}` : 'Aparece en tu página, tu panel y el menú. Sin logo, se muestran tus iniciales.'}
              </p>
            </div>

            <label>Nombre de tu negocio</label>
            <input
              type="text"
              placeholder={emprendedor ? undefined : 'ej: Peluquería María'}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                // Solo autocompletamos el enlace mientras se crea la página por
                // primera vez, y solo si todavía no lo ha tocado a mano.
                if (!emprendedor && !slugTocadoAMano) setSlug(slugify(e.target.value))
              }}
              maxLength={LONGITUD_MAXIMA.nombreNegocio}
              required
            />

            <label>Tu nombre</label>
            <input
              type="text"
              placeholder={emprendedor ? undefined : 'ej: María Pérez'}
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              maxLength={LONGITUD_MAXIMA.nombreContacto}
              required
            />

            <label>Tu oficio</label>
            <input
              type="text"
              placeholder={emprendedor ? undefined : 'ej: Peluquera, jardinero, electricista...'}
              value={oficio}
              onChange={(e) => setOficio(e.target.value)}
              maxLength={LONGITUD_MAXIMA.oficio}
              required
            />

            <label>Ciudad</label>
            <input
              type="text"
              placeholder={emprendedor ? undefined : 'ej: Getafe'}
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              maxLength={LONGITUD_MAXIMA.ciudad}
              required
            />

            <label>Dirección (opcional)</label>
            <input
              type="text"
              placeholder="ej: Calle Mayor 12"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              maxLength={LONGITUD_MAXIMA.direccionNegocio}
            />
            <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
              Si la rellenas, aparece en tu página pública junto a tu teléfono — da más confianza para que te
              contacten. Si prefieres no mostrar tu calle exacta, déjala vacía y se queda solo la ciudad.
            </p>

            <label>Enlace de tu página</label>
            {slugBloqueado ? (
              <div className="campo-bloqueado">
                <span>{typeof window !== 'undefined' ? window.location.host : 'tudominio.com'}/{slug}</span>
                <button type="button" className="enlace-boton" onClick={() => setSlugBloqueado(false)}>
                  Cambiar enlace
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugTocadoAMano(true)
                    setSlug(e.target.value)
                  }}
                  maxLength={LONGITUD_MAXIMA.slug}
                  required
                  autoFocus={!esNueva}
                />
                <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
                  Se verá así: <strong>{typeof window !== 'undefined' ? window.location.host : 'tudominio.com'}/{slug ? slugify(slug) : ''}</strong>.
                </p>
                {emprendedor && (
                  <p className="aviso-cambio-enlace">
                    Ojo: si cambias el enlace, lo que ya compartiste con la URL anterior (redes, WhatsApp, Google) deja
                    de llevar a tu página. Tu código QR no se ve afectado — sigue funcionando igual, no hace falta
                    reimprimirlo.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="seccion-formulario">
            <p className="etiqueta-seccion">Contacto</p>
            <label>Tu WhatsApp</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder={emprendedor ? undefined : 'ej: 600 123 456'}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              maxLength={20}
              required
            />
            <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
              Escribe solo tu número — si no pones prefijo de país, asumimos España (+34). Si tu negocio está en otro
              país, escribe el prefijo delante (ej. +52 para México).
            </p>
          </div>

          <div className="seccion-formulario">
            <p className="etiqueta-seccion">Redes y web (opcional)</p>
            <label>Instagram</label>
            <input
              type="text"
              placeholder="tu_usuario o el enlace completo"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              maxLength={200}
            />

            <label>TikTok</label>
            <input
              type="text"
              placeholder="tu_usuario o el enlace completo"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              maxLength={200}
            />

            <label>Página web</label>
            <input
              type="text"
              placeholder="tuweb.com"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
              maxLength={200}
            />
            <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
              Lo que rellenes aparece como enlace en tu página pública.
            </p>
          </div>

          <div className="seccion-formulario">
            <p className="etiqueta-seccion">Insignias de confianza</p>
            <p style={{ marginTop: -6, color: 'var(--muted)', fontSize: '0.85rem' }}>
              Elige hasta {MAX_INSIGNIAS} — se muestran en tu página pública para dar más confianza a quien te visita.
            </p>
            <div className="chips-insignias">
              {INSIGNIAS_PRESET.map((texto) => (
                <button
                  type="button"
                  key={texto}
                  className={`chip-insignia${presetsSeleccionados.includes(texto) ? ' activo' : ''}`}
                  onClick={() => alternarPreset(texto)}
                >
                  {texto}
                </button>
              ))}
              <button
                type="button"
                className={`chip-insignia${otrosVisible ? ' activo' : ''}`}
                onClick={alternarOtros}
              >
                + Otros
              </button>
            </div>
            {otrosVisible && (
              <input
                type="text"
                placeholder='Escribe tu insignia, ej. "Atención en tu idioma"'
                value={otroTexto}
                onChange={(e) => setOtroTexto(e.target.value)}
                maxLength={40}
                autoFocus
              />
            )}
          </div>

          <button type="submit" disabled={guardando} style={{ marginTop: 8 }}>
            {guardando ? (esNueva ? 'Creando...' : 'Guardando...') : esNueva ? 'Crear mi página' : 'Guardar cambios'}
          </button>
          {guardadoOk && <p style={{ color: 'var(--accent)', marginTop: 10 }}>Guardado correctamente.</p>}
          {error && <p style={{ color: 'var(--peligro)', marginTop: 10 }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}
