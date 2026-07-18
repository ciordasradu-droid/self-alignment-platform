export const maxDuration = 60

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const userId = user.id

    const { data: checkins, error: checkinError } = await supabaseAdmin
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (checkinError) throw checkinError

    const { data: streak, error: streakError } = await supabaseAdmin
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (streakError) throw streakError

    const today = new Date().toISOString().split('T')[0]
    const checkedInToday = checkins?.some(c =>
      c.created_at.split('T')[0] === today
    )

    // ZIUA DIN DRUM — determină stadiul apei (legea 7). Vine din vechimea
    // contului, nu din localStorage. Ziua 1 = ziua în care s-a creat contul.
    let { data: profile } = await supabaseAdmin
      .from('users')
      .select('created_at, current_unlocked_day')
      .eq('id', userId)
      .maybeSingle()

    // Conturile fără email (testeri) nu trec prin /auth/callback, deci n-au
    // rândul lor. Îl creăm la prima cerere — o singură dată, tăcut.
    if (!profile) {
      await supabaseAdmin.from('users')
        .upsert({ id: userId, email: user.email || null }, { onConflict: 'id', ignoreDuplicates: true })
      const { data: fresh } = await supabaseAdmin
        .from('users').select('created_at, current_unlocked_day').eq('id', userId).maybeSingle()
      profile = fresh
    }

    const createdAt = profile?.created_at || user.created_at
    const day = createdAt
      ? Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000) + 1)
      : 1

    // Ce s-a întâmplat azi — home-ul știe ce ritual să ofere.
    const todays = (checkins || []).filter(c => c.created_at.split('T')[0] === today)
    const pick = (kind) => todays.find(c => c.answers?.kind === kind)
    const morning = pick('morning')
    // rândurile vechi n-au `kind` — cele fără erau check-in-ul de seară
    const evening = pick('evening') || todays.find(c => c.answers && !c.answers.kind)

    // Curgerea seară→dimineață (sect. 5): intenția se stabilește seara,
    // pentru ziua următoare — dimineața o continuă, n-o mai stabilește.
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const yesterdayEvening = (checkins || []).find(c =>
      c.created_at.split('T')[0] === yesterday && c.answers?.kind === 'evening'
    )

    return NextResponse.json({
      success: true,
      checkins: checkins || [],
      streak: streak || { current_streak: 0, longest_streak: 0 },
      checkedInToday,
      day,
      today: {
        morning: !!morning,
        evening: !!evening,
        one_breath: !!pick('one_breath'),
        continuedIntention: yesterdayEvening?.answers?.intention || '',
      },
    })

  } catch (err) {
    console.error('Dashboard GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const user_id = user.id

    const body = await request.json()
    const { score, answers } = body

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const { error: checkinError } = await supabaseAdmin
      .from('checkins')
      .insert([{ user_id, score, answers, created_at: new Date().toISOString() }])

    if (checkinError) throw checkinError

    const { data: existingStreak } = await supabaseAdmin
      .from('streaks')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle()

    let newStreak = 1
    let longestStreak = 1

    if (existingStreak) {
      const lastDate = existingStreak.last_checkin_date

      if (lastDate === today) {
        newStreak = existingStreak.current_streak
        longestStreak = existingStreak.longest_streak
      } else if (lastDate === yesterday) {
        newStreak = existingStreak.current_streak + 1
        longestStreak = Math.max(newStreak, existingStreak.longest_streak || 1)
      } else {
        newStreak = 1
        longestStreak = Math.max(1, existingStreak.longest_streak || 1)
      }

      await supabaseAdmin
        .from('streaks')
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_checkin_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
    } else {
      await supabaseAdmin
        .from('streaks')
        .insert([{
          user_id,
          current_streak: 1,
          longest_streak: 1,
          last_checkin_date: today
        }])
      newStreak = 1
      longestStreak = 1
    }

    return NextResponse.json({
      success: true,
      streak: newStreak,
      longest_streak: longestStreak
    })

  } catch (err) {
    console.error('Dashboard POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
