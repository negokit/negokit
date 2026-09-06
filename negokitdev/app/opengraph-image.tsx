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
            position: 'relative',
            marginBottom: 48,
          }}
        >
          {/* Mismo icono que el resto de la web (4 cuadrados + punto
              terracota) — reconstruido con divs porque next/og no soporta
              bien paths de SVG complejos dentro de ImageResponse. */}
          <div style={{ display: 'flex', position: 'absolute', left: 29, top: 29, width: 14, height: 14, background: '#1C1C27' }} />
          <div style={{ display: 'flex', position: 'absolute', right: 29, top: 29, width: 14, height: 14, background: '#1C1C27' }} />
          <div style={{ display: 'flex', position: 'absolute', left: 29, bottom: 29, width: 14, height: 14, background: '#1C1C27' }} />
          <div style={{ display: 'flex', position: 'absolute', right: 29, bottom: 29, width: 14, height: 14, background: '#1C1C27' }} />
          <div style={{ display: 'flex', position: 'absolute', left: 50, top: 50, width: 20, height: 20, borderRadius: 10, background: '#C9713D' }} />
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
