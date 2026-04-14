// lib/prompts/terminology/pt.js

export const hdTerms = {
  types: {
    'Generator': 'Gerador',
    'Manifesting Generator': 'Gerador Manifestador',
    'Manifestor': 'Manifestador',
    'Projector': 'Projetor',
    'Reflector': 'Refletor',
  },
  strategies: {
    'Wait to respond': 'Espera para responder',
    'Wait to respond then inform': 'Espera, responde e depois informa',
    'Inform before acting': 'Informa antes de agir',
    'Wait for the invitation': 'Espera o convite',
    'Wait a lunar cycle': 'Espera um ciclo lunar',
  },
  authorities: {
    'Emotional': 'Autoridade Emocional',
    'Sacral': 'Autoridade Sacral',
    'Splenic': 'Autoridade Esplênica',
    'Ego / Heart': 'Autoridade Ego / Coração',
    'Self-Projected': 'Autoridade Auto-Projetada',
    'Mental': 'Autoridade Mental',
    'Lunar': 'Autoridade Lunar',
  },
  centers: {
    'Head': 'Centro da Cabeça',
    'Ajna': 'Centro Ajna',
    'Throat': 'Centro da Garganta',
    'G': 'Centro G (Identidade)',
    'Heart': 'Centro do Coração',
    'Solar Plexus': 'Plexo Solar',
    'Sacral': 'Centro Sacral',
    'Spleen': 'Baço',
    'Root': 'Centro da Raiz',
  },
  misc: {
    'Gates': 'Portas',
    'Channels': 'Canais',
    'Profile': 'Perfil',
    'Incarnation Cross': 'Cruz de Encarnação',
    'Defined': 'Definido',
    'Undefined': 'Indefinido',
    'Right Angle Cross': 'Cruz de Ângulo Reto',
    'Left Angle Cross': 'Cruz de Ângulo Esquerdo',
    'Juxtaposition Cross': 'Cruz de Justaposição',
  },
}

export const astroTerms = {
  'Sun sign': 'Signo Solar',
  'Moon sign': 'Signo Lunar',
  'Rising': 'Ascendente',
  'Ascendant': 'Ascendente',
  'Planetary ruler': 'Planeta Regente',
  'Cardinal': 'Cardinal',
  'Fixed': 'Fixo',
  'Mutable': 'Mutável',
  'Fire': 'Fogo',
  'Earth': 'Terra',
  'Air': 'Ar',
  'Water': 'Água',
}

export const numerologyTerms = {
  'Life Path': 'Caminho de Vida',
  'Expression Number': 'Número de Expressão',
  'Soul Urge': 'Impulso da Alma',
  'Personal Year': 'Ano Pessoal',
  'Personal Month': 'Mês Pessoal',
  'Personality Number': 'Número da Personalidade',
}

export const grammarRules = `
REGRAS GRAMATICAIS OBRIGATÓRIAS PARA PORTUGUÊS:
1. Use acentuação completa: á, à, â, ã, é, ê, í, ó, ô, õ, ú, ç — sem exceções.
2. Concordância gramatical estrita: gênero (masculino/feminino), número (singular/plural), pessoa.
3. Como o gênero do utilizador não é conhecido, use EXCLUSIVAMENTE formulações neutras de gênero. Evite construções do tipo "estás preparado/a". Reformule: "tens a preparação necessária", "encontras-te em...".
4. Segunda pessoa do singular ("tu") consistente em todo o perfil. Não alternar com formas impessoais ou terceira pessoa.
5. Zero palavras em inglês, espanhol ou outra língua. Se um termo técnico chega nos dados de entrada em inglês, traduzi-lo obrigatoriamente antes de usar.
6. Frases completas com sujeito, predicado e sentido finalizado. Sem truncamentos.
7. Evita neologismos mal formados. Se não tens certeza de uma palavra, usa uma formulação mais simples e correta em português.
8. Construções naturais em português — não traduzas literalmente do inglês.
`

export const headerBoxExplanations = {
  type: {
    label: 'Tipo',
    subtitles: {
      'Generator': 'Energia sustentada — prosperas respondendo ao que te atrai.',
      'Manifesting Generator': 'Energia múltipla — moves-te rapidamente e precisas de variedade.',
      'Manifestor': 'Iniciador independente — começas coisas e informas os outros.',
      'Projector': 'Guia e conselheiro — precisas de reconhecimento e convite.',
      'Reflector': 'Espelho da comunidade — sensível ao ambiente, decisões lentas e sábias.',
    }
  },
  profile: {
    label: 'Perfil',
    subtitle: 'Combinação de linhas que descreve o teu papel no mundo e como aprendes.',
  },
  strategy: {
    label: 'Estratégia',
    subtitles: {
      'Wait to respond': 'Não inicias — respondes ao que aparece à tua frente.',
      'Wait to respond then inform': 'Respondes ao que te atrai, depois informas os outros.',
      'Inform before acting': 'Antes de iniciar algo, diz aos que te rodeiam o que vem.',
      'Wait for the invitation': 'Não te impõe — espera para ser convidado.',
      'Wait a lunar cycle': 'Antes de grandes decisões, deixa um mês inteiro passar.',
    }
  },
  authority: {
    label: 'Autoridade',
    subtitles: {
      'Emotional': 'A tua clareza vem com o tempo — não decidas no pico da emoção.',
      'Sacral': 'O teu corpo sabe — escuta a resposta visceral, não a mente.',
      'Splenic': 'Intuição instantânea — a primeira impressão é geralmente correta.',
      'Ego / Heart': 'Decides pela vontade e valores — o que queres realmente fazer?',
      'Self-Projected': 'A clareza vem quando falas em voz alta com pessoas de confiança.',
      'Mental': 'Processas através de conversas e observação do ambiente.',
      'Lunar': 'Precisas de um ciclo lunar completo para decisões importantes.',
    }
  },
}