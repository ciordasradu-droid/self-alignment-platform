import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkinReminderEmail, weeklyReviewEmail } from '../../../lib/emails/checkinReminder'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, userName, type } = body

    const template = type === 'weekly'
      ? weeklyReviewEmail(userName)
      : checkinReminderEmail(userName)

    const { data, error } = await resend.emails.send({
      from: 'Self Alignment Platform <onboarding@resend.dev>',
      to: email,
      subject: template.subject,
      html: template.html
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}