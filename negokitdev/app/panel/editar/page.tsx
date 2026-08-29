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
  const [emprendedor, setEmprendedor] = useState<any>(null)

  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [oficio, setOficio] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [slug, setSlug] = useState('')
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

    const { data: emp } = await supabase
      .from('emprendedores')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (!emp) { router.replace('/registro'); return }

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
    setLoading(false)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setGuardadoOk(false)
    if (!emprendedor) return

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

    if (slugLimpio !== emprendedor.slug) {
      const { data: existente } = await supabase
        .from('emprendedores')
        .select('id')
        .eq('slug', slugLimpio)
        .neq('id', emprendedor.id)
        .maybeSingle()
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

    const { error } = await supabase
      .from('emprendedores')
      .update({
        nombre_negocio: nombre,
        nombre_contacto: contacto,
        oficio,
        ciudad,
        slug: slugLimpio,
        whatsapp_number: normalizarWhatsapp(whatsapp),
        instagram_url: instagramUrl || null,
        tiktok_url: tiktokUrl || null,
        web_url: webUrl || null,
        logo_url,
        mostrar_insignia_respuesta: mostrarInsigniaRespuesta,
        insignia_personalizada: insigniaPersonalizada.trim() || null,
      })
      .eq('id', emprendedor.id)

    setGuardando(false)

    if (error) { setError(error.message); return }

    setSlug(slugLimpio)
    setLogo(null)
    setGuardadoOk(true)
    cargar()
  }

  const logoPreviewUrl = useMemo(() => (logo ? URL.createObjectURL(logo) : logoActualUrl), [logo, logoActualUrl])

  if (loading || !emprendedor) return <div className="contenedor"><p>Cargando...</p></div>

  return (
    <div className="contenedor" style={{ paddingTop: 96 }}>
      <MenuPanel emprendedor={emprendedor} />

      <h1>Editar mi negocio</h1>

      <div className="card">
        <form onSubmit={guardar}>
          <label style={{ display: 'block' }}>Logo de tu negocio</label>
          <p style={{ marginTop: -6, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Aparece en tu página pública, en tu panel y en el menú. Si no subes uno, se muestran tus iniciales.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <AvatarNegocio
              emprendedor={{ ...emprendedor, nombre_negocio: nombre, logo_url: logoPreviewUrl }}
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
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={LONGITUD_MAXIMA.nombreNegocio}
            required
          />

          <label>Tu nombre</label>
          <input
            type="text"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            maxLength={LONGITUD_MAXIMA.nombreContacto}
            required
          />

          <label>Tu oficio</label>
          <input
            type="text"
            value={oficio}
            onChange={(e) => setOficio(e.target.value)}
            maxLength={LONGITUD_MAXIMA.oficio}
            required
          />

          <label>Ciudad</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            maxLength={LONGITUD_MAXIMA.ciudad}
            required
          />

          <label>Enlace de tu página</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            maxLength={LONGITUD_MAXIMA.slug}
            required
          />
          <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Se verá así: <strong>{typeof window !== 'undefined' ? window.location.host : 'tudominio.com'}/{slug ? slugify(slug) : ''}</strong>.
            Si lo cambias, tu código QR sigue funcionando igual — no hace falta que lo vuelvas a imprimir.
          </p>

          <label>Tu WhatsApp</label>
          <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={20} required />

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
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {guardadoOk && <p style={{ color: 'var(--accent)', marginTop: 10 }}>Guardado correctamente.</p>}
          {error && <p style={{ color: 'var(--peligro)', marginTop: 10 }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}
