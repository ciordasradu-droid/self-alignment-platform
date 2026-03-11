import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'

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

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, profile, personal_year, last_week_score, language = 'en' } = body

    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1)
    const weekKey = weekStart.toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('weekly_resets')
      .select('*')
      .eq('user_id', user_id)
      .eq('week_start', weekKey)
      .single()

    if (existing) {
      return NextResponse.json({ success: true, reset: existing.reset })
    }

    const languageName = LANGUAGE_NAMES[language] || 'English'
    const languageInstruction = language !== 'en'
      ? `\n\nIMPORTANT: Write your entire response in ${languageName}.`
      : ''

    const prompt = `You are a warm, honest personal alignment guide.

Generate a weekly reset message for this person for the week ahead.

THEIR PROFILE:
- Human Design Type: ${profile.human_design_type || 'Generator'}
- Human Design Strategy: ${profile.human_design_strategy || 'Wait to respond'}
- Life Path Number: ${profile.life_path || '1'}
- Core Blueprint: ${profile.blueprint || ''}
- Biggest Sabotage Pattern: ${profile.sabotage || ''}
- Personal Year: ${personal_year?.personal_year || '1'} — ${personal_year?.theme || ''}
- Personal Year Warning: ${personal_year?.warning || ''}
- Last Week Alignment Score: ${last_week_score || 'unknown'}

RULES:
- Warm, direct, honest tone
- Reference their specific type and personal year naturally
- Acknowledge last week briefly — celebrate if good, encourage if low
- Set a clear intention for this week aligned with their personal year
- Give one specific behavioral focus for the week
- End with one powerful question
- Plain language — no jargon
- Never predict, never tell them what to do

Return ONLY a JSON object, no markdown:
{
  "title": "weekly reset title (5 words max)",
  "reflection": "1-2 sentences acknowledging last week",
  "intention": "1-2 sentences setting the frame for this week",
  "focus": "one specific behavioral focus for the week",
  "question": "one powerful question to carry through the week"
}${languageInstruction}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].text.replace(/```json|```/g, '').trim()
    const reset = JSON.parse(text)

    await supabase
      .from('weekly_resets')
      .insert([{ user_id, week_start: weekKey, reset, language }])

    return NextResponse.json({ success: true, reset })

  } catch (err) {
    console.error('Weekly reset error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}