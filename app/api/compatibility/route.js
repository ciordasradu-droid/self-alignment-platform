// Destinație: app/api/compatibility/route.js  (FIȘIER NOU — folder nou app/api/compatibility/)
// POST: calculează ambele persoane, inserează rând pending, generează în fundal, întoarce id.
// GET ?id=...: polling status (pending/complete/failed).
// Refolosește exact tiparul din interpret/route.js.

import { NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { buildCompatibilityPrompt } from '../../../lib/prompts/compatibility'
import { calculateFullProfile } from '../../../lib/calculations/index'
import { jsonrepair } from 'jsonrepair'

export const maxDuration = 300

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian', ru: 'Russian'
}

async function callClaude(prompt, language = 'en', maxTokens = 8000) {
  const languageName = LANGUAGE_NAMES[language] || 'English'
  const reinforcement = `\n\nFINAL REMINDER: entire response in ${languageName}. No code-switching.`
  const params = {
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt + reinforcement }],
    stream: true
  }
  const stream = await anthropic.messages.create(params)
  let fullText = ''
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      fullText += event.delta.text
    }
  }
  if (!fullText) throw new Error('No text response from Claude')
  const clean = fullText.trim().replace(/^```json\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim()
  return JSON.parse(jsonrepair(clean))
}

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await request.json()
    const { type = 'life', language = 'en', personA, personB } = body

    if (!personA || !personB) {
      return NextResponse.json({ error: 'both persons required' }, { status: 400 })
    }

    // calculează ambele hărți
    const dataA = calculateFullProfile(personA.full_name, personA.date_of_birth, personA.time_of_birth, personA.lat, personA.lng, language)
    const dataB = calculateFullProfile(personB.full_name, personB.date_of_birth, personB.time_of_birth, personB.lat, personB.lng, language)

    const { data: row, error: insertErr } = await supabaseAdmin
      .from('compatibility_profiles')
      .insert([{
        user_id: user.id,
        type,
        language,
        name_a: personA.full_name,
        name_b: personB.full_name,
        sections: null
      }])
      .select()
      .single()

    if (insertErr) {
      console.error('Compatibility insert error:', insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    const compatId = row.id

    after(async () => {
      try {
        const prompt = buildCompatibilityPrompt(dataA, dataB, personA.full_name, personB.full_name, type, language)
        const sections = await callClaude(prompt, language, 8000)
        await supabaseAdmin.from('compatibility_profiles').update({ sections }).eq('id', compatId)
      } catch (err) {
        console.error('[compatibility] background error:', err.message)
        await supabaseAdmin.from('compatibility_profiles').update({ sections: { __error__: err.message } }).eq('id', compatId)
      }
    })

    return NextResponse.json({ success: true, compatibility_id: compatId })
  } catch (err) {
    console.error('Compatibility POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('compatibility_profiles')
      .select('id, type, language, name_a, name_b, sections')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    if (!data.sections) return NextResponse.json({ status: 'pending' })
    if (data.sections.__error__) return NextResponse.json({ status: 'failed', error: data.sections.__error__ })

    return NextResponse.json({
      status: 'complete',
      success: true,
      compatibility_id: data.id,
      type: data.type,
      language: data.language,
      name_a: data.name_a,
      name_b: data.name_b,
      sections: data.sections
    })
  } catch (err) {
    console.error('Compatibility GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}