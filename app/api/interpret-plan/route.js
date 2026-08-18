// Destinație: app/api/interpret-plan/route.js  (ÎNLOCUIEȘTE COMPLET)
// Schimbare: adăugat handler GET pentru polling (până acum exista doar POST,
// deci clientul nu putea afla niciodată când planul e gata).
// POST rămâne identic.

import { NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { checkRateLimit } from '../../../lib/rateLimit'
import { buildAlignmentPlanPrompt, buildActionPlanPrompt } from '../../../lib/prompts/profile'
import { jsonrepair } from 'jsonrepair'

// Two sequential Claude calls. 300s on Pro plan.
export const maxDuration = 300

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian', ru: 'Russian'
}

async function callClaude(prompt, language = 'en', maxTokens = 4000) {
  const languageName = LANGUAGE_NAMES[language] || 'English'
  const languageInstruction = language !== 'en'
    ? `\n\nIMPORTANT: Write your entire response in ${languageName}. All text, labels, and content must be in ${languageName}. No English words, no code-switching.`
    : ''
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt + languageInstruction }]
  })

  if (message.stop_reason === 'max_tokens') {
    console.warn(`[interpret-plan] Claude hit max_tokens (${maxTokens}) — output may be truncated.`)
  }

  const textBlock = message.content.find(block => block.type === 'text')
  if (!textBlock || !textBlock.text) throw new Error('No text response from Claude')
  const clean = textBlock.text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  return JSON.parse(jsonrepair(clean))
}

// GET — polling de status: ?id=<interpreted_profile_id>
// Returnează 'complete' + planul când există în DB, altfel 'pending'.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('interpreted_profiles')
      .select('alignment_plan, action_plan')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ status: 'failed', error: 'profile not found' })
    }

    // Sentinel de eroare (GCAO 06.08.2026) — vezi POST: scris cand generarea
    // pica in fundal, ca pollingul sa nu astepte degeaba 4 minute pana la
    // propriul lui timeout pentru ceva ce a esuat deja.
    if (data.alignment_plan && data.alignment_plan.__failed__) {
      return NextResponse.json({ status: 'failed', error: data.alignment_plan.error || 'unknown error' })
    }

    if (data.alignment_plan) {
      return NextResponse.json({
        status: 'complete',
        alignment_plan: data.alignment_plan,
        action_plan: data.action_plan || []
      })
    }

    return NextResponse.json({ status: 'pending' })
  } catch (err) {
    console.error('Interpret-plan GET error:', err.message)
    return NextResponse.json({ status: 'failed', error: err.message })
  }
}

// GCAO 06.08.2026 — reparatie P0 (generare blocata): POST facea generarea
// DIRECT in handler, tinuta in viata doar de conexiunea clientului. Clientul
// (generating/page.js) foloseste un AbortController de 30s pe acest POST
// PE FATA — "abandonam POST-ul, pollingul prinde rezultatul cand serverul
// termina" — dar Vercel poate lega ciclul de viata al functiei de conexiunea
// abandonata, omorand generarea la mijloc daca nu e explicit detasata.
// /api/interpret (etapa anterioara) foloseste deja after() pentru exact
// acest motiv; interpret-plan nu-l folosea, desi clientul se baza deja pe
// acelasi model "raspunde imediat, munca reala continua in fundal".
export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const rl = await checkRateLimit(user.id, 'interpret-plan', { limit: 5, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } })
    }

    const body = await request.json()
    const { interpreted_profile_id, calculated_data, sections, swot, language = 'en' } = body

    after(async () => {
      const __t0 = Date.now()
      try {
        // Runda 2, punctul 2: alignment plan si action plan nu depind unul
        // de celalalt (ambele pornesc doar din sections+calculated_data) —
        // rulate secvential adaugau ~25-40s degeaba la timpul total.
        const planPrompt = buildAlignmentPlanPrompt(calculated_data, sections, swot, language)
        const actionPlanPrompt = buildActionPlanPrompt(calculated_data, sections, language)

        const [alignmentPlan, actionPlan] = await Promise.all([
          callClaude(planPrompt, language, 4000),
          callClaude(actionPlanPrompt, language, 3000)
            .then(raw => raw.practices || [])
            .catch(e => {
              console.error('Action plan failed (non-fatal):', e.message)
              return []
            })
        ])
        console.log(`[TIMING] interpret-plan (parallel) done at +${Date.now() - __t0}ms`)

        await supabaseAdmin
          .from('interpreted_profiles')
          .update({ alignment_plan: alignmentPlan, action_plan: actionPlan })
          .eq('id', interpreted_profile_id)
      } catch (err) {
        console.error('[interpret-plan] background error:', err.message)
        // Sentinel de eroare — vezi GET mai sus.
        await supabaseAdmin
          .from('interpreted_profiles')
          .update({ alignment_plan: { __failed__: true, error: err.message || 'unknown error' } })
          .eq('id', interpreted_profile_id)
      }
    })

    return NextResponse.json({ success: true, started: true })
  } catch (err) {
    console.error('Interpret-plan error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}