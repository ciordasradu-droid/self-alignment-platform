import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { dailyReminderEmail, weeklyReviewEmail } from '../../../lib/emails/checkinReminder'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, email, name } = body

    const template = type === 'weekly'
      ? weeklyReviewEmail(name)
      : dailyReminderEmail(name)

    const { data, error } = await resend.emails.send({
      from: 'Alignment <onboarding@resend.dev>',
      to: email,
      subject: template.subject,
      html: template.html
    })

    if (error) throw error

    return NextResponse.json({ success: true, id: data.id })

  } catch (err) {
    console.error('Email error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}