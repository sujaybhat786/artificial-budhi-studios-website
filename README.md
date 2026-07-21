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

## Structure

- `index.html` — page markup
- `tokens.css` — design tokens (colors, type, spacing, radii, motion) —
  copy this file into other sites to keep them visually consistent
- `styles.css` — component and layout styles
- `script.js` — scroll reveals, nav, hero particles, Sri Yantra animation,
  contact form submission (Netlify Forms)
