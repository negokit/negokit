import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabaseClient'
import { readFileSync } from 'node:fs'
import path from 'node:path'

// Logo real de Emprenia para la marca de agua pequeña de abajo a la
// derecha — variante para fondo oscuro (barras en blanco) porque va dentro
// de un cuadradito azul marino, igual que antes con el icono dibujado a mano.
const logoDataUrl = `data:image/png;base64,${readFileSync(
  path.join(process.cwd(), 'public', 'logo-emprenia-oscuro.png')
).toString('base64')}`

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
        {/* El logo va completamente solo, sin nada al lado — así no se
            confunde con el bloque de texto. El nombre/oficio/descripción
            van despues, separados por una rayita de acento, como un bloque
            aparte "por fuera" del logo (así lo pidió Gabriela después de
            que un cliente real dijera que la version con todo en fila se
            veia mal). */}
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
            width={130}
            height={130}
            style={{ objectFit: 'contain', borderRadius: 20, flexShrink: 0 }}
            alt=""
          />
        ) : (
          // Solo cuando no hay logo subido usamos un círculo de iniciales
          // como respaldo — igual que en el resto de la web (AvatarNegocio).
          <div
            style={{
              display: 'flex',
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: '#1C1C27',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 50, fontWeight: 700, color: '#fff' }}>{iniciales}</span>
          </div>
        )}

        {/* Rayita de acento que marca visualmente donde termina el logo y
            empieza el bloque de texto — el "por fuera" que pidió Gabriela. */}
        <div style={{ display: 'flex', width: 64, height: 4, borderRadius: 2, background: '#C9713D', marginTop: 36, marginBottom: 32 }} />

        <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, color: '#1C1C27', lineHeight: 1.15 }}>
          {nombre}
        </div>
        {(oficio || ciudad) && (
          <div style={{ display: 'flex', fontSize: 28, color: '#8a8a99', marginTop: 10 }}>
            {[oficio, ciudad].filter(Boolean).join(' · ')}
          </div>
        )}

        {descripcion && (
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#5B6472',
              lineHeight: 1.5,
              marginTop: 26,
              maxWidth: 920,
            }}
          >
            {descripcion}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', bottom: 56, right: 76 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: 9,
              background: '#1C1C27',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUrl} width={19} height={19} style={{ objectFit: 'contain' }} alt="" />
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
