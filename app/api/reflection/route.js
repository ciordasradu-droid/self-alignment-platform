export const maxDuration = 60

// Destinație: app/api/reflection/route.js  (FIȘIER NOU — creează folderul app/api/reflection/)
// Salvează reflecția scrisă (dimineață) în tabelul checkins, în coloana answers,
// privat. Marcată cu kind:'morning' ca s-o putem distinge la Weekly Review.
// NU atinge streak-ul (acela rămâne legat de check-in-ul de seară).

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await request.json()
    const { kind, text } = body

    if (!text) {
      return NextResponse.json({ error: 'text required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('checkins')
      .insert([{
        user_id: user.id,
        score: 0,
        answers: { kind: kind || 'morning', text },
        created_at: new Date().toISOString()
      }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reflection POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}