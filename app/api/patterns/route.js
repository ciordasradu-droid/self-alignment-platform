export const maxDuration = 60

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const LANGUAGE_NAMES = {
  en: 'English', ro: 'Romanian', es: 'Spanish', fr: 'French',
  de: 'German', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', hu: 'Hungarian'
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, language = 'en' } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    // Get last 30 check-ins
    const { data: checkins, error: checkinError } = await supabase
      .from('daily_checkins')
      .select('date, responses, alignment_score, questions')
      .eq('user_id', user_id)
      .order('date', { ascending: false })
      .limit(30)

    if (checkinError) throw checkinError

    // Also try the checkins table (dashboard API uses this)
    let allCheckins = checkins || []
    if (allCheckins.length === 0) {
      const { data: altCheckins } = await supabase
        .from('checkins')
        .select('created_at, score, answers')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(30)

      if (altCheckins && altCheckins.length > 0) {
        allCheckins = altCheckins.map(c => ({
          date: c.created_at?.split('T')[0],
          alignment_score: c.score,
          responses: c.answers,
          questions: null
        }))
      }
    }

    // Need at least 7 check-ins for meaningful patterns
    if (allCheckins.length < 7) {
      return NextResponse.json({ insufficient: true })
    }

    // Get user's profile for context
    const { data: profileData } = await supabase
      .from('interpreted_profiles')
      .select('profile')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const profile = profileData?.profile || {}
    const hdType = profile.human_design_type || 'Generator'
    const hdStrategy = profile.human_design_strategy || ''
    const languageName = LANGUAGE_NAMES[language] || 'English'

    // Build check-in summary for the prompt
    const checkinSummary = allCheckins.map(c => {
      const scores = c.responses ? Object.entries(c.responses).map(([k, v]) => `${k}:${v}`).join(', ') : ''
      return `${c.date} | Score: ${c.alignment_score || 'N/A'} | ${scores}`
    }).join('\n')

    // Calculate trends
    const scores = allCheckins
      .filter(c => c.alignment_score)
      .map(c => c.alignment_score)

    const recentAvg = scores.length >= 3
      ? Math.round(scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3)
      : null
    const olderAvg = scores.length >= 7
      ? Math.round(scores.slice(-4).reduce((a, b) => a + b, 0) / Math.min(4, scores.slice(-4).length))
      : null

    const trend = recentAvg && olderAvg
      ? recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable'
      : 'insufficient data'

    const languageInstruction = language !== 'en'
      ? `\n\nCRITICAL: Write your ENTIRE response in ${languageName}. Every word must be in ${languageName}.`
      : ''

    const prompt = `You are a warm, perceptive alignment guide. Analyze this person's check-in history and reveal the patterns emerging in their journey.

PERSON'S PROFILE:
- Human Design Type: ${hdType}
- Strategy: ${hdStrategy}
- Check-ins completed: ${allCheckins.length}
- Score trend: ${trend} (recent avg: ${recentAvg}, older avg: ${olderAvg})

CHECK-IN HISTORY (most recent first):
${checkinSummary}

ANALYSIS RULES:
- Look for REAL patterns in the data — recurring high/low scores, category trends, consistency gaps
- Connect patterns to their Human Design type naturally (don't lecture about HD)
- Be specific to THEIR data, not generic advice
- Warm but honest — name what you see, including uncomfortable patterns
- 2-3 sentences per insight, no more
- Never predict the future
- Never tell them what to do — help them see what's happening

Return ONLY a JSON object, no markdown:
{
  "strength": {
    "title": "short title (5 words max)",
    "body": "2-3 sentences about a positive pattern you see emerging"
  },
  "watch": {
    "title": "short title (5 words max)", 
    "body": "2-3 sentences about a pattern to be mindful of"
  },
  "invitation": {
    "title": "short title (5 words max)",
    "body": "2-3 sentences with a reflective invitation based on what you see"
  }
}${languageInstruction}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].text.replace(/```json|```/g, '').trim()
    const patterns = JSON.parse(text)

    // Cache in Supabase for future reference
    await supabase
      .from('patterns_insights')
      .upsert([{
        user_id,
        patterns,
        checkin_count: allCheckins.length,
        language,
        created_at: new Date().toISOString()
      }], { onConflict: 'user_id' })
      .catch(() => {}) // Don't fail if table doesn't exist yet

    return NextResponse.json({ success: true, patterns })

  } catch (err) {
    console.error('Patterns error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}