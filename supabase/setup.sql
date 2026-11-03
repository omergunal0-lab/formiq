-- FORMIQ veritabanı kurulumu
-- Supabase → SQL Editor → New query → bu dosyanın tamamını yapıştır → Run.
-- Tekrar çalıştırmak zarar vermez.

-- 1) Each user's app data (one row per user)
create table if not exists public.user_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.user_state enable row level security;
drop policy if exists "own state" on public.user_state;
create policy "own state" on public.user_state
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 2) Daily AI coach usage (for the per-user limit)
create table if not exists public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day     date not null default current_date,
  count   int  not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;
drop policy if exists "read own usage" on public.ai_usage;
create policy "read own usage" on public.ai_usage
  for select to authenticated using ((select auth.uid()) = user_id);

-- 3) Shared food calculation cache: the same text is never sent to the AI twice
create table if not exists public.food_cache (
  q          text primary key,
  items      jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.food_cache enable row level security;  -- no policies: server only

-- 4) Atomically increments the daily counter and returns the new value (server only)
create or replace function public.ai_take(p_user uuid)
returns int language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  insert into public.ai_usage (user_id, day, count) values (p_user, current_date, 1)
  on conflict (user_id, day) do update set count = public.ai_usage.count + 1
  returning count into n;
  return n;
end $$;
revoke all on function public.ai_take(uuid) from public, anon, authenticated;
grant execute on function public.ai_take(uuid) to service_role;

-- 5) Users can delete their own account from inside the app (required by App Store / Google Play)
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
begin
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
