// sect. C1 (brief 25.07 seara): extinde poarta lexicala cu verificarile
// Vocii Pragului pentru copy-ul /subscribe, in toate cele 11 limbi.
// Prag 0 pe fiecare verificare de mai jos.
import { SUBSCRIBE_LABELS } from '../lib/subscribeLabels.js'

// Campuri de tip buton/link — imperativul e permis AICI, nicaieri altundeva
// (Vocea Pragului 8: "Imperativul doar pe butoane").
const BUTTON_FIELDS = new Set(['back', 'subscribe_prefix', 'try_free', 'no_profile_link', 'already_link', 'monthly', 'annual', 'redirecting'])

// Verbe de comanda tipice pentru marketing, ca prim cuvant al unei propozitii
// (euristica rezonabila, nu parser gramatical complet).
// Verbe cu ton de indemn/promovare, ca prim cuvant al unei propozitii.
// "cancel"/"anuleaza" si variantele lui NU sunt in lista: in acest copy
// apar mereu in context de LINISTIRE ("anulezi dintr-un click" — cat de
// usor e sa pleci), nu de indemn — un detector care le prinde da
// fals-pozitiv chiar pe textul verbatim validat de Alex. La fel, "don't"/
// "nu" simplu sunt excluse (prind si intrebari negative — "Don't have X
// yet?" — nu doar comenzi); daca apare vreodata un indemn de tip
// "don't miss out", tot va fi prins de restul listei din propozitie.
const IMPERATIVE_STARTERS = {
  en: /^(start|try|get|discover|unlock|join|subscribe|click|download|act now|claim|hurry|sign up|generate)\b/i,
  ro: /^(începe|încearcă|obține|descoperă|deblochează|alătură-te|abonează-te|apasă|descarcă|acționează acum|revendică|grăbește-te|generează)\b/i,
  es: /^(empieza|prueba|obtén|descubre|desbloquea|únete|suscríbete|haz clic|descarga|actúa ahora|reclama|apúrate|genera)\b/i,
  fr: /^(commence|essaie|obtiens|découvre|débloque|rejoins|abonne-toi|clique|télécharge|agis maintenant|réclame|dépêche-toi|génère)\b/i,
  de: /^(starte|probier|hol dir|entdecke|schalte frei|tritt bei|abonniere|klicke|lade herunter|handle jetzt|beeil dich|generiere)\b/i,
  it: /^(inizia|prova|ottieni|scopri|sblocca|unisciti|abbonati|clicca|scarica|agisci ora|reclama|sbrigati|genera)\b/i,
  pt: /^(começa|experimenta|obtém|descobre|desbloqueia|junta-te|subscreve|clica|descarrega|age agora|reclama|apressa-te|gera)\b/i,
  nl: /^(begin|probeer|krijg|ontdek|ontgrendel|doe mee|abonneer|klik|download|handel nu|schiet op|genereer)\b/i,
  pl: /^(zacznij|wypróbuj|zdobądź|odkryj|odblokuj|dołącz|zasubskrybuj|kliknij|pobierz|działaj teraz|pospiesz się|wygeneruj)\b/i,
  hu: /^(kezdd|próbáld|szerezd|fedezd|oldd fel|csatlakozz|iratkozz|kattints|töltsd|cselekedj most|siess|generáld)\b/i,
  ru: /^(начни|попробуй|получи|открой|разблокируй|присоединись|подпишись|нажми|скачай|действуй сейчас|поспеши|создай)\b/i,
}

function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean)
}

function collectFields(obj, prefix = '') {
  const out = []
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      v.forEach((item, i) => out.push([`${prefix}${k}[${i}]`, item]))
    } else if (typeof v === 'string') {
      out.push([`${prefix}${k}`, v])
    }
  }
  return out
}

let totalIssues = 0
const report = {}

for (const [lang, labels] of Object.entries(SUBSCRIBE_LABELS)) {
  const fields = collectFields(labels)
  const issues = []

  // 1. Semne de exclamare — prag 0, peste TOATE campurile (inclusiv butoane).
  for (const [key, text] of fields) {
    if (text.includes('!')) issues.push(`[exclamare] ${key}: "${text}"`)
  }

  // 2. Imperativ in afara butoanelor — prag 0.
  const starterRe = IMPERATIVE_STARTERS[lang]
  if (starterRe) {
    for (const [key, text] of fields) {
      const fieldName = key.split('[')[0]
      if (BUTTON_FIELDS.has(fieldName)) continue
      for (const sentence of splitSentences(text)) {
        if (starterRe.test(sentence)) issues.push(`[imperativ in afara butonului] ${key}: "${sentence}"`)
      }
    }
  }

  // 3. "check-in" netradus — prag 0.
  for (const [key, text] of fields) {
    if (/check-?in/i.test(text)) issues.push(`[check-in netradus] ${key}: "${text}"`)
  }

  // 4. Cuvinte rezervate cu alt sens — "Angajament" (capitalizat, ziua 60)
  // nu trebuie folosit AICI ca LABEL/TITLU de feature (ar fi confundat cu
  // documentul din Drumul). Verificat doar pe campuri scurte de tip
  // titlu/tag (nu si in proza curgatoare — "capitalizat" nu e un semnal
  // de incredere in germana, unde toate substantivele sunt capitalizate
  // prin gramatica, nu prin folosire ca titlu).
  const LABEL_FIELD_RE = /title|tag$/i
  for (const [key, text] of fields) {
    const fieldName = key.split('[')[0]
    if (!LABEL_FIELD_RE.test(fieldName)) continue
    if (/\b(Angajament|Commitment|Compromiso|Engagement|Verpflichtung|Impegno|Zobowiązanie|Elköteleződés)\b/i.test(text)) {
      issues.push(`[cuvant rezervat folosit ca titlu/label] ${key}: "${text}"`)
    }
  }

  // 5. Raritate fara mecanism — offer_text trebuie sa aiba placeholder {n},
  // altfel nu exista nicio legatura cu un contor viu.
  if (labels.offer_text && !labels.offer_text.includes('{n}')) {
    issues.push(`[raritate fara contor viu] offer_text nu contine placeholder {n}: "${labels.offer_text}"`)
  }

  report[lang] = issues
  totalIssues += issues.length
}

console.log('=== Poarta Vocii Pragului — /subscribe, toate cele 11 limbi ===\n')
for (const [lang, issues] of Object.entries(report)) {
  if (issues.length === 0) {
    console.log(`[OK] ${lang}: curat`)
  } else {
    console.log(`[FAIL] ${lang}: ${issues.length} probleme`)
    issues.forEach(i => console.log('  ' + i))
  }
}

console.log(`\n=== REZULTAT: ${totalIssues === 0 ? 'CURAT — copy-ul trece Vocea Pragului' : `${totalIssues} PROBLEME gasite (prag 0)`} ===`)
process.exit(totalIssues === 0 ? 0 : 1)
