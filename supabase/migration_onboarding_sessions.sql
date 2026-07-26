-- ============================================================================
-- Punctul 1 (audit 26.07, runda 2 — corectie dupa testul explicit al lui Alex):
-- varianta cu sessionStorage (golit imediat dupa prima citire, ca sa nu
-- ramana date personale in browser mai mult decat trebuie) supravietuia doar
-- Strict-Mode-ului din dev. Un refresh REAL pe /generating la 60s dupa start
-- gasea sessionStorage deja gol si trimitea inapoi la /onboarding, pierzand
-- formularul. Testat live: CONFIRMAT.
--
-- Solutie: datele de onboarding stau server-side, sub un id opac, din
-- momentul in care utilizatorul apasa "Creeaza-mi profilul" — acelasi tipar
-- deja folosit pentru intoarcerea din Stripe (/api/checkout/session). URL-ul
-- devine /generating?id=<uuid>: niciodata date personale in adresa, iar un
-- refresh doar recitește dupa id, oricat de multe ori, oricand in flux.
--
-- Rulează acest fișier O SINGURĂ DATĂ în Supabase → SQL Editor → New query → Run.
-- ============================================================================

create table if not exists public.onboarding_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  form_data  jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.onboarding_sessions enable row level security;
-- fara policy pentru anon/authenticated => accesibil doar prin service-role
-- (acelasi tipar ca `user_agreements`/`rate_limits`) — rutele API verifica
-- explicit user_id inainte de a returna form_data.
