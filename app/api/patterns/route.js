export const maxDuration = 60

// TIPARE — sinteza reala din texte (secț. 5/7, z14). Fara scor, fara profil
// de "umbra": doar jurnal/recunostinta/intentii/somn, citite din checkins
// (rituale), sintetizate printr-un prompt liber cu Regula de Voce. Arata
// si ce merge (nu doar ce revine) — trei categorii, dar niciuna nu e
// diagnostic clinic.

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { VOICE_RULES } from '../../../lib/prompts/profile'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian', ru: 'Russian'
}

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const user_id = user.id

    const body = await request.json()
    const { language = 'en' } = body

    const { data: checkins, error: checkinError } = await supabaseAdmin
      .from('checkins')
      .select('created_at, answers')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(60)

    if (checkinError) throw checkinError

    // Extragem DOAR textul — jurnal, recunostinta, intentii, somn. Nimic
    // numeric, niciun scor. Fiecare intrare cu text real devine o linie.
    const entries = []
    for (const c of (checkins || [])) {
      const date = c.created_at?.split('T')[0]
      const a = c.answers || {}
      if (a.kind === 'evening') {
        if (a.evening_journal) entries.push({ date, field: 'jurnal', text: a.evening_journal })
        if (a.gratitude) entries.push({ date, field: 'recunostinta', text: a.gratitude })
        if (a.intention) entries.push({ date, field: 'intentie (pentru maine)', text: a.intention })
      } else if (a.kind === 'morning') {
        if (a.sleep) entries.push({ date, field: 'somn', text: a.sleep })
        if (a.intention) entries.push({ date, field: 'intentie (continuata)', text: a.intention })
      }
    }

    // Nevoie de suficient text real, nu doar zile trecute — sub acest prag
    // sinteza ar inventa tipare din nimic.
    if (entries.length < 10) {
      return NextResponse.json({ insufficient: true })
    }

    // Profilul — schema reala: interpreted_profiles.sections +
    // calculated_profiles.calculated_data (nu "profile", coloana veche).
    const { data: interpreted } = await supabaseAdmin
      .from('interpreted_profiles')
      .select('sections, calculated_profile_id')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let hdType = 'Generator'
    if (interpreted?.calculated_profile_id) {
      const { data: calc } = await supabaseAdmin
        .from('calculated_profiles')
        .select('calculated_data')
        .eq('id', interpreted.calculated_profile_id)
        .maybeSingle()
      hdType = calc?.calculated_data?.human_design?.type || hdType
    }

    const languageName = LANGUAGE_NAMES[language] || 'English'
    const textCorpus = entries
      .map(e => `[${e.date} · ${e.field}] ${e.text}`)
      .join('\n')

    const prompt = `${VOICE_RULES}

You are reading someone's real journal entries, gratitude notes, intentions, and sleep notes from the last weeks — written by them, in their own words. Find what is actually emerging across these entries. This is reflection, not diagnosis: never produce a psychological profile, never label a "shadow side", never diagnose a condition.

PERSON'S HUMAN DESIGN TYPE (context only, don't lecture about it): ${hdType}

THEIR WRITTEN ENTRIES (chronological, most recent first):
${textCorpus}

WHAT TO LOOK FOR:
- "strength" — something that is genuinely working, visible across multiple entries (not flattery — a real, specific pattern of what's going well)
- "watch" — something that keeps recurring and might be worth their attention (a gentle observation, never framed as a flaw or diagnosis)
- "invitation" — one reflective question or gentle nudge that follows naturally from what they've written

RULES:
- Quote or closely paraphrase their own words when it strengthens the observation — this must feel like THEY wrote it, reflected back, not like a report about them.
- 2-3 sentences per insight, no more.
- Never predict the future. Never tell them what to do — help them see what's already there.
- Plain language, ${languageName} only.

Return ONLY a JSON object, no markdown, no code fences:
{
  "strength": { "title": "short title (5 words max)", "body": "2-3 sentences" },
  "watch": { "title": "short title (5 words max)", "body": "2-3 sentences" },
  "invitation": { "title": "short title (5 words max)", "body": "2-3 sentences" }
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].text.replace(/```json|```/g, '').trim()
    const patterns = JSON.parse(text)

    await supabaseAdmin
      .from('patterns_insights')
      .upsert([{
        user_id,
        patterns,
        checkin_count: entries.length,
        language,
        created_at: new Date().toISOString()
      }], { onConflict: 'user_id' })
      .then(() => {}, () => {}) // nu esueaza daca tabela lipseste

    return NextResponse.json({ success: true, patterns })

  } catch (err) {
    console.error('Patterns error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
