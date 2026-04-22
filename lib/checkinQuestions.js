// Check-in Questions Bank
// 10 questions × 3 categories × 5 HD types × 10 languages
// Zero API cost — all static content
// getDailyCheckinQuestions(hdType, lang) returns 3 questions (1 per category) rotating daily

const QUESTIONS = {
  en: {
    Generator: {
      mirroring: [
        "Did you feel a genuine pull toward your work today, or were you pushing through?",
        "When did your body give you a clear yes or no signal today?",
        "Were you responding to what life brought you, or forcing an outcome?",
        "How much of today was spent on things that truly light you up?",
        "Did you honor your need to rest when your energy dipped?",
        "Were you doing work that made you feel satisfied, or just busy?",
        "When did you feel most in flow today?",
        "Did you say yes to something your gut said no to?",
        "How aligned was your energy with how you spent your time?",
        "Did you wait for the right moment, or jump in too quickly?"
      ],
      gratitude: [
        "What gave you deep satisfaction today?",
        "What responded to you in a way that felt right?",
        "Name one moment where your energy felt perfectly matched to the task.",
        "What opportunity showed up today that you didn't plan?",
        "What part of your work felt effortless today?",
        "Who or what lit up your sacral energy today?",
        "What small win brought you genuine joy?",
        "What are you grateful your body told you today?",
        "Name something that felt like a true yes in your gut.",
        "What moment today reminded you why you do what you do?"
      ],
      intention: [
        "Tomorrow, what will you wait to respond to before acting?",
        "What is one thing you can say no to, so your yes means more?",
        "How will you protect your energy for what truly matters?",
        "What would it look like to trust your gut response more tomorrow?",
        "What can you let go of that's draining your life force?",
        "How will you create space for something satisfying to show up?",
        "What boundary will you set to honor your energy?",
        "Tomorrow, how will you notice when you're pushing instead of flowing?",
        "What is one way you'll prioritize satisfaction over productivity?",
        "How will you stay open to responding rather than initiating?"
      ]
    },
    'Manifesting Generator': {
      mirroring: [
        "Did you follow your excitement today, even when it seemed scattered?",
        "Were you multi-tasking from joy or from stress?",
        "Did you honor the urge to pivot when something stopped feeling right?",
        "How many of your activities today came from a genuine gut response?",
        "Did you give yourself permission to move fast without guilt?",
        "Were you skipping steps wisely, or cutting corners from impatience?",
        "Did you let yourself explore multiple interests without judgment?",
        "When did you feel your signature satisfaction today?",
        "Did you inform people before making changes, or blindside them?",
        "How well did you balance speed with presence today?"
      ],
      gratitude: [
        "What unexpected path opened up for you today?",
        "Name a moment when your speed and instinct served you perfectly.",
        "What are you grateful you had the courage to pivot toward?",
        "Which of your many interests brought you the most alive today?",
        "What efficiency or shortcut saved you energy for the good stuff?",
        "Who appreciated your energy and pace today?",
        "What felt electric and exciting in your body today?",
        "Name something you're grateful you quit or dropped.",
        "What connection between two different interests surprised you?",
        "What moment of satisfaction do you want to remember?"
      ],
      intention: [
        "Tomorrow, how will you honor your need to follow excitement?",
        "What can you inform others about before you pivot?",
        "How will you give yourself permission to be multi-passionate?",
        "What step can you skip tomorrow without sacrificing quality?",
        "How will you balance your speed with patience for others?",
        "What will you commit to responding to, not initiating?",
        "How can you channel your energy toward fewer, deeper things?",
        "Tomorrow, what will you drop if it stops feeling right?",
        "How will you communicate your changes to those affected?",
        "What would full permission to be yourself look like tomorrow?"
      ]
    },
    Manifestor: {
      mirroring: [
        "Did you inform the people around you before taking action today?",
        "Were you initiating from a place of peace, or from anger?",
        "Did you honor your need for solitude and rest?",
        "How much resistance did you encounter, and was it external or internal?",
        "Did you feel at peace with your impact today?",
        "Were you forcing doors open, or finding the ones already unlocked?",
        "Did you allow yourself to rest without guilt?",
        "How honest were you about what you truly wanted?",
        "Did you consider how your actions affected others?",
        "Were you leading from vision or from frustration?"
      ],
      gratitude: [
        "What did you successfully initiate today?",
        "Name a moment where your impact felt clean and clear.",
        "What are you grateful you had the courage to start?",
        "Who supported your vision today?",
        "What peace did you find in your independence?",
        "What creative urge did you honor today?",
        "Name a moment when informing others smoothed your path.",
        "What boundary protected your energy today?",
        "What felt powerful about being yourself today?",
        "What new thing did you set in motion?"
      ],
      intention: [
        "Tomorrow, who needs to be informed about your plans?",
        "How will you create space for your creative urges?",
        "What will you initiate that's been waiting for your energy?",
        "How will you balance independence with informing others?",
        "What rest do you need to protect your creative power?",
        "How will you respond to anger as a signal, not a weapon?",
        "What impact do you want to have tomorrow?",
        "How will you make space for the unexpected?",
        "What needs your initiating energy most right now?",
        "Tomorrow, how will you lead without bulldozing?"
      ]
    },
    Projector: {
      mirroring: [
        "Did you wait for an invitation before offering guidance today?",
        "Were you recognized for your wisdom, or did you feel invisible?",
        "How much of today did you spend managing others' energy wisely?",
        "Did you rest enough to maintain your clarity?",
        "Were you guiding, or were you trying to do the work yourself?",
        "Did you feel bitter about anything today? What does that signal?",
        "How well did you manage your limited energy today?",
        "Did you offer advice only when asked, or push it uninvited?",
        "Were you studying and mastering what interests you?",
        "How present were you in one-on-one interactions today?"
      ],
      gratitude: [
        "Who recognized and valued your insight today?",
        "What did you see clearly that others missed?",
        "Name a moment where your guidance truly landed.",
        "What system or person did you help optimize today?",
        "What are you grateful you waited for?",
        "What deep rest replenished you today?",
        "Who invited you into something meaningful?",
        "What mastery or study brought you joy today?",
        "Name a moment where less effort created more impact.",
        "What quality one-on-one connection nourished you?"
      ],
      intention: [
        "Tomorrow, where will you wait for the invitation?",
        "How will you protect your energy for what truly matters?",
        "What system or person could benefit from your insight?",
        "How will you rest before you're depleted?",
        "What will you study or master that excites you?",
        "How will you handle bitterness if it arises?",
        "Tomorrow, how will you let your recognition come to you?",
        "What one-on-one connection will you invest in?",
        "How will you guide without overextending?",
        "What invitation are you hoping for, and how can you be ready?"
      ]
    },
    Reflector: {
      mirroring: [
        "How did your environment affect your mood and energy today?",
        "Did you give yourself enough time before making decisions?",
        "Whose energy did you absorb today — and was it yours to carry?",
        "How well did you reflect the health of your community today?",
        "Did you feel surprised by anything you felt today?",
        "Were you honoring your need for a full lunar cycle on big decisions?",
        "How different did you feel compared to yesterday?",
        "Did you create enough space for solitude and reflection?",
        "Were you sampling different experiences, or getting stuck in one?",
        "How well did you protect your openness today?"
      ],
      gratitude: [
        "What environment made you feel truly good today?",
        "Name a moment of clarity that came from reflecting, not acting.",
        "What surprised and delighted you about today?",
        "Who created a safe space for you to be yourself?",
        "What did your sensitivity reveal that others missed?",
        "What lunar phase wisdom served you today?",
        "Name something beautiful you noticed that others overlooked.",
        "What community or group made you feel whole today?",
        "What change in yourself today felt interesting rather than scary?",
        "What are you grateful your openness allowed you to experience?"
      ],
      intention: [
        "Tomorrow, how will you choose your environment wisely?",
        "What big decision will you give more time before finalizing?",
        "How will you release energy that isn't yours?",
        "What community needs your mirror and reflection?",
        "How will you protect your openness without closing down?",
        "Tomorrow, what experience do you want to sample?",
        "How will you honor your need for solitude?",
        "What environment will you avoid to protect your well-being?",
        "How will you notice the difference between your feelings and others'?",
        "What is one way you'll let yourself be surprised tomorrow?"
      ]
    }
  }
}

