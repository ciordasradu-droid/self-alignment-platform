
export function buildProfilePrompt(calculatedData, fullName) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const a  = enriched.astrology
  const hd = enriched.human_design

  const keyGatesBlock = hd.key_gates?.join('\n') || ''
  const channelsBlock = hd.formed_channels?.length
    ? hd.formed_channels.join(', ')
    : 'no full channels formed (all centers receive energy conditionally)'
  const definedBlock   = hd.defined_centers?.join(', ')   || 'none'
  const undefinedBlock = hd.undefined_centers?.join(', ') || 'none'
  const allGatesBlock  = hd.all_active_gates?.join(', ')  || ''

  return `You are a warm, precise personal development guide writing a profile for ${fullName}.

You have been given complete calculated data from three systems. Your job is to synthesize them into a profile that feels uncannily specific to this exact person â€” not generic to their type or sign.

STRICT RULES â€” NEVER BREAK THESE:
1. Every section must reference at least one specific gate number, channel name, or numerology number by name. No exceptions.
2. Never write a sentence that could apply to every ${hd.type} or every ${a.sun_sign}. Each sentence must be specific to the data below.
3. When two systems agree on a trait, name the convergence explicitly (e.g. "Gate 58's drive for vitality echoes your Life Path ${n.life_path} as ${n.life_path_meaning}").
4. When two systems create tension, name the tension and explain what it means for this person.
5. Use plain, everyday language. No jargon. Replace all HD technical terms with plain equivalents already provided.
6. Tone: warm, honest, like a trusted friend who happens to know these systems deeply.
7. Do not invent any facts. Use only the data provided below.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
COMPLETE PROFILE DATA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

NUMEROLOGY:
- Life Path ${n.life_path} â€” ${n.life_path_meaning}
- Expression ${n.expression} â€” ${n.expression_meaning}
- Soul Urge ${n.soul_urge} â€” ${n.soul_urge_meaning}
- Personality Number: ${n.personality}
- Personal Year: ${n.personal_year?.personal_year} â€” ${n.personal_year?.theme}
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
- Strategy (plain): ${hd.strategy_plain}
- Signature (thriving signal): ${hd.signature}
- Warning signal (out of alignment): ${hd.not_self_theme_plain}
- Energy: ${hd.energy_type_plain}
- Work style: ${hd.work_style_plain}
- Core traits: ${hd.core_traits_plain?.join(', ')}
- Incarnation Cross: ${hd.incarnation_cross}
- Defined Centers (consistent, reliable energy): ${definedBlock}
- Undefined Centers (conditioned, amplified from outside): ${undefinedBlock}
- Formed Channels: ${channelsBlock}
- All Active Gates: ${allGatesBlock}

KEY GATES (most important for identity):
${keyGatesBlock}

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
OUTPUT FORMAT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Return ONLY valid JSON, no markdown, no explanation.

{
  "blueprint": "3-4 warm sentences synthesizing all three systems. Must name the Life Path number, the HD type, and at least one specific gate or channel. Must reference the current Personal Year. Must feel written for this specific person, not their type.",

  "strengths": [
    "Strength 1 â€” must name a specific gate, channel, or number that explains WHY this is a strength for this person",
    "Strength 2 â€” same rule",
    "Strength 3 â€” same rule",
    "Strength 4 â€” same rule",
    "Strength 5 â€” same rule"
  ],

  "vulnerabilities": [
    "Growth area 1 â€” must reference a specific piece of data (gate, undefined center, number) and frame it as an opportunity, not a flaw",
    "Growth area 2 â€” same rule",
    "Growth area 3 â€” same rule",
    "Growth area 4 â€” same rule"
  ],

  "energy_patterns": [
    "Pattern 1 â€” specific to this person's defined/undefined centers and HD type",
    "Pattern 2 â€” reference a specific gate or channel",
    "Pattern 3 â€” reference astrology element or modality",
    "Pattern 4 â€” reference personal year energy"
  ],

  "sabotage_tendencies": [
    "Tendency 1 â€” must name the not-self theme and link it to a specific undefined center or gate",
    "Tendency 2 â€” link to a numerology number",
    "Tendency 3 â€” link to astrology modality or element",
    "Tendency 4 â€” name a specific behavioral pattern from the data"
  ],

  "decision_making": [
    "Style 1 â€” explain this person's ${hd.authority} authority in plain language with a concrete example",
    "Style 2 â€” name a gate or channel that colors HOW they process decisions",
    "Style 3 â€” reference the numerology soul urge as a motivational filter"
  ],

  "work_discipline": [
    "Point 1 â€” specific to their HD type and channels",
    "Point 2 â€” reference a specific gate related to work or energy",
    "Point 3 â€” tie to expression number and what it says about how they engage professionally",
    "Point 4 â€” reference the current personal year theme as a work lens"
  ],

  "commitments": [
    "I commit to [specific agreement based on their biggest sabotage pattern â€” reference the gate or center behind it]",
    "I commit to [specific agreement based on their energy type and how they work best â€” name the HD type]",
    "I commit to [specific agreement aligned with their Personal Year ${n.personal_year?.personal_year} theme â€” name the theme]"
  ]
}`
}

