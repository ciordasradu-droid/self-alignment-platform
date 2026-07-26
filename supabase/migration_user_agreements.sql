-- ============================================================================
-- Punctul 2 (audit 26.07, runda 1): poarta de acorduri traia DOAR in
-- localStorage (`my_agreements`, `gate_committed:<nume-sau-anon>`) — serverul
-- nu stia nimic despre ea. Consecinta verificata live: un cont vechi avea
-- gate_committed:anon="true" din 16 iunie (poarta n-a mai aparut de atunci,
-- desi profilul activ era complet altul, in alta limba) — nu era stricata,
-- era SARITA, fiindca cheia locala nu se leaga nicicum de user_id sau de
-- profilul curent.
--
-- Rulează acest fișier O SINGURĂ DATĂ în Supabase → SQL Editor → New query → Run.
-- ============================================================================

create table if not exists public.user_agreements (
  user_id                text primary key,
  items                  jsonb not null,
  accepted_at            timestamptz not null default now(),
  interpreted_profile_id uuid,
  language               text
);

alter table public.user_agreements enable row level security;
-- fara policy pentru anon/authenticated => accesibil doar prin service-role
-- (acelasi tipar ca `spots`/`rate_limits`)
