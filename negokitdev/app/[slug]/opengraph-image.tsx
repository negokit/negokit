import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabaseClient'

// Imagen que se ve cuando alguien comparte el enlace de un negocio por
// WhatsApp, iMessage, etc. — con el logo del negocio (o sus iniciales si no
// tiene), su nombre y su oficio, en vez del enlace pelado que se veía antes.
export const alt = 'Página de negocio en servix'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

export default async function Image({ params }: Props) {
  const { slug } = await params

  const { data: emp } = await supabase
    .from('emprendedores')
    .select('nombre_negocio, oficio, ciudad, logo_url')
    .eq('slug', slug)
    .eq('activo', true)
    .maybeSingle()

  const nombre = emp?.nombre_negocio || 'servix'
  const oficio = emp?.oficio || ''
  const ciudad = emp?.ciudad || ''
  const logoUrl = emp?.logo_url || null

  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  const iniciales =
    partes.length >= 2 ? (partes[0][0] + partes[1][0]).toUpperCase() : (partes[0]?.slice(0, 2) || '').toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#1C1C27',
          padding: '80px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 148,
            height: 148,
            borderRadius: 34,
            overflow: 'hidden',
            background: '#5B6472',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 44,
          }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} width={148} height={148} style={{ objectFit: 'cover' }} alt="" />
          ) : (
            <span style={{ fontSize: 58, fontWeight: 700, color: '#fff' }}>{iniciales}</span>
          )}
        </div>

        <div style={{ display: 'flex', fontSize: 66, fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>
          {nombre}
        </div>

        {(oficio || ciudad) && (
          <div style={{ display: 'flex', fontSize: 32, color: 'rgba(255,255,255,0.72)', marginTop: 18 }}>
            {[oficio, ciudad].filter(Boolean).join(' · ')}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', bottom: 52, right: 68 }}>
          <div
            style={{
              display: 'flex',
              width: 30,
              height: 30,
              borderRadius: 9,
              background: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              fontWeight: 700,
              color: '#1C1C27',
            }}
          >
            s
          </div>
          <span style={{ display: 'flex', fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.78)' }}>
            servix
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
