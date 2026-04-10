'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { t } from '../../lib/translations'

const QUESTIONS = {
  en: [
    {
      id: 'self_knowledge',
      question: 'How well do you know yourself?',
      subtitle: 'Your patterns, your energy, what drives you and what holds you back.',
      options: [
        { value: 1, label: 'Not at all', emoji: '😶' },
        { value: 2, label: 'A little', emoji: '🤔' },
        { value: 3, label: 'Somewhat', emoji: '🙂' },
        { value: 4, label: 'Quite well', emoji: '😊' },
        { value: 5, label: 'Very well', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Do you consciously work on yourself?',
      subtitle: 'Habits, reflection, personal growth — intentionally, not just when forced.',
      options: [
        { value: 'yes', label: 'Yes, consistently', emoji: '✦' },
        { value: 'sometimes', label: 'Sometimes', emoji: '🌱' },
        { value: 'not_really', label: 'Not really', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'How often do you keep promises to yourself?',
      subtitle: 'The ones only you know about — habits, commitments, changes you said you\'d make.',
      options: [
        { value: 'always', label: 'Almost always', emoji: '✦' },
        { value: 'sometimes', label: 'Sometimes', emoji: '🌱' },
        { value: 'rarely', label: 'Rarely', emoji: '😔' },
      ]
    }
  ],
  ro: [
    {
      id: 'self_knowledge',
      question: 'Cât de bine te cunoști pe tine însuți?',
      subtitle: 'Tiparele tale, energia ta, ce te motivează și ce te oprește.',
      options: [
        { value: 1, label: 'Deloc', emoji: '😶' },
        { value: 2, label: 'Puțin', emoji: '🤔' },
        { value: 3, label: 'Oarecum', emoji: '🙂' },
        { value: 4, label: 'Destul de bine', emoji: '😊' },
        { value: 5, label: 'Foarte bine', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Lucrezi conștient la tine?',
      subtitle: 'Obiceiuri, reflecție, creștere personală — intenționat, nu doar când ești forțat.',
      options: [
        { value: 'yes', label: 'Da, consistent', emoji: '✦' },
        { value: 'sometimes', label: 'Uneori', emoji: '🌱' },
        { value: 'not_really', label: 'Nu prea', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'Cât de des îți ții promisiunile față de tine?',
      subtitle: 'Cele pe care le știi doar tu — obiceiuri, angajamente, schimbări pe care ai zis că le vei face.',
      options: [
        { value: 'always', label: 'Aproape întotdeauna', emoji: '✦' },
        { value: 'sometimes', label: 'Uneori', emoji: '🌱' },
        { value: 'rarely', label: 'Rar', emoji: '😔' },
      ]
    }
  ],
  es: [
    {
      id: 'self_knowledge',
      question: '¿Qué tan bien te conoces a ti mismo?',
      subtitle: 'Tus patrones, tu energía, qué te motiva y qué te detiene.',
      options: [
        { value: 1, label: 'Para nada', emoji: '😶' },
        { value: 2, label: 'Un poco', emoji: '🤔' },
        { value: 3, label: 'Algo', emoji: '🙂' },
        { value: 4, label: 'Bastante bien', emoji: '😊' },
        { value: 5, label: 'Muy bien', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: '¿Trabajas conscientemente en ti mismo?',
      subtitle: 'Hábitos, reflexión, crecimiento personal — intencionalmente, no solo cuando te obligan.',
      options: [
        { value: 'yes', label: 'Sí, consistentemente', emoji: '✦' },
        { value: 'sometimes', label: 'A veces', emoji: '🌱' },
        { value: 'not_really', label: 'No realmente', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: '¿Con qué frecuencia cumples las promesas que te haces?',
      subtitle: 'Las que solo tú conoces — hábitos, compromisos, cambios que dijiste que harías.',
      options: [
        { value: 'always', label: 'Casi siempre', emoji: '✦' },
        { value: 'sometimes', label: 'A veces', emoji: '🌱' },
        { value: 'rarely', label: 'Rara vez', emoji: '😔' },
      ]
    }
  ],
  fr: [
    {
      id: 'self_knowledge',
      question: 'À quel point te connais-tu toi-même ?',
      subtitle: 'Tes schémas, ton énergie, ce qui te motive et ce qui te retient.',
      options: [
        { value: 1, label: 'Pas du tout', emoji: '😶' },
        { value: 2, label: 'Un peu', emoji: '🤔' },
        { value: 3, label: 'Assez', emoji: '🙂' },
        { value: 4, label: 'Assez bien', emoji: '😊' },
        { value: 5, label: 'Très bien', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Travailles-tu consciemment sur toi-même ?',
      subtitle: 'Habitudes, réflexion, croissance personnelle — intentionnellement, pas seulement quand tu y es forcé.',
      options: [
        { value: 'yes', label: 'Oui, régulièrement', emoji: '✦' },
        { value: 'sometimes', label: 'Parfois', emoji: '🌱' },
        { value: 'not_really', label: 'Pas vraiment', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'À quelle fréquence tiens-tu tes promesses envers toi-même ?',
      subtitle: 'Celles que toi seul connais — habitudes, engagements, changements que tu t\'étais promis de faire.',
      options: [
        { value: 'always', label: 'Presque toujours', emoji: '✦' },
        { value: 'sometimes', label: 'Parfois', emoji: '🌱' },
        { value: 'rarely', label: 'Rarement', emoji: '😔' },
      ]
    }
  ],
  de: [
    {
      id: 'self_knowledge',
      question: 'Wie gut kennst du dich selbst?',
      subtitle: 'Deine Muster, deine Energie, was dich antreibt und was dich zurückhält.',
      options: [
        { value: 1, label: 'Gar nicht', emoji: '😶' },
        { value: 2, label: 'Ein wenig', emoji: '🤔' },
        { value: 3, label: 'Etwas', emoji: '🙂' },
        { value: 4, label: 'Ziemlich gut', emoji: '😊' },
        { value: 5, label: 'Sehr gut', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Arbeitest du bewusst an dir selbst?',
      subtitle: 'Gewohnheiten, Reflexion, persönliches Wachstum — absichtlich, nicht nur wenn du dazu gezwungen bist.',
      options: [
        { value: 'yes', label: 'Ja, konsequent', emoji: '✦' },
        { value: 'sometimes', label: 'Manchmal', emoji: '🌱' },
        { value: 'not_really', label: 'Nicht wirklich', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'Wie oft hältst du Versprechen, die du dir selbst gibst?',
      subtitle: 'Die, die nur du kennst — Gewohnheiten, Verpflichtungen, Änderungen, die du dir vorgenommen hast.',
      options: [
        { value: 'always', label: 'Fast immer', emoji: '✦' },
        { value: 'sometimes', label: 'Manchmal', emoji: '🌱' },
        { value: 'rarely', label: 'Selten', emoji: '😔' },
      ]
    }
  ],
  it: [
    {
      id: 'self_knowledge',
      question: 'Quanto ti conosci bene?',
      subtitle: 'I tuoi schemi, la tua energia, cosa ti motiva e cosa ti trattiene.',
      options: [
        { value: 1, label: 'Per niente', emoji: '😶' },
        { value: 2, label: 'Un po\'', emoji: '🤔' },
        { value: 3, label: 'Abbastanza', emoji: '🙂' },
        { value: 4, label: 'Abbastanza bene', emoji: '😊' },
        { value: 5, label: 'Molto bene', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Lavori consciamente su te stesso?',
      subtitle: 'Abitudini, riflessione, crescita personale — intenzionalmente, non solo quando sei costretto.',
      options: [
        { value: 'yes', label: 'Sì, in modo coerente', emoji: '✦' },
        { value: 'sometimes', label: 'A volte', emoji: '🌱' },
        { value: 'not_really', label: 'Non proprio', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'Quanto spesso mantieni le promesse che fai a te stesso?',
      subtitle: 'Quelle che solo tu conosci — abitudini, impegni, cambiamenti che ti eri promesso di fare.',
      options: [
        { value: 'always', label: 'Quasi sempre', emoji: '✦' },
        { value: 'sometimes', label: 'A volte', emoji: '🌱' },
        { value: 'rarely', label: 'Raramente', emoji: '😔' },
      ]
    }
  ],
  pt: [
    {
      id: 'self_knowledge',
      question: 'Quão bem você se conhece?',
      subtitle: 'Seus padrões, sua energia, o que te motiva e o que te impede.',
      options: [
        { value: 1, label: 'De jeito nenhum', emoji: '😶' },
        { value: 2, label: 'Um pouco', emoji: '🤔' },
        { value: 3, label: 'Razoavelmente', emoji: '🙂' },
        { value: 4, label: 'Bastante bem', emoji: '😊' },
        { value: 5, label: 'Muito bem', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Você trabalha conscientemente em si mesmo?',
      subtitle: 'Hábitos, reflexão, crescimento pessoal — intencionalmente, não apenas quando forçado.',
      options: [
        { value: 'yes', label: 'Sim, consistentemente', emoji: '✦' },
        { value: 'sometimes', label: 'Às vezes', emoji: '🌱' },
        { value: 'not_really', label: 'Não muito', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'Com que frequência você cumpre promessas a si mesmo?',
      subtitle: 'As que só você sabe — hábitos, compromissos, mudanças que você disse que faria.',
      options: [
        { value: 'always', label: 'Quase sempre', emoji: '✦' },
        { value: 'sometimes', label: 'Às vezes', emoji: '🌱' },
        { value: 'rarely', label: 'Raramente', emoji: '😔' },
      ]
    }
  ],
  nl: [
    {
      id: 'self_knowledge',
      question: 'Hoe goed ken je jezelf?',
      subtitle: 'Je patronen, je energie, wat je drijft en wat je tegenhoudt.',
      options: [
        { value: 1, label: 'Helemaal niet', emoji: '😶' },
        { value: 2, label: 'Een beetje', emoji: '🤔' },
        { value: 3, label: 'Enigszins', emoji: '🙂' },
        { value: 4, label: 'Vrij goed', emoji: '😊' },
        { value: 5, label: 'Heel goed', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Werk je bewust aan jezelf?',
      subtitle: 'Gewoonten, reflectie, persoonlijke groei — bewust, niet alleen als je gedwongen wordt.',
      options: [
        { value: 'yes', label: 'Ja, consequent', emoji: '✦' },
        { value: 'sometimes', label: 'Soms', emoji: '🌱' },
        { value: 'not_really', label: 'Niet echt', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'Hoe vaak houd je beloftes aan jezelf?',
      subtitle: 'De beloftes die alleen jij kent — gewoonten, verbintenissen, veranderingen die je jezelf had beloofd.',
      options: [
        { value: 'always', label: 'Bijna altijd', emoji: '✦' },
        { value: 'sometimes', label: 'Soms', emoji: '🌱' },
        { value: 'rarely', label: 'Zelden', emoji: '😔' },
      ]
    }
  ],
  pl: [
    {
      id: 'self_knowledge',
      question: 'Jak dobrze znasz siebie?',
      subtitle: 'Twoje wzorce, energia, co cię motywuje i co cię powstrzymuje.',
      options: [
        { value: 1, label: 'Wcale', emoji: '😶' },
        { value: 2, label: 'Trochę', emoji: '🤔' },
        { value: 3, label: 'Częściowo', emoji: '🙂' },
        { value: 4, label: 'Całkiem dobrze', emoji: '😊' },
        { value: 5, label: 'Bardzo dobrze', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Czy świadomie pracujesz nad sobą?',
      subtitle: 'Nawyki, refleksja, rozwój osobisty — celowo, nie tylko gdy jesteś zmuszony.',
      options: [
        { value: 'yes', label: 'Tak, konsekwentnie', emoji: '✦' },
        { value: 'sometimes', label: 'Czasami', emoji: '🌱' },
        { value: 'not_really', label: 'Nie bardzo', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'Jak często dotrzymujesz obietnic samemu sobie?',
      subtitle: 'Tych, które zna tylko ty — nawyki, zobowiązania, zmiany, które obiecałeś sobie wprowadzić.',
      options: [
        { value: 'always', label: 'Prawie zawsze', emoji: '✦' },
        { value: 'sometimes', label: 'Czasami', emoji: '🌱' },
        { value: 'rarely', label: 'Rzadko', emoji: '😔' },
      ]
    }
  ],
  hu: [
    {
      id: 'self_knowledge',
      question: 'Mennyire ismered magad?',
      subtitle: 'A mintáid, az energiád, mi motivál és mi tart vissza.',
      options: [
        { value: 1, label: 'Egyáltalán nem', emoji: '😶' },
        { value: 2, label: 'Kicsit', emoji: '🤔' },
        { value: 3, label: 'Valamennyire', emoji: '🙂' },
        { value: 4, label: 'Elég jól', emoji: '😊' },
        { value: 5, label: 'Nagyon jól', emoji: '✦' },
      ]
    },
    {
      id: 'conscious_work',
      question: 'Tudatosan dolgozol magadon?',
      subtitle: 'Szokások, reflexió, személyes fejlődés — szándékosan, nem csak amikor kénytelen vagy.',
      options: [
        { value: 'yes', label: 'Igen, következetesen', emoji: '✦' },
        { value: 'sometimes', label: 'Néha', emoji: '🌱' },
        { value: 'not_really', label: 'Nem igazán', emoji: '😔' },
      ]
    },
    {
      id: 'promises',
      question: 'Milyen gyakran tartod be a magadnak tett ígéreteket?',
      subtitle: 'Azokat, amelyeket csak te tudsz — szokások, kötelezettségek, változások, amelyeket megígértél magadnak.',
      options: [
        { value: 'always', label: 'Majdnem mindig', emoji: '✦' },
        { value: 'sometimes', label: 'Néha', emoji: '🌱' },
        { value: 'rarely', label: 'Ritkán', emoji: '😔' },
      ]
    }
  ]
}

const RESPONSES = {
  en: {
    low: "That's honest. Most people don't even ask this question.\nYour profile will show you exactly where to start.",
    medium: "You're on the path. The profile will sharpen what you already sense about yourself.",
    high: "Good. Now let's make it precise. Your profile will confirm what you know and reveal what you don't."
  },
  ro: {
    low: "Asta e onest. Majoritatea oamenilor nici nu pun această întrebare.\nProfilul tău îți va arăta exact de unde să începi.",
    medium: "Ești pe drum. Profilul va clarifica ceea ce deja simți despre tine.",
    high: "Bine. Acum hai să fie precis. Profilul va confirma ce știi și va dezvălui ce nu știi."
  },
  es: {
    low: "Eso es honesto. La mayoría de las personas ni siquiera hacen esta pregunta.\nTu perfil te mostrará exactamente por dónde empezar.",
    medium: "Estás en el camino. El perfil aclarará lo que ya intuyes sobre ti mismo.",
    high: "Bien. Ahora hagámoslo preciso. El perfil confirmará lo que sabes y revelará lo que no."
  },
  fr: {
    low: "C'est honnête. La plupart des gens ne posent même pas cette question.\nTon profil te montrera exactement où commencer.",
    medium: "Tu es sur la bonne voie. Le profil affinera ce que tu ressens déjà sur toi-même.",
    high: "Bien. Maintenant rendons cela précis. Le profil confirmera ce que tu sais et révélera ce que tu ne sais pas."
  },
  de: {
    low: "Das ist ehrlich. Die meisten Menschen stellen sich diese Frage nicht einmal.\nDein Profil zeigt dir genau, wo du anfangen sollst.",
    medium: "Du bist auf dem Weg. Das Profil wird schärfen, was du bereits über dich selbst spürst.",
    high: "Gut. Jetzt machen wir es präzise. Das Profil bestätigt, was du weißt und enthüllt, was du nicht weißt."
  },
  it: {
    low: "È onesto. La maggior parte delle persone non si pone nemmeno questa domanda.\nIl tuo profilo ti mostrerà esattamente da dove iniziare.",
    medium: "Sei sulla strada giusta. Il profilo affinerà ciò che già percepisci di te stesso.",
    high: "Bene. Ora rendiamolo preciso. Il profilo confermerà ciò che sai e rivelerà ciò che non sai."
  },
  pt: {
    low: "Isso é honesto. A maioria das pessoas nem faz essa pergunta.\nSeu perfil mostrará exatamente por onde começar.",
    medium: "Você está no caminho. O perfil vai apurar o que você já sente sobre si mesmo.",
    high: "Bem. Agora vamos tornar isso preciso. O perfil confirmará o que você sabe e revelará o que não sabe."
  },
  nl: {
    low: "Dat is eerlijk. De meeste mensen stellen deze vraag niet eens.\nJouw profiel laat je precies zien waar je moet beginnen.",
    medium: "Je bent op de goede weg. Het profiel zal aanscherpen wat je al aanvoelt over jezelf.",
    high: "Goed. Laten we het nu preciezer maken. Het profiel bevestigt wat je weet en onthult wat je niet weet."
  },
  pl: {
    low: "To szczere. Większość ludzi nawet nie zadaje sobie tego pytania.\nTwój profil pokaże ci dokładnie, od czego zacząć.",
    medium: "Jesteś na właściwej drodze. Profil sprecyzuje to, co już czujesz o sobie.",
    high: "Dobrze. Teraz uczyńmy to precyzyjnym. Profil potwierdzi to, co wiesz i ujawni to, czego nie wiesz."
  },
  hu: {
    low: "Ez őszinte. A legtöbb ember ezt a kérdést sem teszi fel magának.\nA profilod megmutatja, hol kezdj el.",
    medium: "Jó úton jársz. A profil pontosítja, amit már érzel magadról.",
    high: "Jó. Most tegyük pontossá. A profil megerősíti, amit tudsz, és feltárja, amit nem."
  }
}

function getScore(answers) {
  const sk = answers.self_knowledge || 0
  const cw = answers.conscious_work === 'yes' ? 3 : answers.conscious_work === 'sometimes' ? 2 : 1
  const p = answers.promises === 'always' ? 3 : answers.promises === 'sometimes' ? 2 : 1
  return sk + cw + p
}

function getResponse(answers, lang) {
  const score = getScore(answers)
  const r = RESPONSES[lang] || RESPONSES['en']
  if (score <= 5) return r.low
  if (score <= 8) return r.medium
  return r.high
}

export default function IntroPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [step, setStep] = useState(0) // 0 = lang select, 1-3 = questions, 4 = response
  const [answers, setAnswers] = useState({})

  const questions = QUESTIONS[lang] || QUESTIONS['en']
  const currentQ = questions[step - 1]

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value }
    setAnswers(newAnswers)
    if (step < 3) {
      setStep(step + 1)
    } else {
      setStep(4)
    }
  }

  const handleContinue = () => {
    router.push(`/onboarding?lang=${lang}`)
  }

  if (step === 0) {
    return (
      <>
        <div className="cosmic-bg" />
        <main style={s.wrap}>
          <div style={s.card}>
            <div style={s.eyebrow}>
              <span className="tag tag-purple">✦ Self Alignment</span>
            </div>
            <h1 style={s.title}>Before we begin.</h1>
            <p style={s.subtitle}>Three quick questions. No right or wrong answers. Just honesty.</p>
            <p style={s.langLabel}>Choose your language:</p>
            <div style={s.langGrid}>
              {[
                { code:'en', label:'English', flag:'🇬🇧' },
                { code:'ro', label:'Română', flag:'🇷🇴' },
                { code:'es', label:'Español', flag:'🇪🇸' },
                { code:'fr', label:'Français', flag:'🇫🇷' },
                { code:'de', label:'Deutsch', flag:'🇩🇪' },
                { code:'it', label:'Italiano', flag:'🇮🇹' },
                { code:'pt', label:'Português', flag:'🇵🇹' },
                { code:'nl', label:'Nederlands', flag:'🇳🇱' },
                { code:'pl', label:'Polski', flag:'🇵🇱' },
                { code:'hu', label:'Magyar', flag:'🇭🇺' },
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setStep(1) }}
                  style={s.langBtn}
                >
                  <span style={s.langFlag}>{l.flag}</span>
                  <span style={s.langName}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  if (step === 4) {
    const response = getResponse(answers, lang)
    return (
      <>
        <div className="cosmic-bg" />
        <main style={s.wrap}>
          <div style={s.card}>
            <div style={s.progressRow}>
              {[1,2,3].map(i => (
                <div key={i} style={{...s.progressDot, background:'var(--purple)'}} />
              ))}
            </div>
            <div style={{fontSize:'48px', marginBottom:'24px', textAlign:'center'}}>✦</div>
            <p style={s.response}>{response}</p>
            <button onClick={handleContinue} style={s.continueBtn}>
              {lang === 'ro' ? 'Generează Profilul Meu →' :
               lang === 'es' ? 'Generar Mi Perfil →' :
               lang === 'fr' ? 'Générer Mon Profil →' :
               lang === 'de' ? 'Mein Profil Generieren →' :
               lang === 'it' ? 'Genera Il Mio Profilo →' :
               lang === 'pt' ? 'Gerar Meu Perfil →' :
               lang === 'nl' ? 'Genereer Mijn Profiel →' :
               lang === 'pl' ? 'Wygeneruj Mój Profil →' :
               lang === 'hu' ? 'Profil Létrehozása →' :
               'Generate My Profile →'}
            </button>
            <p style={s.micro}>Takes 30 seconds. Free.</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <div className="cosmic-bg" />
      <main style={s.wrap}>
        <div style={s.card}>
          <div style={s.progressRow}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                ...s.progressDot,
                background: i <= step ? 'var(--purple)' : 'var(--border)'
              }} />
            ))}
          </div>
          <p style={s.qNum}>{step} / 3</p>
          <h2 style={s.question}>{currentQ.question}</h2>
          <p style={s.qSubtitle}>{currentQ.subtitle}</p>
          <div style={s.options}>
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.value)}
                style={s.optionBtn}
              >
                <span style={s.optionEmoji}>{opt.emoji}</span>
                <span style={s.optionLabel}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

const s = {
  wrap: { maxWidth:'520px', margin:'0 auto', padding:'60px 24px 80px' },
  card: { background:'var(--surface)', borderRadius:'var(--radius)', border:'1px solid var(--border)', padding:'40px', boxShadow:'var(--shadow-lg)' },
  eyebrow: { textAlign:'center', marginBottom:'20px' },
  title: { fontSize:'36px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'12px', textAlign:'center' },
  subtitle: { fontSize:'15px', color:'var(--text-muted)', lineHeight:'1.7', marginBottom:'32px', textAlign:'center' },
  langLabel: { fontSize:'13px', fontWeight:'600', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'16px' },
  langGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' },
  langBtn: { display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'10px', cursor:'pointer', fontSize:'14px', fontWeight:'500', color:'var(--text)', transition:'all 0.15s' },
  langFlag: { fontSize:'20px' },
  langName: { fontSize:'14px', fontWeight:'500' },
  progressRow: { display:'flex', gap:'8px', justifyContent:'center', marginBottom:'32px' },
  progressDot: { width:'40px', height:'4px', borderRadius:'2px', transition:'background 0.3s' },
  qNum: { fontSize:'12px', fontWeight:'600', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px', textAlign:'center' },
  question: { fontSize:'26px', fontWeight:'600', color:'var(--text)', fontFamily:'Cormorant Garamond, serif', marginBottom:'10px', lineHeight:'1.3', textAlign:'center' },
  qSubtitle: { fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'32px', textAlign:'center' },
  options: { display:'flex', flexDirection:'column', gap:'10px' },
  optionBtn: { display:'flex', alignItems:'center', gap:'14px', padding:'16px 20px', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:'12px', cursor:'pointer', fontSize:'15px', fontWeight:'500', color:'var(--text)', textAlign:'left', transition:'all 0.15s' },
  optionEmoji: { fontSize:'22px', flexShrink:0 },
  optionLabel: { fontSize:'15px', fontWeight:'500' },
  response: { fontSize:'18px', color:'var(--text)', lineHeight:'1.8', marginBottom:'32px', textAlign:'center', fontFamily:'Cormorant Garamond, serif', whiteSpace:'pre-line' },
  continueBtn: { width:'100%', padding:'16px', background:'var(--purple)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'500', cursor:'pointer', boxShadow:'0 4px 20px rgba(124,92,191,0.3)', marginBottom:'12px' },
  micro: { textAlign:'center', fontSize:'12px', color:'var(--text-light)' }
}