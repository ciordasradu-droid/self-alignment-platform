// app/dashboard/components/CommitmentDocument.js
// "Angajamentul cu Tine" — personal commitment document
// Unlocks at Day 60. Generates a printable page with:
// - Platform header
// - 3 sections: ce ești, ce mergi către, ce lași
// - Zone for handwritten: date, name, signature + "Am luat la cunoștință"
// Printable, keepable. No verification — it's between the user and themselves.

'use client'

import { useState, useEffect } from 'react'

const LABELS = {
  en: {
    title: 'Commitment With Yourself',
    subtitle: 'This document is between you and yourself. No one else will see it. Print it, sign it by hand, and keep it somewhere you will see it.',
    section1_title: 'Who I Am',
    section1_prompt: 'In your own words — who are you? What defines you? What do you know about yourself that no one taught you?',
    section2_title: 'What I Am Moving Toward',
    section2_prompt: 'What are you building? What direction feels true? What do you want to become?',
    section3_title: 'What I Am Leaving Behind',
    section3_prompt: 'What patterns, habits, or beliefs no longer serve you? What are you done carrying?',
    date_label: 'Date',
    name_label: 'Full Name',
    signature_label: 'Signature',
    acknowledgment: 'I acknowledge this commitment to myself.',
    generate: 'Generate My Commitment',
    print: 'Print This Document',
    placeholder1: 'Write who you are...',
    placeholder2: 'Write what you are moving toward...',
    placeholder3: 'Write what you are leaving behind...',
    tag: 'Day 60',
  },
  ro: {
    title: 'Angajamentul cu Tine',
    subtitle: 'Acest document este între tine și tine. Nimeni altcineva nu-l va vedea. Printează-l, semnează-l de mână și ține-l undeva unde îl vei vedea.',
    section1_title: 'Cine Sunt',
    section1_prompt: 'În cuvintele tale — cine ești? Ce te definește? Ce știi despre tine ce nimeni nu te-a învățat?',
    section2_title: 'Spre Ce Merg',
    section2_prompt: 'Ce construiești? Ce direcție se simte adevărată? Ce vrei să devii?',
    section3_title: 'Ce Las în Urmă',
    section3_prompt: 'Ce tipare, obiceiuri sau convingeri nu te mai servesc? Ce nu mai vrei să porți?',
    date_label: 'Data',
    name_label: 'Numele Complet',
    signature_label: 'Semnătura',
    acknowledgment: 'Am luat la cunoștință acest angajament cu mine.',
    generate: 'Generează Angajamentul Meu',
    print: 'Printează Documentul',
    placeholder1: 'Scrie cine ești...',
    placeholder2: 'Scrie spre ce mergi...',
    placeholder3: 'Scrie ce lași în urmă...',
    tag: 'Ziua 60',
  },
  es: { title: 'Compromiso Contigo Mismo', subtitle: 'Este documento es entre tú y tú mismo. Nadie más lo verá. Imprímelo, fírmalo a mano y guárdalo donde lo veas.', section1_title: 'Quién Soy', section1_prompt: 'En tus propias palabras — ¿quién eres?', section2_title: 'Hacia Dónde Voy', section2_prompt: '¿Qué estás construyendo? ¿Qué dirección se siente verdadera?', section3_title: 'Qué Dejo Atrás', section3_prompt: '¿Qué patrones ya no te sirven?', date_label: 'Fecha', name_label: 'Nombre Completo', signature_label: 'Firma', acknowledgment: 'Reconozco este compromiso conmigo mismo.', generate: 'Generar Mi Compromiso', print: 'Imprimir Documento', placeholder1: 'Escribe quién eres...', placeholder2: 'Escribe hacia dónde vas...', placeholder3: 'Escribe qué dejas atrás...', tag: 'Día 60' },
  fr: { title: 'Engagement Avec Toi-Même', subtitle: 'Ce document est entre toi et toi-même. Personne d\'autre ne le verra. Imprime-le, signe-le à la main et garde-le là où tu le verras.', section1_title: 'Qui Je Suis', section1_prompt: 'Dans tes propres mots — qui es-tu ?', section2_title: 'Vers Quoi Je Me Dirige', section2_prompt: 'Que construis-tu ? Quelle direction te semble juste ?', section3_title: 'Ce Que Je Laisse Derrière', section3_prompt: 'Quels schémas ne te servent plus ?', date_label: 'Date', name_label: 'Nom Complet', signature_label: 'Signature', acknowledgment: 'Je reconnais cet engagement envers moi-même.', generate: 'Générer Mon Engagement', print: 'Imprimer le Document', placeholder1: 'Écris qui tu es...', placeholder2: 'Écris vers quoi tu te diriges...', placeholder3: 'Écris ce que tu laisses derrière...', tag: 'Jour 60' },
  de: { title: 'Verpflichtung Mit Dir Selbst', subtitle: 'Dieses Dokument ist zwischen dir und dir selbst. Niemand sonst wird es sehen.', section1_title: 'Wer Ich Bin', section1_prompt: 'In deinen eigenen Worten — wer bist du?', section2_title: 'Wohin Ich Gehe', section2_prompt: 'Was baust du auf? Welche Richtung fühlt sich wahr an?', section3_title: 'Was Ich Loslasse', section3_prompt: 'Welche Muster dienen dir nicht mehr?', date_label: 'Datum', name_label: 'Vollständiger Name', signature_label: 'Unterschrift', acknowledgment: 'Ich erkenne diese Verpflichtung mir selbst gegenüber an.', generate: 'Meine Verpflichtung Erstellen', print: 'Dokument Drucken', placeholder1: 'Schreib wer du bist...', placeholder2: 'Schreib wohin du gehst...', placeholder3: 'Schreib was du loslässt...', tag: 'Tag 60' },
}

