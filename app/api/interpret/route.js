import { NextResponse } from 'next/server'
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

async function callClaude(prompt, language = 'en', maxTokens = 6000) {
  const languageName = LANGUAGE_NAMES[language] || 'English'
  const reinforcement = language === 'en'
    ? `\n\nFINAL REMINDER: Your entire response must be in English. No Spanish, no other languages. Every word must be English.`
    : `\n\nFINAL REMINDER: Your entire response must be in ${languageName}. No English words, no code-switching.`

  const params = {
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt + reinforcement }]
  }

  let message
  try {
    message = await anthropic.messages.create(params)
  } catch (err) {
    const status = err?.status
    if (status === 529 || (typeof status === 'number' && status >= 500 && status < 600)) {
      console.warn(`[interpret] Anthropic ${status}, retrying once after 2s...`)
      await new Promise(r => setTimeout(r, 2000))
      message = await anthropic.messages.create(params)
    } else {
      throw err
    }
  }

  const textBlock = message.content.find(block => block.type === 'text')
  if (!textBlock || !textBlock.text) throw new Error('No text response from Claude')

  const clean = textBlock.text.trim()
    .replace(/^```json\n?/i, '')
    .replace(/^```\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim()

  const wasTruncated = message.stop_reason === 'max_tokens'
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

export async function POST(request) {
  try {
    const body = await request.json()
    const { calculated_profile_id, full_name, calculated_data, user_id, language = 'en' } = body

    const profilePrompt = buildProfilePrompt(calculated_data, full_name, language)
    const sections = await callClaude(profilePrompt, language, 10000)

    const swot = {
      strengths: sections.strengths?.slice(0, 4) || [],
      weaknesses: sections.vulnerabilities?.slice(0, 4) || [],
      opportunities: sections.opportunities || [],
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
        prompt_version: 'v3',
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
    if (err instanceof TruncationError) {
      console.error('Interpret truncation:', err.message)
      return NextResponse.json(
        { error: 'Profile generation was too long, please try again' },
        { status: 502 }
      )
    }
    console.error('Interpret error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
