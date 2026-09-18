# Tolu Portfolio — Design Contract

Date: 2026-09-18 · Author: AdaL · POC: Tolu Shekoni
Source: `docs/adal/EXECUTE.md` §Stage 1 · `docs/adal/build-and-asset-plan.md` §1

This file is the single source of truth that the build and the evaluator both check against. Any visual drift from this contract is a defect, not a refinement.

---

## 1. Tokens (one `:root` block only — no duplicates)

```css
:root {
  /* palette — dark cinematic editorial */
  --color-ink: oklch(0.13 0.01 60);          /* deep warm-black paper */
  --color-surface: oklch(0.18 0.015 60);     /* one step up */
  --color-ink-fg: oklch(0.93 0.008 60);      /* primary text */
  --color-muted: oklch(0.62 0.02 60);        /* secondary text */
  --color-rule: oklch(0.28 0.01 60);         /* hairline borders */
  --color-accent: oklch(0.78 0.16 85);       /* warm gold */
  --color-accent-bg: oklch(0.20 0.04 85);    /* gold tinted bg */
  --color-blue: oklch(0.65 0.19 245);        /* cool slate blue */

  /* type */
  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-body: 'Source Sans 3', system-ui, -apple-system, sans-serif;
  --font-mono: 'DM Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  /* motion */
  --ease-out-exp: cubic-bezier(0.16, 1, 0.3, 1);

  /* shadow / overlay */
  --shadow-card: 0 1.5rem 4rem oklch(0.08 0.01 60 / 0.5);
  --glass-bg: oklch(0.20 0.018 60 / 0.72);
}
```

**No aliases.** Code references `var(--color-accent)`, never `var(--accent)` or `var(--gold)`.

---

## 2. Type ramp

| Element | Size | Family | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| `h1` (hero) | `clamp(3.9rem, 11vw, 9.5rem)` | `--font-display` | 700, opsz 144 | -0.095em | 0.86 |
| `h2` (section) | `clamp(2.35rem, 7vw, 5.8rem)` | `--font-display` | 600, opsz 144 | -0.06em | 0.92 |
| `h3` (card) | `clamp(1.35rem, 3vw, 2rem)` | `--font-body` | 600 | -0.005em | 1.3 |
| `.label` / kicker | `0.68–0.78rem` | `--font-mono` | 500 | 0.13–0.16em | 1.4, uppercase |
| `body` | `1rem` | `--font-body` | 400 | normal | 1.65 |
| `.hero-lead` | `clamp(1.15rem, 2vw, 1.55rem)` | `--font-body` | 400 | normal | 1.5 |
| `.contact h2` | `clamp(2.5rem, 8vw, 6.5rem)` | `--font-display` | 600 | -0.07em | 0.92 |

---

## 3. Section order (must render top→bottom)

1. `.site-header` — fixed, glass-on-scroll, height 3.5rem
2. `.hero` (`#about`) — full-viewport, constellation canvas, staggered word entrance, magnetic CTAs, proof-strip, cinema-panel
3. `.agency-marquee` — infinite CSS ticker
4. `.thesis` — editorial pull-quote, gold left border
5. `.disciplines` (`#focus`) — numbered hover rows
6. `.work` (`#work`) — proof-first grid, 8 projects, 3 featured span 2 columns
7. `.built-with-adal` (`#built-with-adal`) — meta-section: prompts used · before/after · build log
8. `.contact` (`#contact`) — oversized type, magnetic email CTA
9. `footer` — minimal copyright

---

## 4. Hero spec

- `min-height: min(94svh, 58rem)`; mobile relaxes to `auto`.
- `#constellation` `<canvas>` is `position: absolute; inset: 0; z-index: 0`, behind `.hero-content` (z-index: 2).
- `.hero-backdrop` `<img>` is the **no-JS / reduced-motion** fallback at `z-index: -1`. Hidden when canvas mounts; restored when canvas fails.
- `h1` uses staggered word entrance (`translateY(110% → 0)`, 600ms, stagger 80ms).
- `.proof-strip` is a 3-column grid on desktop, single column on `<= 820px`.
- `.cinema-panel` is absolutely positioned bottom-right on desktop, in-flow on mobile.
- `.cta` is the magnetic CTA — only translates on `(hover: hover)`.

