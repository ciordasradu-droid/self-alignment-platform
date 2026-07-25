import { NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { checkRateLimit } from '../../../lib/rateLimit'
import { buildProfilePrompt, buildProofreadPrompt } from '../../../lib/prompts/profile'
import { findFailingSections } from '../../../lib/lexiconGate'
import { jsonrepair } from 'jsonrepair'

export const maxDuration = 300

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian', ru: 'Russian'
}

class TruncationError extends Error {
  constructor() {
    super('Profile generation was too long, please try again')
    this.name = 'TruncationError'
  }
}

// B2 (25.07): reveal chapters as they arrive instead of only after the full
// JSON is done. Best-effort — during streaming we periodically try to repair
// + parse whatever text has arrived so far; when a NEW top-level key becomes
// readable that wasn't in the previous partial parse, we hand it to onPartial.
// Never throws: a failed partial-parse attempt is silently skipped, the next
// chunk tries again. Does not affect the final, authoritative parse below.
function tryPartialParse(text) {
  const clean = text.trim().replace(/^```json\n?/i, '').replace(/^```\n?/i, '')
  // Only attempt once we plausibly have at least one complete top-level key,
  // to avoid wasting cycles on obviously-incomplete JSON.
  if (!clean.includes('"') || clean.split('"').length < 5) return null
  try {
    return JSON.parse(jsonrepair(clean))
  } catch (e) {
    return null
  }
}

async function callClaude(prompt, language = 'en', maxTokens = 16000, onPartial = null) {
  const languageName = LANGUAGE_NAMES[language] || 'English'
  const reinforcement = language === 'en'
    ? `\n\nFINAL REMINDER: Your entire response must be in English. No Spanish, no other languages. Every word must be English.`
    : `\n\nFINAL REMINDER: Your entire response must be in ${languageName}. No English words, no code-switching.`

  const params = {
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt + reinforcement }],
    stream: true
  }

  async function streamAndCollect() {
    const stream = await anthropic.messages.create(params)
    let fullText = ''
    let stopReason = null
    let seenKeys = new Set()
    let lastPartialAt = 0
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        fullText += event.delta.text
        if (onPartial && fullText.length - lastPartialAt > 200) {
          lastPartialAt = fullText.length
          const partial = tryPartialParse(fullText)
          if (partial) {
            const newKeys = Object.keys(partial).filter(k => !seenKeys.has(k) && partial[k])
            if (newKeys.length > 0) {
              newKeys.forEach(k => seenKeys.add(k))
              onPartial(partial, newKeys)
            }
          }
        }
      } else if (event.type === 'message_delta' && event.delta?.stop_reason) {
        stopReason = event.delta.stop_reason
      }
    }
    return { fullText, stopReason }
  }

  let result
  try {
    result = await streamAndCollect()
  } catch (err) {
    const status = err?.status
    if (status === 529 || (typeof status === 'number' && status >= 500 && status < 600)) {
      console.warn(`[interpret] Anthropic ${status}, retrying once after 2s...`)
      await new Promise(r => setTimeout(r, 2000))
      result = await streamAndCollect()
    } else {
      throw err
    }
  }

  const { fullText, stopReason } = result
  if (!fullText) throw new Error('No text response from Claude')

  const clean = fullText.trim()
    .replace(/^```json\n?/i, '')
    .replace(/^```\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim()

  const wasTruncated = stopReason === 'max_tokens'
  if (wasTruncated) {
    console.warn('[interpret] Claude hit max_tokens - attempting jsonrepair recovery.')
  }

  try {
    return JSON.parse(jsonrepair(clean))
  } catch (parseErr) {
    if (wasTruncated) {
      console.error('[interpret] jsonrepair could not recover truncated output.')
      throw new TruncationError()
    }
    throw parseErr
  }
}

