export const maxDuration = 60

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

  // Handle all content block types safely
  const textBlock = message.content.find(block => block.type === 'text')
  if (!textBlock || !textBlock.text) {
    throw new Error('No text response from Claude')
  }

  const clean = textBlock.text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { calculated_profile_id, full_name, calculated_data } = body

    const profilePrompt = buildProfilePrompt(calculated_data, full_name)
    const sections = await callClaude(profilePrompt)

    const swotPrompt = buildSWOTPrompt(calculated_data, sections)
    const swot = await callClaude(swotPrompt)

    const planPrompt = buildAlignmentPlanPrompt(calculated_data, sections, swot)
    const alignmentPlan = await callClaude(planPrompt)

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
    console.error('Interpret error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
