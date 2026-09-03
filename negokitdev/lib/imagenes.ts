// Comprime fotos y logos en el propio navegador antes de subirlos. Muchas
// fotos que salen directas de un móvil moderno pesan 6-10 MB — sin esto,
// chocaban contra el límite de tamaño y se rechazaban sin más. Si algo falla
// al comprimir (formato raro, navegador antiguo, etc.), se sube el archivo
// original tal cual: más vale subir la foto sin comprimir que bloquear el
// guardado por esto.

const DIMENSION_MAXIMA = 1600 // px, del lado más largo — de sobra para verse nítida en cualquier pantalla
const CALIDAD_JPEG = 0.82
const NO_COMPRIMIR_POR_DEBAJO_DE = 400 * 1024 // 400 KB — ya es pequeña, no merece la pena tocarla

export async function comprimirImagen(archivo: File): Promise<File> {
  if (archivo.size <= NO_COMPRIMIR_POR_DEBAJO_DE) return archivo

  try {
    const bitmap = await createImageBitmap(archivo)
    const escala = Math.min(1, DIMENSION_MAXIMA / Math.max(bitmap.width, bitmap.height))
    const ancho = Math.round(bitmap.width * escala)
    const alto = Math.round(bitmap.height * escala)

    const canvas = document.createElement('canvas')
    canvas.width = ancho
    canvas.height = alto
    const ctx = canvas.getContext('2d')
    if (!ctx) return archivo
    ctx.drawImage(bitmap, 0, 0, ancho, alto)

    // Los PNG se mantienen en PNG (para no romper logos con transparencia);
    // reducir la resolución ya ahorra bastante peso incluso sin perder
    // calidad. Los JPEG sí bajan también de calidad, que es donde más se
    // nota el ahorro en fotos reales.
    const tipoSalida = archivo.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, tipoSalida, tipoSalida === 'image/jpeg' ? CALIDAD_JPEG : undefined)
    )

    if (!blob || blob.size >= archivo.size) return archivo

    return new File([blob], archivo.name, { type: tipoSalida })
  } catch {
    return archivo
  }
}
