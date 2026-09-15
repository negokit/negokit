-- ============================================================================
-- OPCIONAL pero recomendado — cierra un hueco parecido al de
-- sql-seguridad-cuentas.sql, pero en las FOTOS (logos y fotos de servicio),
-- no en la base de datos.
--
-- Ahora mismo, cuando subes una foto, el código la guarda en una carpeta con
-- el id de tu negocio (ej. "abc123/logo-....png"). Pero si el bucket
-- "fotos" no tiene reglas propias que lo impidan, cualquier usuario con
-- sesión iniciada podría —a propósito, saltándose la web— subir o
-- reemplazar un archivo en la carpeta de OTRO negocio (por ejemplo, cambiar
-- el logo de otra cuenta). Esto NO está confirmado como fallo real (no
-- tengo forma de ver cómo está configurado tu bucket ahora mismo) — es una
-- comprobación preventiva, no una urgencia como la de ayer.
--
-- Esto NO afecta a que las fotos se vean en la página pública — eso sigue
-- funcionando igual (la lectura es pública a propósito, como hasta ahora).
-- Solo restringe quién puede SUBIR, REEMPLAZAR o BORRAR un archivo.
--
-- Ejecutar en Supabase → SQL Editor, en LOS DOS proyectos (producción y dev).
-- ============================================================================

drop policy if exists "cada emprendedor sube solo a su propia carpeta" on storage.objects;
create policy "cada emprendedor sube solo a su propia carpeta"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] = (
      select id::text from emprendedores where auth_user_id = auth.uid()
    )
  );

drop policy if exists "cada emprendedor reemplaza solo en su propia carpeta" on storage.objects;
create policy "cada emprendedor reemplaza solo en su propia carpeta"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] = (
      select id::text from emprendedores where auth_user_id = auth.uid()
    )
  );

drop policy if exists "cada emprendedor borra solo de su propia carpeta" on storage.objects;
create policy "cada emprendedor borra solo de su propia carpeta"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] = (
      select id::text from emprendedores where auth_user_id = auth.uid()
    )
  );

-- ============================================================================
-- Si al ejecutar esto te da un error de que ya existe una política parecida
-- con otro nombre, no pasa nada — dímelo y la ajustamos. Y si después de
-- correr esto no puedes subir tu propia foto de servicio o logo, avísame
-- enseguida, sería señal de que tu bucket usa otra estructura de carpetas.
-- ============================================================================
