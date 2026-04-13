// lib/prompts/terminology/es.js

export const hdTerms = {
  types: {
    'Generator': 'Generador',
    'Manifesting Generator': 'Generador Manifestante',
    'Manifestor': 'Manifestador',
    'Projector': 'Proyector',
    'Reflector': 'Reflector',
  },
  strategies: {
    'Wait to respond': 'Esperar y responder',
    'Wait to respond then inform': 'Esperar, responder e informar',
    'Inform before acting': 'Informar antes de actuar',
    'Wait for the invitation': 'Esperar la invitación',
    'Wait a lunar cycle': 'Esperar un ciclo lunar',
  },
  authorities: {
    'Emotional': 'Autoridad Emocional',
    'Sacral': 'Autoridad Sacral',
    'Splenic': 'Autoridad Esplénica',
    'Ego / Heart': 'Autoridad del Ego / Corazón',
    'Self-Projected': 'Autoridad Auto-proyectada',
    'Mental': 'Autoridad Mental',
    'Lunar': 'Autoridad Lunar',
  },
  centers: {
    'Head': 'Centro de la Cabeza',
    'Ajna': 'Centro Ajna',
    'Throat': 'Centro de la Garganta',
    'G': 'Centro G (Identidad)',
    'Heart': 'Centro del Corazón',
    'Solar Plexus': 'Plexo Solar',
    'Sacral': 'Centro Sacral',
    'Spleen': 'Centro del Bazo',
    'Root': 'Centro Raíz',
  },
  misc: {
    'Gates': 'Puertas',
    'Channels': 'Canales',
    'Profile': 'Perfil',
    'Incarnation Cross': 'Cruz de la Encarnación',
    'Defined': 'Definido',
    'Undefined': 'Indefinido',
    'Right Angle Cross': 'Cruz en Ángulo Recto',
    'Left Angle Cross': 'Cruz en Ángulo Izquierdo',
    'Juxtaposition Cross': 'Cruz de Yuxtaposición',
  },
}

export const astroTerms = {
  'Sun sign': 'Signo Solar',
  'Moon sign': 'Signo Lunar',
  'Rising': 'Ascendente',
  'Ascendant': 'Ascendente',
  'Planetary ruler': 'Planeta Regente',
  'Cardinal': 'Cardinal',
  'Fixed': 'Fijo',
  'Mutable': 'Mutable',
  'Fire': 'Fuego',
  'Earth': 'Tierra',
  'Air': 'Aire',
  'Water': 'Agua',
}

export const numerologyTerms = {
  'Life Path': 'Camino de Vida',
  'Expression Number': 'Número de Expresión',
  'Soul Urge': 'Deseo del Alma',
  'Personal Year': 'Año Personal',
  'Personal Month': 'Mes Personal',
  'Personality Number': 'Número de Personalidad',
}

export const grammarRules = `
REGLAS GRAMATICALES OBLIGATORIAS PARA ESPAÑOL:
1. Usa segunda persona singular ("tú") de forma consistente. No cambies a tercera persona.
2. Acuerdo de género y número estricto en adjetivos, participios y pronombres.
3. No se conoce el género del usuario — usa formulaciones neutras o alterna formas cuando sea necesario, preferiblemente reformulando para evitar marcas de género.
4. Cero palabras en inglés u otro idioma en el texto. Si un término técnico llega en inglés en los datos, tradúcelo antes de usarlo.
5. Oraciones completas con sujeto y predicado. Sin fragmentos.
6. Español natural — no traduzcas literalmente del inglés. Reformula para que suene fluido.
`

export const headerBoxExplanations = {
  type: {
    label: 'Tipo',
    subtitles: {
      'Generator': 'Energía sostenida — prosperas respondiendo a lo que te atrae.',
      'Manifesting Generator': 'Energía múltiple — te mueves rápido y necesitas variedad.',
      'Manifestor': 'Iniciador independiente — comienzas cosas e informas a los demás.',
      'Projector': 'Guía y consejero — necesitas reconocimiento e invitación.',
      'Reflector': 'Espejo comunitario — sensible al entorno, decisiones lentas y sabias.',
    }
  },
  profile: {
    label: 'Perfil',
    subtitle: 'La combinación de líneas que describe tu rol en el mundo y cómo aprendes.',
  },
  strategy: {
    label: 'Estrategia',
    subtitles: {
      'Wait to respond': 'No inicies — responde a lo que la vida te trae.',
      'Wait to respond then inform': 'Responde a lo que te entusiasma, luego informa a los demás.',
      'Inform before acting': 'Antes de empezar algo nuevo, comunícaselo a quienes te rodean.',
      'Wait for the invitation': 'No te impongas — espera a ser reconocido e invitado.',
      'Wait a lunar cycle': 'Antes de decisiones importantes, deja pasar un mes completo.',
    }
  },
  authority: {
    label: 'Autoridad',
    subtitles: {
      'Emotional': 'La claridad llega con el tiempo — nunca decidas en el pico emocional.',
      'Sacral': 'Tu cuerpo sabe — confía en la respuesta visceral, no en la mente.',
      'Splenic': 'Intuición instantánea — tu primera impresión suele ser correcta.',
      'Ego / Heart': 'Decides desde la voluntad y los valores — ¿qué quieres realmente hacer?',
      'Self-Projected': 'La claridad llega cuando lo hablas con personas de confianza.',
      'Mental': 'Procesas a través de la conversación y la observación del entorno.',
      'Lunar': 'Necesitas un ciclo lunar completo para decisiones importantes.',
    }
  },
}