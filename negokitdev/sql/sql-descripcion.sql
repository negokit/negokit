-- Añade la descripción breve del negocio (opcional, máximo 200 caracteres),
-- que se muestra arriba de todo en la página pública y se usa también como
-- descripción para Google. Ejecutar en Supabase → SQL Editor, en LOS DOS
-- proyectos (producción y dev).

alter table emprendedores add column if not exists descripcion text;

alter table emprendedores drop constraint if exists emprendedores_descripcion_check;

alter table emprendedores
  add constraint emprendedores_descripcion_check
  check (descripcion is null or char_length(descripcion) <= 200);
