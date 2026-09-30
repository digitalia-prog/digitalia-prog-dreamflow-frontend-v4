begin;
create table public.ugc_creative_library (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 saved_at timestamptz not null default now(),
 payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152)
);
create index ugc_creative_library_owner_date on public.ugc_creative_library(user_id, saved_at desc, id);
alter table public.ugc_creative_library enable row level security;
revoke all on public.ugc_creative_library from public, anon, authenticated;
grant select, insert, update, delete on public.ugc_creative_library to authenticated;
create policy library_select on public.ugc_creative_library for select to authenticated using ((select auth.uid()) = user_id);
create policy library_insert on public.ugc_creative_library for insert to authenticated with check ((select auth.uid()) = user_id);
create policy library_update on public.ugc_creative_library for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy library_delete on public.ugc_creative_library for delete to authenticated using ((select auth.uid()) = user_id);
commit;
