export const maxDuration = 60
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'
import { buildAlignmentPlanPrompt, buildActionPlanPrompt } from '../../../lib/prompts/profile'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian'
}

async function callClaude(prompt, language = 'en', maxTokens = 2000) {
  const languageName = LANGUAGE_NAMES[language] || 'English'
  const languageInstruction = language !== 'en'
    ? `\n\nIMPORTANT: Write your entire response in ${languageName}. All text, labels, and content must be in ${languageName}.`
    : ''
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt + languageInstruction }]
  })
  const textBlock = message.content.find(block => block.type === 'text')
  if (!textBlock || !textBlock.text) throw new Error('No text response from Claude')
  const clean = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
  return JSON.parse(clean)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { interpreted_profile_id, calculated_data, sections, swot, language = 'en' } = body

    const planPrompt = buildAlignmentPlanPrompt(calculated_data, sections, swot)
    const alignmentPlan = await callClaude(planPrompt, language, 2000)

    let actionPlan = []
    try {
      const actionPlanPrompt = buildActionPlanPrompt(calculated_data, sections)
      const actionPlanRaw = await callClaude(actionPlanPrompt, language, 2000)
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