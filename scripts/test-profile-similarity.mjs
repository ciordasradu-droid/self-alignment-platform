// scripts/test-profile-similarity.mjs
//
// Protocol de test A11: genereaza 3 profiluri complete cu date de nastere
// foarte diferite, compara sectiunile intre ele, raporteaza propozitii
// similare intre useri diferiti. Daca apar paragrafe/propozitii aproape
// identice intre oameni diferiti, promptul e prea generic (Barnum) sau
// prea sablonat structural — promptul PICA testul.
//
// Ruleaza ambele treceri (generare + proofread E6) ca in productie
// (app/api/interpret/route.js), ca testul sa reflecte exact ce primeste
// userul final.
//
//   node scripts/test-profile-similarity.mjs [language]
//
// Foloseste ANTHROPIC_API_KEY din .env.local. Ruleaza DOAR local.

import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { jsonrepair } from 'jsonrepair'
import { calculateFullProfile } from '../lib/calculations/index.js'
import { buildProfilePrompt, buildProofreadPrompt } from '../lib/prompts/profile.js'

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

// Trei oameni foarte diferiti: decade diferite, luni diferite, ore diferite,
// locatii diferite -> tipuri HD / semne / life path foarte diferite probabil.
const PEOPLE = [
  { name: 'Ana Popescu',    dob: '1968-02-14', tob: '03:20', lat: 44.4268, lng: 26.1025 }, // Bucuresti, iarna, noapte
  { name: 'Mihai Ionescu',  dob: '1995-07-30', tob: '15:45', lat: 46.7712, lng: 23.6236 }, // Cluj, vara, dupa-amiaza
  { name: 'Elena Dumitru',  dob: '2003-11-09', tob: '09:05', lat: 45.7489, lng: 21.2087 }, // Timisoara, toamna, dimineata
]

async function callClaude(prompt, maxTokens = 10000) {
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
  return JSON.parse(jsonrepair(clean))
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

function extractSections(sections) {
  const out = {}
  out.archetype = [sections.archetype?.description]
  out.how_you_work = [sections.how_you_work?.surface, sections.how_you_work?.engine, sections.how_you_work?.core]
  out.aligned_life = [sections.aligned_life]
  out.decision_system = Array.isArray(sections.decision_system) ? sections.decision_system : []
  out.energy_manual = [sections.energy_manual?.peak, sections.energy_manual?.drain, sections.energy_manual?.rhythm, sections.energy_manual?.current_year]
  out.friction_map = (Array.isArray(sections.friction_map) ? sections.friction_map : [])
    .filter(f => f && typeof f === 'object')
    .flatMap(f => [f.tension, f.pull_a, f.pull_b, f.daily_experience, f.resolution])
  out.warning_signals = (Array.isArray(sections.warning_signals) ? sections.warning_signals : [])
    .filter(w => w && typeof w === 'object')
    .flatMap(w => [w.signal, w.pattern, w.exit])
  out.strengths = Array.isArray(sections.strengths) ? sections.strengths : []
  out.vulnerabilities = Array.isArray(sections.vulnerabilities) ? sections.vulnerabilities : []
  out.opportunities = Array.isArray(sections.opportunities) ? sections.opportunities : []

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

const LEXICON_TELLS = [
  [/umbr[aăe]/i, 'cuvant "umbra" (shadow) interzis complet, in orice forma'],
  [/\ba\)\s|\bb\)\s/i, 'litere A)/B) ca prefix'],
  [/\(\d+\/\d+\s*\|\s*\d+\/\d+\)/, 'tuplu brut de cifre de mecanism'],
  [/tensiune (in|în) piept|nod (in|în) g[aâ]t|str[aâ]ngere de stomac|gol (in|în) stomac/i, 'disconfort anatomic numit'],
  [/a intrat (in|în) panic[aă]|a preluat controlul|a t[aă]cut(?!\w)/i, 'personificare a sistemului'],
]

