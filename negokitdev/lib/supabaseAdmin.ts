// Cliente de Supabase "admin", para usar SOLO en el servidor (API routes
// como el webhook de Stripe, donde no hay una sesión de usuario logueado).
// Usa la service_role key, que se salta las políticas de seguridad (RLS) —
// por eso nunca debe usarse en el navegador ni exponerse con NEXT_PUBLIC_.
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
