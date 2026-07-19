import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { calculatePersonalDayMonth } from '../../../lib/calculations/numerology'
import { VOICE_RULES } from '../../../lib/prompts/profile'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French', de: 'German',
  it: 'Italian', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish', hu: 'Hungarian'
}

// Gândul Zilei, conectat la calculul real (secț. 5, bloc 3): zi/lună/an
// personal + porțile HD + ziua săptămânii — nu doar tipul HD, ca înainte.
export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const user_id = user.id

    const body = await request.json()
    const { profile, personal_year, format = 'full', language = 'en' } = body
    if (!profile?.date_of_birth) return NextResponse.json({ error: 'missing profile' }, { status: 400 })

    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabaseAdmin
      .from('daily_insights')
      .select('*')
      .eq('user_id', user_id)
      .eq('date', today)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, insight: existing.insight, format: existing.insight?.format || 'full' })
    }

    const { personal_day, personal_month } = calculatePersonalDayMonth(profile.date_of_birth, language)
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    const languageName = LANGUAGE_NAMES[language] || 'English'

    // porțile-cheie — doar Soare (personalitate + design), ca temei tematic;
    // fără jargon de mecanism în prompt (TERM_POLICY se aplică și aici).
    const ag = profile.hd_data?.active_gates
    const gates = []
    if (ag?.personality?.sun) gates.push(`Personality Sun: Gate ${ag.personality.sun.gate}`)
    if (ag?.design?.sun) gates.push(`Design Sun: Gate ${ag.design.sun.gate}`)

    const schema = format === 'quick'
      ? `{ "question": "one grounded, concrete question or observation for today, tied to the reasoning below (1 sentence)" }`
      : `{ "title": "short title for today's thought (5 words max)", "body": "2-3 sentence observation", "question": "one grounding line: why this, today, for this person — reference the personal day/gate/weekday naturally, never as raw jargon" }`

    const prompt = `${VOICE_RULES}

Generate today's "Daily Thought" for this person — a short reflection grounded in real, specific data about their day, not generic inspiration.

THEIR DATA:
- Human Design Type: ${profile.hd_data?.type || 'Generator'}
- Human Design Strategy: ${profile.hd_data?.strategy_plain || ''}
- Personal Year: ${personal_year?.personal_year || ''} — ${personal_year?.theme || ''}
- Personal Month (numerology, reduced): ${personal_month}
- Personal Day (numerology, reduced): ${personal_day}
- Day of week: ${dayOfWeek}
${gates.length ? '- Key gates (thematic anchor, never name as "gate" to the user): ' + gates.join(' | ') : ''}

RULES:
- Ground the thought in the SPECIFIC combination above (which day of the week, which personal day number, their HD strategy) — make it feel calculated for today, not generic.
- Never mention "personal day/month" or "gate" as jargon — translate into lived experience.
- Never predict the future. Never tell them what to do — help them notice.
- Plain language, ${languageName} only.

Return ONLY a JSON object, no markdown, no code fences:
${schema}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].text.replace(/```json|```/g, '').trim()
    const insight = { ...JSON.parse(text), format }

    await supabaseAdmin
      .from('daily_insights')
      .insert([{ user_id, date: today, insight, language }])

    return NextResponse.json({ success: true, insight, format })

  } catch (err) {
    console.error('Daily insight error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
