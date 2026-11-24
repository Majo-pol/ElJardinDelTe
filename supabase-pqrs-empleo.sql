-- ============================================================
--  EL JARDÍN DEL TÉ — PQRS y "Trabaja con nosotros"
--  Pegar TODO esto en Supabase → SQL Editor → Run
--  Se puede correr varias veces sin romper nada.
-- ============================================================


-- ------------------------------------------------------------
-- 1. TABLA DE PQRS
--    (Peticiones, Quejas, Reclamos y Sugerencias)
-- ------------------------------------------------------------
create table if not exists public.pqrs (
    id              bigint generated always as identity primary key,
    radicado        text        not null unique,
    tipo            text        not null,
    nombre          text        not null,
    correo          text        not null,
    telefono        text,
    mensaje         text        not null,
    autoriza_datos  boolean     not null default false,
    estado          text        not null default 'Recibida',
    creado_en       timestamptz not null default now()
);

alter table public.pqrs enable row level security;

-- Cualquier visitante puede RADICAR una PQRS...
drop policy if exists "pqrs_insertar_publico" on public.pqrs;
create policy "pqrs_insertar_publico"
    on public.pqrs for insert
    to anon, authenticated
    with check (true);

-- ...pero sólo alguien con sesión iniciada (los admins del panel)
-- puede LEERLAS. Esto es lo que impide que cualquiera se descargue
-- los datos de todos los que escribieron.
drop policy if exists "pqrs_leer_admin" on public.pqrs;
create policy "pqrs_leer_admin"
    on public.pqrs for select
    to authenticated
    using (true);

-- Y sólo un admin puede cambiarles el estado.
drop policy if exists "pqrs_actualizar_admin" on public.pqrs;
create policy "pqrs_actualizar_admin"
    on public.pqrs for update
    to authenticated
    using (true)
    with check (true);


-- ------------------------------------------------------------
-- 2. TABLA DE POSTULACIONES DE EMPLEO
-- ------------------------------------------------------------
create table if not exists public.postulaciones (
    id              bigint generated always as identity primary key,
    nombre          text        not null,
    correo          text        not null,
    telefono        text        not null,
    cargo           text        not null,
    mensaje         text,
    archivo_ruta    text,          -- dónde quedó el PDF dentro del bucket
    archivo_nombre  text,          -- cómo se llamaba el archivo original
    autoriza_datos  boolean     not null default false,
    estado          text        not null default 'Recibida',
    creado_en       timestamptz not null default now()
);

alter table public.postulaciones enable row level security;

drop policy if exists "postulaciones_insertar_publico" on public.postulaciones;
create policy "postulaciones_insertar_publico"
    on public.postulaciones for insert
    to anon, authenticated
    with check (true);

drop policy if exists "postulaciones_leer_admin" on public.postulaciones;
create policy "postulaciones_leer_admin"
    on public.postulaciones for select
    to authenticated
    using (true);

drop policy if exists "postulaciones_actualizar_admin" on public.postulaciones;
create policy "postulaciones_actualizar_admin"
    on public.postulaciones for update
    to authenticated
    using (true)
    with check (true);


-- ------------------------------------------------------------
-- 3. BUCKET PARA LAS HOJAS DE VIDA
--
--    public = false  -> el archivo NO se puede abrir con un enlace
--                       suelto. El panel de admin pide un enlace
--                       temporal firmado cada vez que lo necesita.
--
--    El límite de 5 MB y la lista de tipos permitidos los revisa el
--    servidor de Supabase. La validación que hace el formulario en
--    el navegador es sólo para avisarle bonito a la persona: la que
--    de verdad protege es ésta.
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'hojas-de-vida',
    'hojas-de-vida',
    false,
    5242880,
    array[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
)
on conflict (id) do update
    set public             = excluded.public,
        file_size_limit    = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

-- Cualquiera puede SUBIR su hoja de vida...
drop policy if exists "hv_subir_publico" on storage.objects;
create policy "hv_subir_publico"
    on storage.objects for insert
    to anon, authenticated
    with check (bucket_id = 'hojas-de-vida');

-- ...pero sólo un admin con sesión puede DESCARGARLAS.
drop policy if exists "hv_leer_admin" on storage.objects;
create policy "hv_leer_admin"
    on storage.objects for select
    to authenticated
    using (bucket_id = 'hojas-de-vida');


-- ------------------------------------------------------------
-- 4. COMPROBACIÓN
--    Si todo salió bien, esto devuelve las dos tablas con
--    rowsecurity = true.
-- ------------------------------------------------------------
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('pqrs', 'postulaciones');
