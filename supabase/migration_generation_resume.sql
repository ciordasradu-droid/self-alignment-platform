-- ============================================================================
-- P0 continuare (06.08.2026) — "generarea nu supravietuieste ascunderii filei".
--
-- Diagnoza: intreaga generare (calculate -> interpret -> interpret-plan) e
-- orchestrata 100% client-side, secvential, intr-un singur closure JS legat
-- de instanta paginii /generating. Fiecare endpoint individual foloseste deja
-- after() ca sa-si termine PROPRIUL pas server-side daca clientul abandoneaza
-- conexiunea — dar daca browserul mobil suspenda/evacueaza tab-ul din memorie
-- cat timp e in fundal (comun pe iOS, si pe Android sub presiune de memorie),
-- bucla de orchestrare client-side moare pur si simplu, fara nicio eroare —
-- ecranul ramane inghetat la nesfarsit, pentru ca nimic nu mai declanseaza
-- pasul urmator. Asta a lasat ZERO urma in interpreted_profiles pentru contul
-- lui Alex: atacul s-a intamplat probabil chiar in timpul unuia din pasi,
-- inainte ca randul respectiv sa fi apucat sa se scrie.
--
-- Solutie: onboarding_sessions retine acum progresul (nu doar formularul),
-- ca /generating sa poata RELUA de la etapa lipsa la orice re-montare a
-- paginii (revenire din tab evacuat = reload complet = acelasi mecanism),
-- in loc sa reporneasca orbeste de la /api/calculate de fiecare data.
--
-- Rulează acest fișier O SINGURĂ DATĂ în Supabase → SQL Editor → New query → Run.
-- ============================================================================

alter table public.onboarding_sessions
  add column if not exists calculated_data jsonb,
  add column if not exists interpreted_profile_id uuid;
