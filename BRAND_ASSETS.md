# Al Broker — Brand Assets
*Canonical reference for all logo, color, and typography usage.*
*Last updated: April 2026*

---

## Logo Files

All logo files live in `/public/images/brand/`. Use these — do not recreate logos inline.

| File | Use |
|---|---|
| `logo-mark-light.svg` | Robot face only — light backgrounds (mint, white) |
| `logo-mark-dark.svg` | Robot face only — dark backgrounds (navy, slate) |
| `logo-wordmark-light.svg` | Full "AL BROKER" wordmark — light backgrounds |
| `logo-wordmark-dark.svg` | Full "AL BROKER" wordmark — dark backgrounds |

### In JSX components
```jsx
// Robot face mark (header, favicon, icons)
<img src="/images/brand/logo-mark-light.svg" alt="Al Broker" width={40} height={40} />

// Full wordmark (hero, splash screens)
<img src="/images/brand/logo-wordmark-light.svg" alt="Al Broker" height={48} />
```

---

## Logo Construction

The logo mark is a robot face with the following elements:

- **Head:** Perfect circle, Rocket Orange (`#FF7043`)
- **Eyes:** Two circular whites inside a single dark rounded-rect goggle frame (`#263238`), with dark pupils and white shine dots
- **Spectacles:** Teal (`#02DFD8`) circular frames over each eye, connected by teal bridge and temple arms
- **Ears:** Small orange circles with dark stroke on each side of head
- **Mouth/Grille:** Dark rounded rectangle (`#263238`) with a 3x2 orange grid pattern — fully contained within head circle
- **Antenna:** Short dark stem topped with small orange circle

The wordmark places the robot face as the **O** in BROKER — `AL BR` + face + `KER`. Text is Inter 900 Black Italic.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-rocket` | `#FF7043` | Primary CTA, logo, accents. One bold move per screen. |
| `--color-teal` | `#02DFD8` | Borders, dividers, focus states, spectacle frames |
| `--bg` (light) | `#E0F2F1` | Page background — Mid-Century Mint |
| `--bg-card` | `#FFFFFF` | Card surfaces |
| `--text` | `#263238` | Primary text — Deep Space |
| `--text-muted` | `#546E7A` | Secondary text |
| `--border` | `#263238` | Borders and shadows |
| `--bg` (dark) | `#37474F` | Dark mode page background — Slate Panel |
| `--bg-card` (dark) | `#4A6270` | Dark mode card surface |
| `--text` (dark) | `#E0F2F1` | Dark mode primary text — Mint |

**Usage rule:** Mint is the canvas. Deep Space is the ink. Rocket Orange is your one bold move per screen. Teal for structure and focus. Never full black.

---

## Typography

**Font:** Inter (Google Fonts)
- Import: `Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900`
- Logo / Display: weight 900, italic
- Headings: weight 700–900
- Body: weight 400–600
- Labels / Monospace: `DM Mono` or system monospace

**Type scale (CSS):**
```css
h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; font-style: italic; }
h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; }
h3 { font-size: 1rem–1.25rem; font-weight: 700; }
```

---

## Buttons

Three variants — always italic, always bold, always hard shadow:

```jsx
<button className="btn">Primary (Rocket Orange)</button>
<button className="btn btn-outline">Outline (transparent + orange border)</button>
<button className="btn btn-accent">Accent (Teal)</button>
```

**Button rule:** One primary CTA per screen. Hard offset shadow, translate-on-hover for retro tactile feel.

---

## Cards

```jsx
<div className="card" style={{ padding: '1.5rem' }}>
  {/* White surface, dark border, 3px hard shadow */}
</div>
```

---

## Shadows & Borders

- **Signature look:** Hard offset, zero-blur shadows
- Light mode: `3px 3px 0 #263238`
- Dark mode: `3px 3px 0 #E0F2F1`
- Accent: `3px 3px 0 #02DFD8` (teal shadow for featured elements)
- **Never use blurred shadows**

---

## CSS Variables (globals.css)

```css
:root {
  --bg: #E0F2F1;
  --bg-card: #FFFFFF;
  --text: #263238;
  --text-muted: #546E7A;
  --border: #263238;
  --shadow: #263238;
  --color-rocket: #FF7043;
  --color-teal: #02DFD8;
}

[data-theme="dark"] {
  --bg: #37474F;
  --bg-card: #4A6270;
  --text: #E0F2F1;
  --text-muted: #90A4AE;
  --border: #E0F2F1;
  --shadow: #E0F2F1;
}
```

---

## What Not To Do

- ❌ Do not recreate the logo mark inline in JSX — always use the SVG files from `/public/images/brand/`
- ❌ Do not use full black (`#000000`) anywhere
- ❌ Do not use blurred box shadows
- ❌ Do not use Rocket Orange as a background color for large areas
- ❌ Do not use more than one primary CTA per screen
- ❌ Do not use the Colorado-specific copy anywhere — platform is national

---

*Al Broker · Brand Assets · Confidential · April 2026*
