import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { checkRateLimit } from '../../../lib/rateLimit'
import { calculatePersonalDayMonth } from '../../../lib/calculations/numerology'
import { VOICE_RULES } from '../../../lib/prompts/profile'
import { getDailyThoughtAngle } from '../../../lib/dailyThoughts'
import { getTrialStatus } from '../../../lib/trial'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French', de: 'German',
  it: 'Italian', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish', hu: 'Hungarian', ru: 'Russian'
}

// Gândul Zilei, conectat la calculul real (secț. 5, bloc 3): zi/lună/an
// personal + porțile HD + ziua săptămânii — nu doar tipul HD, ca înainte.
export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const user_id = user.id

    const rl = await checkRateLimit(user_id, 'daily-insight', { limit: 20, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } })
    }

    const body = await request.json()
    const { profile, personal_year, language = 'en' } = body
    if (!profile?.date_of_birth) return NextResponse.json({ error: 'missing profile' }, { status: 400 })

    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabaseAdmin
      .from('daily_insights')
      .select('*')
      .eq('user_id', user_id)
      .eq('date', today)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, insight: existing.insight })
    }

    // A6 — gandul zilei PERSONALIZAT se opreste la expirarea probei (fara
    // abonament). Clientul are deja fallback-ul static; nu mai chemam Claude.
    const { subscribed, trialEnded } = await getTrialStatus(supabaseAdmin, user_id)
    if (trialEnded && !subscribed) {
      return NextResponse.json({ success: true, insight: null, subscribe_required: true })
    }

    const { personal_day, personal_month } = calculatePersonalDayMonth(profile.date_of_birth, language)
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    const languageName = LANGUAGE_NAMES[language] || 'English'
    const angle = getDailyThoughtAngle()
    const ANGLE_BRIEF = {
      energy: 'their energy today — when it is highest, what would drain it, what would feed it',
      decisions: 'a decision or choice quality today — how they decide well, what to trust',
      relationships: 'how they show up with other people today — connection, boundaries, communication',
      rhythm: 'the shape/pace of their day today — starting, pausing, closing, the tempo that fits them',
    }

    // porțile-cheie — doar Soare (personalitate + design), ca temei tematic;
    // fără jargon de mecanism în prompt (TERM_POLICY se aplică și aici).
    const ag = profile.hd_data?.active_gates
    const gates = []
    if (ag?.personality?.sun) gates.push(`Personality Sun: Gate ${ag.personality.sun.gate}`)
    if (ag?.design?.sun) gates.push(`Design Sun: Gate ${ag.design.sun.gate}`)

    const prompt = `${VOICE_RULES}

Generate today's "Daily Thought" for this person — a tiny reflection grounded in real, specific data about their day, not generic inspiration.

TODAY'S ANGLE (this is the lens for today — stay inside it, do not drift into a different angle): ${ANGLE_BRIEF[angle]}

THEIR DATA:
- Human Design Type: ${profile.hd_data?.type || 'Generator'}
- Human Design Strategy: ${profile.hd_data?.strategy_plain || ''}
- Personal Year: ${personal_year?.personal_year || ''} — ${personal_year?.theme || ''}
- Personal Month (numerology, reduced): ${personal_month}
- Personal Day (numerology, reduced): ${personal_day}
- Day of week: ${dayOfWeek}
${gates.length ? '- Key gates (thematic anchor, never name as "gate" to the user): ' + gates.join(' | ') : ''}

FORMAT (A9 — closed decision, do not deviate):
- MAXIMUM 2 sentences of body, plus exactly 1 question. Nothing more. The whole thing should be readable, and the question answerable in your head, in about 5 seconds.
- NO title. NO section heading of any kind.
- FORBIDDEN inside the text: any system terminology — "gate", "channel", "Life Path", "house", "personal day/month/year" said as a label, or any translation of these words. Translate everything into the lived, concrete day instead (e.g. "today finishing something matters more than starting something new" — not "your Personal Day 4 means...").
- FORBIDDEN: breathing instructions ("take a deep breath", "breathe in"), and any variant of "reflect on this" / "think about this" as filler — the question itself IS the reflection, it doesn't need to be introduced.
- The anchor must come FROM the profile data above, translated into something concrete about THIS actual day — not a generic thought that could apply to anyone.
- Never predict the future. Never tell them what to do — help them notice.
- Plain language, ${languageName} only.

Return ONLY a JSON object, no markdown, no code fences:
{ "body": "max 2 sentences, no title, grounded in today's angle and their real data", "question": "1 short question, answerable mentally in about 5 seconds" }`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].text.replace(/```json|```/g, '').trim()
    const insight = { ...JSON.parse(text), angle }

    await supabaseAdmin
      .from('daily_insights')
      .insert([{ user_id, date: today, insight, language }])

    return NextResponse.json({ success: true, insight })

  } catch (err) {
    console.error('Daily insight error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
