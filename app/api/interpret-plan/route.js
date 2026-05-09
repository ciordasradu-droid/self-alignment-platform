import { NextResponse } from 'next/server'
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

export async function POST(request) {
  try {
    const body = await request.json()
    const { interpreted_profile_id, calculated_data, sections, swot, language = 'en' } = body

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

    return NextResponse.json({ success: true, alignment_plan: alignmentPlan, action_plan: actionPlan })
  } catch (err) {
    console.error('Interpret-plan error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