---

## 5. Constellation canvas spec

- Vanilla 2D canvas. No Three.js, no WebGL.
- Node count: `min(140, round(width / 12))` capped by devicePixelRatio.
- Each node: `vx, vy ∈ [-0.15, 0.15]` px/frame; integrates drift.
- Pairs within 130px → 1px gold line, alpha = `1 - dist/130`.
- Nodes within 180px of mouse get a soft repel vector; click toggles to attract.
- Resize handler re-counts nodes and resets positions to within new bounds.
- `prefers-reduced-motion: reduce` → static render of pre-positioned nodes, no `requestAnimationFrame`, no mouse handling.
- If `<canvas>` unsupported → hide canvas, show `.hero-backdrop`.

---

## 6. Motion primitives

- One easing site-wide: `cubic-bezier(0.16, 1, 0.3, 1)`.
- `.reveal`: `opacity 0 → 1`, `translateY(1.25rem → 0)`, 600ms, stagger 100ms per sibling inside same section.
- `.section-rule`: width `0 → 6rem`, 800ms.
- Word entrance (hero h1): `translateY(110% → 0)`, 600ms per word, stagger 80ms.
- Marquee: pure CSS `@keyframes` translateX, 40s linear infinite; paused under `prefers-reduced-motion`.
- Magnetic CTA: translate capped at ±8px on `mousemove` only on `(hover: hover)`.
- All transitions collapse to 0.01ms under `prefers-reduced-motion: reduce`.

---

## 7. Craft details

- **Film-grain overlay**: fixed `body::before` (or layer), full-screen, `opacity: 0.04`, SVG noise data-URI, `pointer-events: none`, `z-index: 0`, sits between page bg and content.
- **Custom cursor dot**: `.cursor-dot` is an 8px circle appended by JS, only when `matchMedia('(hover: hover) and (pointer: fine)')` matches. Hidden otherwise. Lerps to mouse at 0.18.
- **Selection color**: `::selection { background: var(--color-accent); color: var(--color-ink); }`.
- **Focus-visible**: `outline: 2px solid var(--color-accent); outline-offset: 2px;`.
- **Favicon**: `assets/img/favicon.png` (`<link rel="icon">`).
- **OG image**: `assets/img/og.png` 1200×630 (`<meta property="og:image">`, Twitter card).
- **No-JS fallback**: hero backdrop image, project cards rendered statically, CTAs remain functional.
- **`<noscript>` banner**: small monospace bar at top in case JS is off.

---

## 8. Work grid spec

- 8 real projects from `portfolioProjects` array (preserved verbatim from `script.js`).
- 3 featured (Stripe Clone, SignalForge, Vouch): 2-column span, larger h3 (`clamp(1.7rem, 4vw, 3rem)`), `LIVE PROOF` badge, project thumbnail `assets/img/project-*.png`.
- 5 secondary: standard card, proof link list.
- All real links preserved; `isSafeProjectLink()` filters `http(s)` only.

---

## 9. Built-with-AdaL spec

3-card meta-section above contact:
- **Prompts used** — inline `<details>` collapsible with the asset prompts verbatim from `build-and-asset-plan.md` §A1–A7.
- **Before / After** — two stacked panels showing the rebuilt hero vs the prior dark cinematic version.
- **Build log** — `<table>` of date · stage · outcome, sourced from git log + this plan.

---

## 10. Mobile (<= 48rem / 768px)

- Hamburger nav (3 spans → animated X).
- `.hero-content` `padding-right: 0`.
- `.work` no longer full-bleed; `width: 100%; margin-left: 0`.
- `.proof-strip` collapses to 1 column at <= 820px.
- `.cinema-panel` in-flow at <= 900px.
- `body` font scales via `clamp()` only — no JS.

---

## 11. Validation hooks

- All `var(--…)` references resolve to a token in §1. No raw `oklch()` in component CSS — only in `:root`.
- No console warnings or errors at load.
- All `<a>` links resolve to `http:` or `https:`.
- Reduced-motion and no-JS paths both render a complete, legible hero.
- 320px viewport: no horizontal scroll (`overflow-x: hidden` on `body`).
