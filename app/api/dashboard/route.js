export const maxDuration = 60

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    const { data: checkins, error: checkinError } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (checkinError) throw checkinError

    const { data: streak, error: streakError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (streakError) throw streakError

    const today = new Date().toISOString().split('T')[0]
    const checkedInToday = checkins?.some(c =>
      c.created_at.split('T')[0] === today
    )

    return NextResponse.json({
      success: true,
      checkins: checkins || [],
      streak: streak || { current_streak: 0, longest_streak: 0 },
      checkedInToday,
      lastScore: checkins?.[0]?.score || 0
    })

  } catch (err) {
    console.error('Dashboard GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, score, answers } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const { error: checkinError } = await supabase
      .from('checkins')
      .insert([{ user_id, score, answers, created_at: new Date().toISOString() }])

    if (checkinError) throw checkinError

    const { data: existingStreak } = await supabase
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

      await supabase
        .from('streaks')
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_checkin_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
    } else {
      await supabase
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
