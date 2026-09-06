import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabaseClient'

// Dominio real de Emprenia — hay que actualizar esto a mano si el
// dominio cambia de nuevo en el futuro (no usamos VERCEL_URL aquí porque
// Google solo debe indexar la web de verdad, nunca una preview).
const BASE_URL = 'https://emprenia.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: emprendedores } = await supabase
    .from('emprendedores')
    .select('slug')
    .eq('activo', true)

  const paginasDeNegocios = (emprendedores || []).map((e) => ({
    url: `${BASE_URL}/${e.slug}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    ...paginasDeNegocios,
  ]
}
