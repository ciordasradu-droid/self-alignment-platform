# SECȚIUNEA 8 — STARE TEHNICĂ + CE URMEAZĂ
Actualizat: 16.07.2026, la finalul calupului „Experiența Apei, reală".
De înlocuit peste secțiunea 8 din PROMPT_MASTER_v2.md.

### Stack și acces
- Next.js (App Router) + Supabase (PostgreSQL) + Claude API (claude-sonnet-4-6).
- **APA: three.js + @react-three/fiber + @react-three/drei + shadere GLSL custom.**
- Live: https://self-alignment-platform.vercel.app | Local: C:\Users\user\self-alignment-platform
- GitHub: github.com/ciordasradu-droid/self-alignment-platform (push pe main = deploy Vercel).
- 10 limbi: EN, RO, ES, FR, DE, IT, PT, NL, PL, HU.

### Fișiere cheie
**Apa (nou):**
- `app/components/water/shaders.js` — GLSL: zgomot simplex + FBM, fundalul de apă (unde, caustice, inele, unde din atingere), picătura (perlată, fresnel, irizație rece, miez auriu).
- `app/components/water/WaterScene.js` — scena R3F: un singur Canvas, dpr [1,1.5], frameloop pauzat, PerfGuard.
- `app/components/water/WaterCanvas.js` — învelișul: ssr:false, fallback fără WebGL, ripple global.
- `app/components/water/waterState.js` — cele 7 stadii + starea partajată (day, light, dropPos, ripples, showDrop).
- `app/dev/water/page.js` — playground cu Leva (404 în producție).

**Restul:** lib/prompts/{profile,compatibility}.js · lib/prompts/terminology/{10 limbi}.js · lib/translations.js · lib/landing.js · lib/dailyThoughts.js · lib/language.js · lib/useUser.js · lib/supabase/{server,client,service}.js · lib/calculations/index.js · middleware.js · app/dashboard/page.js + components/{MorningAnchor, EveningMirror, OneBreath, DailyInsight, StreakTracker, WeeklyReset, WeeklyReview, FreeJournal, PatternsInsight, ProgressiveUnlock, CommitmentDocument} · app/api/{calculate, interpret, interpret-plan, ritual, dashboard, compatibility}/route.js · app/{login, auth/callback, profile, generating, onboarding, compatibility}/

**Scripturi (rulabile oricând):**
- `node scripts/dev-login.mjs` — login de dev FĂRĂ email (Admin API + email_confirm). Niciun test nu mai așteaptă un inbox.
- `node scripts/screenshots.mjs` — capturi Playwright la 390×844 și 1440×900 (`--only=home`). Merge și pe live: `BASE_URL=https://... node scripts/screenshots.mjs`.
- `node scripts/verify-water.mjs` — verifică ce nu se vede într-o captură: apa se mișcă, tap→undă, fundal indigo, reduced-motion static.
- `node scripts/find-violations.mjs` — scanner de încălcări: emoji, „scor", mov.

### Tabele Supabase
`users` (id→auth.users, email, birth_data, current_unlocked_day, custom_settings, starting_point), `calculated_profiles`, `interpreted_profiles`, `checkins` (answers jsonb — ritualurile stau aici, cu `kind`: morning/evening/one_breath; score e NOT NULL → scriem 0), `streaks`, `compatibility_profiles`, `daily_insights`, `weekly_reviews`, `weekly_resets`, `patterns_insights`, `invites`, `referrals`, `subscriptions`, `spots`. RLS peste tot (`auth.uid()::text = user_id::text`).

### Confirmat funcțional
Plan de aliniere ✓ · Compatibilitate cap-coadă ✓ (testat 16.07) · Check-in seară se salvează ✓ (testat 16.07) · Migrare Auth + RLS ✓ · Experiența apei (three.js) ✓ — build curat, zero emoji, verificări de apă toate trec, deploy live verificat.

### RĂMAS DE FĂCUT DE ALEX (blocant pentru testeri)
- **Resend ca SMTP custom în Supabase**: Project Settings → Authentication → SMTP Settings → Enable Custom SMTP (host `smtp.resend.com`, port 465, user `resend`, parola = RESEND_API_KEY). Fără asta, emailul implicit Supabase are limită de câteva mesaje/oră și testerii nu pot intra. Depinde de un domeniu verificat în Resend → depinde de NUMELE aplicației (decizie deschisă).

### CALUPUL URMĂTOR
1. **SESIUNE DE EXPERIENȚĂ (Fable + Alex)** — după testul pe telefon: ce pagini au sens, ce se remodelează, cizelarea cuvintelor. Rezultatul devine calupul următor.
2. Stadiile vizuale 2–7 ale apei, rafinate pe rând în /dev/water (arhitectura le știe deja: `waterState.STAGES` + uniforme).
3. TEXTE + LIMBĂ: texte pre-scrise nereparate încă („Monday — New Week" netradus, „Reflectează asupra asta", diacritice în eyebrow-uri, „An Personal 1"); VOICE_RULES primesc principiul „fraza sună nativ în limba respectivă"; textele noi din secțiunea 5 traduse nativ în 10 limbi (acum: EN + RO complete, restul parțial).
4. CAPACITOR (Android + iOS) — după testul de experiență.
5. Curățenie rămasă: `lib/userId.js` (încă importat de generating/compatibility/subscribe, dar valoarea e ignorată de rute), `middleware.js` → `proxy.js` (convenție Next 16), clasele numite `tag-purple` (culoarea e deja aur).

### DECIZII DESCHISE
- **NUMELE aplicației + domeniul .com**: NEDECIS. Blochează Resend (domeniu expeditor) și iconițele PWA. Familia „alin-" i s-a părut lui Alex clișeu. De explorat în sesiune de naming cu Fable, posibil din universul apei/luminii. Criterii: feminin, se termină în „a", ușor de pronunțat/scris, .com liber.
- **Pragurile de oră ale ritualurilor** (acum 12:00 / 17:00): ora sugerează ritualul, celălalt rămâne accesibil printr-un link discret (fără blocaj — principiul 4). De validat la sesiunea de experiență.
- **A treia sugestie de seară** + senzația celor 3 axe — de validat la test (marcate în Master secțiunea 5).
