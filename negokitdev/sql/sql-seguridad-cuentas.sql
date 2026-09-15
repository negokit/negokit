-- ============================================================================
-- URGENTE — cierra un hueco de seguridad real: hasta ahora las tablas
-- "emprendedores" y "servicios" NO tenían seguridad a nivel de fila (RLS)
-- activada. Eso significa que cualquiera que abriera la consola del
-- navegador en tu propia web, con la misma clave pública que usa la web
-- (no hay que robar nada, esa clave es pública por diseño), podía saltarse
-- el filtro de "solo mis datos" que pone el código y leer o incluso
-- MODIFICAR los datos de OTRO negocio directamente contra Supabase: número
-- de WhatsApp, email, ids de Stripe, servicios, etc.
--
-- Este script activa RLS en las dos tablas y añade las reglas mínimas para
-- que la web siga funcionando exactamente igual que ahora (página pública,
-- panel, comprobación de enlace/teléfono repetido al editar) pero cerrando
-- el acceso a los datos de cualquier otro negocio.
--
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).
-- No borra ni modifica ninguna fila, solo añade reglas de acceso.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EMPRENDEDORES
-- ----------------------------------------------------------------------------
alter table emprendedores enable row level security;

-- Lectura: cualquiera puede ver un negocio ACTIVO (así funciona la página
-- pública, y así se puede comprobar si un enlace o teléfono ya está en uso
-- al crear/editar una cuenta) — y cada emprendedor puede ver también su
-- propia fila aunque todavía no esté activa (recién creada, o de baja).
drop policy if exists "negocios activos son publicos, y cada uno ve el suyo" on emprendedores;
create policy "negocios activos son publicos, y cada uno ve el suyo"
  on emprendedores for select
  to anon, authenticated
  using (activo = true or auth.uid() = auth_user_id);

-- Creación: al registrarse, cada usuario solo puede crear SU PROPIA fila
-- (no puede crear una página a nombre de otra cuenta).
drop policy if exists "cada usuario crea solo su propio negocio" on emprendedores;
create policy "cada usuario crea solo su propio negocio"
  on emprendedores for insert
  to authenticated
  with check (auth.uid() = auth_user_id);

-- Edición: cada emprendedor solo puede modificar SU PROPIA fila — esto es
-- lo que impide que alguien cambie el WhatsApp, el nombre o cualquier otro
-- dato de un negocio que no es el suyo.
drop policy if exists "cada emprendedor edita solo su propio negocio" on emprendedores;
create policy "cada emprendedor edita solo su propio negocio"
  on emprendedores for update
  to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

-- (No se añade política de borrado: nadie puede borrar un negocio directamente
-- desde la web, como hasta ahora.)

-- ----------------------------------------------------------------------------
-- SERVICIOS
-- ----------------------------------------------------------------------------
alter table servicios enable row level security;

-- Lectura: cualquiera puede ver los servicios ACTIVOS de un negocio (página
-- pública) — y cada emprendedor puede ver TODOS los suyos, activos o no
-- (así el panel sigue mostrando los servicios pausados).
drop policy if exists "servicios activos son publicos, y el dueño ve los suyos" on servicios;
create policy "servicios activos son publicos, y el dueño ve los suyos"
  on servicios for select
  to anon, authenticated
  using (
    activo = true
    or exists (
      select 1 from emprendedores e
      where e.id = servicios.emprendedor_id
        and e.auth_user_id = auth.uid()
    )
  );

-- Creación, edición y borrado: solo el dueño del negocio puede tocar sus
-- propios servicios — esto impide que alguien cree, edite o borre un
-- servicio de OTRO negocio.
drop policy if exists "el dueño crea sus propios servicios" on servicios;
create policy "el dueño crea sus propios servicios"
  on servicios for insert
  to authenticated
  with check (
    exists (
      select 1 from emprendedores e
      where e.id = servicios.emprendedor_id
        and e.auth_user_id = auth.uid()
    )
  );

drop policy if exists "el dueño edita sus propios servicios" on servicios;
create policy "el dueño edita sus propios servicios"
  on servicios for update
  to authenticated
  using (
    exists (
      select 1 from emprendedores e
      where e.id = servicios.emprendedor_id
        and e.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from emprendedores e
      where e.id = servicios.emprendedor_id
        and e.auth_user_id = auth.uid()
    )
  );

drop policy if exists "el dueño borra sus propios servicios" on servicios;
create policy "el dueño borra sus propios servicios"
  on servicios for delete
  to authenticated
  using (
    exists (
      select 1 from emprendedores e
      where e.id = servicios.emprendedor_id
        and e.auth_user_id = auth.uid()
    )
  );

-- ============================================================================
-- Comprobación final — pega esto también y ejecútalo después. Debe devolver
-- "true" en las dos filas (rowsecurity activado en las dos tablas):
--
-- select tablename, rowsecurity from pg_tables
-- where tablename in ('emprendedores', 'servicios');
-- ============================================================================
