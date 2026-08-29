'use client'
import { useEffect, useState } from 'react'
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
  LONGITUD_MAXIMA,
} from '@/lib/validaciones'
import AuthLayout from '@/components/AuthLayout'

export default function RegistroPage() {
  const router = useRouter()
  const [cargando, setCargando] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [regNombre, setRegNombre] = useState('')
  const [regContacto, setRegContacto] = useState('')
  const [regOficio, setRegOficio] = useState('')
  const [regCiudad, setRegCiudad] = useState('')
  const [regSlug, setRegSlug] = useState('')
  const [slugTocadoAMano, setSlugTocadoAMano] = useState(false)
  const [regWhatsapp, setRegWhatsapp] = useState('')
  const [registrando, setRegistrando] = useState(false)
  const [errorRegistro, setErrorRegistro] = useState('')

  useEffect(() => {
    verificar()
  }, [])

  async function verificar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }
    setUser(user)

    // Si ya tiene página creada, no debe pasar por aquí de nuevo.
    const { data: emp } = await supabase
      .from('emprendedores')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (emp) {
      router.replace('/panel')
      return
    }

    setCargando(false)
  }

  async function crearPerfil(e: React.FormEvent) {
    e.preventDefault()
    setErrorRegistro('')
    if (!user) return

    if (!validarNombreNegocio(regNombre)) {
      setErrorRegistro('Escribe el nombre de tu negocio (2 a 60 caracteres).')
      return
    }
    if (!validarNombreContacto(regContacto)) {
      setErrorRegistro('Escribe tu nombre, solo letras y espacios (2 a 60 caracteres).')
      return
    }
    if (!validarOficio(regOficio)) {
      setErrorRegistro('Escribe tu oficio (2 a 40 caracteres).')
      return
    }
    if (!validarCiudad(regCiudad)) {
      setErrorRegistro('Escribe tu ciudad, solo letras y espacios (2 a 40 caracteres).')
      return
    }
    const slugLimpio = slugify(regSlug)
    if (!slugLimpio) {
      setErrorRegistro('Escribe un nombre de negocio o un enlace válido.')
      return
    }
    if (!validarWhatsapp(regWhatsapp)) {
      setErrorRegistro('Escribe un número de WhatsApp válido (con código de país, ej. +34...).')
      return
    }

    setRegistrando(true)

    const { data: existente } = await supabase
      .from('emprendedores')
      .select('id')
      .eq('slug', slugLimpio)
      .maybeSingle()

    if (existente) {
      setErrorRegistro('Ese enlace de página ya está en uso, prueba con otro.')
      setRegistrando(false)
      return
    }

    const { error } = await supabase.from('emprendedores').insert({
      auth_user_id: user.id,
      nombre_negocio: regNombre,
      nombre_contacto: regContacto,
      oficio: regOficio,
      ciudad: regCiudad,
      email: user.email,
      pais: 'España',
      slug: slugLimpio,
      whatsapp_number: normalizarWhatsapp(regWhatsapp),
      activo: true,
    })

    if (error) {
      setErrorRegistro(error.message)
      setRegistrando(false)
      return
    }

    // Perfil creado: pasamos al panel a añadir servicios.
    router.replace('/panel')
  }

  if (cargando) return <div className="contenedor"><p>Cargando...</p></div>

  return (
    <AuthLayout
      titulo={<>Tu página, lista en <em>minutos</em>.</>}
      subtitulo="Súmate y consigue tu propio espacio para que tus clientes te encuentren y te escriban directo por WhatsApp."
      puntos={['Página profesional', 'Código QR permanente', 'Contacto por WhatsApp', 'Sin conocimientos técnicos']}
    >
      <div className="card">
        <h1 style={{ marginBottom: 4 }}>Crea tu página</h1>
        <p style={{ marginTop: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Solo son 6 datos y menos de un minuto.</p>
        <form onSubmit={crearPerfil}>
          <label>Nombre de tu negocio</label>
          <input
            type="text"
            placeholder="ej: Peluquería María"
            value={regNombre}
            onChange={(e) => {
              setRegNombre(e.target.value)
              if (!slugTocadoAMano) setRegSlug(slugify(e.target.value))
            }}
            maxLength={LONGITUD_MAXIMA.nombreNegocio}
            required
          />

          <label>Tu nombre</label>
          <input
            type="text"
            placeholder="ej: María Pérez"
            value={regContacto}
            onChange={(e) => setRegContacto(e.target.value)}
            maxLength={LONGITUD_MAXIMA.nombreContacto}
            required
          />

          <label>Tu oficio</label>
          <input
            type="text"
            placeholder="ej: Peluquera, jardinero, electricista..."
            value={regOficio}
            onChange={(e) => setRegOficio(e.target.value)}
            maxLength={LONGITUD_MAXIMA.oficio}
            required
          />

          <label>Ciudad</label>
          <input
            type="text"
            placeholder="ej: Getafe"
            value={regCiudad}
            onChange={(e) => setRegCiudad(e.target.value)}
            maxLength={LONGITUD_MAXIMA.ciudad}
            required
          />

          <label>Enlace de tu página</label>
          <input
            type="text"
            placeholder="ej: peluqueria-maria"
            value={regSlug}
            onChange={(e) => {
              setSlugTocadoAMano(true)
              setRegSlug(e.target.value)
            }}
            maxLength={LONGITUD_MAXIMA.slug}
            required
          />
          <p style={{ marginTop: -8, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Es la dirección web de tu página (sin espacios ni tildes). Se verá así:{' '}
            <strong>{typeof window !== 'undefined' ? window.location.host : 'tudominio.com'}/{regSlug ? slugify(regSlug) : 'tu-negocio'}</strong>
          </p>

          <label>Tu WhatsApp</label>
          <input
            type="tel"
            placeholder="con código de país, ej. +34..."
            value={regWhatsapp}
            onChange={(e) => setRegWhatsapp(e.target.value)}
            maxLength={20}
            required
          />
          <button type="submit" disabled={registrando} style={{ width: '100%' }}>
            {registrando ? 'Creando...' : 'Crear mi página'}
          </button>
          {errorRegistro && <p style={{ color: 'var(--peligro)', marginTop: 10 }}>{errorRegistro}</p>}
        </form>
        <p className="auth-enlace-secundario">
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </AuthLayout>
  )
}
