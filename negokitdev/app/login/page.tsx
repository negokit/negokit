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

  if (enviado) {
    return <p>Revisa tu correo, te hemos enviado un enlace para entrar.</p>
  }

  return (
    <form onSubmit={handleLogin} style={{ padding: 40 }}>
      <h1>Entrar</h1>
      <input
        type="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Enviar enlace</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}