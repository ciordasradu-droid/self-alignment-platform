-- ============================================================================
-- GCAO 01.08.2026 — Acțiunea 6: query-ul de comisioane pentru afiliere.
-- Rulează manual în Supabase → SQL Editor, oricând vrei să calculezi ce
-- datorezi fiecărui influencer luna asta. Comisionul (€3/profil vândut)
-- se plătește manual de Alex pe baza rezultatului — nimic automat aici.
--
-- Ce numără: fiecare user atribuit unui invite_code (tabelul
-- invite_code_referrals) care are un rând în `subscriptions` cu
-- status = 'active' (adică a devenit abonat plătitor), grupat pe cod și
-- pe luna calendaristică în care a devenit plătitor.
-- ============================================================================

select
  icr.invite_code,
  ic.owner_name,
  date_trunc('month', s.updated_at)::date as luna,
  count(distinct s.user_id) as profiluri_platite,
  count(distinct s.user_id) * 3 as comision_datorat_eur
from public.invite_code_referrals icr
join public.invite_codes ic on ic.code = icr.invite_code
join public.subscriptions s on s.user_id = icr.user_id and s.status = 'active'
group by icr.invite_code, ic.owner_name, date_trunc('month', s.updated_at)
order by luna desc, icr.invite_code;

-- ============================================================================
-- EXEMPLU DE REZULTAT:
--
--  invite_code | owner_name    |    luna    | profiluri_platite | comision_datorat_eur
-- -------------+---------------+------------+-------------------+----------------------
--  MARIA10     | Maria Popescu | 2026-08-01 |                 4 |                   12
--  RARES5      | Rareș Ionescu | 2026-08-01 |                 1 |                    3
--
-- Citire: în august 2026, 4 oameni atribuiți codului MARIA10 au un
-- abonament activ → Maria e datoare cu 4 × €3 = €12. Ajustează manual
-- fereastra de timp (where s.updated_at >= ...) dacă vrei o luna anume.
-- ============================================================================
