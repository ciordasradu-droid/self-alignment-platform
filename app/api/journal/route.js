// JURNALUL-CARTE (A5, calup arhitectura 30.07) — un singur jurnal, paginat
// pe zile logice, in ordine inversa. Reuseste tabela `checkins` existenta
// (fara migrare noua): fiecare rand deja poarta fie continut de ritual
// (sleep/intentie/gratitudine/jurnal de seara), fie, incepand de acum, un
// nou `kind: 'journal_entry'` pentru intrarile libere (deblocate la
// prezenta >= 3 zile — ACEEASI regula ca FreeJournal-ul vechi, A2).

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'
import { getSessionUser } from '../../../lib/supabase/server'
import { getLogicalDay } from '../../../lib/logicalDay'

// GCAO A1 (01.08.2026) — planul dacă-atunci + obstacolul se afiseaza in
// jurnal SUB ACEEASI eticheta "Intentia dimineatii" (nu o eticheta noua),
// alaturate ca text simplu, fara termeni stiintifici. Doar cuvintele de
// legatura sunt traduse aici (acelasi text ca MorningAnchor.js).
const PLAN_WORDS = {
  en: { if_: 'If', then_: 'then', obstacle: 'What might get in the way' },
  ro: { if_: 'Dacă', then_: 'atunci', obstacle: 'Ce ar putea sta în cale' },
  es: { if_: 'Si', then_: 'entonces', obstacle: 'Qué podría interponerse' },
  fr: { if_: 'Si', then_: 'alors', obstacle: 'Ce qui pourrait se mettre en travers' },
  de: { if_: 'Wenn', then_: 'dann', obstacle: 'Was im Weg stehen könnte' },
  it: { if_: 'Se', then_: 'allora', obstacle: 'Cosa potrebbe ostacolare' },
  pt: { if_: 'Se', then_: 'então', obstacle: 'O que pode atrapalhar' },
  nl: { if_: 'Als', then_: 'dan', obstacle: 'Wat in de weg zou kunnen staan' },
  pl: { if_: 'Jeśli', then_: 'to', obstacle: 'Co może stanąć na przeszkodzie' },
  hu: { if_: 'Ha', then_: 'akkor', obstacle: 'Mi állhat az útjába' },
  ru: { if_: 'Если', then_: 'то', obstacle: 'Что может помешать' },
}

function appendPlanText(intentionText, a, lang) {
  const w = PLAN_WORDS[lang] || PLAN_WORDS.en
  const lines = []
  if (intentionText) lines.push(intentionText)
  if (a.plan_if && a.plan_then) lines.push(`${w.if_} ${a.plan_if}, ${w.then_} ${a.plan_then}.`)
  if (a.plan_obstacle) lines.push(`${w.obstacle}: ${a.plan_obstacle}`)
  return lines.join('\n')
}

export async function GET(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const tz = Number(searchParams.get('tz')) || 0
    const lang = searchParams.get('lang') || 'en'

    const { data: checkins, error } = await supabaseAdmin
      .from('checkins')
      .select('created_at, answers')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    const byDay = new Map()
    for (const c of (checkins || [])) {
      const a = c.answers || {}
      const kind = a.kind || (a.evening_journal !== undefined || a.gratitude !== undefined ? 'evening' : null)
      const texts = []
      if (kind === 'morning') {
        if (a.sleep) texts.push({ label: 'sleep', text: a.sleep })
        const intentionCombined = appendPlanText(a.intention, a, lang)
        if (intentionCombined) texts.push({ label: 'morning_intention', text: intentionCombined })
      } else if (kind === 'evening') {
        if (a.evening_journal) texts.push({ label: 'evening_journal', text: a.evening_journal })
        if (a.gratitude) texts.push({ label: 'gratitude', text: a.gratitude })
        if (a.intention) texts.push({ label: 'evening_intention', text: a.intention })
      } else if (kind === 'journal_entry') {
        if (a.text) texts.push({ label: 'free', text: a.text })
      }
      if (!texts.length) continue

      const day = getLogicalDay(new Date(c.created_at).getTime(), tz)
      if (!byDay.has(day)) byDay.set(day, [])
      byDay.get(day).push(...texts)
    }

    const pages = Array.from(byDay.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, entries]) => ({ date, entries }))

    // Prezenta (A2) — ACEEASI metrica ca /api/dashboard si isUnlocked() din
    // drumul/page.js: orice check-in conteaza (inclusiv O Respirație, fără
    // text), nu doar zilele cu text scris — altfel acest cont vede
    // "incuiat" în timp ce Drumul îi arată deja deblocarea, o contradicție
    // pe care am prins-o direct la verificarea live.
    const activeDays = new Set((checkins || []).map(c => getLogicalDay(new Date(c.created_at).getTime(), tz))).size

    return NextResponse.json({ success: true, pages, activeDays })
  } catch (err) {
    console.error('Journal GET error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = await request.json()
    const { text, tz } = body
    if (!text || !text.trim()) return NextResponse.json({ error: 'text required' }, { status: 400 })

    // Deblocare pe prezenta, nu varsta contului (A2, decizie inchisa) —
    // aceeasi verificare ca isUnlocked(3, 'days', ...) din drumul/page.js.
    const { data: allCheckins } = await supabaseAdmin
      .from('checkins')
      .select('created_at')
      .eq('user_id', user.id)

    const tzOffset = Number(tz) || 0
    const activeDays = new Set((allCheckins || []).map(c => getLogicalDay(new Date(c.created_at).getTime(), tzOffset))).size
    if (activeDays < 3) {
      return NextResponse.json({ error: 'locked' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('checkins')
      .insert([{ user_id: user.id, score: 0, answers: { kind: 'journal_entry', text: text.trim() }, created_at: new Date().toISOString() }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Journal POST error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
