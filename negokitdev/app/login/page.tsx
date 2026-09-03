'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AuthLayout from '@/components/AuthLayout'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/panel` },
    })
    if (error) setError(error.message)
    else setEnviado(true)
  }

  return (
    <AuthLayout
      titulo={<>Tu oficio, con la página que <em>merece</em>.</>}
      subtitulo="Sube tus servicios, comparte tu enlace o tu código QR, y deja que te escriban directo por WhatsApp — sin páginas complicadas ni nada que aprender."
      puntos={['Página profesional', 'Código QR permanente', 'Contacto por WhatsApp', 'Sin conocimientos técnicos']}
    >
      <div className="card">
        {enviado ? (
          <p style={{ marginBottom: 0 }}>Revisa tu correo, te hemos enviado un enlace para entrar.</p>
        ) : (
          <form onSubmit={handleLogin}>
            <h1 style={{ marginBottom: 4 }}>Entrar</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Te enviamos un enlace a tu correo — nada de contraseñas que recordar.
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
          ¿Aún no tienes página? <a href="/registro">Crear mi página</a>
        </p>
      </div>
    </AuthLayout>
  )
}
