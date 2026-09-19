# ToluOS Design Spec — Extended (to supplement DESIGN.md)

Date: 2026-09-18 · Author: AdaL (engineer)
Reference: `reference-redesign-plan.md` §6 (palette, chrome, motion, sound)
Status: Round-4 implementation in progress

This file extends `DESIGN.md` (the linear-scroll portfolio contract) with the **toluOS** contract — the desktop-OS metaphor that replaced the rejected push in Round 3. Sections 1–5 from `DESIGN.md` (palette base, type ramp, motion, craft) are preserved and inherited; this doc adds the chrome, window, taskbar, mobile-tab, and constellation specs.

---

## 1. Inherited from DESIGN.md (unchanged)
- All `:root` tokens (ink, surface, ink-fg, muted, rule, accent, blue) — same values.
- Type ramp — same fonts (Fraunces / Source Sans 3 / DM Mono), same scales.
- Motion easing — `cubic-bezier(0.16, 1, 0.3, 1)` site-wide.
- Reduced-motion, focus-visible, selection — same CSS rules.

## 2. Expanded palette (per project-domain accent)

Added 10 new tokens (see `:root` in `styles.css`):

| Token | Value | Domain |
|---|---|---|
| `--color-amber-hot` | `oklch(0.7 0.18 70)` | Vouch, Crypto Scanner |
| `--color-deep-violet` | `oklch(0.32 0.14 290)` | Memory Palace |
| `--color-mint-green` | `oklch(0.78 0.18 160)` | SignalForge |
| `--color-cyan` | `oklch(0.78 0.10 200)` | Agent Skills |
| `--color-blue-grey` | `oklch(0.55 0.04 230)` | X Monitor |
| `--color-deep-amber` | `oklch(0.45 0.10 60)` | AgentTrust |
| `--color-window-bg` | `oklch(0.10 0.012 280)` | Window body |
| `--color-window-title` | `oklch(0.16 0.014 60)` | Window title bar |
| `--color-taskbar-bg` | `oklch(0.10 0.012 280 / 0.92)` | Taskbar background |

Hue sanity: all new colors fall in {60, 70, 85, 160, 200, 230, 245, 290}.

## 3. Wallpaper — 6-layer composite (back-to-front)

1. **`body` gradient** — `linear-gradient(160deg, oklch(0.08 0.014 260) 0%, oklch(0.13 0.01 60) 50%, oklch(0.16 0.014 50) 100%)`. Cool→warm diagonal.
2. **`#A7-topo.png`** — generated topographic texture at 10% opacity, `mix-blend-mode: overlay`.
3. **`#constellation` canvas** — focal-point constellation (see §5) at 65% opacity, `mix-blend-mode: screen`.
4. **`.wp-glow-warm`** — `radial-gradient(circle, oklch(0.78 0.16 85 / 0.25), transparent 60%)` top-right, 1200×1200 px.
5. **`.wp-glow-cool`** — `radial-gradient(circle, oklch(0.65 0.19 245 / 0.18), transparent 55%)` bottom-left, 1100×1100 px.
6. **`body::before` grain** — SVG noise at 5% opacity, `mix-blend-mode: overlay`.

## 4. Window chrome

| Element | Spec |
|---|---|
| Title bar height | 32 px, `var(--color-window-title)` bg |
| Title bar accent stripe | 3 px wide on the left edge, project-domain color (`--window-accent`) |
| Title text | Fraunces 600 13 px, `--color-ink-fg` |
| Controls | 3 × 22×22 px: minimize (−), maximize (□), close (×) |
| Close hover | `oklch(0.62 0.20 25)` red |
| Body | `var(--color-window-bg)` bg, 20 px padding, flex column with status footer pinned to bottom |
| Border | 1 px `oklch(1 0 0 / 0.08)`, border-radius 8 px |
| Shadow | `0 2rem 5rem oklch(0 0 0 / 0.55), 0 0 0 1px oklch(1 0 0 / 0.06)` |
| Min size | 320 × 240 px |
| Resize handles | 8 directions (n/s/e/w/ne/nw/se/sw), 4-px hit area |
| Z-index mgmt | last-clicked = highest (nextZ++ on focus) |

## 5. Constellation canvas — focal-point (replaces uniform mesh)

- **Core** at center: 14 px radius, pulsing scale 1.0 → 1.15 every 4 s (sine), gold glow radial gradient extends to 56 px.
- **6 spokes** radiating at 60° intervals to cluster centers at radius `min(w,h) * 0.22` from center.
- **6 clusters** of 9 secondary nodes each within 25–75 px of cluster center.
- **Cluster edges**: drawn between nodes within 80 px, opacity 0.35.
- **Cluster-to-cluster arcs**: drawn between adjacent cluster centers, opacity 0.18.
- **Mouse attract**: within 280 px of mouse, spokes softly drift toward it (0.02 lerp/frame).
- **Click to explode**: all spokes fly outward to radius × 2.8 over ~1 s. Click again to return.
- **Reduced-motion**: skipped entirely (no canvas).

