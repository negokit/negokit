// Logo de la marca de la plataforma (Emprenia — este archivo se sigue
// llamando LogoServix.tsx por dentro, es solo el nombre del archivo, no
// afecta a nada visible), no confundir con el nombre del negocio de cada
// emprendedor — esto se usa en login, registro, panel y como firma "Creado
// con Emprenia" al pie de las páginas públicas.
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

  // Icono: 4 marcas de esquina (como puntos de enfoque de una cámara o de
  // un lector de QR) con un punto de acento en el centro — representa
  // "aquí te encuentran", ligado a lo que hace el producto (la página +
  // el QR), en vez de ser una letra. Cuadrados sólidos y rectos a
  // propósito (nada de curvas ni puntas redondeadas) para que no se
  // puedan confundir con un corazón.
  const icono = (
    <svg width={tamano} height={tamano} viewBox="0 0 100 100" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="24" fill={fondoIcono} />
      <g fill={colorS}>
        <rect x="24" y="24" width="12" height="12" />
        <rect x="64" y="24" width="12" height="12" />
        <rect x="24" y="64" width="12" height="12" />
        <rect x="64" y="64" width="12" height="12" />
      </g>
      <circle cx="50" cy="50" r="8" fill="#C9713D" />
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
        Emprenia
      </span>
    </span>
  )
}
