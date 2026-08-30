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
  validarInsigniaPersonalizada,
  LONGITUD_MAXIMA,
} from '@/lib/validaciones'
import MenuPanel from '../MenuPanel'
import AvatarNegocio from '@/components/AvatarNegocio'

const TAMANO_MAXIMO_LOGO = 5 * 1024 * 1024 // 5 MB
const TIPOS_LOGO_PERMITIDOS = ['image/png', 'image/jpeg']

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
  const [slug, setSlug] = useState('')
  const [slugTocadoAMano, setSlugTocadoAMano] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [web, setWeb] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [logoActualUrl, setLogoActualUrl] = useState<string | null>(null)
  const [mostrarInsigniaRespuesta, setMostrarInsigniaRespuesta] = useState(true)
  const [insigniaPersonalizada, setInsigniaPersonalizada] = useState('')

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

    if (emp) {
      setEmprendedor(emp)
      setNombre(emp.nombre_negocio || '')
      setContacto(emp.nombre_contacto || '')
      setOficio(emp.oficio || '')
      setCiudad(emp.ciudad || '')
      setSlug(emp.slug || '')
      setWhatsapp(emp.whatsapp_number || '')
      setInstagram(emp.instagram_url || '')
      setTiktok(emp.tiktok_url || '')
      setWeb(emp.web_url || '')
      setLogoActualUrl(emp.logo_url || null)
      setMostrarInsigniaRespuesta(emp.mostrar_insignia_respuesta !== false)
      setInsigniaPersonalizada(emp.insignia_personalizada || '')
    } else {
      // Sin página todavía: se queda emprendedor en null y el formulario
      // arranca vacío, listo para crearla.
      setEmprendedor(null)
    }
    setLoading(false)
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
    const slugLimpio = slugify(slug)
    if (!slugLimpio) {
      setError('El enlace de tu página no puede quedar vacío.')
      return
    }
    if (!validarWhatsapp(whatsapp)) {
      setError('Escribe un número de WhatsApp válido.')
      return
    }
    if (!validarInsigniaPersonalizada(insigniaPersonalizada)) {
      setError(`La insignia personalizada no puede pasar de ${LONGITUD_MAXIMA.insigniaPersonalizada} caracteres.`)
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
      slug: slugLimpio,
      whatsapp_number: normalizarWhatsapp(whatsapp),
      instagram_url: instagramUrl || null,
      tiktok_url: tiktokUrl || null,
      web_url: webUrl || null,
      mostrar_insignia_respuesta: mostrarInsigniaRespuesta,
      insignia_personalizada: insigniaPersonalizada.trim() || null,
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

      setSlug(slugLimpio)
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

    setGuardando(false)
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
          <label style={{ display: 'block' }}>Logo de tu negocio</label>
          <p style={{ marginTop: -6, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Aparece en tu página pública, en tu panel y en el menú. Si no subes uno, se muestran tus iniciales.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <AvatarNegocio
              emprendedor={{ nombre_negocio: nombre, logo_url: logoPreviewUrl }}
              tamano={64}
              conAnillo
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
              {logo && (
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: -6 }}>Seleccionado: {logo.name}</p>
              )}
            </div>
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
            placeholder={emprendedor ? undefined : 'ej: Madrid'}
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            maxLength={LONGITUD_MAXIMA.ciudad}
            required
          />

          <label>Enlace de tu página</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTocadoAMano(true)
              setSlug(e.target.value)
            }}
            maxLength={LONGITUD_MAXIMA.slug}
            required
          />
          <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Se verá así: <strong>{typeof window !== 'undefined' ? window.location.host : 'tudominio.com'}/{slug ? slugify(slug) : ''}</strong>.
            {emprendedor && ' Si lo cambias, tu código QR sigue funcionando igual — no hace falta que lo vuelvas a imprimir.'}
          </p>

          <label>Tu WhatsApp</label>
          <input
            type="tel"
            placeholder={emprendedor ? undefined : 'con código de país, ej. +34...'}
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            maxLength={20}
            required
          />

          <label>Instagram (opcional)</label>
          <input
            type="text"
            placeholder="tu_usuario o el enlace completo"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            maxLength={200}
          />
          <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Si lo rellenas, aparece un enlace a tu Instagram en tu página pública.
          </p>

          <label>TikTok (opcional)</label>
          <input
            type="text"
            placeholder="tu_usuario o el enlace completo"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            maxLength={200}
          />

          <label>Página web (opcional)</label>
          <input
            type="text"
            placeholder="tuweb.com"
            value={web}
            onChange={(e) => setWeb(e.target.value)}
            maxLength={200}
          />
          <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Si tienes TikTok o web propia, también aparecerán como enlaces en tu página pública.
          </p>

          <label style={{ display: 'block', marginTop: 6 }}>Insignias de confianza</label>
          <p style={{ marginTop: -6, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Se muestran en tu página pública para dar más confianza a quien te visita.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={mostrarInsigniaRespuesta}
              onChange={(e) => setMostrarInsigniaRespuesta(e.target.checked)}
            />
            Mostrar &quot;Respuesta &lt; 24h&quot;
          </label>
          <input
            type="text"
            placeholder='Insignia personalizada, ej. "+200 clientes atendidos"'
            value={insigniaPersonalizada}
            onChange={(e) => setInsigniaPersonalizada(e.target.value)}
            maxLength={LONGITUD_MAXIMA.insigniaPersonalizada}
          />
          <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Opcional. Déjalo vacío si no quieres mostrar ninguna.
          </p>

          <button type="submit" disabled={guardando}>
            {guardando ? (esNueva ? 'Creando...' : 'Guardando...') : esNueva ? 'Crear mi página' : 'Guardar cambios'}
          </button>
          {guardadoOk && <p style={{ color: 'var(--accent)', marginTop: 10 }}>Guardado correctamente.</p>}
          {error && <p style={{ color: 'var(--peligro)', marginTop: 10 }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}
