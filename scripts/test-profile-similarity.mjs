// scripts/test-profile-similarity.mjs
//
// Protocol de test A11 (extins 25.07, sect. C din brief-ul de audit):
// genereaza mai multe profiluri complete cu date de nastere foarte diferite
// — inclusiv Proiector si Reflector explicit — compara sectiunile intre ele,
// si ruleaza un audit de lexic pe FIECARE profil (nu doar similitudinea).
//
// Ruleaza ambele treceri (generare + proofread selectiv B1) ca in productie
// (app/api/interpret/route.js), ca testul sa reflecte exact ce primeste
// userul final, si ca sa raporteze si TIMPUL real.
//
//   node scripts/test-profile-similarity.mjs [language]
//   ruleaza si pe 'en' pentru comparatie RO/EN (sect. C: "aceleasi date, ca
//   defectele de limba sa se separe de defectele de prompt").
//
// Foloseste ANTHROPIC_API_KEY din .env.local. Ruleaza DOAR local.

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { jsonrepair } from 'jsonrepair'
import { calculateFullProfile } from '../lib/calculations/index.js'
import { buildProfilePrompt, buildProofreadPrompt } from '../lib/prompts/profile.js'
import { findFailingSections } from '../lib/lexiconGate.js'

const ROOT = path.resolve(import.meta.dirname, '..')
function loadEnv() {
  const file = path.join(ROOT, '.env.local')
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split(/\r?\n/)
      .filter(l => l.includes('=') && !l.trim().startsWith('#'))
      .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
  )
}
const env = loadEnv()
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

const language = process.argv[2] || 'ro'

// Oameni foarte diferiti: decade/luni/ore/locatii diferite + Proiector si
// Reflector explicit (gasite prin cautare pe grila — sect. C, "A5 nu se
// poate valida altfel", cele 2 tipuri fiind rare statistic).
const PEOPLE = [
  { name: 'Ana Popescu',    dob: '1968-02-14', tob: '03:20', lat: 44.4268, lng: 26.1025 },
  { name: 'Mihai Ionescu',  dob: '1995-07-30', tob: '15:45', lat: 46.7712, lng: 23.6236 },
  { name: 'Elena Dumitru',  dob: '2003-11-09', tob: '09:05', lat: 45.7489, lng: 21.2087 },
  { name: 'Radu Proiector', dob: '1960-01-14', tob: '00:00', lat: 45.0,    lng: 25.0 },    // Proiector
  { name: 'Sofia Reflector',dob: '1984-01-14', tob: '00:00', lat: 45.0,    lng: 25.0 },    // Reflector
]

