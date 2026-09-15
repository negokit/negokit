-- Añade la columna nueva para la lista de insignias de confianza (hasta 3),
-- reemplazando el uso de los dos campos sueltos anteriores. Ejecutar en
-- Supabase → SQL Editor, en LOS DOS proyectos (el de producción y el de dev),
-- porque son proyectos separados.

alter table emprendedores
  add column if not exists insignias text[] not null default '{}'::text[];

-- No se borran las columnas antiguas (mostrar_insignia_respuesta,
-- insignia_personalizada) a propósito: el código las sigue leyendo como
-- respaldo para negocios que se crearon antes de este cambio y todavía no
-- han vuelto a guardar el formulario de "Editar mi negocio".
