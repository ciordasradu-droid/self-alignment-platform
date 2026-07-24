// app/dashboard/components/CommitmentDocument.js
// "Angajamentul cu Tine" — documentul personal in 4 parti (z60, secț. 5/7).
// Partea 1 e punctul de plecare de la onboarding, RECITIT, nu editabil —
// e ancora istorica. Partile 2-4 sunt editabile. PDF descarcabil (jsPDF),
// nu doar print. Persistat local + in user_metadata, deci recitibil
// oricand din Drum, pe orice device.

'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '../../../lib/supabase/client'

const LABELS = {
  en: {
    tag: 'Day 60', title: 'Commitment With Yourself',
    subtitle: 'This document is between you and yourself. No one else will see it. Print it, sign it by hand, and keep it somewhere you will see it.',
    part0_title: 'Where You Started', part0_note: 'At the start of your path, you wrote this:', part0_empty: 'We couldn\'t find a saved starting point — you can still continue below.',
    section1_title: 'Who I Am', section1_prompt: 'In your own words — who are you? What defines you? What do you know about yourself that no one taught you?',
    section2_title: 'What I Am Moving Toward', section2_prompt: 'What are you building? What direction feels true? What do you want to become?',
    section3_title: 'What I Am Leaving Behind', section3_prompt: 'What patterns, habits, or beliefs no longer serve you? What are you done carrying?',
    date_label: 'Date', name_label: 'Full Name', signature_label: 'Signature',
    acknowledgment: 'I acknowledge this commitment to myself.',
    generate: 'Generate My Commitment', print: 'Print This Document', download_pdf: 'Download as PDF', edit: 'Edit',
    reread_note: 'You can re-read this anytime, from The Path.',
    placeholder1: 'Write who you are...', placeholder2: 'Write what you are moving toward...', placeholder3: 'Write what you are leaving behind...',
    annual_offer: 'The annual plan is available now, here — just this once.', annual_cta: 'See the annual plan',
  },
  ro: {
    tag: 'Ziua 60', title: 'Angajamentul cu Tine',
    subtitle: 'Acest document este între tine și tine. Nimeni altcineva nu-l va vedea. Printează-l, semnează-l de mână și ține-l undeva unde îl vei vedea.',
    part0_title: 'De Unde Ai Pornit', part0_note: 'La începutul drumului tău, ai scris asta:', part0_empty: 'Nu am găsit un punct de plecare salvat — poți continua mai jos oricum.',
    section1_title: 'Cine Sunt', section1_prompt: 'În cuvintele tale — cine ești? Ce te definește? Ce știi despre tine ce nimeni nu te-a învățat?',
    section2_title: 'Spre Ce Merg', section2_prompt: 'Ce construiești? Ce direcție se simte adevărată? Ce vrei să devii?',
    section3_title: 'Ce Las în Urmă', section3_prompt: 'Ce tipare, obiceiuri sau convingeri nu te mai servesc? Ce nu mai vrei să porți?',
    date_label: 'Data', name_label: 'Numele Complet', signature_label: 'Semnătura',
    acknowledgment: 'Am luat la cunoștință acest angajament cu mine.',
    generate: 'Generează Angajamentul Meu', print: 'Printează Documentul', download_pdf: 'Descarcă PDF', edit: 'Editează',
    reread_note: 'Poți reciti asta oricând, din Drum.',
    placeholder1: 'Scrie cine ești...', placeholder2: 'Scrie spre ce mergi...', placeholder3: 'Scrie ce lași în urmă...',
    annual_offer: 'Planul anual e disponibil acum, aici — o singură dată.', annual_cta: 'Vezi planul anual',
  },
  es: {
    tag: 'Día 60', title: 'Compromiso Contigo Mismo',
    subtitle: 'Este documento es entre tú y tú mismo. Nadie más lo verá. Imprímelo, fírmalo a mano y guárdalo donde lo veas.',
    part0_title: 'Desde Dónde Partiste', part0_note: 'Al comienzo de tu camino, escribiste esto:', part0_empty: 'No encontramos un punto de partida guardado — puedes continuar abajo de todos modos.',
    section1_title: 'Quién Soy', section1_prompt: 'En tus propias palabras — ¿quién eres? ¿Qué te define?',
    section2_title: 'Hacia Dónde Voy', section2_prompt: '¿Qué estás construyendo? ¿Qué dirección se siente verdadera?',
    section3_title: 'Qué Dejo Atrás', section3_prompt: '¿Qué patrones ya no te sirven? ¿Qué ya no quieres cargar?',
    date_label: 'Fecha', name_label: 'Nombre Completo', signature_label: 'Firma',
    acknowledgment: 'Reconozco este compromiso conmigo mismo.',
    generate: 'Generar Mi Compromiso', print: 'Imprimir Documento', download_pdf: 'Descargar PDF', edit: 'Editar',
    reread_note: 'Puedes releer esto cuando quieras, desde el Camino.',
    placeholder1: 'Escribe quién eres...', placeholder2: 'Escribe hacia dónde vas...', placeholder3: 'Escribe qué dejas atrás...',
    annual_offer: 'El plan anual está disponible ahora, aquí — solo esta vez.', annual_cta: 'Ver el plan anual',
  },
  fr: {
    tag: 'Jour 60', title: 'Engagement Avec Toi-Même',
    subtitle: 'Ce document est entre toi et toi-même. Personne d\'autre ne le verra. Imprime-le, signe-le à la main et garde-le là où tu le verras.',
    part0_title: 'D\'Où Tu Es Parti', part0_note: 'Au début de ton chemin, tu as écrit ceci :', part0_empty: 'Nous n\'avons pas trouvé de point de départ enregistré — tu peux continuer ci-dessous quand même.',
    section1_title: 'Qui Je Suis', section1_prompt: 'Dans tes propres mots — qui es-tu ? Qu\'est-ce qui te définit ?',
    section2_title: 'Vers Quoi Je Me Dirige', section2_prompt: 'Que construis-tu ? Quelle direction te semble juste ?',
    section3_title: 'Ce Que Je Laisse Derrière', section3_prompt: 'Quels schémas ne te servent plus ? Que ne veux-tu plus porter ?',
    date_label: 'Date', name_label: 'Nom Complet', signature_label: 'Signature',
    acknowledgment: 'Je reconnais cet engagement envers moi-même.',
    generate: 'Générer Mon Engagement', print: 'Imprimer le Document', download_pdf: 'Télécharger en PDF', edit: 'Modifier',
    reread_note: 'Tu peux relire ceci à tout moment, depuis le Chemin.',
    placeholder1: 'Écris qui tu es...', placeholder2: 'Écris vers quoi tu te diriges...', placeholder3: 'Écris ce que tu laisses derrière...',
    annual_offer: "Le plan annuel est disponible maintenant, ici — juste cette fois.", annual_cta: 'Voir le plan annuel',
  },
  de: {
    tag: 'Tag 60', title: 'Verpflichtung Mit Dir Selbst',
    subtitle: 'Dieses Dokument ist zwischen dir und dir selbst. Niemand sonst wird es sehen. Drucke es aus, unterschreibe es von Hand und bewahre es dort auf, wo du es siehst.',
    part0_title: 'Wo Du Angefangen Hast', part0_note: 'Am Anfang deines Weges hast du das geschrieben:', part0_empty: 'Wir haben keinen gespeicherten Ausgangspunkt gefunden — du kannst trotzdem unten weitermachen.',
    section1_title: 'Wer Ich Bin', section1_prompt: 'In deinen eigenen Worten — wer bist du? Was definiert dich?',
    section2_title: 'Wohin Ich Gehe', section2_prompt: 'Was baust du auf? Welche Richtung fühlt sich wahr an?',
    section3_title: 'Was Ich Loslasse', section3_prompt: 'Welche Muster dienen dir nicht mehr? Was willst du nicht mehr tragen?',
    date_label: 'Datum', name_label: 'Vollständiger Name', signature_label: 'Unterschrift',
    acknowledgment: 'Ich erkenne diese Verpflichtung mir selbst gegenüber an.',
    generate: 'Meine Verpflichtung Erstellen', print: 'Dokument Drucken', download_pdf: 'Als PDF herunterladen', edit: 'Bearbeiten',
    reread_note: 'Du kannst das jederzeit wieder lesen, vom Weg aus.',
    placeholder1: 'Schreib wer du bist...', placeholder2: 'Schreib wohin du gehst...', placeholder3: 'Schreib was du loslässt...',
    annual_offer: 'Der Jahresplan ist jetzt hier verfügbar — nur dieses eine Mal.', annual_cta: 'Jahresplan ansehen',
  },
  it: {
    tag: 'Giorno 60', title: 'Impegno Con Te Stesso',
    subtitle: 'Questo documento è tra te e te stesso. Nessun altro lo vedrà. Stampalo, firmalo a mano e tienilo dove lo vedrai.',
    part0_title: 'Da Dove Sei Partito', part0_note: 'All\'inizio del tuo cammino, hai scritto questo:', part0_empty: 'Non abbiamo trovato un punto di partenza salvato — puoi comunque continuare qui sotto.',
    section1_title: 'Chi Sono', section1_prompt: 'Con le tue parole — chi sei? Cosa ti definisce?',
    section2_title: 'Verso Cosa Sto Andando', section2_prompt: 'Cosa stai costruendo? Quale direzione senti vera?',
    section3_title: 'Cosa Lascio Andare', section3_prompt: 'Quali schemi non ti servono più? Cosa non vuoi più portare?',
    date_label: 'Data', name_label: 'Nome Completo', signature_label: 'Firma',
    acknowledgment: 'Riconosco questo impegno con me stesso.',
    generate: 'Genera Il Mio Impegno', print: 'Stampa Documento', download_pdf: 'Scarica PDF', edit: 'Modifica',
    reread_note: 'Puoi rileggerlo quando vuoi, dal Cammino.',
    placeholder1: 'Scrivi chi sei...', placeholder2: 'Scrivi verso cosa stai andando...', placeholder3: 'Scrivi cosa lasci andare...',
    annual_offer: 'Il piano annuale è disponibile ora, qui — solo questa volta.', annual_cta: 'Vedi il piano annuale',
  },
  pt: {
    tag: 'Dia 60', title: 'Compromisso Contigo Mesmo',
    subtitle: 'Este documento é entre ti e ti mesmo. Mais ninguém o verá. Imprime-o, assina-o à mão e guarda-o onde o vejas.',
    part0_title: 'De Onde Partiste', part0_note: 'No início do teu caminho, escreveste isto:', part0_empty: 'Não encontrámos um ponto de partida guardado — podes continuar abaixo mesmo assim.',
    section1_title: 'Quem Sou', section1_prompt: 'Nas tuas próprias palavras — quem és? O que te define?',
    section2_title: 'Para Onde Vou', section2_prompt: 'O que estás a construir? Que direção parece verdadeira?',
    section3_title: 'O Que Deixo Para Trás', section3_prompt: 'Que padrões já não te servem? O que já não queres carregar?',
    date_label: 'Data', name_label: 'Nome Completo', signature_label: 'Assinatura',
    acknowledgment: 'Reconheço este compromisso comigo mesmo.',
    generate: 'Gerar O Meu Compromisso', print: 'Imprimir Documento', download_pdf: 'Descarregar PDF', edit: 'Editar',
    reread_note: 'Podes reler isto quando quiseres, a partir do Caminho.',
    placeholder1: 'Escreve quem és...', placeholder2: 'Escreve para onde vais...', placeholder3: 'Escreve o que deixas para trás...',
    annual_offer: 'O plano anual está disponível agora, aqui — só desta vez.', annual_cta: 'Ver o plano anual',
  },
  nl: {
    tag: 'Dag 60', title: 'Toewijding Aan Jezelf',
    subtitle: 'Dit document is tussen jou en jezelf. Niemand anders zal het zien. Druk het af, teken het met de hand en bewaar het ergens waar je het zult zien.',
    part0_title: 'Waar Je Begon', part0_note: 'Aan het begin van je pad schreef je dit:', part0_empty: 'We konden geen opgeslagen startpunt vinden — je kunt hieronder toch verdergaan.',
    section1_title: 'Wie Ik Ben', section1_prompt: 'In je eigen woorden — wie ben je? Wat definieert je?',
    section2_title: 'Waar Ik Naartoe Ga', section2_prompt: 'Wat bouw je op? Welke richting voelt waar aan?',
    section3_title: 'Wat Ik Achterlaat', section3_prompt: 'Welke patronen dienen je niet meer? Wat wil je niet meer dragen?',
    date_label: 'Datum', name_label: 'Volledige Naam', signature_label: 'Handtekening',
    acknowledgment: 'Ik erken deze toewijding aan mezelf.',
    generate: 'Genereer Mijn Toewijding', print: 'Print Dit Document', download_pdf: 'Download als PDF', edit: 'Bewerken',
    reread_note: 'Je kunt dit altijd teruglezen, vanaf het Pad.',
    placeholder1: 'Schrijf wie je bent...', placeholder2: 'Schrijf waar je naartoe gaat...', placeholder3: 'Schrijf wat je achterlaat...',
    annual_offer: 'Het jaarplan is nu hier beschikbaar — alleen deze ene keer.', annual_cta: 'Bekijk het jaarplan',
  },
  pl: {
    tag: 'Dzień 60', title: 'Zobowiązanie Wobec Siebie',
    subtitle: 'Ten dokument jest między tobą a tobą samym. Nikt inny go nie zobaczy. Wydrukuj go, podpisz odręcznie i przechowuj tam, gdzie go zobaczysz.',
    part0_title: 'Skąd Zacząłeś', part0_note: 'Na początku swojej drogi napisałeś to:', part0_empty: 'Nie znaleźliśmy zapisanego punktu startowego — możesz i tak kontynuować poniżej.',
    section1_title: 'Kim Jestem', section1_prompt: 'Własnymi słowami — kim jesteś? Co cię definiuje?',
    section2_title: 'Dokąd Zmierzam', section2_prompt: 'Co budujesz? Który kierunek wydaje się prawdziwy?',
    section3_title: 'Co Zostawiam Za Sobą', section3_prompt: 'Jakie wzorce już ci nie służą? Czego już nie chcesz nosić?',
    date_label: 'Data', name_label: 'Imię i Nazwisko', signature_label: 'Podpis',
    acknowledgment: 'Uznaję to zobowiązanie wobec samego siebie.',
    generate: 'Wygeneruj Moje Zobowiązanie', print: 'Wydrukuj Dokument', download_pdf: 'Pobierz jako PDF', edit: 'Edytuj',
    reread_note: 'Możesz to przeczytać ponownie w każdej chwili, z Drogi.',
    placeholder1: 'Napisz kim jesteś...', placeholder2: 'Napisz dokąd zmierzasz...', placeholder3: 'Napisz co zostawiasz za sobą...',
    annual_offer: 'Plan roczny jest dostępny teraz, tutaj — tylko ten jeden raz.', annual_cta: 'Zobacz plan roczny',
  },
  hu: {
    tag: '60. Nap', title: 'Elköteleződés Önmagad Felé',
    subtitle: 'Ez a dokumentum közted és önmagad között van. Senki más nem fogja látni. Nyomtasd ki, írd alá kézzel, és tartsd olyan helyen, ahol látni fogod.',
    part0_title: 'Ahonnan Elindultál', part0_note: 'Az utad elején ezt írtad:', part0_empty: 'Nem találtunk mentett kiindulópontot — ettől függetlenül folytathatod lent.',
    section1_title: 'Ki Vagyok', section1_prompt: 'A saját szavaiddal — ki vagy te? Mi határoz meg téged?',
    section2_title: 'Merre Tartok', section2_prompt: 'Mit építesz? Melyik irány érződik igaznak?',
    section3_title: 'Mit Hagyok Magam Mögött', section3_prompt: 'Milyen minták nem szolgálnak már téged? Mit nem akarsz már cipelni?',
    date_label: 'Dátum', name_label: 'Teljes Név', signature_label: 'Aláírás',
    acknowledgment: 'Tudomásul veszem ezt az elköteleződést önmagam felé.',
    generate: 'Elköteleződésem Létrehozása', print: 'Dokumentum Nyomtatása', download_pdf: 'Letöltés PDF-ként', edit: 'Szerkesztés',
    reread_note: 'Ezt bármikor újraolvashatod, az Útról.',
    placeholder1: 'Írd le ki vagy...', placeholder2: 'Írd le merre tartasz...', placeholder3: 'Írd le mit hagysz magad mögött...',
    annual_offer: 'Az éves csomag most elérhető, itt — csak ez egyszer.', annual_cta: 'Éves csomag megtekintése',
  },
  ru: {
    tag: 'День 60', title: 'Обязательство Перед Собой',
    subtitle: 'Этот документ — только между тобой и тобой. Никто другой его не увидит. Распечатай его, подпиши от руки и держи там, где будешь его видеть.',
    part0_title: 'С Чего Ты Начал(а)', part0_note: 'В начале своего пути ты написал(а) это:', part0_empty: 'Мы не нашли сохранённую точку отсчёта — можешь всё равно продолжить ниже.',
    section1_title: 'Кто Я', section1_prompt: 'Своими словами — кто ты? Что тебя определяет? Что ты знаешь о себе такого, чему никто не учил?',
    section2_title: 'К Чему Я Иду', section2_prompt: 'Что ты строишь? Какое направление ощущается настоящим? Кем ты хочешь стать?',
    section3_title: 'Что Я Оставляю Позади', section3_prompt: 'Какие закономерности, привычки или убеждения тебе больше не служат? Что ты больше не хочешь нести с собой?',
    date_label: 'Дата', name_label: 'Полное Имя', signature_label: 'Подпись',
    acknowledgment: 'Я признаю это обязательство перед собой.',
    generate: 'Создать Моё Обязательство', print: 'Распечатать Документ', download_pdf: 'Скачать PDF', edit: 'Редактировать',
    reread_note: 'Ты можешь перечитать это в любое время, из раздела Путь.',
    placeholder1: 'Напиши, кто ты...', placeholder2: 'Напиши, к чему ты идёшь...', placeholder3: 'Напиши, что оставляешь позади...',
    annual_offer: 'Годовой план доступен сейчас, здесь — только в этот раз.', annual_cta: 'Смотреть годовой план',
  },
}

