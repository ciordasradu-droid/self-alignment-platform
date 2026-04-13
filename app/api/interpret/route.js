export const maxDuration = 60
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'
import { buildProfilePrompt } from '../../../lib/prompts/profile'
import { jsonrepair } from 'jsonrepair'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian'
}

async function callClaudeStreaming(prompt, language = 'en', maxTokens = 5000) {
  const languageName = LANGUAGE_NAMES[language] || 'English'
  const languageInstruction = language !== 'en'
    ? `\n\nIMPORTANT: Write your entire response in ${languageName}. All text, labels, and content must be in ${languageName}.`
    : ''

  let fullText = ''
  const stream = await anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt + languageInstruction }]
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
      fullText += chunk.delta.text
    }
  }

  const clean = fullText.trim()
    .replace(/^```json\n?/i, '')
    .replace(/^```\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim()

  return JSON.parse(jsonrepair(clean))
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { calculated_profile_id, full_name, calculated_data, user_id, language = 'en' } = body

    const profilePrompt = buildProfilePrompt(calculated_data, full_name)
    const sections = await callClaudeStreaming(profilePrompt, language, 5000)

    const swot = {
      strengths: sections.strengths?.slice(0, 4) || [],
      weaknesses: sections.vulnerabilities?.slice(0, 4) || [],
      opportunities: [
        `Personal Year ${calculated_data.enriched?.numerology?.personal_year?.personal_year} of 9: ${calculated_data.enriched?.numerology?.personal_year?.theme}`,
        `${calculated_data.enriched?.human_design?.incarnation_cross}`,
        `Channel ${calculated_data.enriched?.human_design?.formed_channels?.[0] || 'activation'} — a consistent strength to build on`,
        `Expression ${calculated_data.enriched?.numerology?.expression} — ${calculated_data.enriched?.numerology?.expression_meaning}`
      ],
      threats: sections.sabotage_tendencies?.slice(0, 4) || []
    }

    const { data, error } = await supabase
      .from('interpreted_profiles')
      .insert([{
        calculated_profile_id: calculated_profile_id || null,
        user_id: user_id || null,
        sections,
        swot,
        alignment_plan: null,
        action_plan: null,
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
      swot
    })
  } catch (err) {
    console.error('Interpret error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}