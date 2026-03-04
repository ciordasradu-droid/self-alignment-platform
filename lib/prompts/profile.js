export function buildProfilePrompt(calculatedData, fullName) {
  return `You are a psychologically grounded personal development analyst.
You have been given structured data from three systems: Astrology, Numerology, and Human Design.
Your task is to generate a structured personal profile for ${fullName}.

IMPORTANT RULES:
- Be practical, clear, and psychologically intelligent
- No mystical language, no vague statements
- No deterministic claims ("you will", "you are destined")
- Use "tends to", "may", "often", "can" language
- Be direct and actionable
- Format each section with bullet points where possible

HERE IS THE RAW DATA:

ASTROLOGY:
- Sun Sign: ${calculatedData.astrology.sun_sign}
- Element: ${calculatedData.astrology.element}
- Modality: ${calculatedData.astrology.modality}
- Ruling Planet: ${calculatedData.astrology.ruling_planet}
- Core Traits: ${calculatedData.astrology.core_traits?.join(', ')}

NUMEROLOGY:
- Life Path Number: ${calculatedData.numerology.life_path}
- Expression Number: ${calculatedData.numerology.expression}
- Soul Urge Number: ${calculatedData.numerology.soul_urge}
- Personality Number: ${calculatedData.numerology.personality}

HUMAN DESIGN:
- Type: ${calculatedData.human_design.type}
- Strategy: ${calculatedData.human_design.strategy}
- Energy Type: ${calculatedData.human_design.energy_type}
- Core Traits: ${calculatedData.human_design.core_traits?.join(', ')}
- Work Style: ${calculatedData.human_design.work_style}
- Not-Self Theme: ${calculatedData.human_design.not_self_theme}

Generate the following 7 sections. Return ONLY valid JSON, no markdown, no explanation.

{
  "blueprint": "2-3 sentences synthesizing all three systems into a core energetic summary",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
  "vulnerabilities": ["vulnerability 1", "vulnerability 2", "vulnerability 3", "vulnerability 4"],
  "energy_patterns": ["pattern 1", "pattern 2", "pattern 3", "pattern 4"],
  "sabotage_tendencies": ["tendency 1", "tendency 2", "tendency 3", "tendency 4"],
  "decision_making": ["style point 1", "style point 2", "style point 3"],
  "work_discipline": ["work point 1", "work point 2", "work point 3", "work point 4"]
}`
}

export function buildSWOTPrompt(calculatedData, profileSections) {
  return `You are a behavioral psychology analyst specializing in personal discipline and self-sabotage.
Based on the profile data below, generate a SWOT analysis focused STRICTLY on:
- Personal discipline
- Self-sabotage patterns  
- Energy management

PROFILE SUMMARY:
- Blueprint: ${profileSections.blueprint}
- Key Strengths: ${profileSections.strengths?.join(', ')}
- Key Vulnerabilities: ${profileSections.vulnerabilities?.join(', ')}
- Sabotage Tendencies: ${profileSections.sabotage_tendencies?.join(', ')}
- Human Design Type: ${calculatedData.human_design.type}
- Life Path Number: ${calculatedData.numerology.life_path}

RULES:
- Each point must be specific and actionable
- No vague generalities
- Psychologically grounded language only
- 4-5 bullet points per quadrant

Return ONLY valid JSON, no markdown, no explanation.

{
  "strengths": ["discipline strength 1", "discipline strength 2", "discipline strength 3", "discipline strength 4"],
  "weaknesses": ["self-control weakness 1", "weakness 2", "weakness 3", "weakness 4"],
  "opportunities": ["leverage point 1", "opportunity 2", "opportunity 3", "opportunity 4"],
  "threats": ["sabotage risk 1", "threat 2", "threat 3", "threat 4"]
}`
}

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot) {
  return `You are a behavioral coach and systems designer.
Based on the profile and SWOT below, create a practical 3-layer Alignment Plan.

PROFILE SUMMARY:
- Blueprint: ${profileSections.blueprint}
- Top Strengths: ${profileSections.strengths?.slice(0,3).join(', ')}
- Top Vulnerabilities: ${profileSections.vulnerabilities?.slice(0,2).join(', ')}
- Human Design Strategy: ${calculatedData.human_design.strategy}
- Work Style: ${calculatedData.human_design.work_style}

SWOT SUMMARY:
- Key Opportunities: ${swot.opportunities?.slice(0,2).join(', ')}
- Key Threats: ${swot.threats?.slice(0,2).join(', ')}

RULES:
- Everything must be immediately implementable
- No overwhelming complexity
- Clear, simple, direct language
- Specific and actionable

Return ONLY valid JSON, no markdown, no explanation.

{
  "directional_clarity": {
    "life_direction": "2-3 sentence general direction statement",
    "prioritize": ["priority 1", "priority 2", "priority 3"],
    "eliminate": ["eliminate 1", "eliminate 2", "eliminate 3"]
  },
  "structured_plan": {
    "thirty_day_focus": "1 sentence focus statement for the next 30 days",
    "weekly_template": ["Monday-Tuesday: action", "Wednesday-Thursday: action", "Friday: action", "Weekend: action"],
    "daily_template": ["Morning: action", "Midday: action", "Evening: action"]
  },
  "behavioral_anchors": {
    "keystone_habits": ["habit 1", "habit 2", "habit 3"],
    "anti_sabotage_rules": ["rule 1", "rule 2", "rule 3"],
    "non_negotiables": ["non-negotiable 1", "non-negotiable 2", "non-negotiable 3"]
  }
}`
}