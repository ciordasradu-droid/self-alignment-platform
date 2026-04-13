// lib/prompts/terminology/pl.js

export const hdTerms = {
  types: {
    'Generator': 'Generator',
    'Manifesting Generator': 'Generator Manifestujący',
    'Manifestor': 'Manifestor',
    'Projector': 'Projektor',
    'Reflector': 'Reflektor',
  },
  strategies: {
    'Wait to respond': 'Czekaj i reaguj',
    'Wait to respond then inform': 'Czekaj, reaguj i informuj',
    'Inform before acting': 'Informuj przed działaniem',
    'Wait for the invitation': 'Czekaj na zaproszenie',
    'Wait a lunar cycle': 'Poczekaj jeden cykl księżycowy',
  },
  authorities: {
    'Emotional': 'Autorytet Emocjonalny',
    'Sacral': 'Autorytet Sakralny',
    'Splenic': 'Autorytet Śledziony',
    'Ego / Heart': 'Autorytet Ego / Serca',
    'Self-Projected': 'Autorytet Samoprojektowany',
    'Mental': 'Autorytet Mentalny',
    'Lunar': 'Autorytet Księżycowy',
  },
  centers: {
    'Head': 'Centrum Głowy',
    'Ajna': 'Centrum Ajna',
    'Throat': 'Centrum Gardła',
    'G': 'Centrum G (Tożsamość)',
    'Heart': 'Centrum Serca',
    'Solar Plexus': 'Splot Słoneczny',
    'Sacral': 'Centrum Sakralne',
    'Spleen': 'Centrum Śledziony',
    'Root': 'Centrum Korzenia',
  },
  misc: {
    'Gates': 'Bramy',
    'Channels': 'Kanały',
    'Profile': 'Profil',
    'Incarnation Cross': 'Krzyż Wcielenia',
    'Defined': 'Zdefiniowany',
    'Undefined': 'Niezdefiniowany',
    'Right Angle Cross': 'Krzyż Prostokątny',
    'Left Angle Cross': 'Krzyż Lewokątny',
    'Juxtaposition Cross': 'Krzyż Zestawienia',
  },
}

export const astroTerms = {
  'Sun sign': 'Znak Słoneczny',
  'Moon sign': 'Znak Księżycowy',
  'Rising': 'Ascendent',
  'Ascendant': 'Ascendent',
  'Planetary ruler': 'Planeta Rządząca',
  'Cardinal': 'Kardynalny',
  'Fixed': 'Stały',
  'Mutable': 'Zmienny',
  'Fire': 'Ogień',
  'Earth': 'Ziemia',
  'Air': 'Powietrze',
  'Water': 'Woda',
}

export const numerologyTerms = {
  'Life Path': 'Ścieżka Życia',
  'Expression Number': 'Liczba Wyrazu',
  'Soul Urge': 'Pragnienie Duszy',
  'Personal Year': 'Rok Osobisty',
  'Personal Month': 'Miesiąc Osobisty',
  'Personality Number': 'Liczba Osobowości',
}

export const grammarRules = `
OBOWIĄZKOWE ZASADY GRAMATYCZNE DLA JĘZYKA POLSKIEGO:
1. Używaj drugiej osoby liczby pojedynczej ("ty") konsekwentnie. Nie przełączaj się na trzecią osobę.
2. Ścisła zgodność przypadków, rodzajów i liczby dla przymiotników, imiesłowów i zaimków. Polskie deklinacje muszą być poprawne.
3. Płeć użytkownika jest nieznana — używaj form neutralnych płciowo lub reformułuj, aby unikać oznaczeń rodzaju.
4. Zero angielskich słów w tekście. Jeśli termin techniczny pojawia się w danych po angielsku, przetłumacz go przed użyciem.
5. Kompletne zdania z podmiotem i orzeczeniem. Bez fragmentów.
6. Naturalny język polski — nie tłumacz dosłownie z angielskiego. Przeformułuj tak, aby brzmiało płynnie.
7. Szczególna uwaga na właściwe użycie przypadków (mianownik, dopełniacz, celownik, biernik itd.) — błędy przypadków są natychmiast widoczne w polskim.
`

export const headerBoxExplanations = {
  type: {
    label: 'Typ',
    subtitles: {
      'Generator': 'Trwała energia — rozkwitasz reagując na to, co cię przyciąga.',
      'Manifesting Generator': 'Wielokierunkowa energia — poruszasz się szybko i potrzebujesz różnorodności.',
      'Manifestor': 'Niezależny inicjator — zaczynasz rzeczy i informujesz innych.',
      'Projector': 'Przewodnik i doradca — potrzebujesz uznania i właściwego zaproszenia.',
      'Reflector': 'Lustro społeczności — wrażliwy na otoczenie, powolne mądre decyzje.',
    }
  },
  profile: {
    label: 'Profil',
    subtitle: 'Kombinacja linii opisująca twoją rolę w świecie i sposób, w jaki się uczysz.',
  },
  strategy: {
    label: 'Strategia',
    subtitles: {
      'Wait to respond': 'Nie inicjuj — reaguj na to, co przynosi życie.',
      'Wait to respond then inform': 'Reaguj na to, co cię ekscytuje, a potem informuj innych.',
      'Inform before acting': 'Zanim zaczniesz coś nowego, powiedz o tym ludziom wokół ciebie.',
      'Wait for the invitation': 'Nie narzucaj się — czekaj, aż zostaniesz rozpoznany i zaproszony.',
      'Wait a lunar cycle': 'Przed ważnymi decyzjami pozwól upłynąć pełnemu miesiącowi.',
    }
  },
  authority: {
    label: 'Autorytet',
    subtitles: {
      'Emotional': 'Jasność przychodzi z czasem — nigdy nie decyduj na szczycie emocji.',
      'Sacral': 'Twoje ciało wie — ufaj reakcji trzewnej, nie umysłowi.',
      'Splenic': 'Natychmiastowa intuicja — twoje pierwsze wrażenie jest zazwyczaj słuszne.',
      'Ego / Heart': 'Decydujesz z woli i wartości — czego naprawdę chcesz?',
      'Self-Projected': 'Jasność przychodzi, gdy rozmawiasz z zaufanymi osobami.',
      'Mental': 'Przetwarzasz przez rozmowę i obserwację środowiska.',
      'Lunar': 'Potrzebujesz pełnego cyklu księżycowego do ważnych decyzji.',
    }
  },
}