// lib/prompts/terminology/de.js

export const hdTerms = {
  types: {
    'Generator': 'Generator',
    'Manifesting Generator': 'Manifestierender Generator',
    'Manifestor': 'Manifestor',
    'Projector': 'Projektor',
    'Reflector': 'Reflektor',
  },
  strategies: {
    'Wait to respond': 'Warten und reagieren',
    'Wait to respond then inform': 'Warten, reagieren und informieren',
    'Inform before acting': 'Informieren bevor man handelt',
    'Wait for the invitation': 'Auf die Einladung warten',
    'Wait a lunar cycle': 'Einen Mondzyklus abwarten',
  },
  authorities: {
    'Emotional': 'Emotionale Autorität',
    'Sacral': 'Sakrale Autorität',
    'Splenic': 'Milzautorität',
    'Ego / Heart': 'Ego- / Herzautorität',
    'Self-Projected': 'Selbstprojizierte Autorität',
    'Mental': 'Mentale Autorität',
    'Lunar': 'Lunare Autorität',
  },
  centers: {
    'Head': 'Kopfzentrum',
    'Ajna': 'Ajna-Zentrum',
    'Throat': 'Kehlzentrum',
    'G': 'G-Zentrum (Identität)',
    'Heart': 'Herzzentrum',
    'Solar Plexus': 'Solarplexus',
    'Sacral': 'Sakralzentrum',
    'Spleen': 'Milzzentrum',
    'Root': 'Wurzelzentrum',
  },
  misc: {
    'Gates': 'Tore',
    'Channels': 'Kanäle',
    'Profile': 'Profil',
    'Incarnation Cross': 'Inkarnationskreuz',
    'Defined': 'Definiert',
    'Undefined': 'Undefiniert',
    'Right Angle Cross': 'Rechtwinkliges Kreuz',
    'Left Angle Cross': 'Linkswinkliges Kreuz',
    'Juxtaposition Cross': 'Nebeneinanderstellungskreuz',
  },
}

export const astroTerms = {
  'Sun sign': 'Sonnenzeichen',
  'Moon sign': 'Mondzeichen',
  'Rising': 'Aszendent',
  'Ascendant': 'Aszendent',
  'Planetary ruler': 'Herrscherplanet',
  'Cardinal': 'Kardinal',
  'Fixed': 'Fix',
  'Mutable': 'Veränderlich',
  'Fire': 'Feuer',
  'Earth': 'Erde',
  'Air': 'Luft',
  'Water': 'Wasser',
}

export const numerologyTerms = {
  'Life Path': 'Lebensweg',
  'Expression Number': 'Ausdruckszahl',
  'Soul Urge': 'Seelenimpuls',
  'Personal Year': 'Persönliches Jahr',
  'Personal Month': 'Persönlicher Monat',
  'Personality Number': 'Persönlichkeitszahl',
}

export const grammarRules = `
GRAMMATIKREGELN FÜR DEUTSCH — VERBINDLICH:
1. Zweite Person Singular ("du") durchgehend verwenden. Nicht mit dritter Person oder "Sie" wechseln.
2. Striktes Genus-, Kasus- und Numeruskongruenz bei Adjektiven, Partizipien und Pronomen. Artikel korrekt: der/die/das je nach Substantiv.
3. Das Geschlecht der nutzenden Person ist unbekannt — geschlechtsneutrale Formulierungen verwenden. Statt "du bist bereit" → "du hast die nötige Bereitschaft". Statt "du bist ein guter Zuhörer/Zuhörerin" → "du hörst sehr gut zu".
4. Null englische Wörter im Text. Wenn technische Begriffe in den Daten auf Englisch ankommen, vor der Verwendung übersetzen.
5. Vollständige Sätze mit Subjekt und Prädikat. Keine Fragmente.
6. Natürliches Deutsch — nicht wörtlich aus dem Englischen übersetzen. Umformulieren, damit es flüssig klingt.
`

export const headerBoxExplanations = {
  type: {
    label: 'Typ',
    subtitles: {
      'Generator': 'Nachhaltige Energie — du blühst auf, wenn du auf das reagierst, was dich anzieht.',
      'Manifesting Generator': 'Vielfältige Energie — du bewegst dich schnell und brauchst Abwechslung.',
      'Manifestor': 'Unabhängiger Initiator — du startest Dinge und hältst andere informiert.',
      'Projector': 'Ratgeber und Führer — du brauchst Anerkennung und die richtige Einladung.',
      'Reflector': 'Gemeinschaftsspiegel — sensibel für Umgebungen, langsame weise Entscheidungen.',
    }
  },
  profile: {
    label: 'Profil',
    subtitle: 'Die Linienkombination, die deine Rolle in der Welt und deine Lernweise beschreibt.',
  },
  strategy: {
    label: 'Strategie',
    subtitles: {
      'Wait to respond': 'Nicht initiieren — auf das reagieren, was das Leben dir bringt.',
      'Wait to respond then inform': 'Reagiere auf das, was dich begeistert, informiere dann andere.',
      'Inform before acting': 'Bevor du etwas Neues anfängst, sag den Menschen um dich herum Bescheid.',
      'Wait for the invitation': 'Nicht aufdrängen — warten, bis du erkannt und eingeladen wirst.',
      'Wait a lunar cycle': 'Vor großen Entscheidungen einen vollen Monat verstreichen lassen.',
    }
  },
  authority: {
    label: 'Autorität',
    subtitles: {
      'Emotional': 'Klarheit kommt mit der Zeit — entscheide nie auf dem emotionalen Höhepunkt.',
      'Sacral': 'Dein Körper weiß es — vertrau der Bauchreaktion, nicht dem Verstand.',
      'Splenic': 'Sofortige Intuition — dein erster Eindruck ist meistens richtig.',
      'Ego / Heart': 'Du entscheidest aus Willen und Werten — was willst du wirklich tun?',
      'Self-Projected': 'Klarheit kommt, wenn du es mit vertrauenswürdigen Menschen besprichst.',
      'Mental': 'Du verarbeitest durch Gespräche und Beobachtung deiner Umgebung.',
      'Lunar': 'Du brauchst einen vollständigen Mondzyklus für wichtige Entscheidungen.',
    }
  },
}