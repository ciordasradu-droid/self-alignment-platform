# Project: Self-Alignment Platform

## Design Rules (ALWAYS follow these)

### Philosophy
- This is a personal reflection app, not a SaaS dashboard
- The feel should be: calm, warm, personal, like opening a beautiful journal
- Think Calm app or Headspace — premium but never overwhelming

### Typography
- Readability is KING — never sacrifice readability for aesthetics
- Body text: minimum 15px, high contrast, comfortable line-height (1.6+)
- Dark backgrounds: text must be rgba(255,255,255,0.85) or higher — never lower than 0.7
- Light backgrounds: text must be #1a1a2e or darker
- Labels and small text: minimum 12px, never lower

### Colors & Effects
- Effects must ENHANCE content, never compete with it
- Background effects (gradients, orbs, particles): max 8% opacity — they set mood, not distract
- Gradient text: only on numbers, scores, and hero titles — NEVER on body text or labels
- Glowing borders: subtle (max 0.2 opacity shadows) — never harsh
- If an effect makes text harder to read, REMOVE the effect

### Animations
- All animations: 150-400ms, ease-out
- Never animate body text (no typewriter on paragraphs — only on short titles if needed)
- Hover effects: subtle lift (2-4px) + soft shadow. Never dramatic color changes
- Loading/celebration animations can be more dramatic but still elegant

### Cards & Layout
- Cards should feel warm but clean — soft shadows, NOT harsh borders
- White/light cards: subtle warm shadow, barely visible border
- Dark cards (like Daily Thought): gradient background is fine, but text contrast must be high
- Minimum padding: 20px on mobile, 28px on desktop
- Always generous whitespace between sections

### Mobile
- Everything must work on 320px width
- Touch targets: minimum 44px
- No horizontal scrolling ever
- Reduce padding slightly on mobile but never make it feel cramped

### What NOT to do
- No background patterns that reduce text readability
- No animated text on anything the user needs to read carefully
- No more than 2 animations visible at the same time per screen
- No neon/harsh glowing effects — always soft and organic
- Never make forms harder to use for visual effect

### Generating/Loading pages
- These should be calming and reassuring, not flashy
- Clear progress indication
- Text must be perfectly readable at all times
