'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

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
    <div className="contenedor" style={{ minHeight: '100vh', background: '#dbeafe' }}>
      <div className="card">
        {enviado ? (
          <p>Revisa tu correo, te hemos enviado un enlace para entrar.</p>
        ) : (
          <form onSubmit={handleLogin}>
            <h1>Entrar</h1>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Enviar enlace</button>
            {error && <p style={{ color: 'var(--peligro)' }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