async function main() {
  console.log(`\n=== Test similitudine profiluri (${language}) — 3 date de nastere foarte diferite ===\n`)
  console.log('(rulez ambele treceri: generare + proofread E6, ca in productie)\n')

  const profiles = []
  for (const person of PEOPLE) {
    console.log(`Generez profil pentru ${person.name} (${person.dob} ${person.tob})...`)
    const calculatedData = calculateFullProfile(person.name, person.dob, person.tob, person.lat, person.lng, language, false)
    const prompt = buildProfilePrompt(calculatedData, person.name, language)
    let sections = await callClaude(prompt, 10000)
    try {
      const proofreadPrompt = buildProofreadPrompt(JSON.stringify(sections), language)
      sections = await callClaude(proofreadPrompt, 10000)
    } catch (e) {
      console.log(`  (proofread a esuat pentru ${person.name}, pastrez originalul: ${e.message})`)
    }
    profiles.push({ person, sections })
  }

  console.log('\n--- Rezumat date de baza per profil ---')
  for (const { person, sections } of profiles) {
    console.log(`${person.name}: arhetip="${sections.archetype?.name}"`)
  }

  console.log('\n--- Verificare 1: tipare Barnum interzise (regex) ---')
  let barnumHits = 0
  for (const { person, sections } of profiles) {
    const allText = JSON.stringify(sections)
    for (const re of BARNUM_TELLS) {
      if (re.test(allText)) {
        console.log(`  [FAIL] ${person.name}: gasit tipar interzis ${re}`)
        barnumHits++
      }
    }
  }
  if (barnumHits === 0) console.log('  [OK] Niciun tipar Barnum interzis gasit direct.')

  console.log('\n--- Verificare 1b: lexic interzis (Umbra, A/B, cifre brute, disconfort anatomic, personificare) ---')
  let lexiconHits = 0
  for (const { person, sections } of profiles) {
    const allText = JSON.stringify(sections)
    for (const [re, label] of LEXICON_TELLS) {
      const matches = allText.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))
      if (matches) {
        console.log(`  [FAIL] ${person.name}: ${label} — ${matches.length}x (${JSON.stringify(matches.slice(0,3))})`)
        lexiconHits += matches.length
      }
    }
  }
  if (lexiconHits === 0) console.log('  [OK] Niciun termen din lista neagra gasit.')

  console.log('\n--- Verificare 2: similaritate propozitii intre useri diferiti (Jaccard > 0.6) ---')
  const extracted = profiles.map(p => extractSections(p.sections))
  const sectionNames = Object.keys(extracted[0])
  let similarityHits = 0
  const THRESHOLD = 0.6

  for (const section of sectionNames) {
    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const sentA = extracted[i][section] || []
        const sentB = extracted[j][section] || []
        for (const a of sentA) {
          for (const b of sentB) {
            const sim = jaccard(a, b)
            if (sim > THRESHOLD) {
              similarityHits++
              console.log(`  [FAIL] sectiune "${section}" — ${profiles[i].person.name} vs ${profiles[j].person.name} (similaritate ${(sim*100).toFixed(0)}%)`)
              console.log(`         A: "${a}"`)
              console.log(`         B: "${b}"`)
            }
          }
        }
      }
    }
  }
  if (similarityHits === 0) console.log(`  [OK] Nicio pereche de propozitii peste pragul de ${THRESHOLD*100}% similaritate.`)

  console.log('\n--- Verificare 3: unghiul de deschidere (archetype.description) ---')
  for (const { person, sections } of profiles) {
    console.log(`  ${person.name}: "${(sections.archetype?.description || '').slice(0, 140)}..."`)
  }

  const totalIssues = barnumHits + lexiconHits + similarityHits
  console.log(`\n=== REZULTAT: ${totalIssues === 0 ? 'CURAT — promptul trece testul' : `${totalIssues} PROBLEME gasite — promptul NU trece inca`} ===\n`)

  fs.writeFileSync(
    path.join(ROOT, 'scripts', '_similarity-report.json'),
    JSON.stringify({ language, profiles: profiles.map(p => ({ person: p.person, sections: p.sections })), barnumHits, lexiconHits, similarityHits }, null, 2)
  )
  console.log('Raport complet salvat in scripts/_similarity-report.json\n')

  process.exit(totalIssues === 0 ? 0 : 1)
}

main().catch(err => {
  console.error('Eroare in testul de similitudine:', err)
  process.exit(2)
})
