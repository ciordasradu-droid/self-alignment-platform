import { NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'
import { buildProfilePrompt } from '../../../lib/prompts/profile'
import { jsonrepair } from 'jsonrepair'

export const maxDuration = 300

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian'
}

class TruncationError extends Error {
  constructor() {
    super('Profile generation was too long, please try again')
    this.name = 'TruncationError'
  }
}

async function callClaude(prompt, language = 'en', maxTokens = 16000) {
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
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        fullText += event.delta.text
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
    const body = await request.json()
    const { calculated_profile_id, full_name, calculated_data, user_id, language = 'en' } = body

    const { data: row, error: insertErr } = await supabase
      .from('interpreted_profiles')
      .insert([{
        calculated_profile_id: calculated_profile_id || null,
        user_id: user_id || null,
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
        const sections = await callClaude(profilePrompt, language, 10000)

        const swot = {
          strengths: sections.strengths?.slice(0, 4) || [],
          weaknesses: sections.vulnerabilities?.slice(0, 4) || [],
          opportunities: sections.opportunities || [],
          threats: sections.warning_signals?.slice(0, 4).map(w => typeof w === 'object' ? w.signal : w) || []
        }

        await supabase
          .from('interpreted_profiles')
          .update({ sections, swot })
          .eq('id', interpretedProfileId)
      } catch (err) {
        const message = err instanceof TruncationError
          ? 'Profile generation was too long, please try again'
          : (err?.message || 'Unknown error')
        console.error('[interpret] background error:', message)
        // Sentinel: GET treats sections.__error__ as a failed run
        await supabase
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

    const { data, error } = await supabase
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

