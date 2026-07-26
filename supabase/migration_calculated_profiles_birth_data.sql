-- ============================================================================
-- Punctul 1 (audit 26.07, runda 1): calculated_profiles nu salva NICIODATA
-- datele brute de nastere (nume, data, ora, oras, lat/lng) si nici un blob
-- unificat `calculated_data` (JSONB cu {astrology, numerology, human_design})
-- — desi /api/profile si /api/patterns presupuneau deja ca acesta din urma
-- exista (comentarii in cod il refera direct). Doar coloane noi, ADITIV,
-- fara nicio stergere/rescriere de randuri existente.
--
-- Rulează acest fișier O SINGURĂ DATĂ în Supabase → SQL Editor → New query → Run.
-- ============================================================================

alter table public.calculated_profiles
  add column if not exists full_name text,
  add column if not exists birth_date date,
  add column if not exists birth_time time,
  add column if not exists birth_city text,
  add column if not exists birth_lat double precision,
  add column if not exists birth_lng double precision,
  add column if not exists birth_timezone text,
  add column if not exists calculated_data jsonb;

-- Nota: randurile EXISTENTE raman cu aceste coloane NULL — datele brute
-- n-au fost captate niciodata, nu exista nicio recuperare retroactiva
-- (vezi brief-ul 26.07, punctul 1). Orice profil vechi are nevoie de
-- regenerare cu date reintroduse manual.
