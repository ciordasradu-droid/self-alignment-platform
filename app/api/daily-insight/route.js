import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, profile, personal_year } = body

    const today = new Date().toISOString().split('T')[0]

    // Check if insight already generated today
    const { data: existing } = await supabase
      .from('daily_insights')
      .select('*')
      .eq('user_id', user_id)
      .eq('date', today)
      .single()

    if (existing) {
      return NextResponse.json({ success: true, insight: existing.insight })
    }

    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' })

    const prompt = `You are a warm, honest personal alignment guide.

Generate a short daily insight for this person based on their profile.

THEIR PROFILE:
- Human Design Type: ${profile.human_design_type || 'Generator'}
- Human Design Strategy: ${profile.human_design_strategy || 'Wait to respond'}
- Life Path Number: ${profile.life_path || '1'}
- Core Blueprint: ${profile.blueprint || ''}
- Biggest Sabotage Pattern: ${profile.sabotage || ''}
- Personal Year: ${personal_year?.personal_year || '1'} — ${personal_year?.theme || ''}
- Personal Year Focus: ${personal_year?.focus || ''}
- Day of Week: ${dayOfWeek}

RULES:
- 3-4 sentences maximum
- Warm, direct, honest tone
- Reference their specific type and personal year naturally
- End with one short powerful question that invites self-reflection
- Never predict the future
- Never tell them what to do — help them think
- Plain language — no jargon

Return ONLY a JSON object, no markdown:
{
  "title": "short title for today's insight (5 words max)",
  "body": "3-4 sentence insight",
  "question": "one powerful self-reflection question"
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].text.replace(/```json|```/g, '').trim()
    const insight = JSON.parse(text)

    // Save to database
    await supabase
      .from('daily_insights')
      .insert([{
        user_id,
        date: today,
        insight
      }])

    return NextResponse.json({ success: true, insight })

  } catch (err) {
    console.error('Daily insight error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}