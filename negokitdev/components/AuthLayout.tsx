import LogoServix from './LogoServix'

export default function AuthLayout({
  titulo,
  subtitulo,
  puntos,
  children,
}: {
  titulo: React.ReactNode
  subtitulo: string
  puntos: string[]
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <div className="auth-panel-marca">
        <LogoServix tamano={26} claro />
        <h1 className="auth-titulo">{titulo}</h1>
        <p className="auth-subtitulo">{subtitulo}</p>
        <ul className="auth-lista">
          {puntos.map((p) => (
            <li key={p}>✓ {p}</li>
          ))}
        </ul>
      </div>
      <div className="auth-panel-formulario">
        <div>{children}</div>
      </div>
    </div>
  )
}
