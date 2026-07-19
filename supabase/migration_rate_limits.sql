-- ============================================================================
-- RATE LIMITING pe rutele care apelează Claude (cost per request).
-- Rulează acest fișier O SINGURĂ DATĂ în Supabase → SQL Editor → New query → Run.
-- Fără asta, lib/rateLimit.js "eșuează deschis" (permite cererea) — deci
-- aplicația NU se strică dacă uiți să rulezi asta, dar rate limiting-ul
-- rămâne inactiv până o faci.
-- ============================================================================

create table if not exists public.rate_limits (
  user_id      text not null,
  route        text not null,
  window_start timestamptz not null default now(),
  count        int not null default 1,
  primary key (user_id, route)
);

alter table public.rate_limits enable row level security;
-- fără policy pentru anon/authenticated => accesibil doar prin service-role
-- (același tipar ca tabela `spots`)
