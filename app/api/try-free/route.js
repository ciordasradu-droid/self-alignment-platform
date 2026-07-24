import { NextResponse } from 'next/server'

// A6 (decizie inchisa 23.07): la expirarea probei nu se confisca nimic —
// accesul la Azi/Drumul ramane. "Expirarea" reala e la nivel de
// FUNCTIONALITATE (regenerare Tipare + gandul zilei personalizat, vezi
// lib/trial.js + api/patterns + api/daily-insight), nu la nivel de pagina.
// Cookie-ul de acces initial nu trebuie sa expire inaintea acelui moment —
// durata lunga il face practic permanent, gate-ul real e cel de mai jos.
export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set('try_free', 'true', {
    maxAge: 60 * 60 * 24 * 365 * 10,
    path: '/'
  })

  return response
}