export function buildSWOTPrompt(calculatedData, profileSections) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design

  return `You are a warm, encouraging personal development partner writing a Self Perspective section.

Use the profile data below. Every item must reference a specific gate, channel, number, or center.
Be compassionate, specific, and empowering. Plain language only.

PROFILE SUMMARY:
- Blueprint: ${profileSections.blueprint}
- Key Strengths: ${profileSections.strengths?.join(' | ')}
- Growth Areas: ${profileSections.vulnerabilities?.join(' | ')}
- Patterns to Watch: ${profileSections.sabotage_tendencies?.join(' | ')}
- HD Type: ${hd.type} â€” Profile ${hd.profile}
- Incarnation Cross: ${hd.incarnation_cross}
- Life Path: ${n.life_path} â€” ${n.life_path_meaning}
- Soul Urge: ${n.soul_urge} â€” ${n.soul_urge_meaning}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates: ${hd.key_gates?.join(' | ')}
- Personal Year: ${n.personal_year?.personal_year} â€” ${n.personal_year?.theme}

Return ONLY valid JSON, no markdown, no explanation.

{
  "strengths": [
    "Natural gift 1 â€” reference a specific gate or channel",
    "Natural gift 2 â€” reference a specific number",
    "Natural gift 3 â€” reference defined center or cross",
    "Natural gift 4 â€” reference astrology or profile line"
  ],
  "weaknesses": [
    "Growth edge 1 â€” name the specific gate or undefined center behind this pattern",
    "Growth edge 2 â€” link to a number",
    "Growth edge 3 â€” link to modality or element",
    "Growth edge 4 â€” link to not-self theme"
  ],
  "opportunities": [
    "Opportunity 1 â€” specific to their current Personal Year theme",
    "Opportunity 2 â€” tied to incarnation cross purpose",
    "Opportunity 3 â€” tied to a specific channel or gate",
    "Opportunity 4 â€” tied to expression or life path number"
  ],
  "threats": [
    "Pattern to release 1 â€” name the gate or center behind it",
    "Pattern to release 2 â€” name the numerology pattern",
    "Pattern to release 3 â€” name the conditioning from an undefined center",
    "Pattern to release 4 â€” name a specific behavioral loop from the data"
  ]
}`
}

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  return `You are a warm, practical life alignment partner writing an Alignment Plan.

RULES:
- Every item must be concrete and specific to this person's data â€” not generic advice.
- Reference at least one gate, channel, or number per section.
- The 30-day focus must name the Personal Year theme explicitly.
- Forbidden behaviors must be derived from the not-self theme and sabotage patterns.
- Non-negotiables should feel like personal agreements, not rules imposed from outside.
- Plain everyday language only.

PROFILE DATA:
- HD Type: ${hd.type}, Profile ${hd.profile}, Authority: ${hd.authority}
- Incarnation Cross: ${hd.incarnation_cross}
- Strategy: ${hd.strategy_plain}
- Not-self warning: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates: ${hd.key_gates?.join(' | ')}
- Life Path ${n.life_path} â€” ${n.life_path_meaning}
- Expression ${n.expression} â€” ${n.expression_meaning}
- Soul Urge ${n.soul_urge} â€” ${n.soul_urge_meaning}
- Personal Year ${n.personal_year?.personal_year}: ${n.personal_year?.theme}
- Personal Year Focus: ${n.personal_year?.focus}
- Personal Year Warning: ${n.personal_year?.warning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Blueprint: ${profileSections.blueprint}
- Top Strengths: ${profileSections.strengths?.slice(0,3).join(' | ')}
- Growth Areas: ${profileSections.vulnerabilities?.slice(0,2).join(' | ')}
- Key Opportunities: ${swot.opportunities?.slice(0,2).join(' | ')}
- Patterns to release: ${swot.threats?.slice(0,2).join(' | ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "directional_clarity": {
    "life_direction": "2-3 warm inspiring sentences about this person's natural direction â€” must name their incarnation cross and life path number",
    "prioritize": [
      "Priority 1 â€” tied to a specific gate or channel",
      "Priority 2 â€” tied to their HD type's signature",
      "Priority 3 â€” tied to their expression or life path number"
    ],
    "eliminate": [
      "Drain 1 â€” tied to not-self theme or a specific gate",
      "Drain 2 â€” tied to an undefined center being over-activated",
      "Drain 3 â€” tied to a numerology or astrology pattern"
    ]
  },
  "structured_plan": {
    "thirty_day_focus": "One inspiring sentence explicitly naming Personal Year ${n.personal_year?.personal_year} (${n.personal_year?.theme}) and one specific gate or channel",
    "weekly_template": [
      "Mon-Tue: specific action tied to HD type and channels",
      "Wed-Thu: specific action tied to a gate or center",
      "Fri: specific action tied to strategy or authority",
      "Weekend: specific rest/reflection practice tied to their energy type"
    ],
    "daily_template": [
      "Morning: specific ritual tied to a gate or center",
      "Midday: specific action tied to their work style",
      "Evening: specific reflection tied to their authority or personal year"
    ]
  },
  "behavioral_anchors": {
    "keystone_habits": [
      "Habit 1 â€” name the gate or channel it supports",
      "Habit 2 â€” name the number it aligns with",
      "Habit 3 â€” name the HD type or authority it honors"
    ],
    "forbidden_behaviors": [
      "Never [specific behavior] â€” this triggers your ${hd.not_self_theme} response from [specific gate or center]",
      "Never [specific behavior] â€” this activates the shadow side of [specific number or sign trait]",
      "Never [specific behavior] â€” this works against [specific strategy or channel]"
    ],
    "non_negotiables": [
      "I [specific agreement] â€” this honors Gate [number] / Channel [name] in my design",
      "I [specific agreement] â€” this aligns with my Life Path ${n.life_path} as ${n.life_path_meaning}",
      "I [specific agreement] â€” this supports my Personal Year ${n.personal_year?.personal_year} theme of ${n.personal_year?.theme}"
    ]
  }
}`
}

