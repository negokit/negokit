import { ImageResponse } from 'next/og'

// Imagen que se ve cuando alguien comparte la página principal de Emprenia
// (emprenia.com) por WhatsApp, iMessage, redes, etc. — con el icono, el
// nombre y una frase corta, en vez del enlace pelado.
export const alt = 'Emprenia — Tu página, lista para que te escriban'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

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
            width: 120,
            height: 120,
            borderRadius: 28,
            background: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 48,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 18,
              height: 18,
              borderRadius: 9,
              background: '#C9713D',
            }}
          />
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
