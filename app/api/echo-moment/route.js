import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'

// A3 — micro-moment suplimentar in jurul zilei ~21 (prezenta): aplicatia
// arata userului o fraza scrisa de el cu ~3 saptamani in urma. Fereastra
// larga (18-24 zile) ca sa prinda userul indiferent de ritmul lui exact.
export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { data: checkins, error } = await supabaseAdmin
      .from('checkins')
      .select('created_at, answers')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    const now = Date.now()
    const inWindow = (allCheckins) => allCheckins.filter(c => {
      const days = (now - new Date(c.created_at).getTime()) / 86400000
      return days >= 18 && days <= 24
    })

    const candidates = inWindow(checkins || [])
    let phrase = null
    let date = null
    for (const c of candidates) {
      const a = c.answers || {}
      const text = a.evening_journal || a.gratitude || a.intention || a.sleep
      if (text && text.trim().length > 8) {
        phrase = text.trim()
        date = c.created_at.split('T')[0]
        break
      }
    }

    return NextResponse.json({ success: true, phrase, date })
  } catch (err) {
    console.error('Echo moment error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
