-- ============================================================================
-- MIGRARE AUTH + RLS — Self-Alignment Platform
-- Rulează acest fișier O SINGURĂ DATĂ în Supabase → SQL Editor → New query → Run.
-- Sigur de rulat: NU șterge date (blocul de curățenie e opțional, jos, comentat).
-- ============================================================================

-- ── 1. Tabelul users (creează dacă lipsește; adaugă coloanele lipsă dacă există) ─
create table if not exists public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  created_at          timestamptz not null default now()
);
alter table public.users add column if not exists email                text;
alter table public.users add column if not exists birth_data           jsonb;
alter table public.users add column if not exists current_unlocked_day int not null default 1;
alter table public.users add column if not exists custom_settings      jsonb not null default '{}'::jsonb;
alter table public.users add column if not exists starting_point        text;  -- „punct de plecare"

alter table public.users enable row level security;

-- cast pe ambele părți: merge indiferent dacă id e uuid sau text
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid()::text = id::text);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert with check (auth.uid()::text = id::text);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid()::text = id::text) with check (auth.uid()::text = id::text);

-- ── 2. RLS pe tabelele deținute de user ────────────────────────────────────
-- Notă: user_id e text (id-ul uuid al userului, stocat ca text). Comparăm cu cast.
-- Rutele de server folosesc service-role (ocolesc RLS) și filtrează mereu pe
-- id-ul verificat din sesiune. RLS aici e a doua plasă de siguranță.

do $$
declare
  tbl text;
  owned_tables text[] := array[
    'calculated_profiles',
    'interpreted_profiles',
    'checkins',
    'streaks',
    'compatibility_profiles',
    'daily_insights',
    'weekly_reviews',
    'weekly_resets',
    'patterns_insights',
    'invites',
    'subscriptions'
  ];
begin
  foreach tbl in array owned_tables loop
    if exists (select 1 from information_schema.tables
               where table_schema = 'public' and table_name = tbl) then
      execute format('alter table public.%I enable row level security;', tbl);
      execute format('drop policy if exists "%s_own" on public.%I;', tbl, tbl);
      execute format(
        'create policy "%s_own" on public.%I for all
           using (auth.uid()::text = user_id::text)
           with check (auth.uid()::text = user_id::text);', tbl, tbl);
    end if;
  end loop;
end $$;

-- ── 3. referrals (are referred_by + new_user_id, nu user_id) ────────────────
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema='public' and table_name='referrals') then
    alter table public.referrals enable row level security;
    drop policy if exists "referrals_own" on public.referrals;
    create policy "referrals_own" on public.referrals
      for all
      using (auth.uid()::text = new_user_id::text or auth.uid()::text = referred_by::text)
      with check (auth.uid()::text = new_user_id::text or auth.uid()::text = referred_by::text);
  end if;
end $$;

-- ── 4. spots (contor public global — doar service-role scrie/citește) ───────
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema='public' and table_name='spots') then
    alter table public.spots enable row level security;
    -- fără policy pentru anon/authenticated => accesibil doar prin service-role
  end if;
end $$;

-- ============================================================================
-- OPȚIONAL — CURĂȚENIE DATE DE TEST (start curat).
-- Datele vechi au user_id text aleatoriu (din localStorage), care oricum nu se
-- mai potrivesc cu niciun cont real. Dacă vrei să pornești curat, DECOMENTEAZĂ
-- blocul de mai jos și rulează-l. IREVERSIBIL — șterge rândurile de test.
-- ============================================================================
-- truncate table public.calculated_profiles restart identity cascade;
-- truncate table public.interpreted_profiles restart identity cascade;
-- truncate table public.checkins            restart identity cascade;
-- truncate table public.streaks             restart identity cascade;
-- truncate table public.compatibility_profiles restart identity cascade;
-- truncate table public.daily_insights      restart identity cascade;
-- truncate table public.weekly_reviews      restart identity cascade;
-- truncate table public.weekly_resets       restart identity cascade;
-- truncate table public.patterns_insights   restart identity cascade;
-- truncate table public.invites             restart identity cascade;
-- truncate table public.referrals           restart identity cascade;
-- drop table if exists public.user_emails;   -- emailul e acum identitatea de login
-- ============================================================================
