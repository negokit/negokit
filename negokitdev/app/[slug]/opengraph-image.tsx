import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabaseClient'

// Imagen que se ve cuando alguien comparte el enlace de un negocio por
// WhatsApp, iMessage, etc. — con el logo del negocio (o sus iniciales si no
// tiene), su nombre, su oficio/ciudad y su descripción, en vez del enlace
// pelado que se veía antes.
//
// Diseño claro (no oscuro): así se parece a la propia página del negocio
// en vez de destacar como un cuadro negro raro dentro de la conversación.
export const alt = 'Página de negocio en Emprenia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

// Convierte los bytes de la imagen a una cadena "data:" que se puede meter
// directa en el <img>. Lo hacemos nosotros mismos (en vez de dejar que la
// propia generadora de imagen descargue la URL directamente) porque esa
// descarga automática fallaba en silencio con las fotos de Supabase: no
// daba ningún error, simplemente el logo salía en blanco y el resto de la
// imagen (nombre, oficio, "emprenia") sí se generaba bien — por eso solo
// faltaba el logo.
async function descargarComoDataUrl(url: string): Promise<string | null> {
  try {
    const resp = await fetch(url)
    if (!resp.ok) {
      console.error('[opengraph-image] el logo respondio', resp.status, url)
      return null
    }
    const bytes = new Uint8Array(await resp.arrayBuffer())
    if (bytes.length === 0) {
      console.error('[opengraph-image] el logo llego vacio', url)
      return null
    }
    let binario = ''
    for (let i = 0; i < bytes.length; i++) binario += String.fromCharCode(bytes[i])
    const cabecera = resp.headers.get('content-type') || ''
    // Algunas subidas pueden llegar con un content-type que no empieza por
    // "image/" (o con parametros extra tipo "; charset=..."), así que nos
    // curamos en salud: si no es un tipo de imagen reconocible, forzamos
    // png en vez de dejar que el navegador (o Satori) descarte la imagen
    // por un "data:" con un tipo raro.
    const tipo = cabecera.split(';')[0].trim().startsWith('image/') ? cabecera.split(';')[0].trim() : 'image/png'
    console.log('[opengraph-image] logo descargado OK', { url, bytes: bytes.length, tipo, cabecera })
    return `data:${tipo};base64,${btoa(binario)}`
  } catch (e) {
    console.error('[opengraph-image] fallo al descargar el logo', url, e)
    return null
  }
}

// Recorta la descripción para que quepa en dos líneas sin desbordar la
// imagen — next/og no soporta bien "line-clamp", así que lo hacemos a mano.
function recortar(texto: string, maximo: number) {
  if (texto.length <= maximo) return texto
  return texto.slice(0, maximo).trimEnd() + '…'
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  const { data: emp } = await supabase
    .from('emprendedores')
    .select('nombre_negocio, oficio, ciudad, logo_url, descripcion')
    .eq('slug', slug)
    .eq('activo', true)
    .maybeSingle()

  const nombre = emp?.nombre_negocio || 'emprenia'
  const oficio = emp?.oficio || ''
  const ciudad = emp?.ciudad || ''
  const descripcion = emp?.descripcion ? recortar(emp.descripcion, 120) : ''
  const logoUrl = emp?.logo_url ? await descargarComoDataUrl(emp.logo_url) : null

  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  const iniciales =
    (partes.length >= 2 ? partes[0][0] + partes[1][0] : partes[0]?.slice(0, 2) || nombre.slice(0, 2) || 'E')
      .toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#FAFAF7',
          padding: '76px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl ? (
            // Sin caja de fondo alrededor: si el logo tiene su propio fondo
            // (blanco, de color, lo que sea) se ve tal cual, flotando sobre
            // la página — nada de "recuadro" detrás que desentone con el
            // archivo real que ha subido el negocio.
            // "contain", no "cover": un logo casi nunca es cuadrado, así que
            // se ve completo en vez de recortado.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              width={148}
              height={148}
              style={{ objectFit: 'contain', borderRadius: 24, flexShrink: 0 }}
              alt=""
            />
          ) : (
            // Solo cuando no hay logo subido usamos un círculo de iniciales
            // como respaldo — igual que en el resto de la web (AvatarNegocio).
            <div
              style={{
                display: 'flex',
                width: 148,
                height: 148,
                borderRadius: '50%',
                background: '#1C1C27',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 58, fontWeight: 700, color: '#fff' }}>{iniciales}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40 }}>
            <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, color: '#1C1C27', lineHeight: 1.15 }}>
              {nombre}
            </div>
            {(oficio || ciudad) && (
              <div style={{ display: 'flex', fontSize: 30, color: '#8a8a99', marginTop: 10 }}>
                {[oficio, ciudad].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
        </div>

        {descripcion && (
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#5B6472',
              lineHeight: 1.5,
              marginTop: 40,
              maxWidth: 920,
            }}
          >
            {descripcion}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', bottom: 56, right: 76 }}>
          {/* Mismo icono que el resto de la web (4 cuadrados + punto
              terracota), a tamaño pequeño — reconstruido con divs porque
              next/og no soporta bien paths de SVG complejos. */}
          <div style={{ display: 'flex', position: 'relative', width: 30, height: 30, borderRadius: 9, background: '#1C1C27' }}>
            <div style={{ display: 'flex', position: 'absolute', left: 7, top: 7, width: 4, height: 4, background: '#fff' }} />
            <div style={{ display: 'flex', position: 'absolute', right: 7, top: 7, width: 4, height: 4, background: '#fff' }} />
            <div style={{ display: 'flex', position: 'absolute', left: 7, bottom: 7, width: 4, height: 4, background: '#fff' }} />
            <div style={{ display: 'flex', position: 'absolute', right: 7, bottom: 7, width: 4, height: 4, background: '#fff' }} />
            <div style={{ display: 'flex', position: 'absolute', left: 12, top: 12, width: 6, height: 6, borderRadius: 3, background: '#C9713D' }} />
          </div>
          <span style={{ display: 'flex', fontSize: 24, fontWeight: 600, color: '#5B6472' }}>
            Emprenia
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
