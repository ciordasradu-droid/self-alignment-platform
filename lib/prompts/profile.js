export function buildProfilePrompt(calculatedData, fullName) {
  return `You are a warm, insightful personal development guide.
You have been given structured data from three systems: Astrology, Numerology, and Human Design.
Your task is to generate a structured personal profile for ${fullName}.

IMPORTANT RULES:
- Be warm, encouraging, and psychologically intelligent
- Celebrate strengths genuinely
- Frame vulnerabilities as growth opportunities, not flaws
- Use "tends to", "may", "often", "can" language
- Be direct, clear, and actionable
- No mystical exaggeration, no deterministic claims

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

Return ONLY valid JSON, no markdown, no explanation.

{
  "blueprint": "2-3 warm sentences synthesizing all three systems",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
  "vulnerabilities": ["growth opportunity 1", "growth opportunity 2", "growth opportunity 3", "growth opportunity 4"],
  "energy_patterns": ["pattern 1", "pattern 2", "pattern 3", "pattern 4"],
  "sabotage_tendencies": ["pattern 1", "pattern 2", "pattern 3", "pattern 4"],
  "decision_making": ["style 1", "style 2", "style 3"],
  "work_discipline": ["work point 1", "work point 2", "work point 3", "work point 4"]
}`
}

export function buildSWOTPrompt(calculatedData, profileSections) {
  return `You are a warm, encouraging personal development guide.
Based on the profile data below, generate a Self Perspective.

PROFILE SUMMARY:
- Blueprint: ${profileSections.blueprint}
- Key Strengths: ${profileSections.strengths?.join(', ')}
- Growth Areas: ${profileSections.vulnerabilities?.join(', ')}
- Patterns to Watch: ${profileSections.sabotage_tendencies?.join(', ')}
- Human Design Type: ${calculatedData.human_design.type}
- Life Path Number: ${calculatedData.numerology.life_path}

Return ONLY valid JSON, no markdown, no explanation.

{
  "strengths": ["gift 1", "gift 2", "gift 3", "gift 4"],
  "weaknesses": ["growth edge 1", "growth edge 2", "growth edge 3", "growth edge 4"],
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4"],
  "threats": ["pattern to release 1", "pattern 2", "pattern 3", "pattern 4"]
}`
}

export function buildAlignmentPlanPrompt(calculatedData, profileSections, swot) {
  return `You are a warm, practical life alignment coach.
Based on the profile below, create a 3-layer Alignment Plan.

PROFILE SUMMARY:
- Blueprint: ${profileSections.blueprint}
- Top Strengths: ${profileSections.strengths?.slice(0, 3).join(', ')}
- Growth Areas: ${profileSections.vulnerabilities?.slice(0, 2).join(', ')}
- Human Design Strategy: ${calculatedData.human_design.strategy}
- Key Opportunities: ${swot.opportunities?.slice(0, 2).join(', ')}

Return ONLY valid JSON, no markdown, no explanation.

{
  "directional_clarity": {
    "life_direction": "2-3 inspiring sentences about this person's natural direction",
    "prioritize": ["priority 1", "priority 2", "priority 3"],
    "eliminate": ["drain 1", "drain 2", "drain 3"]
  },
  "structured_plan": {
    "thirty_day_focus": "1 inspiring sentence about the next 30 days",
    "weekly_template": ["Mon-Tue: action", "Wed-Thu: action", "Fri: action", "Weekend: rest"],
    "daily_template": ["Morning: ritual", "Midday: action", "Evening: reflection"]
  },
  "behavioral_anchors": {
    "keystone_habits": ["habit 1", "habit 2", "habit 3"],
    "anti_sabotage_rules": ["rule 1", "rule 2", "rule 3"],
    "non_negotiables": ["non-negotiable 1", "non-negotiable 2", "non-negotiable 3"]
  }
}`
}