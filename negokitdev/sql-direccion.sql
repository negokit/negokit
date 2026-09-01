-- Añade la dirección del negocio (opcional) para mostrarla en la página
-- pública junto al teléfono, y que se vea más contactable. Ejecutar en
-- Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).

alter table emprendedores
  add column if not exists direccion text;
