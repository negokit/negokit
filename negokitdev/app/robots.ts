import type { MetadataRoute } from 'next'

const BASE_URL = 'https://emprenia.com'
const esProduccion = process.env.VERCEL_ENV === 'production'

export default function robots(): MetadataRoute.Robots {
  if (!esProduccion) {
    // En dev/preview no queremos que ningún buscador indexe estas copias de
    // prueba — solo la producción real (emprenia.com) debe salir en Google.
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // El panel privado y las rutas de API no deben aparecer en Google.
      disallow: ['/panel', '/api'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
