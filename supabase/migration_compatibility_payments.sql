-- ============================================================================
-- T3 (calup arhitectura 30.07): compatibilitatea (€8) nu avea NICIO poarta de
-- plata in cod — oricine cu profil putea genera compatibilitate gratis.
-- Acest tabel leaga un rand = o sesiune Stripe deja CONSUMATA (un rand ->
-- o singura generare), verificata direct la Stripe (payment_status==='paid')
-- in /api/compatibility, nu doar prin webhook (acelasi motiv ca la profilul
-- de €4: eviti cursa in care webhook-ul intarzie fata de intoarcerea userului).
-- unique(stripe_session_id) e chiar poarta anti-reluare: a doua incercare de
-- a folosi acelasi session_id pentru o a doua generare esueaza la insert.
--
-- Rulează acest fișier O SINGURĂ DATĂ în Supabase → SQL Editor → New query → Run.
-- ============================================================================

create table if not exists public.compatibility_payments (
  id                uuid primary key default gen_random_uuid(),
  user_id           text not null,
  stripe_session_id text not null unique,
  created_at        timestamptz not null default now()
);

create index if not exists compatibility_payments_user_id_idx
  on public.compatibility_payments(user_id);

alter table public.compatibility_payments enable row level security;
-- fara policy pentru anon/authenticated => accesibil doar prin service-role
-- (acelasi tipar ca `user_agreements`/`rate_limits`)
