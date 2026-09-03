import type { Metadata } from 'next'
import { supabase } from '@/lib/supabaseClient'
import PaginaPublicaClient from './PaginaPublicaClient'

type Props = { params: Promise<{ slug: string }> }

async function buscarEmprendedor(slug: string) {
  const { data } = await supabase
    .from('emprendedores')
    .select('nombre_negocio, oficio, ciudad')
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
  const descripcion = emp.ciudad
    ? `Descubre los servicios de ${emp.nombre_negocio} en ${emp.ciudad} y contacta directo por WhatsApp.`
    : `Descubre los servicios de ${emp.nombre_negocio} y contacta directo por WhatsApp.`

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      siteName: 'servix',
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
  return <PaginaPublicaClient slug={slug} />
}