## 6. Taskbar (desktop)

- Position fixed bottom, 36 px tall.
- Background: `var(--color-taskbar-bg)` with `backdrop-filter: blur(16px) saturate(140%)`.
- Top border: 1 px `oklch(1 0 0 / 0.08)`.
- Start orb (left): 24×24 px gold-gradient circle with "TS" in Fraunces 700.
- Tabs (center): horizontal scroll, 26 px tall, project-domain color dot + label, active state has 2 px bottom border.
- Right: sound toggle (32×32 px) + clock (mono 12 px).
- On mobile (< 48rem): hidden — replaced by `.mobile-tabs` bar above.

## 7. Mobile tabs (< 48 rem)

- Position fixed bottom, 52 px tall, above taskbar.
- Horizontal scroll, pill-shaped tabs.
- Always includes "Welcome" as first tab.
- Tapping a tab opens that project as a window.
- Desktop icons reposition to bottom-center as 4×2 grid (64 px thumbs).

## 8. Right-click context menu (desktop only)

- Plain HTML/CSS, dismiss on outside click or Esc.
- Items: Open Welcome · Reset window layout · Keyboard shortcuts… · View source on GitHub ↗

## 9. Keyboard shortcuts

| Combo | Action |
|---|---|
| `Esc` | Close focused window |
| `⌘/Ctrl + W` | Close focused window |
| `⌘/Ctrl + M` | Minimize focused window |
| `⌘/Ctrl + Tab` | Cycle windows |
| `⌘/Ctrl + 0` | Open/focus Welcome |
| `⌘/Ctrl + 1..8` | Open/focus project 1..8 |
| `⌘/Ctrl + R` | Reset window layout |
| `?` | Show shortcuts overlay |

## 10. Sound (placeholder, no audio asset generated)

- Header sound toggle in taskbar (desktop only).
- Default OFF, persisted in `localStorage` under `toluOS.sound.v1`.
- **C1 ambient audio not generated in this build** — AdaL audio capability not available in this session. Toggle is wired but does not play.
- Documented gap: see `EVALUATE-log.md` Round-5.

## 11. Layout persistence

- Window positions/sizes saved to `localStorage` under `toluOS.layout.v1`.
- On load, restored from storage; default positions used if no entry.
- Reset via `Cmd+R` or right-click → "Reset window layout".

## 12. Welcome window — content spec

- **Headline**: "Tolu Shekoni turns bootcamp velocity into shipped, verifiable products." (Fraunces 700, `clamp(1.75rem, 3.6vw, 2.6rem)`, stagger word-entrance 80 ms).
- **Lead**: 1-liner about intersection of agentic AI, onchain trust, data-driven product systems.
- **CTA row**: Email Me (primary), X / @tolu_evm ↗, GitHub ↗, View Stripe Clone ↗.
- **Proof strip**: 3 columns (LIVE DEMOS / BOOTCAMPS / HACKATHON WORK).
- **Tabs**: 8 Projects · Receipts · Build process.
- **8 Projects panel**: list of all 8 projects with colored dots + Open buttons.
- **Receipts panel**: table of all live project links (display-only, no live probe).
- **Build process panel**: how the build was made (AdaL engineer mode, daedalOS reference, AdaL resources).

## 13. Per-project window content

Each project window contains:
- 16:10 thumbnail (project-domain color overlay).
- h2 title (project-domain color).
- Proof paragraph.
- Link buttons (Live demo, Repo, README, Health endpoint, X proof, Gallery).
- Status footer: "toluOS · v1 · DATE" + "live-verified" pill.

## 14. What is preserved from the prior DESIGN.md

- All `:root` color tokens (no aliases).
- Type ramp, motion easing, reduced-motion, focus-visible.
- The four `oklch` literals in the body gradient (160/85/245/60) and the constellation gold.
- The vendored Three.js r149 (per EXECUTE.md Stage 0) — present and would be usable for a 3D parallax variant in a future iteration.

## 15. What is intentionally different

- No scrolling sections (the desktop metaphor replaces scroll-as-navigation).
- No reveal-on-scroll (windows fade in on open, not on scroll).
- No hamburger nav (replaced by Start orb + taskbar).
- No marquee (the marquee text was redundant with the per-window content).
- No magnetic CTAs (every link button is a clear affordance; no ambiguity).
- No cursor dot (the desktop metaphor uses OS-native cursor states).
