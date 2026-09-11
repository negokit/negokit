import type { Metadata } from 'next'
import { supabase } from '@/lib/supabaseClient'
import PaginaPublicaClient from './PaginaPublicaClient'

// Sin esto, Next.js puede tratar esta página como estática y servir a todo
// el mundo la misma versión guardada en caché desde el último despliegue —
// aunque el emprendedor cambie su WhatsApp cinco minutos después de eso,
// seguiría enseñando el número viejo hasta el próximo redeploy. Forzamos
// que se genere de nuevo en cada visita, para que el número (y todo lo
// demás) esté siempre actualizado.
export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = { params: Promise<{ slug: string }> }

// Dominio real de la web — se usa para construir URLs absolutas en los
// datos estructurados (JSON-LD) que ayudan a Google a mostrar información
// enriquecida (nombre, dirección, teléfono) en los resultados de búsqueda.
const BASE_URL = 'https://emprenia.com'

async function buscarEmprendedor(slug: string) {
  const { data } = await supabase
    .from('emprendedores')
    .select('nombre_negocio, oficio, ciudad, direccion, whatsapp_number, logo_url, descripcion')
    .eq('slug', slug)
    .eq('activo', true)
    .maybeSingle()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const emp = await buscarEmprendedor(slug)

  if (!emp) {
    return { title: 'Página no encontrada' }
  }

  const titulo = emp.oficio ? `${emp.nombre_negocio} · ${emp.oficio}` : emp.nombre_negocio
  // La descripción que escribió el emprendedor tiene prioridad (es más
  // concreta y suya) — si no la rellenó, usamos una genérica.
  const descripcion =
    emp.descripcion ||
    (emp.ciudad
      ? `Descubre los servicios de ${emp.nombre_negocio} en ${emp.ciudad} y contacta directo por WhatsApp.`
      : `Descubre los servicios de ${emp.nombre_negocio} y contacta directo por WhatsApp.`)

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      siteName: 'Emprenia',
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcion,
    },
  }
}

export default async function PaginaPublica({ params }: Props) {
  const { slug } = await params
  const emp = await buscarEmprendedor(slug)

  // Datos estructurados (schema.org LocalBusiness): no cambian nada visible
  // para el usuario, pero le dicen a Google exactamente qué es este negocio
  // (nombre, oficio, ciudad, teléfono, foto) para que pueda mostrarlo mejor
  // en los resultados de búsqueda con el tiempo.
  const datosEstructurados = emp && {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: emp.nombre_negocio,
    description: emp.descripcion || emp.oficio || undefined,
    image: emp.logo_url || undefined,
    telephone: emp.whatsapp_number || undefined,
    url: `${BASE_URL}/${slug}`,
    address: (emp.ciudad || emp.direccion)
      ? {
          '@type': 'PostalAddress',
          streetAddress: emp.direccion || undefined,
          addressLocality: emp.ciudad || undefined,
          addressCountry: 'ES',
        }
      : undefined,
  }

  return (
    <>
      {datosEstructurados && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
        />
      )}
      <PaginaPublicaClient slug={slug} />
    </>
  )
}
