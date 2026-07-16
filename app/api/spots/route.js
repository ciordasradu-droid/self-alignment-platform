import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/service'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('spots')
      .select('spots_used')
      .eq('id', 1)
      .single()

    if (error || !data) {
      return NextResponse.json({ spots_left: 1000 })
    }

    return NextResponse.json({ spots_left: 1000 - data.spots_used })

  } catch (err) {
    return NextResponse.json({ spots_left: 1000 })
  }
}