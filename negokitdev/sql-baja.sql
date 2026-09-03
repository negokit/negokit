-- Guarda las solicitudes de baja hechas por email, para cuando no hay
-- WhatsApp/email de soporte configurado (o el cliente prefiere no usarlos).
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).

alter table emprendedores
  add column if not exists baja_solicitada_en timestamptz,
  add column if not exists baja_contacto_email text;
