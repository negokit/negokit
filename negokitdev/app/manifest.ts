import type { MetadataRoute } from 'next'

// Esto es lo que usa el móvil cuando alguien pulsa "Añadir a inicio" /
// "Instalar app" desde el navegador — el icono, el nombre y el color que
// aparecen en la pantalla de inicio del teléfono.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Emprenia',
    short_name: 'Emprenia',
    description:
      'Tu propia página para que tus clientes te encuentren, vean tus servicios y te escriban directo por WhatsApp.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF7',
    theme_color: '#1C1C27',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