export default function CommitmentDocument({ lang = 'en' }) {
  const [sections, setSections] = useState({ who: '', toward: '', leaving: '' })
  const [generated, setGenerated] = useState(false)
  // A7 — oferta planului anual apare O SINGURA DATA, exact la momentul in
  // care documentul e generat acum (nu la fiecare recitire ulterioara din
  // cache). Ramane false daca "generated" vine din localStorage la mount.
  const [justGenerated, setJustGenerated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [startingPoint, setStartingPoint] = useState(null) // null = inca se incarca

  const t = LABELS[lang] || LABELS['en']

  useEffect(() => {
    const stored = localStorage.getItem('profile')
    if (stored) {
      try {
        const profile = JSON.parse(stored)
        setUserName(profile.full_name || '')
      } catch (e) {}
    }

    const saved = localStorage.getItem('commitment_document')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setSections(data.sections || { who: '', toward: '', leaving: '' })
        setGenerated(true)
      } catch (e) {}
    }

    // Punctul de plecare: local intai (rapid), apoi user_metadata ca plasa
    // (merge cross-device, la fel cum a fost salvat la onboarding).
    try {
      const spLocal = localStorage.getItem('starting_point')
      if (spLocal) {
        const parsed = JSON.parse(spLocal)
        if (parsed?.text) { setStartingPoint(parsed.text); return }
      }
    } catch (e) {}
    ;(async () => {
      try {
        const supabase = createSupabaseBrowser()
        const { data } = await supabase.auth.getUser()
        setStartingPoint(data?.user?.user_metadata?.starting_point || '')
      } catch (e) {
        setStartingPoint('')
      }
    })()
  }, [])

  const handleGenerate = async () => {
    if (!sections.who.trim() || !sections.toward.trim() || !sections.leaving.trim()) return
    const payload = {
      sections,
      date: new Date().toISOString().split('T')[0],
      name: userName,
    }
    localStorage.setItem('commitment_document', JSON.stringify(payload))
    setGenerated(true)
    setJustGenerated(true)
    // plasa server-side — recitibil oricand, pe orice device (fara migrare
    // de schema, la fel ca starting_point).
    try {
      const supabase = createSupabaseBrowser()
      await supabase.auth.updateUser({ data: { commitment_document: payload } })
    } catch (e) { console.warn('commitment_document metadata save failed (non-fatal):', e?.message) }
  }

  const handlePrint = () => window.print()

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const marginX = 22
    let y = 30
    const pageWidth = 210 - marginX * 2

    const addWrapped = (text, size, gapAfter) => {
      doc.setFontSize(size)
      const lines = doc.splitTextToSize(text, pageWidth)
      lines.forEach((line) => {
        if (y > 275) { doc.addPage(); y = 25 }
        doc.text(line, marginX, y)
        y += size * 0.5
      })
      y += gapAfter
    }

    doc.setFont('helvetica', 'bold')
    addWrapped(t.title, 20, 8)
    doc.setFont('helvetica', 'normal')

    if (startingPoint) {
      doc.setFont('helvetica', 'bold')
      addWrapped(t.part0_title, 13, 2)
      doc.setFont('helvetica', 'italic')
      addWrapped(startingPoint, 11, 8)
      doc.setFont('helvetica', 'normal')
    }

    const part = (title, body) => {
      doc.setFont('helvetica', 'bold')
      addWrapped(title, 13, 2)
      doc.setFont('helvetica', 'normal')
      addWrapped(body, 11, 8)
    }
    part(t.section1_title, sections.who)
    part(t.section2_title, sections.toward)
    part(t.section3_title, sections.leaving)

    y += 6
    doc.setFont('helvetica', 'italic')
    addWrapped(t.acknowledgment, 11, 14)
    doc.setFont('helvetica', 'normal')

    const colW = pageWidth / 3
    ;[t.date_label, t.name_label, t.signature_label].forEach((label, i) => {
      const x = marginX + i * colW
      doc.line(x, y, x + colW - 10, y)
      doc.setFontSize(9)
      doc.text(label, x, y + 5)
    })

    doc.save('angajamentul-cu-tine.pdf')
  }

  if (!isOpen) {
    return (
      <div style={s.card} onClick={() => setIsOpen(true)}>
        <div style={s.closedHeader}>
          <div>
            <span className="tag tag-orange" style={{ marginBottom: '8px', display: 'inline-block' }}>{t.tag}</span>
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
          <div style={s.printLogo}>Alignment</div>
          <h2 style={s.printTitle}>{t.title}</h2>
          <div style={s.printDivider} />

          {startingPoint && (
            <div style={s.printSection}>
              <p style={s.part0Note}>{t.part0_note}</p>
              <h3 style={s.printSectionTitle}>{t.part0_title}</h3>
              <p style={{ ...s.printText, fontStyle: 'italic' }}>{startingPoint}</p>
            </div>
          )}

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

        <p style={s.rereadNote}>{t.reread_note}</p>
        <button onClick={handleDownloadPDF} style={s.printBtn}>{t.download_pdf}</button>
        <button onClick={handlePrint} style={s.printBtnGhost}>{t.print}</button>
        <button onClick={() => setGenerated(false)} style={s.editBtn}>{t.edit}</button>

        {/* A7 — planul anual, o singura data, exact la momentul Angajamentului */}
        {justGenerated && (
          <div style={s.annualOffer}>
            <p style={s.annualOfferText}>{t.annual_offer}</p>
            <button
              onClick={() => {
                try { localStorage.setItem('subscribe_intent_plan', 'annual') } catch (e) {}
                window.location.href = '/subscribe'
              }}
              style={s.annualOfferBtn}
            >
              {t.annual_cta}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span className="tag tag-orange" style={{ marginBottom: '12px', display: 'inline-block' }}>{t.tag}</span>
        <h3 style={s.title}>{t.title}</h3>
        <p style={s.subtitle}>{t.subtitle}</p>
      </div>

      {/* partea 1 — punctul de plecare, RECITIT, nu editabil */}
      {startingPoint && (
        <div style={s.part0Box}>
          <p style={s.part0Note}>{t.part0_note}</p>
          <p style={s.part0Title}>{t.part0_title}</p>
          <p style={s.part0Text}>{startingPoint}</p>
        </div>
      )}
      {startingPoint === '' && (
        <p style={s.part0Empty}>{t.part0_empty}</p>
      )}

      <div style={s.form}>
        <div style={s.formSection}>
          <h4 style={s.formLabel}>{t.section1_title}</h4>
          <p style={s.formPrompt}>{t.section1_prompt}</p>
          <textarea
            value={sections.who}
            onChange={(e) => setSections(prev => ({ ...prev, who: e.target.value }))}
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
            onChange={(e) => setSections(prev => ({ ...prev, toward: e.target.value }))}
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
            onChange={(e) => setSections(prev => ({ ...prev, leaving: e.target.value }))}
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
            background: (sections.who.trim() && sections.toward.trim() && sections.leaving.trim()) ? 'var(--purple)' : '#4a4a5e',
            cursor: (sections.who.trim() && sections.toward.trim() && sections.leaving.trim()) ? 'pointer' : 'not-allowed',
          }}
        >
          {t.generate}
        </button>
      </div>
    </div>
  )
}

