import type { MetadataRoute } from 'next'

const BASE_URL = 'https://emprenia.com'

export default function robots(): MetadataRoute.Robots {
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
