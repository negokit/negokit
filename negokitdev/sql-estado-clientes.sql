-- Añade un estado (pipeline de seguimiento) a cada lead, para que el
-- emprendedor pueda marcar en qué punto está cada cliente que le escribió
-- desde su página — antes esto solo era una lista sin más.
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).

-- Estado del lead: nuevo por defecto, y solo puede ser uno de estos 5 valores.
alter table leads add column if not exists estado text not null default 'nuevo';

alter table leads drop constraint if exists leads_estado_check;
alter table leads add constraint leads_estado_check
  check (estado in ('nuevo', 'contactado', 'en_seguimiento', 'cliente', 'no_cerrado'));

-- El emprendedor puede ACTUALIZAR (cambiar el estado) de los leads que
-- pertenecen a sus propios servicios — antes solo podía leerlos, nunca
-- escribir en ellos.
drop policy if exists "el emprendedor actualiza el estado de sus leads" on leads;
create policy "el emprendedor actualiza el estado de sus leads"
  on leads for update
  to authenticated
  using (
    exists (
      select 1
      from servicios s
      join emprendedores e on e.id = s.emprendedor_id
      where s.id = leads.servicio_id
        and e.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from servicios s
      join emprendedores e on e.id = s.emprendedor_id
      where s.id = leads.servicio_id
        and e.auth_user_id = auth.uid()
    )
  );