const s = {
  card: { background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '28px', marginBottom: '24px', boxShadow: 'var(--shadow)' },

  closedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' },
  closedTitle: { fontSize: '18px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '4px' },
  closedSubtitle: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' },
  toggle: { fontSize: '14px', color: 'var(--text-muted)' },

  header: { marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7' },

  part0Box: { background: 'var(--surface2)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '18px 20px', marginBottom: '24px', borderLeft: '3px solid var(--amber)' },
  part0Note: { fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' },
  part0Title: { fontSize: '15px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '8px' },
  part0Text: { fontSize: '15px', color: 'var(--amber)', lineHeight: '1.6', fontStyle: 'italic' },
  part0Empty: { fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px', fontStyle: 'italic' },

  form: {},
  formSection: { marginBottom: '28px' },
  formLabel: { fontSize: '16px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '6px' },
  formPrompt: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '12px' },
  textarea: { width: '100%', padding: '16px', border: '1.5px solid var(--border)', borderRadius: '12px', fontSize: '15px', color: 'var(--text)', background: 'var(--surface2)', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', lineHeight: '1.7', minHeight: '120px' },
  generateBtn: { width: '100%', padding: '16px', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '500', boxShadow: '0 4px 20px var(--gold-faint)' },

  printHeader: { textAlign: 'center', padding: '20px 0' },
  printLogo: { fontSize: '20px', fontWeight: '600', fontFamily: 'Cormorant Garamond, serif', color: 'var(--purple)', marginBottom: '24px' },
  printTitle: { fontSize: '28px', fontWeight: '600', color: 'var(--text)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '16px' },
  printDivider: { width: '60px', height: '2px', background: 'var(--purple)', margin: '24px auto' },
  printSection: { textAlign: 'left', marginBottom: '28px', padding: '0 12px' },
  printSectionTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--purple)', fontFamily: 'Cormorant Garamond, serif', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  printText: { fontSize: '15px', color: 'var(--text)', lineHeight: '1.8' },
  acknowledgment: { fontSize: '14px', color: 'var(--text)', fontStyle: 'italic', textAlign: 'center', marginBottom: '32px' },
  signatureArea: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', padding: '0 12px' },
  signatureField: { textAlign: 'center' },
  signatureLine: { borderBottom: '1px solid var(--text)', height: '40px', marginBottom: '8px' },
  signatureLabel: { fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  rereadNote: { fontSize: '12px', color: 'var(--text-light)', textAlign: 'center', marginTop: '8px', marginBottom: '16px' },
  printBtn: { width: '100%', padding: '14px', background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '8px' },
  printBtnGhost: { width: '100%', padding: '12px', background: 'transparent', color: 'var(--text)', border: '1.5px solid var(--border)', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', marginBottom: '8px' },
  editBtn: { width: '100%', padding: '12px', background: 'transparent', color: 'var(--text-muted)', border: '1.5px solid var(--border)', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' },
  annualOffer: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' },
  annualOfferText: { fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '10px' },
  annualOfferBtn: { padding: '10px 20px', background: 'transparent', color: 'var(--amber)', border: '1.5px solid var(--amber)', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
}
