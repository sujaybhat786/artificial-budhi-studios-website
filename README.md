# Artificial Budhi Studios

Marketing site for Artificial Budhi Studios — AI media, education, and product
studio at the intersection of ancient Indian knowledge systems and modern AI.

## Setup

This is a static HTML/CSS/JS site — no build step, no dependencies. Open
`index.html` directly in a browser, or serve the folder with any static
file server.

After cloning, run this once to restore the design skill pack (regenerable,
not tracked in git):

```
uipro init --ai claude
```

To preview locally with a real HTTP origin (the contact form and
fonts behave better than over `file://`):

```
python3 -m http.server 4321
```

## Structure

- `index.html` — page markup
- `tokens.css` — design tokens (colors, type, spacing, radii, motion) —
  copy this file into other sites to keep them visually consistent
- `styles.css` — component and layout styles
- `script.js` — scroll reveals, nav, hero particles, Sri Yantra animation,
  contact form submission (Netlify Forms)

## Design system

Glassmorphism / dark cinematic, shared with the founder portfolio at
[sujaybhat.com](https://sujaybhat.com) so the two sites read as one
identity. Palette is ambient grey + deep indigo on dark crossed with
premium black + gold (accent `#e3b04b`); type is Space Grotesk /
Inter / JetBrains Mono.

Real `backdrop-filter` glass is rationed to the nav, persona cards,
role card and contact panel. Dense grids use the cheaper flat-gradient
`.panel`, which reads the same without the blur cost.
