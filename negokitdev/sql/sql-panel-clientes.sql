-- Permite que cada emprendedor vea (solo lectura) los mensajes de contacto
-- ("leads") que dejaron sus propios visitantes desde el formulario de su
-- página pública — para la nueva sección "Clientes" del panel.
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).

-- Fecha de creación de cada lead, para poder ordenarlos del más reciente al
-- más antiguo (si la tabla "leads" ya la tenía, esto no hace nada).
alter table leads add column if not exists created_at timestamptz not null default now();

-- Activa seguridad a nivel de fila en "leads" (si ya estaba activada, esta
-- línea no hace nada).
alter table leads enable row level security;

-- Cualquier persona (incluida sin iniciar sesión) puede seguir dejando un
-- mensaje desde la página pública — igual que hasta ahora.
drop policy if exists "cualquiera puede crear un lead" on leads;
create policy "cualquiera puede crear un lead"
  on leads for insert
  to anon, authenticated
  with check (true);

-- Un emprendedor con sesión iniciada solo puede LEER los leads que
-- pertenecen a sus propios servicios (nunca los de otro negocio).
drop policy if exists "el emprendedor ve sus propios leads" on leads;
create policy "el emprendedor ve sus propios leads"
  on leads for select
  to authenticated
  using (
    exists (
      select 1
      from servicios s
      join emprendedores e on e.id = s.emprendedor_id
      where s.id = leads.servicio_id
        and e.auth_user_id = auth.uid()
    )
  );