// POST: insert pending row, kick off Claude work in the background via after(),
// return the id immediately. The client polls GET ?id=... to discover completion.
// This avoids holding a long-lived browser→server connection that mobile networks drop.
export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const rl = await checkRateLimit(user.id, 'interpret', { limit: 5, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } })
    }

    const body = await request.json()
    const { calculated_profile_id, full_name, calculated_data, language = 'en' } = body

    const { data: row, error: insertErr } = await supabaseAdmin
      .from('interpreted_profiles')
      .insert([{
        calculated_profile_id: calculated_profile_id || null,
        user_id: user.id,
        sections: null,
        swot: null,
        alignment_plan: null,
        action_plan: null,
        prompt_version: 'v4',
        language
      }])
      .select()
      .single()

    if (insertErr) {
      console.error('Supabase insert error:', insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    const interpretedProfileId = row.id

    after(async () => {
      try {
        const profilePrompt = buildProfilePrompt(calculated_data, full_name, language)

        // B2 (25.07): reveal chapters as they arrive. Each time new top-level
        // keys parse successfully mid-stream, write them to the DB right away
        // (marked __partial__) so the client's existing poll picks them up —
        // no new transport, just earlier + more frequent writes to the same row.
        const onPartial = (partial, newKeys) => {
          supabaseAdmin
            .from('interpreted_profiles')
            .update({ sections: { ...partial, __partial__: true } })
            .eq('id', interpretedProfileId)
            .then(() => {}, () => {})
        }
        let sections = await callClaude(profilePrompt, language, 10000, onPartial)

        // B1 (25.07): la ce foloseste odata prima trecere sa fie curata (cazul
        // frecvent), a doua trecere completa dubla ~105s de asteptare degeaba.
        // Poarta lexicala ieftina (regex, zero apeluri de model) verifica FIECARE
        // sectiune separat — doar cele care pica intra in a doua trecere, si
        // DOAR ele se trimit la Claude (nu tot documentul). Pe un profil curat,
        // costul devine aproape zero.
        const { failing, clean } = findFailingSections(sections, language)
        if (!clean) {
          try {
            const proofreadPrompt = buildProofreadPrompt(JSON.stringify(failing), language)
            const corrected = await callClaude(proofreadPrompt, language, 4000)
            sections = { ...sections, ...corrected }
          } catch (proofErr) {
            console.error('[interpret] proofread pass failed on sections', Object.keys(failing), '- keeping originals:', proofErr.message)
          }
        }

        const swot = {
          strengths: sections.strengths?.slice(0, 4) || [],
          weaknesses: [],
          opportunities: [],
          threats: []
        }

        await supabaseAdmin
          .from('interpreted_profiles')
          .update({ sections, swot })
          .eq('id', interpretedProfileId)
      } catch (err) {
        const message = err instanceof TruncationError
          ? 'Profile generation was too long, please try again'
          : (err?.message || 'Unknown error')
        console.error('[interpret] background error:', message)
        // Sentinel: GET treats sections.__error__ as a failed run
        await supabaseAdmin
          .from('interpreted_profiles')
          .update({ sections: { __error__: message } })
          .eq('id', interpretedProfileId)
      }
    })

    return NextResponse.json({
      success: true,
      interpreted_profile_id: interpretedProfileId
    })
  } catch (err) {
    console.error('Interpret POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET: poll endpoint. Returns { status: 'pending' | 'complete' | 'failed' }
// plus sections/swot when complete or error message when failed.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('interpreted_profiles')
      .select('id, sections, swot')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })

    if (!data.sections) {
      return NextResponse.json({ status: 'pending' })
    }
    if (data.sections.__error__) {
      return NextResponse.json({ status: 'failed', error: data.sections.__error__ })
    }
    // B2 — mid-generation partial write: still pending, but chapters written
    // so far ride along so the client can reveal them while waiting.
    if (data.sections.__partial__) {
      const { __partial__, ...partialSections } = data.sections
      return NextResponse.json({ status: 'pending', partial_sections: partialSections })
    }
    return NextResponse.json({
      status: 'complete',
      success: true,
      interpreted_profile_id: data.id,
      sections: data.sections,
      swot: data.swot
    })
  } catch (err) {
    console.error('Interpret GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