export default function CommitmentDocument({ lang = 'en' }) {
  const [sections, setSections] = useState({ who: '', toward: '', leaving: '' })
  const [generated, setGenerated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState('')

  const t = LABELS[lang] || LABELS['en']

  useEffect(() => {
    const stored = localStorage.getItem('profile')
    if (stored) {
      try {
        const profile = JSON.parse(stored)
        setUserName(profile.full_name || '')
      } catch(e) {}
    }
    // Load saved commitment if exists
    const saved = localStorage.getItem('commitment_document')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setSections(data.sections || { who: '', toward: '', leaving: '' })
        setGenerated(true)
      } catch(e) {}
    }
  }, [])

  const handleGenerate = () => {
    if (!sections.who.trim() || !sections.toward.trim() || !sections.leaving.trim()) return
    localStorage.setItem('commitment_document', JSON.stringify({
      sections,
      date: new Date().toISOString().split('T')[0],
      name: userName
    }))
    setGenerated(true)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!isOpen) {
    return (
      <div style={s.card} onClick={() => setIsOpen(true)}>
        <div style={s.closedHeader}>
          <div>
            <span className="tag tag-orange" style={{marginBottom:'8px', display:'inline-block'}}>📜 {t.tag}</span>
            <h3 style={s.closedTitle}>{t.title}</h3>
            <p style={s.closedSubtitle}>{t.subtitle}</p>
          </div>
          <span style={s.toggle}>▼</span>
        </div>
      </div>
    )
  }

  if (generated) {
    return (
      <div style={s.card}>
        <div style={s.printHeader} id="commitment-print">
          <div style={s.printLogo}>✦ Alignment</div>
          <h2 style={s.printTitle}>{t.title}</h2>
          <div style={s.printDivider} />

          <div style={s.printSection}>
            <h3 style={s.printSectionTitle}>{t.section1_title}</h3>
            <p style={s.printText}>{sections.who}</p>
          </div>

          <div style={s.printSection}>
            <h3 style={s.printSectionTitle}>{t.section2_title}</h3>
            <p style={s.printText}>{sections.toward}</p>
          </div>

          <div style={s.printSection}>
            <h3 style={s.printSectionTitle}>{t.section3_title}</h3>
            <p style={s.printText}>{sections.leaving}</p>
          </div>

          <div style={s.printDivider} />

          <p style={s.acknowledgment}>{t.acknowledgment}</p>

          <div style={s.signatureArea}>
            <div style={s.signatureField}>
              <div style={s.signatureLine} />
              <p style={s.signatureLabel}>{t.date_label}</p>
            </div>
            <div style={s.signatureField}>
              <div style={s.signatureLine} />
              <p style={s.signatureLabel}>{t.name_label}</p>
            </div>
            <div style={s.signatureField}>
              <div style={s.signatureLine} />
              <p style={s.signatureLabel}>{t.signature_label}</p>
            </div>
          </div>
        </div>

        <button onClick={handlePrint} style={s.printBtn}>
          {t.print}
        </button>
        <button onClick={() => setGenerated(false)} style={s.editBtn}>
          Edit
        </button>
      </div>
    )
  }

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span className="tag tag-orange" style={{marginBottom:'12px', display:'inline-block'}}>📜 {t.tag}</span>
        <h3 style={s.title}>{t.title}</h3>
        <p style={s.subtitle}>{t.subtitle}</p>
      </div>

      <div style={s.form}>
        <div style={s.formSection}>
          <h4 style={s.formLabel}>{t.section1_title}</h4>
          <p style={s.formPrompt}>{t.section1_prompt}</p>
          <textarea
            value={sections.who}
            onChange={(e) => setSections(prev => ({...prev, who: e.target.value}))}
            placeholder={t.placeholder1}
            rows={5}
            style={s.textarea}
          />
        </div>

        <div style={s.formSection}>
          <h4 style={s.formLabel}>{t.section2_title}</h4>
          <p style={s.formPrompt}>{t.section2_prompt}</p>
          <textarea
            value={sections.toward}
            onChange={(e) => setSections(prev => ({...prev, toward: e.target.value}))}
            placeholder={t.placeholder2}
            rows={5}
            style={s.textarea}
          />
        </div>

        <div style={s.formSection}>
          <h4 style={s.formLabel}>{t.section3_title}</h4>
          <p style={s.formPrompt}>{t.section3_prompt}</p>
          <textarea
            value={sections.leaving}
            onChange={(e) => setSections(prev => ({...prev, leaving: e.target.value}))}
            placeholder={t.placeholder3}
            rows={5}
            style={s.textarea}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!sections.who.trim() || !sections.toward.trim() || !sections.leaving.trim()}
          style={{
            ...s.generateBtn,
            background: (sections.who.trim() && sections.toward.trim() && sections.leaving.trim()) ? 'var(--purple)' : '#ccc',
            cursor: (sections.who.trim() && sections.toward.trim() && sections.leaving.trim()) ? 'pointer' : 'not-allowed'
          }}
        >
          {t.generate}
        </button>
      </div>
    </div>
  )
}

