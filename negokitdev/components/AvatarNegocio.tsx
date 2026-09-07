// Muestra el logo del negocio (si lo ha subido) o, si no, sus iniciales
// sobre un fondo de marca. Se usa en la página pública, el panel y el menú,
// para que el logo aparezca de forma consistente en toda la app.
export default function AvatarNegocio({
  emprendedor,
  tamano = 52,
  radio,
  conAnillo = false,
}: {
  emprendedor: any
  tamano?: number
  radio?: number
  conAnillo?: boolean
}) {
  const borderRadius = radio ?? Math.round(tamano * 0.3)
  const anillo = conAnillo
    ? { boxShadow: '0 0 0 3px var(--surface), 0 2px 10px rgba(20, 20, 30, 0.14)' }
    : {}

  if (emprendedor?.logo_url) {
    // "cover" (no "contain"): así el logo rellena todo el círculo/cuadro sin
    // dejar ver el fondo alrededor — antes usaba "contain" para no recortar
    // logos no cuadrados, pero eso dejaba un borde de color visible detrás
    // (el cliente de Gabriela lo vio como un "fondo beis" feo). Con "cover"
    // se pierde un pelín de los bordes del logo si no es cuadrado, pero se
    // ve como un logo de verdad (igual que WhatsApp, Instagram, etc.) y no
    // como una foto metida con calzador dentro de una caja.
    return (
      <div
        style={{
          width: tamano,
          height: tamano,
          borderRadius,
          background: 'var(--border)',
          flexShrink: 0,
          overflow: 'hidden',
          ...anillo,
        }}
      >
        <img
          src={emprendedor.logo_url}
          alt={emprendedor.nombre_negocio || 'Logo'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    )
  }

  const nombre = (emprendedor?.nombre_negocio || '').trim()
  const partes = nombre.split(/\s+/).filter(Boolean)
  const iniciales =
    partes.length >= 2 ? (partes[0][0] + partes[1][0]).toUpperCase() : (partes[0]?.slice(0, 2) || '').toUpperCase()

  return (
    <div
      style={{
        width: tamano,
        height: tamano,
        borderRadius,
        background: 'var(--foreground)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: Math.round(tamano * 0.34),
        flexShrink: 0,
        ...anillo,
      }}
    >
      {iniciales}
    </div>
  )
}
