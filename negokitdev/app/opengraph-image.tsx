import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import path from 'node:path'

// Imagen que se ve cuando alguien comparte la página principal de Emprenia
// (emprenia.com) por WhatsApp, iMessage, redes, etc. — con el icono, el
// nombre y una frase corta, en vez del enlace pelado.
export const alt = 'Emprenia — Tu página, lista para que te escriban'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Logo real de Emprenia (hoja + barras) como "data:" URL, leído del propio
// archivo del proyecto en vez de reconstruirlo con divs — next/og sí sabe
// pintar una imagen normal dentro de ImageResponse. Usamos la variante para
// fondos claros (barras en azul marino) porque va dentro de una caja blanca.
const logoDataUrl = `data:image/png;base64,${readFileSync(
  path.join(process.cwd(), 'public', 'logo-emprenia-claro.png')
).toString('base64')}`

export default async function Image() {
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
          padding: '90px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: 28,
            background: '#FFFFFF',
            marginBottom: 48,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUrl} width={78} height={78} style={{ objectFit: 'contain' }} alt="" />
        </div>

        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
          Emprenia
        </div>

        <div style={{ display: 'flex', fontSize: 34, color: 'rgba(255,255,255,0.75)', marginTop: 22, maxWidth: 900 }}>
          Tu negocio, listo para que te encuentren.
        </div>
      </div>
    ),
    { ...size }
  )
}
