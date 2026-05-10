import { NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'
import { buildAlignmentPlanPrompt, buildActionPlanPrompt } from '../../../lib/prompts/profile'
import { jsonrepair } from 'jsonrepair'

// Two sequential Claude calls. 300s on Pro plan.
export const maxDuration = 300

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian'
}

async function callClaude(prompt, language = 'en', maxTokens = 4000) {
  const languageName = LANGUAGE_NAMES[language] || 'English'
  const languageInstruction = language !== 'en'
    ? `\n\nIMPORTANT: Write your entire response in ${languageName}. All text, labels, and content must be in ${languageName}. No English words, no code-switching.`
    : ''

  const params = {
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt + languageInstruction }],
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
      console.warn(`[interpret-plan] Anthropic ${status}, retrying once after 2s...`)
      await new Promise(r => setTimeout(r, 2000))
      result = await streamAndCollect()
    } else {
      throw err
    }
  }

  const { fullText, stopReason } = result
  if (!fullText) throw new Error('No text response from Claude')

  if (stopReason === 'max_tokens') {
    console.warn(`[interpret-plan] Claude hit max_tokens (${maxTokens}) — output may be truncated.`)
  }

  const clean = fullText.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  return JSON.parse(jsonrepair(clean))
}

// POST: kick off plan generation in the background via after(), return immediately.
// Client polls GET ?id=... to discover when alignment_plan is populated.
export async function POST(request) {
  try {
    const body = await request.json()
    const { interpreted_profile_id, calculated_data, sections, swot, language = 'en' } = body

    if (!interpreted_profile_id) {
      return NextResponse.json({ error: 'interpreted_profile_id required' }, { status: 400 })
    }

    after(async () => {
      try {
        const planPrompt = buildAlignmentPlanPrompt(calculated_data, sections, swot)
        const alignmentPlan = await callClaude(planPrompt, language, 4000)

        let actionPlan = []
        try {
          const actionPlanPrompt = buildActionPlanPrompt(calculated_data, sections)
          const actionPlanRaw = await callClaude(actionPlanPrompt, language, 3000)
          actionPlan = actionPlanRaw.practices || []
        } catch (e) {
          console.error('Action plan failed (non-fatal):', e.message)
        }

        await supabase
          .from('interpreted_profiles')
          .update({ alignment_plan: alignmentPlan, action_plan: actionPlan })
          .eq('id', interpreted_profile_id)
      } catch (err) {
        console.error('[interpret-plan] background error:', err.message)
        // Sentinel: GET treats alignment_plan.__error__ as a failed run
        await supabase
          .from('interpreted_profiles')
          .update({ alignment_plan: { __error__: err.message || 'Unknown error' }, action_plan: [] })
          .eq('id', interpreted_profile_id)
      }
    })

    return NextResponse.json({ success: true, interpreted_profile_id })
  } catch (err) {
    console.error('Interpret-plan POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET: poll endpoint. Returns { status: 'pending' | 'complete' | 'failed' }
// plus alignment_plan/action_plan when complete.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { data, error } = await supabase
      .from('interpreted_profiles')
      .select('alignment_plan, action_plan')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })

    if (!data.alignment_plan) {
      return NextResponse.json({ status: 'pending' })
    }
    if (data.alignment_plan.__error__) {
      return NextResponse.json({ status: 'failed', error: data.alignment_plan.__error__ })
    }
    return NextResponse.json({
      status: 'complete',
      success: true,
      alignment_plan: data.alignment_plan,
      action_plan: data.action_plan || []
    })
  } catch (err) {
    console.error('Interpret-plan GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
