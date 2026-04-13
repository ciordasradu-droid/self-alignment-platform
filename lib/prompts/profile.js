// lib/prompts/profile.js

export function buildProfilePrompt(calculatedData, fullName) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const a  = enriched.astrology
  const hd = enriched.human_design

  const keyGatesBlock = hd.key_gates?.join('\n') || ''
  const channelsBlock = hd.formed_channels?.length
    ? hd.formed_channels.join(', ')
    : 'no full channels formed'
  const definedBlock   = hd.defined_centers?.join(', ') || 'none'
  const undefinedBlock = hd.undefined_centers?.join(', ') || 'none'
  const allGatesBlock  = hd.all_active_gates?.join(', ') || ''

  return `You are writing a personal profile for ${fullName}.

Your job is to make this person feel deeply seen — not analyzed. Every section should feel like a wise friend who has studied these systems is talking directly to them. The tone is warm, clear, and grounded. Not mystical. Not clinical.

WRITING RULES — follow these exactly:
1. Lead every insight with the human truth first. Then explain where it comes from in their data. Example: "You have a rare ability to energize any room you enter — this comes from Gate 58 in your design, which carries the energy of joy and vitality and the drive to make life better."
2. Always explain what a gate, channel, or number actually IS before saying what it means for this person. Never just say "Gate 58 gives you X" — say "Gate 58 is about joy and vitality — the pure drive to improve life. For you this means..."
3. For the Personal Year, always explain the cycle: "You are in year ${n.personal_year?.personal_year} of a 9-year numerology cycle. This year's theme is ${n.personal_year?.theme}, which means..."
4. Name the shadow side of every strength. If someone has joy energy, also name when it becomes perfectionism or restlessness. This is what makes a profile feel honest and real.
5. When two systems point to the same trait, connect them explicitly in plain language. Example: "Both your Life Path 9 and your Capricorn sun point to the same thing — you are someone who is here to serve something bigger than yourself."
6. When two systems create tension, name it and explain what to do with it. Example: "Your Expression 1 wants to lead and be original, but your Soul Urge 4 craves security and order. This tension is real — and the resolution is..."
7. Write in flowing paragraphs, not bullet points. Each section should feel like it was written specifically for this person, not assembled from templates.
8. Never use these words: "unique", "special", "journey", "resonate", "vibration", "frequency", "universe", "manifest", "aligned". They are overused and feel hollow.
9. The profile must be fully written in the language of the output. Do not mix languages.
10. Do not invent any data. Use only what is provided below.

═══════════════════════════════
PROFILE DATA
═══════════════════════════════

NUMEROLOGY:
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Expression ${n.expression} — ${n.expression_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Personality Number: ${n.personality}
- Personal Year: ${n.personal_year?.personal_year} of 9 — ${n.personal_year?.theme}
- Personal Year Focus: ${n.personal_year?.focus}
- Personal Year Warning: ${n.personal_year?.warning}

ASTROLOGY:
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Ruling Planet: ${a.ruling_planet}
- Core Traits: ${a.core_traits?.join(', ')}

HUMAN DESIGN:
- Type: ${hd.type}
- Profile: ${hd.profile}
- Authority: ${hd.authority}
- Strategy: ${hd.strategy_plain}
- Signature (how thriving feels): ${hd.signature}
- Warning signal (how being off track feels): ${hd.not_self_theme_plain}
- Energy: ${hd.energy_type_plain}
- Work style: ${hd.work_style_plain}
- Incarnation Cross: ${hd.incarnation_cross}
- Defined Centers: ${definedBlock}
- Undefined Centers: ${undefinedBlock}
- Formed Channels: ${channelsBlock}
- All Active Gates: ${allGatesBlock}

KEY GATES (most important — explain each one):
${keyGatesBlock}

═══════════════════════════════
OUTPUT FORMAT
═══════════════════════════════

Return ONLY valid JSON, no markdown, no explanation.

{
  "blueprint": "3-4 sentences. Open with who this person fundamentally is — their Life Path, their HD type, and their current moment (Personal Year). Name the cycle explicitly. Make it feel like the opening of a letter written just for them.",

  "strengths": [
    "Write each strength as 2 sentences maximum. Lead with the human truth. Then explain the gate, channel, or number behind it — what that energy actually IS, not just what it gives them. End with one sentence about when this strength is at its best.",
    "Same format — 5 strengths total, each a real paragraph",
    "Each one must reference a specific gate, channel, or number by name AND explain what it is",
    "No two strengths should feel like they are saying the same thing",
    "Fifth strength here"
  ],

  "vulnerabilities": [
    "Write each as 2 sentences maximum. Name the pattern honestly. Explain which part of their data creates this tendency — gate, undefined center, or number. End with one concrete thing they can do differently. Frame as growth, not flaw.",
    "Same format — 4 vulnerabilities total",
    "Third vulnerability here",
    "Fourth vulnerability here"
  ],

  "energy_patterns": [
    "Full paragraph describing when their energy peaks, why, and what to do with it — reference defined centers",
    "Full paragraph describing when their energy drops, why, and the warning signs — reference undefined centers or not-self theme",
    "Full paragraph about how their astrology element (${a.element}) shapes their daily energy rhythm",
    "Full paragraph about what Personal Year ${n.personal_year?.personal_year} is doing to their energy right now — explain the cycle"
  ],

  "sabotage_tendencies": [
    "Full paragraph — name a specific self-sabotage pattern, trace it back to a gate or number, explain what triggers it, and what the exit is",
    "Same format — 4 tendencies total",
    "Third tendency here",
    "Fourth tendency here"
  ],

  "decision_making": [
    "Full paragraph explaining their ${hd.authority} authority in plain language — what it feels like in the body, how to use it practically, with a concrete example from daily life",
    "Full paragraph about how their Soul Urge ${n.soul_urge} (${n.soul_urge_meaning}) filters what they actually want versus what they think they should want",
    "Full paragraph about the tension or harmony between their authority and their astrology — does their ${a.sun_sign} nature support or fight their decision-making style"
  ],

  "work_discipline": [
    "Full paragraph about how this person works best — their HD type, their channels, what kind of work lights them up",
    "Full paragraph about a specific gate in their design that shapes how they approach work — explain what the gate is and how it shows up",
    "Full paragraph about their Expression ${n.expression} (${n.expression_meaning}) and what this means professionally",
    "Full paragraph about what Personal Year ${n.personal_year?.personal_year} means for their work right now — concrete guidance"
  ],

  "commitments": [
    "Written as 'I commit to...' — specific, personal, grounded in a gate or center from their design. 2-3 sentences. Should feel like something they would actually say to themselves.",
    "Written as 'I commit to...' — grounded in their HD type and how they work best. 2-3 sentences.",
    "Written as 'I commit to...' — grounded in their Personal Year ${n.personal_year?.personal_year} theme of ${n.personal_year?.theme}. 2-3 sentences."
  ]
}`
}