// Translated labels for categories
const CATEGORY_LABELS = {
  en: { mirroring: 'mirroring', gratitude: 'gratitude', intention: 'intention' },
  ro: { mirroring: 'oglindire', gratitude: 'recunoștință', intention: 'intenție' },
  es: { mirroring: 'reflejo', gratitude: 'gratitud', intention: 'intención' },
  fr: { mirroring: 'miroir', gratitude: 'gratitude', intention: 'intention' },
  de: { mirroring: 'Spiegelung', gratitude: 'Dankbarkeit', intention: 'Absicht' },
  it: { mirroring: 'specchio', gratitude: 'gratitudine', intention: 'intenzione' },
  pt: { mirroring: 'espelho', gratitude: 'gratidão', intention: 'intenção' },
  nl: { mirroring: 'spiegel', gratitude: 'dankbaarheid', intention: 'intentie' },
  pl: { mirroring: 'lustro', gratitude: 'wdzięczność', intention: 'intencja' },
  hu: { mirroring: 'tükör', gratitude: 'hála', intention: 'szándék' }
}

/**
 * Get 3 daily check-in questions (1 per category), rotating by day of year
 * @param {string} hdType - Human Design type
 * @param {string} lang - Language code
 * @returns {Array<{id: string, category: string, question: string}>}
 */
export function getDailyCheckinQuestions(hdType, lang = 'en') {
  // Use EN questions for all languages (questions are reflective/personal, EN works as base)
  // Category labels are translated for UI display
  const langData = QUESTIONS[lang] || QUESTIONS.en
  const typeData = langData[hdType] || langData['Generator']
  
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  
  const categories = ['mirroring', 'gratitude', 'intention']
  
  return categories.map((cat, i) => {
    const pool = typeData[cat]
    const index = (dayOfYear + i) % pool.length
    return {
      id: `${cat}-${index}`,
      category: cat,
      question: pool[index]
    }
  })
}