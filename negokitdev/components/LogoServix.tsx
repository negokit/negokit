// Logo de la marca de la plataforma (Emprenia — este archivo se sigue
// llamando LogoServix.tsx por dentro, es solo el nombre del archivo, no
// afecta a nada visible), no confundir con el nombre del negocio de cada
// emprendedor — esto se usa en login, registro, panel y como firma "Creado
// con Emprenia" al pie de las páginas públicas.
//
// El icono (hoja + barras ascendentes, en color terracota) es una imagen,
// no un SVG dibujado a mano — viene directo de los dos archivos que dio
// Gabriela. Hay dos variantes recortadas con fondo transparente, una para
// colocar sobre fondos claros (barras en azul marino) y otra para fondos
// oscuros (barras en blanco), controladas con la prop `claro` igual que
// antes.
export default function LogoServix({
  variante = 'completo',
  tamano = 32,
  claro = false,
}: {
  variante?: 'completo' | 'icono'
  tamano?: number
  claro?: boolean // true = versión para fondos oscuros (barras del icono en blanco, texto blanco)
}) {
  const colorTexto = claro ? '#FFFFFF' : 'var(--foreground)'
  const srcIcono = claro ? '/logo-emprenia-oscuro.png' : '/logo-emprenia-claro.png'

  const icono = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcIcono}
      alt="Emprenia"
      style={{ height: tamano, width: 'auto', flexShrink: 0, display: 'block' }}
    />
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
