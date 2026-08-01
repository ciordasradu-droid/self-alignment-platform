-- ============================================================================
-- GCAO 01.08.2026 — Acțiunea 6: fundația sistemului de afiliere prin
-- invitații (coduri de influencer, NU reducere — doar atribuire pentru
-- comisionul manual de €3/profil vândut, plătit de Alex pe baza query-ului
-- din supabase/query_commission_report.sql).
--
-- Rulează acest fișier O SINGURĂ DATĂ în Supabase → SQL Editor → New query
-- → Run. Sigur de rulat: doar CREATE TABLE IF NOT EXISTS, nimic distructiv,
-- nu atinge tabelele existente `invites`/`referrals` (sistemul de invitații
-- ÎNTRE UTILIZATORI, peer-to-peer, rămâne neschimbat — vezi notă mai jos).
--
-- NOTĂ IMPORTANTĂ: numele tabelei noi e `invite_code_referrals`, NU
-- `referrals` — aplicația are deja un tabel `referrals` (invitații între
-- prieteni, coloane `referred_by`/`new_user_id`, fără legătură cu
-- influencerii). Un tabel nou cu același nume `referrals` dar coloane
-- diferite (`invite_code`/`user_id`, cum cerea specificația inițială)
-- ar fi intrat în conflict direct cu tabelul existent — de-asta e numit
-- diferit aici. Cele două sisteme de invitații coexistă, complet separate.
-- ============================================================================

-- ── 1. invite_codes — codurile deținute de influenceri, create manual de Alex ──
create table if not exists public.invite_codes (
  code        text primary key,
  owner_name  text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── 2. invite_code_referrals — atribuirea unui user catre un cod, o singura data ──
create table if not exists public.invite_code_referrals (
  id          bigint generated always as identity primary key,
  invite_code text not null references public.invite_codes(code),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index if not exists invite_code_referrals_code_idx
  on public.invite_code_referrals (invite_code);

-- ── 3. RLS — acces DOAR prin service-role (la fel ca tabelul `spots`) ──────
-- Alex creează codurile direct din Supabase (service-role/SQL editor);
-- aplicația scrie atribuirea prin service-role (vezi app/api/invite-code/
-- route.js). Niciun user autentificat nu citește/scrie direct aceste
-- tabele — nu există nicio poartă vizibilă în UI pentru ele (fundație, fără
-- dashboard, conform scope-ului cerut).
alter table public.invite_codes enable row level security;
alter table public.invite_code_referrals enable row level security;

-- ============================================================================
-- EXEMPLU — cum adaugi un cod nou pentru un influencer (rulează manual,
-- unul pe rând, oricând vrei sa activezi un influencer nou):
-- ============================================================================
-- insert into public.invite_codes (code, owner_name) values ('MARIA10', 'Maria Popescu');
-- ============================================================================