const s = {
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'28px', marginBottom:'24px', boxShadow:'var(--shadow)' },

  // Closed state
  closedHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', cursor:'pointer' },
  closedTitle: { fontSize:'18px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'4px' },
  closedSubtitle: { fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6' },
  toggle: { fontSize:'14px', color:'var(--text-muted)' },

  // Open - form state
  header: { marginBottom:'24px' },
  title: { fontSize:'24px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px' },
  subtitle: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7' },
  form: {},
  formSection: { marginBottom:'28px' },
  formLabel: { fontSize:'16px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'6px' },
  formPrompt: { fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'12px' },
  textarea: { width:'100%', padding:'16px', border:'1.5px solid var(--border)', borderRadius:'12px', fontSize:'15px', color:'var(--text)', background:'var(--bg)', resize:'vertical', fontFamily:'inherit', outline:'none', boxSizing:'border-box', lineHeight:'1.7', minHeight:'120px' },
  generateBtn: { width:'100%', padding:'16px', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'500', boxShadow:'0 4px 20px rgba(124,92,191,0.3)' },

  // Generated - print state
  printHeader: { textAlign:'center', padding:'20px 0' },
  printLogo: { fontSize:'20px', fontWeight:'600', fontFamily:'Cormorant Garamond, serif', color:'var(--purple)', marginBottom:'24px' },
  printTitle: { fontSize:'28px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'16px' },
  printDivider: { width:'60px', height:'2px', background:'var(--purple)', margin:'24px auto' },
  printSection: { textAlign:'left', marginBottom:'28px', padding:'0 12px' },
  printSectionTitle: { fontSize:'16px', fontWeight:'600', color:'var(--purple)', fontFamily:'Cormorant Garamond, serif', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px' },
  printText: { fontSize:'15px', color:'var(--text)', lineHeight:'1.8' },
  acknowledgment: { fontSize:'14px', color:'var(--text)', fontStyle:'italic', textAlign:'center', marginBottom:'32px' },
  signatureArea: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px', padding:'0 12px' },
  signatureField: { textAlign:'center' },
  signatureLine: { borderBottom:'1px solid var(--text)', height:'40px', marginBottom:'8px' },
  signatureLabel: { fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' },
  printBtn: { width:'100%', padding:'14px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:'500', cursor:'pointer', marginTop:'20px', marginBottom:'8px' },
  editBtn: { width:'100%', padding:'12px', background:'transparent', color:'var(--text-muted)', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'14px', cursor:'pointer' },
}