async function callClaude(prompt, maxTokens = 10000) {
  const t0 = Date.now()
  const params = {
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  }
  const stream = await anthropic.messages.create(params)
  let fullText = ''
  let stopReason = null
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') fullText += event.delta.text
    else if (event.type === 'message_delta' && event.delta?.stop_reason) stopReason = event.delta.stop_reason
  }
  const clean = fullText.trim().replace(/^```json\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim()
  if (stopReason === 'max_tokens') throw new Error('truncated')
  return { data: JSON.parse(jsonrepair(clean)), ms: Date.now() - t0 }
}

function splitSentences(text) {
  if (!text || typeof text !== 'string') return []
  return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 12)
}

function wordSet(sentence) {
  return new Set(
    sentence.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)
  )
}

function jaccard(a, b) {
  const setA = wordSet(a), setB = wordSet(b)
  if (setA.size === 0 || setB.size === 0) return 0
  let inter = 0
  for (const w of setA) if (setB.has(w)) inter++
  const union = setA.size + setB.size - inter
  return inter / union
}

// A7: schema noua — 6 capitole + arhetip
function extractSections(sections) {
  const out = {}
  out.archetype = [sections.archetype?.description]
  out.how_you_work = [sections.how_you_work?.surface, sections.how_you_work?.engine, sections.how_you_work?.core]
  out.strengths = Array.isArray(sections.strengths) ? sections.strengths : []
  out.decision_system = Array.isArray(sections.decision_system) ? sections.decision_system : []
  out.energy_manual = [sections.energy_manual?.peak, sections.energy_manual?.drain, sections.energy_manual?.rhythm, sections.energy_manual?.current_year, ...(sections.energy_manual?.watch_for || [])]
  out.central_tension = sections.central_tension && typeof sections.central_tension === 'object'
    ? [sections.central_tension.tension, sections.central_tension.pull_a, sections.central_tension.pull_b, sections.central_tension.daily_experience, sections.central_tension.resolution]
    : []
  out.aligned_life = [sections.aligned_life]

  const flat = {}
  for (const [k, arr] of Object.entries(out)) {
    flat[k] = arr.filter(Boolean).flatMap(splitSentences)
  }
  return flat
}

const BARNUM_TELLS = [
  /\bun proiect\b.*\bo directie\b.*\bpoate\b/i,
  /\bnu din ego\b/i,
  /\bnu din negativism\b/i,
  /\bvrea sa conteze\b|\bvrei sa contezi\b/i,
]

// Gasit empiric 25.07: 4 din 5 profiluri de test au deschis cu exact acelasi
// sablon structural ("genul de om/persoana care intra intr-o camera...") desi
// cuvintele diferite dupa scapau de verificarea Jaccard de mai jos — Jaccard
// prinde repetitia de CUVINTE, nu repetitia de SABLON STRUCTURAL. Verificare
// separata, per profil (nu incrucisata), pentru acest sablon specific.
const STRUCTURAL_TEMPLATE_TELLS = [
  /genul de (om|persoan[aă]) care intr[aă] într?-o camer[aă]/i,
  /kind of person who walks? into a room/i,
]

// sect. C: prag 0 pentru fiecare din urmatoarele. Verbe-comanda si stari
// negative numite au acoperire buna doar in RO/EN (limitare cunoscuta,
// aceeasi ca in lib/lexiconGate.js — variaza prea mult intre cele 11 limbi
// pentru regex simplu; restul limbilor raman acoperite doar de prompt).
const LEXICON_TELLS = [
  [/umbr[aăe]|shadow/i, 'cuvant "umbra/shadow" interzis complet'],
  [/\ba\)\s|\bb\)\s/i, 'litere A)/B) ca prefix'],
  [/\(\d+\/\d+\s*\|\s*\d+\/\d+\)/, 'tuplu brut de cifre de mecanism'],
  [/tensiune (in|în) piept|nod (in|în) g[aâ]t|str[aâ]ngere de stomac|gol (in|în) stomac|tightness in (your|my) chest|knot in (your|my) stomach/i, 'disconfort anatomic numit'],
  [/a intrat (in|în) panic[aă]|a preluat controlul|a t[aă]cut(?!\w)|took over|went quiet(?!\w)/i, 'personificare a sistemului'],
  [/\bresentiment\w*|\bfrustrare\w*|\bam[aă]r[aă]ciune\w*|\bresentment\b|\bfrustration\b|\bbitterness\b/i, 'stare negativa numita (RO/EN)'],
  [/\bshould\b|\bneed to\b|\bhave to\b|\bought to\b/i, 'verb-comanda (EN, doar cand testul ruleaza pe en)'],
]

async function generateOne(person) {
  const calculatedData = calculateFullProfile(person.name, person.dob, person.tob, person.lat, person.lng, language, false)
  const genPrompt = buildProfilePrompt(calculatedData, person.name, language)
  let { data: sections, ms: genMs } = await callClaude(genPrompt, 10000)

  const { failing, clean } = findFailingSections(sections, language)
  let proofMs = 0
  if (!clean) {
    try {
      const { data: corrected, ms } = await callClaude(buildProofreadPrompt(JSON.stringify(failing), language), 4000)
      sections = { ...sections, ...corrected }
      proofMs = ms
    } catch (e) {
      console.log(`  (proofread a esuat pentru ${person.name}: ${e.message})`)
    }
  }
  return { person, sections, genMs, proofMs, wasClean: clean, failingKeys: Object.keys(failing) }
}

async function main() {
  console.log(`\n=== Test similitudine + lexic + latenta (${language}) — 5 profiluri, inclusiv Proiector/Reflector ===\n`)

  const results = []
  for (const person of PEOPLE) {
    console.log(`Generez profil pentru ${person.name} (${person.dob} ${person.tob})...`)
    const r = await generateOne(person)
    results.push(r)
    console.log(`  ${(r.genMs/1000).toFixed(1)}s generare` + (r.wasClean ? ' — CURAT, a 2-a trecere sarita' : ` + ${(r.proofMs/1000).toFixed(1)}s corectura (sectiuni: ${r.failingKeys.join(', ')})`))
  }

  console.log('\n--- Rezumat: arhetip + tip HD per profil ---')
  for (const { person, sections } of results) {
    const calculatedData = calculateFullProfile(person.name, person.dob, person.tob, person.lat, person.lng, language, false)
    console.log(`${person.name} [${calculatedData.human_design.type}]: arhetip="${sections.archetype?.name}"`)
  }

  console.log('\n--- Verificare 1: tipare Barnum interzise (regex) ---')
  let barnumHits = 0
  for (const { person, sections } of results) {
    const allText = JSON.stringify(sections)
    for (const re of BARNUM_TELLS) {
      if (re.test(allText)) { console.log(`  [FAIL] ${person.name}: gasit tipar interzis ${re}`); barnumHits++ }
    }
  }
  if (barnumHits === 0) console.log('  [OK] Niciun tipar Barnum interzis gasit direct.')

  console.log('\n--- Verificare 1a: sabloane structurale de deschidere repetate (gasit empiric 25.07) ---')
  let templateHits = 0
  for (const { person, sections } of results) {
    const archText = sections.archetype?.description || ''
    for (const re of STRUCTURAL_TEMPLATE_TELLS) {
      if (re.test(archText)) { console.log(`  [FAIL] ${person.name}: deschidere pe sablonul interzis "intra intr-o camera"`); templateHits++ }
    }
  }
  if (templateHits === 0) console.log('  [OK] Niciun profil nu foloseste sablonul de deschidere interzis.')

  console.log('\n--- Verificare 1b: lexic interzis (prag 0 conform sect. C) ---')
  let lexiconHits = 0
  for (const { person, sections } of results) {
    const allText = JSON.stringify(sections)
    for (const [re, label] of LEXICON_TELLS) {
      if (label.includes('doar cand testul ruleaza pe en') && language !== 'en') continue
      const matches = allText.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))
      if (matches) { console.log(`  [FAIL] ${person.name}: ${label} — ${matches.length}x (${JSON.stringify(matches.slice(0,3))})`); lexiconHits += matches.length }
    }
  }
  if (lexiconHits === 0) console.log('  [OK] Niciun termen din lista neagra gasit.')

  console.log('\n--- Verificare 2: similaritate propozitii intre useri diferiti (Jaccard > 0.6) ---')
  const extracted = results.map(r => extractSections(r.sections))
  const sectionNames = Object.keys(extracted[0])
  let similarityHits = 0
  const THRESHOLD = 0.6
  for (const section of sectionNames) {
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const sentA = extracted[i][section] || []
        const sentB = extracted[j][section] || []
        for (const a of sentA) {
          for (const b of sentB) {
            const sim = jaccard(a, b)
            if (sim > THRESHOLD) {
              similarityHits++
              console.log(`  [FAIL] sectiune "${section}" — ${results[i].person.name} vs ${results[j].person.name} (similaritate ${(sim*100).toFixed(0)}%)`)
              console.log(`         A: "${a}"`); console.log(`         B: "${b}"`)
            }
          }
        }
      }
    }
  }
  if (similarityHits === 0) console.log(`  [OK] Nicio pereche de propozitii peste pragul de ${THRESHOLD*100}% similaritate.`)

  console.log('\n--- Verificare 3: lungime (tinta 1400-1600 cuvinte, sect. A6) ---')
  let lengthMisses = 0
  for (const { person, sections } of results) {
    const wc = JSON.stringify(sections).split(/\s+/).length
    const inRange = wc >= 1300 && wc <= 1800 // marja de toleranta peste tinta stricta
    if (!inRange) lengthMisses++
    console.log(`  ${inRange ? '[OK]' : '[WARN]'} ${person.name}: ~${wc} cuvinte`)
  }

  console.log('\n--- Verificare 4: unghiul de deschidere (archetype.description) ---')
  for (const { person, sections } of results) {
    console.log(`  ${person.name}: "${(sections.archetype?.description || '').slice(0, 140)}..."`)
  }

  const totalGenMs = results.reduce((a, r) => a + r.genMs + r.proofMs, 0)
  const avgMs = totalGenMs / results.length
  console.log(`\n--- Timp mediu per profil: ${(avgMs/1000).toFixed(1)}s (vechi, 2 treceri complete intotdeauna: ~210s) ---`)
  console.log(`--- Profiluri curate (a 2-a trecere sarita): ${results.filter(r => r.wasClean).length}/${results.length} ---`)

  const totalIssues = barnumHits + templateHits + lexiconHits + similarityHits
  console.log(`\n=== REZULTAT: ${totalIssues === 0 ? 'CURAT — promptul trece testul' : `${totalIssues} PROBLEME gasite (prag 0) — promptul NU trece inca`}${lengthMisses ? ` | ${lengthMisses} profil(uri) in afara marjei de lungime (avertisment, nu esec)` : ''} ===\n`)

  fs.writeFileSync(
    path.join(ROOT, 'scripts', '_similarity-report.json'),
    JSON.stringify({ language, profiles: results.map(r => ({ person: r.person, sections: r.sections, genMs: r.genMs, proofMs: r.proofMs, wasClean: r.wasClean })), barnumHits, lexiconHits, similarityHits, lengthMisses }, null, 2)
  )
  console.log('Raport complet salvat in scripts/_similarity-report.json\n')

  process.exit(totalIssues === 0 ? 0 : 1)
}

main().catch(err => { console.error('Eroare in testul de similitudine:', err); process.exit(2) })
