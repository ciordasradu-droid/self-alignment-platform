export const maxDuration = 60

// Scrierea ritualurilor zilnice (secțiunea 5).
// Alegere tehnică: extindem `checkins` (answers jsonb) în loc să adăugăm un
// tabel nou — zero migrare SQL, aceleași date, un singur loc de citit.
// answers = { kind: 'morning'|'evening'|'one_breath', ...câmpurile ritualului }
//
// Semnalele 0-100 stau în answers ca DATE BRUTE (hrănesc Patterns și raportul
// de 30 zile). Nu se afișează niciodată ca scor (decizia 1).

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

const KINDS = ['morning', 'evening', 'one_breath']

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await request.json()
    const { kind } = body
    if (!KINDS.includes(kind)) {
      return NextResponse.json({ error: 'unknown kind' }, { status: 400 })
    }

    const answers = { ...body }
    delete answers.kind
    answers.kind = kind

    // score: 0 — coloana e NOT NULL, dar scorul nu există ca noțiune în produs.
    const { error } = await supabaseAdmin
      .from('checkins')
      .insert([{ user_id: user.id, score: 0, answers, created_at: new Date().toISOString() }])
    if (error) throw error

    // Prezența: seara sau o respirație închid ziua. Dimineața nu o închide.
    let streak = null
    if (kind === 'evening' || kind === 'one_breath') {
      streak = await touchPresence(user.id)
    }

    return NextResponse.json({ success: true, streak })
  } catch (err) {
    console.error('Ritual POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DECIZIA 4 — consecvența ÎNGHEAȚĂ la absență: nu scade, nu se resetează.
// Absența = prezență întreruptă care se reia blând. Deci numărăm zilele de
// prezență; o pauză nu șterge nimic, doar nu adaugă.
async function touchPresence(userId) {
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabaseAdmin
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existing) {
    await supabaseAdmin.from('streaks').insert([{
      user_id: userId, current_streak: 1, longest_streak: 1, last_checkin_date: today,
    }])
    return 1
  }

  if (existing.last_checkin_date === today) return existing.current_streak

  const next = (existing.current_streak || 0) + 1
  await supabaseAdmin
    .from('streaks')
    .update({
      current_streak: next,
      longest_streak: Math.max(next, existing.longest_streak || 0),
      last_checkin_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
  return next
}
