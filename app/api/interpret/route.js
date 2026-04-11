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
  const raw = textBlock.text.trim()
  // Strip markdown code fences if present
  const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
  try {
    return JSON.parse(clean)
  } catch (e) {
    console.error('JSON parse failed. Raw response:', raw.slice(0, 500))
    throw new Error(`JSON parse failed: ${e.message}. Response started with: ${raw.slice(0, 100)}`)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { calculated_profile_id, full_name, calculated_data, user_id, language = 'en' } = body

    let sections, swot, alignmentPlan, actionPlan

    try {
      const profilePrompt = buildProfilePrompt(calculated_data, full_name)
      sections = await callClaude(profilePrompt, language, 2500)
    } catch (e) {
      console.error('Step 1 (profile) failed:', e.message)
      return NextResponse.json({ error: 'Profile generation failed: ' + e.message }, { status: 500 })
    }

    try {
      const swotPrompt = buildSWOTPrompt(calculated_data, sections)
      swot = await callClaude(swotPrompt, language, 2000)
    } catch (e) {
      console.error('Step 2 (swot) failed:', e.message)
      return NextResponse.json({ error: 'Self perspective failed: ' + e.message }, { status: 500 })
    }

    try {
      const planPrompt = buildAlignmentPlanPrompt(calculated_data, sections, swot)
      alignmentPlan = await callClaude(planPrompt, language, 2000)
    } catch (e) {
      console.error('Step 3 (alignment plan) failed:', e.message)
      return NextResponse.json({ error: 'Alignment plan failed: ' + e.message }, { status: 500 })
    }

    try {
      const actionPlanPrompt = buildActionPlanPrompt(calculated_data, sections)
      const actionPlanRaw = await callClaude(actionPlanPrompt, language, 2000)
      actionPlan = actionPlanRaw.practices || []
    } catch (e) {
      console.error('Step 4 (action plan) failed:', e.message)
      actionPlan = [] // non-fatal — profile still saves without action plan
    }

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
      console.error('Supabase error:', error)
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