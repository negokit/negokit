'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AuthLayout from '@/components/AuthLayout'

// Registro es solo el paso de crear la cuenta (confirmar el email). Los
// datos del negocio (nombre, oficio, logo, insignias, etc.) se rellenan
// después en "Editar mi negocio" — un único formulario para crear y editar,
// en vez de duplicar los mismos campos aquí.
export default function RegistroPage() {
  const router = useRouter()
  const [cargando, setCargando] = useState(true)
  const [email, setEmail] = useState('')
  const [enlaceEnviado, setEnlaceEnviado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    verificar()
  }, [])

  async function verificar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Sin sesión todavía: se queda aquí mismo pidiendo el email.
      setCargando(false)
      return
    }

    const { data: emp } = await supabase
      .from('emprendedores')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    // Ya tiene cuenta confirmada: si le falta crear la página, o si ya la
    // tiene, en los dos casos "Editar mi negocio" es la pantalla correcta.
    router.replace(emp ? '/panel' : '/panel/editar')
  }

  async function enviarEnlace(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/registro` },
    })
    if (error) setError(error.message)
    else setEnlaceEnviado(true)
  }

  if (cargando) return <div className="contenedor"><p>Cargando...</p></div>

  return (
    <AuthLayout
      titulo={<>Tu página, lista en <em>minutos</em>.</>}
      subtitulo="Súmate y consigue tu propio espacio para que tus clientes te encuentren y te escriban directo por WhatsApp."
      puntos={['Página profesional', 'Código QR permanente', 'Contacto por WhatsApp', 'Sin conocimientos técnicos']}
    >
      <div className="card">
        {enlaceEnviado ? (
          <p style={{ marginBottom: 0 }}>Revisa tu correo, te hemos enviado un enlace para continuar creando tu página.</p>
        ) : (
          <form onSubmit={enviarEnlace}>
            <h1 style={{ marginBottom: 4 }}>Crea tu cuenta</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Escribe tu email para empezar — te enviamos un enlace, nada de contraseñas que recordar. En el siguiente
              paso rellenas los datos de tu negocio.
            </p>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" style={{ width: '100%' }}>Enviar enlace</button>
            {error && <p style={{ color: 'var(--peligro)' }}>{error}</p>}
          </form>
        )}
        <p className="auth-enlace-secundario">
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </AuthLayout>
  )
}
