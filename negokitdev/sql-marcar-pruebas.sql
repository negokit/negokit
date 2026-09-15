-- Añade una forma de marcar cuentas de prueba, separada de "activo"
-- (que controla si la página funciona de verdad). El objetivo: puedes
-- seguir haciendo pruebas con activo = true para probar el flujo completo,
-- sin que esas pruebas aparezcan nunca en el sitemap ni se indexen en
-- Google. app/sitemap.ts ya filtra por es_prueba = false.

alter table emprendedores
  add column if not exists es_prueba boolean not null default false;

-- Marca como prueba TODAS las que ya tienes activas ahora mismo
-- (confirmado: todo lo que hay activo hoy en producción es de prueba).
update emprendedores
set es_prueba = true
where activo = true;
