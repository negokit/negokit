// Logo de la marca de la plataforma (Servix), no confundir con el nombre del
// negocio de cada emprendedor — esto se usa en login, registro, panel y como
// firma "Creado con Servix" al pie de las páginas públicas.
export default function LogoServix({
  variante = 'completo',
  tamano = 32,
  claro = false,
}: {
  variante?: 'completo' | 'icono'
  tamano?: number
  claro?: boolean // true = versión para fondos oscuros (icono invertido, texto blanco)
}) {
  const fondoIcono = claro ? '#FFFFFF' : 'var(--foreground)'
  const colorS = claro ? 'var(--foreground)' : '#FFFFFF'
  const colorTexto = claro ? '#FFFFFF' : 'var(--foreground)'

  const icono = (
    <svg width={tamano} height={tamano} viewBox="0 0 100 100" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="24" fill={fondoIcono} />
      <text
        x="50"
        y="71"
        fontFamily="var(--font-inter), Arial, Helvetica, sans-serif"
        fontSize="58"
        fontWeight="700"
        fill={colorS}
        textAnchor="middle"
      >
        s
      </text>
    </svg>
  )

  if (variante === 'icono') return icono

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(tamano * 0.28) }}>
      {icono}
      <span
        style={{
          fontSize: Math.round(tamano * 0.62),
          fontWeight: 600,
          color: colorTexto,
          letterSpacing: '-0.01em',
        }}
      >
        servix
      </span>
    </span>
  )
}
