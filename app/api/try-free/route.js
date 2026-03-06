import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set('try_free', 'true', {
    maxAge: 60 * 60 * 24 * 30,
    path: '/'
  })

  return response
}