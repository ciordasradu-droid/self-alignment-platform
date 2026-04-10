export const maxDuration = 60
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'
import {
  buildProfilePrompt,
  buildSWOTPrompt,
  buildAlignmentPlanPrompt,
  buildActionPlanPrompt
} from '../../../lib/prompts/profile'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const LANGUAGE_NAMES = {
  en: 'English',
  ro: 'Romanian',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
  pl: 'Polish',
  hu: 'Hungarian'
}

async function callClaude(prompt, language = 'en', maxTokens = 1500) {
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
  if (!textBlock || !textBlock.text) {
    throw new Error('No text response from Claude')
  }
  const clean = textBlock.text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { calculated_profile_id, full_name, calculated_data, user_id, language = 'en' } = body

    // Step 1 — main profile sections
    const profilePrompt = buildProfilePrompt(calculated_data, full_name)
    const sections = await callClaude(profilePrompt, language, 1500)

    // Step 2 — self perspective (SWOT)
    const swotPrompt = buildSWOTPrompt(calculated_data, sections)
    const swot = await callClaude(swotPrompt, language, 1000)

    // Step 3 — alignment plan
    const planPrompt = buildAlignmentPlanPrompt(calculated_data, sections, swot)
    const alignmentPlan = await callClaude(planPrompt, language, 1500)

    // Step 4 — personalized action plan (Task 3)
    const actionPlanPrompt = buildActionPlanPrompt(calculated_data, sections)
    const actionPlanRaw = await callClaude(actionPlanPrompt, language, 1500)
    const actionPlan = actionPlanRaw.practices || []

    // Persist everything
    const { data, error } = await supabase
      .from('interpreted_profiles')
      .insert([{
        calculated_profile_id: calculated_profile_id || null,
        user_id: user_id || null,
        sections,
        swot,
        alignment_plan: alignmentPlan,
        action_plan: actionPlan,
        prompt_version: 'v2',
        language
      }])
      .select()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      interpreted_profile_id: data[0].id,
      sections,
      swot,
      alignment_plan: alignmentPlan,
      action_plan: actionPlan
    })
  } catch (err) {
    console.error('Interpret error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
