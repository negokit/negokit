import { redirect, notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default async function RedirectPermanenteQR({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: emprendedor } = await supabase
    .from('emprendedores')
    .select('slug')
    .eq('id', id)
    .single()

  if (!emprendedor) {
    notFound()
  }

  redirect(`/${emprendedor.slug}`)
}