export function buildSWOTPrompt(calculatedData, profileSections) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design

  return `You are writing a Self Perspective section for a personal profile.

Use the same warm, clear, grounded tone as the profile. Lead with human truths. Explain data references. No mystical language. Full paragraphs, not bullet points. Fully in the profile's language — no mixed languages.

PROFILE SUMMARY:
- Blueprint: ${profileSections.blueprint}
- Key Strengths: ${profileSections.strengths?.join(' | ')}
- Growth Areas: ${profileSections.vulnerabilities?.join(' | ')}
- HD Type: ${hd.type} — Profile ${hd.profile}
- Incarnation Cross: ${hd.incarnation_cross}
- Life Path: ${n.life_path} — ${n.life_path_meaning}
- Soul Urge: ${n.soul_urge} — ${n.soul_urge_meaning}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates: ${hd.key_gates?.join(' | ')}
- Personal Year: ${n.personal_year?.personal_year} of 9 — ${n.personal_year?.theme}

Return ONLY valid JSON, no markdown, no explanation.

{
  "strengths": [
    "2-3 sentence paragraph — a natural gift, explained as a human truth first, then traced to its source in the data",
    "Same format — 4 strengths total",
    "Third strength",
    "Fourth strength"
  ],
  "weaknesses": [
    "2-3 sentence paragraph — a growth edge, named honestly, traced to its source, one concrete reframe at the end",
    "Same format — 4 weaknesses total",
    "Third weakness",
    "Fourth weakness"
  ],
  "opportunities": [
    "2-3 sentence paragraph — a real opening available to this person right now, tied to their Personal Year ${n.personal_year?.personal_year} theme",
    "Opportunity tied to their incarnation cross purpose",
    "Opportunity tied to a specific channel or gate — explain what it is",
    "Opportunity tied to their Life Path ${n.life_path} number"
  ],
  "threats": [
    "2-3 sentence paragraph — a pattern that could pull them off track, named specifically, with one practical way to catch it early",
    "Same format — 4 threats total",
    "Third threat",
    "Fourth threat"
  ]
}`
}

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  return `You are writing an Alignment Plan — a practical, concrete guide for how this person should direct their energy over the next 30 days and beyond.

Tone: warm but direct. Like a coach who knows their data well and cares about results. No vague advice. Every item must be something they can actually do.
Fully in the profile's language — no mixed languages.

PROFILE DATA:
- HD Type: ${hd.type}, Profile ${hd.profile}, Authority: ${hd.authority}
- Incarnation Cross: ${hd.incarnation_cross}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates: ${hd.key_gates?.join(' | ')}
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Expression ${n.expression} — ${n.expression_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Personal Year Focus: ${n.personal_year?.focus}
- Personal Year Warning: ${n.personal_year?.warning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Blueprint: ${profileSections.blueprint}
- Top Strengths: ${profileSections.strengths?.slice(0,2).join(' | ')}
- Growth Areas: ${profileSections.vulnerabilities?.slice(0,2).join(' | ')}
- Key Opportunities: ${swot.opportunities?.slice(0,2).join(' | ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "directional_clarity": {
    "life_direction": "3 sentences. Where is this person headed, based on their incarnation cross and life path? Make it feel like a compass, not a prescription.",
    "prioritize": [
      "Concrete priority — what to say yes to this month, and why it connects to their design",
      "Second priority",
      "Third priority"
    ],
    "eliminate": [
      "Concrete thing to stop doing — explain why it drains this specific person based on their data",
      "Second drain",
      "Third drain"
    ]
  },
  "structured_plan": {
    "thirty_day_focus": "One clear sentence naming Personal Year ${n.personal_year?.personal_year} (${n.personal_year?.theme}) and the one thing to focus on this month.",
    "weekly_template": [
      "Mon-Tue: specific action tied to their HD type and energy",
      "Wed-Thu: specific action tied to a gate or center",
      "Fri: specific action tied to their authority or strategy",
      "Weekend: specific rest or reflection practice tied to their energy type"
    ],
    "daily_template": [
      "Morning: specific ritual — what, how long, why it works for this person",
      "Midday: specific action — concrete, doable",
      "Evening: specific reflection — tied to their authority or personal year"
    ]
  },
  "behavioral_anchors": {
    "keystone_habits": [
      "Habit 1 — specific, doable, tied to a gate or channel",
      "Habit 2 — tied to a number",
      "Habit 3 — tied to their HD type or authority"
    ],
    "forbidden_behaviors": [
      "Never do this — explain exactly why it derails this specific person",
      "Second forbidden behavior",
      "Third forbidden behavior"
    ],
    "non_negotiables": [
      "I... — personal agreement, specific, grounded in their design",
      "Second agreement",
      "Third agreement"
    ]
  }
}`
}