export function buildActionPlanPrompt(calculatedData, profileSections) {
  const { enriched } = calculatedData
  const n  = enriched.numerology
  const hd = enriched.human_design
  const a  = enriched.astrology

  // Type-specific guidance for practice mix
  const typeGuidance = {
    'Generator':            'Practices should focus on sustainable energy output, responding to what lights you up, and building mastery through repetition.',
    'Manifesting Generator': 'Practices should support multi-directional energy, quick pivots, and informing others. Include variety and short bursts.',
    'Manifestor':           'Practices should support independent initiation, informing before acting, and managing impact on others.',
    'Projector':            'Practices should prioritize rest, recognition, waiting for the right moment, and conserving focused energy.',
    'Reflector':            'Practices should honor sensitivity to environment, slow decision-making, and lunar cycle awareness.',
  }

  return `You are a warm, practical life alignment partner creating a personalized daily practice plan.

Each practice must be something the person can do tomorrow morning with no equipment, no prior training, and no cost.
Every practice must be directly tied to a specific gate, channel, defined center, or numerology number from this person's data.
This is not generic wellness advice â€” it is a custom prescription derived from their unique design.

PROFILE DATA:
- HD Type: ${hd.type} â€” ${typeGuidance[hd.type] || ''}
- Profile: ${hd.profile}
- Authority: ${hd.authority}
- Strategy: ${hd.strategy_plain}
- Not-self warning: ${hd.not_self_theme_plain}
- Defined Centers: ${hd.defined_centers?.join(', ')}
- Formed Channels: ${hd.formed_channels?.join(', ')}
- Key Gates:
${hd.key_gates?.join('\n')}
- Life Path ${n.life_path} â€” ${n.life_path_meaning}
- Soul Urge ${n.soul_urge} â€” ${n.soul_urge_meaning}
- Sun Sign: ${a.sun_sign} (${a.element} / ${a.modality})
- Personal Year ${n.personal_year?.personal_year}: ${n.personal_year?.theme}
- Blueprint summary: ${profileSections.blueprint}
- Key sabotage patterns: ${profileSections.sabotage_tendencies?.join(' | ')}

RULES:
1. Generate between 5 and 8 practices total.
2. Mix of daily (4-5) and weekly (1-3) practices. No more than 1 "as_needed".
3. Every practice must have a why_for_you that names a specific gate number, channel name, defined center, or numerology number â€” not just the type.
4. Instructions must be concrete: tell the person exactly what to do, step by step, in 1-3 sentences. No vague advice like "reflect on your day."
5. Duration must be realistic â€” between 5 and 30 minutes.
6. Practices must require zero equipment, zero prior experience, zero cost.
7. The mix should reflect the HD type: ${typeGuidance[hd.type] || ''}

Return ONLY valid JSON, no markdown, no explanation.

{
  "practices": [
    {
      "id": "p1",
      "name": "Short name max 6 words",
      "when": "morning",
      "duration_minutes": 10,
      "instructions": "Exactly what to do in 1-3 concrete sentences. Tell them the specific steps.",
      "why_for_you": "One sentence naming the specific gate, channel, center, or number that makes this practice right for this person.",
      "frequency": "daily"
    },
    {
      "id": "p2",
      "name": "Short name max 6 words",
      "when": "evening",
      "duration_minutes": 5,
      "instructions": "Exactly what to do in 1-3 concrete sentences.",
      "why_for_you": "One sentence naming the specific gate, channel, center, or number.",
      "frequency": "daily"
    }
  ]
}

Generate all 5-8 practices in the array. Each must follow the exact structure above.`
}
