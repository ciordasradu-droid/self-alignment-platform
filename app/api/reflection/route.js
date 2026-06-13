export const maxDuration = 60

// Destinație: app/api/reflection/route.js  (FIȘIER NOU — creează folderul app/api/reflection/)
// Salvează reflecția scrisă (dimineață) în tabelul checkins, în coloana answers,
// privat. Marcată cu kind:'morning' ca s-o putem distinge la Weekly Review.
// NU atinge streak-ul (acela rămâne legat de check-in-ul de seară).

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, kind, text } = body

    if (!user_id || !text) {
      return NextResponse.json({ error: 'user_id and text required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('checkins')
      .insert([{
        user_id,
        score: null,
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