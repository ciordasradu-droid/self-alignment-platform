"use client"

import { useState } from "react"
import { getUserId } from "../../../lib/userId"

const LABELS = {
  en: { tag: "Daily reminders", title: "Never miss a check-in.", desc: "Add your email and we will send you a warm reminder each morning if you have not checked in yet. No spam. Just alignment.", btn: "Remind me", done: "Check your inbox for a welcome email.", note: "No spam. Unsubscribe anytime. We only email when it matters." },
  ro: { tag: "Remindere zilnice", title: "Nu rata niciun check-in.", desc: "Adauga emailul tau si iti trimitem un reminder cald in fiecare dimineata daca nu ai facut check-in. Fara spam. Doar aliniere.", btn: "Aminteste-mi", done: "Verifica inbox-ul pentru emailul de bun venit.", note: "Fara spam. Dezabonare oricand. Trimitem email doar cand conteaza." },
  es: { tag: "Recordatorios diarios", title: "No te pierdas ningun check-in.", desc: "Agrega tu email y te enviaremos un recordatorio calido cada manana si no has hecho check-in. Sin spam. Solo alineacion.", btn: "Recordarme", done: "Revisa tu bandeja de entrada.", note: "Sin spam. Cancelar en cualquier momento." },
  fr: { tag: "Rappels quotidiens", title: "Ne manque aucun check-in.", desc: "Ajoute ton email et nous t enverrons un rappel chaleureux chaque matin si tu n as pas fait ton check-in. Pas de spam.", btn: "Me rappeler", done: "Verifie ta boite de reception.", note: "Pas de spam. Desabonnement a tout moment." },
  de: { tag: "Tagliche Erinnerungen", title: "Verpasse keinen Check-in.", desc: "Fuge deine Email hinzu und wir senden dir jeden Morgen eine freundliche Erinnerung wenn du noch keinen Check-in gemacht hast.", btn: "Erinnere mich", done: "Prufe deinen Posteingang.", note: "Kein Spam. Jederzeit abbestellbar." },
  it: { tag: "Promemoria giornalieri", title: "Non perdere nessun check-in.", desc: "Aggiungi la tua email e ti invieremo un promemoria gentile ogni mattina se non hai fatto il check-in. Niente spam.", btn: "Ricordami", done: "Controlla la tua posta in arrivo.", note: "Niente spam. Cancella quando vuoi." },
  pt: { tag: "Lembretes diarios", title: "Nao perca nenhum check-in.", desc: "Adicione seu email e enviaremos um lembrete caloroso toda manha se voce nao fez check-in. Sem spam.", btn: "Lembre-me", done: "Verifique sua caixa de entrada.", note: "Sem spam. Cancele a qualquer momento." },
  nl: { tag: "Dagelijkse herinneringen", title: "Mis geen check-in.", desc: "Voeg je email toe en we sturen je elke ochtend een vriendelijke herinnering als je nog geen check-in hebt gedaan.", btn: "Herinner mij", done: "Controleer je inbox.", note: "Geen spam. Op elk moment opzegbaar." },
  pl: { tag: "Codzienne przypomnienia", title: "Nie przegap zadnego check-inu.", desc: "Dodaj swoj email a wyslemy ci cieple przypomnienie kazdego ranka jesli nie zrobiles check-inu.", btn: "Przypomnij mi", done: "Sprawdz swoja skrzynke.", note: "Bez spamu. Wypisz sie w dowolnym momencie." },
  hu: { tag: "Napi emlekeztetok", title: "Ne hagyd ki a check-int.", desc: "Add meg az emailed es minden reggel kulddunk egy baratsagos emlekeztetot ha meg nem csinaltad meg a check-int.", btn: "Emlekezz", done: "Nezd meg a postaladad.", note: "Nincs spam. Barmikor lemondhatod." }
}

export default function EmailCapture({ lang = "en" }) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const t = LABELS[lang] || LABELS.en

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return
    setLoading(true)
    const userId = getUserId()
    try {
      await fetch("/api/save-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, email })
      })
      setSent(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div style={s.card}>
        <p style={s.doneText}>{t.done}</p>
      </div>
    )
  }

  return (
    <div style={s.card}>
      <span style={s.tag}>{t.tag}</span>
      <h3 style={s.title}>{t.title}</h3>
      <p style={s.desc}>{t.desc}</p>
      <div style={s.inputRow}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={s.input}
        />
        <button onClick={handleSubmit} disabled={loading} style={s.btn}>
          {loading ? "..." : t.btn}
        </button>
      </div>
      <p style={s.note}>{t.note}</p>
    </div>
  )
}

const s = {
  card: { background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "28px", marginBottom: "24px", boxShadow: "var(--shadow)" },
  tag: { fontSize: "11px", fontWeight: "700", color: "var(--purple)", textTransform: "uppercase", letterSpacing: "1px" },
  title: { fontSize: "20px", fontWeight: "600", color: "var(--text)", fontFamily: "Cormorant Garamond, serif", margin: "10px 0 8px" },
  desc: { fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "20px" },
  inputRow: { display: "flex", gap: "10px", marginBottom: "12px" },
  input: { flex: 1, padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "15px", background: "var(--bg)" },
  btn: { padding: "12px 24px", background: "var(--purple)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
  note: { fontSize: "12px", color: "var(--text-muted)", textAlign: "center" },
  doneText: { fontSize: "15px", color: "var(--green)", textAlign: "center", padding: "12px 0" }
}
