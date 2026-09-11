-- Preguntas guiadas por servicio (hasta 2, las escribe el propio emprendedor
-- al configurar el servicio) + pregunta fija "¿para cuándo lo necesitas?" +
-- fecha de última actualización de cada lead (para el pipeline de Clientes).
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).

-- Hasta 2 preguntas propias de cada servicio (ej. "¿Cuántos metros tiene tu
-- jardín?"). Opcionales: si se dejan vacías, esa pregunta no aparece en el
-- formulario del cliente para ese servicio.
alter table servicios add column if not exists pregunta_1 text;
alter table servicios add column if not exists pregunta_2 text;

-- Respuestas del cliente a esas preguntas (máx. 300 caracteres cada una,
-- validado también en el formulario) + su respuesta a la pregunta fija de
-- "para cuándo" que aparece siempre, sea cual sea el servicio elegido.
alter table leads add column if not exists para_cuando text;
alter table leads add column if not exists respuesta_1 text;
alter table leads add column if not exists respuesta_2 text;

-- Fecha de última actualización del lead — se pone sola al crearlo y se
-- actualiza sola cada vez que cambia algo (por ejemplo, al mover el estado
-- en el pipeline de Clientes), sin que el código tenga que ponerla a mano.
alter table leads add column if not exists updated_at timestamptz not null default now();

create or replace function actualizar_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_actualizar_updated_at on leads;
create trigger leads_actualizar_updated_at
  before update on leads
  for each row
  execute function actualizar_updated_at();
