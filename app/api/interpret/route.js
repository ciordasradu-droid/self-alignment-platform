import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../lib/supabase'
import { buildProfilePrompt, buildSWOTPrompt, buildAlignmentPlanPrompt } from '../../../lib/prompts/profile'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

async function callClaude(prompt) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  })
  const text = message.content[0].text
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { calculated_profile_id, full_name, calculated_data } = body

    // Step 1 — Generate profile sections
    const profilePrompt = buildProfilePrompt(calculated_data, full_name)
    const sections = await callClaude(profilePrompt)

    // Step 2 — Generate SWOT
    const swotPrompt = buildSWOTPrompt(calculated_data, sections)
    const swot = await callClaude(swotPrompt)

    // Step 3 — Generate Alignment Plan
    const planPrompt = buildAlignmentPlanPrompt(calculated_data, sections, swot)
    const alignmentPlan = await callClaude(planPrompt)

    // Save to database
    const { data, error } = await supabase
      .from('interpreted_profiles')
      .insert([{
        calculated_profile_id: calculated_profile_id || null,
        sections,
        swot,
        alignment_plan: alignmentPlan,
        prompt_version: 'v1'
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
      alignment_plan: alignmentPlan
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Interpretation failed' }, { status: 500 })
  }
}