export function buildActionPlanPrompt(calculatedData, profileSections) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  const typeGuidance = {
    'Generator':             'Practices should focus on sustainable energy output, responding to what lights you up, and building mastery through repetition.',
    'Manifesting Generator': 'Practices should support multi-directional energy, quick pivots, and informing others. Include variety and short bursts.',
    'Manifestor':            'Practices should support independent initiation, informing before acting, and managing impact on others.',
    'Projector':             'Practices should prioritize rest, recognition, waiting for the right moment, and conserving focused energy.',
    'Reflector':             'Practices should honor sensitivity to environment, slow decision-making, and lunar cycle awareness.',
  }

  return `You are creating a personalized daily practice plan — 5 to 8 concrete practices this person can start tomorrow.

Each practice must be doable with no equipment, no prior training, no cost.
Each practice must be directly connected to something specific in this person's data.
Tone: practical and warm. Explain why each practice is right for THIS person specifically.
Fully in the profile's language — no mixed languages.

PROFILE DATA:
- HD Type: ${hd.type} — ${typeGuidance[hd.type] || ''}
- Profile: ${hd.profile}
- Authority: ${hd.authority}
- Strategy: ${hd.strategy_plain}
- Warning signal: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates:
${hd.key_gates?.join('\n')}
- Life Path ${n.life_path} — ${n.life_path_meaning}
- Soul Urge ${n.soul_urge} — ${n.soul_urge_meaning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Personal Year ${n.personal_year?.personal_year} of 9: ${n.personal_year?.theme}
- Blueprint: ${profileSections.blueprint}
- Key sabotage patterns: ${profileSections.sabotage_tendencies?.join(' | ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "practices": [
    {
      "id": "p1",
      "name": "Short name, max 6 words",
      "when": "morning",
      "duration_minutes": 10,
      "instructions": "Exactly what to do, step by step, in 2-3 concrete sentences. Tell them precisely what to do, not just what category it falls into.",
      "why_for_you": "One sentence explaining why this specific practice fits this specific person — name the gate, channel, center, or number behind it and explain what it is.",
      "frequency": "daily"
    }
  ]
}`
}