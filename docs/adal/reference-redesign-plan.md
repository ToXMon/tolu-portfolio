# Reference-Led Redesign Plan

Date: 2026-09-18 · Author: AdaL (planner role)
References studied: https://dustinbrett.com/ (daedalOS), https://sylphai-inc.github.io/adal-bootcamp-landing-page/slides/04-resources.html, https://sylphai-inc.github.io/adal-bootcamp-landing-page/ (root class landing).
Scope: replace the rejected pushed build (`42d1f58`) with a desktop-OS-metaphor portfolio in the spirit of daedalOS, using AdaL bootcamp resources for asset generation. **No source edits in this turn** — this is a discovery + plan document.

---

## 1. TL;DR

The pushed build is a conventional scroll-portfolio with one 2D canvas, flat dark background, no media, no real interactivity. It passes mechanical gates and prints a clean OG card, but it does not look like the kind of portfolio that wins a portfolio-design hackathon. **The user's reference (dustinbrett.com / daedalOS) is a full in-browser desktop OS** — windows, taskbar, draggable icons, working file explorer, working terminal, working apps (Doom, video player, image viewer, settings). Adapting that grammar to Tolu's portfolio is the highest-leverage move available.

The proposed redesign is **"toluOS"** — Tolu's Workstation: a single-page web app rendered as a dark cinematic desktop OS. Each project is a draggable, resizable window. The user can open multiple projects at once, rearrange them, snapshot the layout, and switch to a "stage mode" for distraction-free reading. Mobile falls back to a tabbed single-window interface (not desktop metaphor — touch input doesn't support dragging). Hero is the desktop with all icons; the proof-strip and cinema-panel become a single wallpaper + a "Welcome" window that auto-opens on load.

The AdaL resources page gives us the prompt patterns (MotionSites prompts, "design-spec.md" workflow, Magic UI / Aceternity blocks) for asset generation. The bootcamp's `design-spec.md` workflow maps directly to our existing `DESIGN.md`. The reference sets (lapa.ninja, onepagelove.com, motion sites) feed hero and project-window chrome.

---

## 2. References — what was studied

### 2.1 daedalOS (https://dustinbrett.com/)

**Visual surface (captured):**
- Dark space-themed wallpaper (galaxy image, full-bleed, behind everything).
- 8 desktop icons top-left (My PC, Feature Review, Day in My Life, Public, My Travel Story, Blog Posts, Live Well Live Twice, Doom) — each with a 48×48 thumbnail + label.
- Bottom-bar widgets: Pi (math/stats) icon, search icon, current-window tab ("My PC"), live clock.
- No top bar, no menu bar — chrome is intentionally minimal.

**Interaction grammar (verified via playwright):**
- **Single-click** icon → highlight / focus (selection state, subtle visual change).
- **Double-click** icon → opens a draggable, resizable window with full chrome (title bar, min/max/close, breadcrumb path, nav arrows, refresh, search field, status bar, view toggle). Window is rendered as a separate canvas overlay (not a DOM window) — but the chrome and behavior are familiar.
- Window contents: real file-system metadata (Program Files, System, Users folders; favicon.ico, robots.txt, sitemap.xml, CREDITS.md, etc.), with Name/Date modified/Type/Size columns.
- Taskbar at bottom: shows currently-open windows as tabs (click to focus).
- Live clock in bottom-right.
- Mobile (390 px): same desktop metaphor laid out tightly; tap ≠ double-click so windows don't open by default (likely a fallback UX we don't see).

**What is conceptually adaptable (not literal copy):**
- **Desktop metaphor** as the primary UI surface (instead of scrolling sections).
- **Project-as-window**: each of Tolu's 8 projects becomes a window that opens when clicked.
- **Window chrome** with min/max/close, draggable title bar, resize handles.
- **Taskbar at bottom** with: avatar/profile · sound toggle · running windows · live clock.
- **Wallpaper** = the hero canvas + A7 topo texture + accent glow.
- **Welcome window** auto-opens on load = the proof-strip + 1-line thesis + CTAs (Email / GitHub / X).
- **Right-click context menu** on the desktop = "Reset layout" / "Sound on/off" / "Built with AdaL — view source".
- **Keyboard shortcuts**: `Esc` to close focused window, `Cmd/Ctrl+W` to close, `Tab` to cycle windows, `1–8` to jump to project, `?` to show shortcut overlay.

**What is NOT adaptable (too ambitious for this build):**
- Full working file explorer with real virtual file system.
- Doom, video player, image viewer, settings app, terminal — those are months of work.
- Real drag-and-drop file management.

### 2.2 AdaL Bootcamp landing & resources

- **Class landing** ([link](https://sylphai-inc.github.io/adal-bootcamp-landing-page/)) is itself a dark cinematic single-page with marquee, sections, and built-with-AdaL evidence — confirming the brief pattern works. Five class modules: setup / capabilities / starting point / clone / resources.
- **Resources page** ([link](https://sylphai-inc.github.io/adal-bootcamp-landing-page/slides/04-resources.html)) catalogs:
  - **MotionSites AI** ([motionsites.ai](https://motionsites.ai/)) — 364 copy-paste prompts for animated landing pages, each with a looping video preview. **Use for hero inspiration.**
  - **Aceternity UI** ([ui.aceternity.com](https://ui.aceternity.com/)) — 200+ bold animated blocks. **Use for the "Welcome window" content, bento grid, lamp/glow effects.**
  - **Magic UI** ([magicui.design](https://magicui.design/)) — animated marketing components (marquees, bento grids, globe, shimmer). **Use for marquee styling, bento grids in the project windows.**
  - **Stork** ([stork.ai](https://www.stork.ai/free-animated-landing-page-prompts)) — free equivalent to MotionSites stack. **Use as a fallback if MotionSites prompts don't fit.**
  - **21st.dev** ([21st.dev](https://21st.dev/)) — community UI components with "Copy prompt" buttons. **Use for individual component prompts (cursor dot, magnetic button, etc.).**
  - **Lapa Ninja** ([lapa.ninja](https://www.lapa.ninja/)) — 7,300+ landing-page screenshots. **Use for section-order / hero-composition reference.**
  - **One Page Love** ([onepagelove.com](https://onepagelove.com/)) — curated single-page sites. **Use for scroll-rhythm and section-order reference.**
- **Copy-paste prompts** to adapt:
  - **Prompt 1: "Reverse-engineer any site into a design spec"** — exactly the workflow we used for `DESIGN.md`. Reuse as a reference point: open daedalOS, screenshot at 1440/768/390, extract palette/type/spacing/animations → `design-spec.md`. Re-apply to our toluOS redesign.
  - **Prompt 2: "Clone a preview you'd otherwise pay for"** — go to MotionSites, pick a hero preview, study frame-by-frame, recreate with our copy and brand. **Apply to the Welcome-window hero.**
  - **Prompt 3: "Build the full landing page from a reference set"** — study daedalOS + 2 MotionSites heroes + 1 Lapa reference, write `design-spec.md` for our product, build responsive at 1440/768/390. **This is the master prompt for the redesign.**

### 2.3 Existing brief + plan docs (read again)

- `docs/EXECUTE.md` — Stages 0–6; "vendored Three.js" Stage 0 (still required unless we explicitly deviate and document why); "Vendor Three.js" required even if unused as a deliverable.
- `docs/build-and-asset-plan.md` — §1 (web build), §2 (asset plan with full Director's Console prompts for A1–A7, B1–B2, C1–C2), §3 (workflow). Asset prompts verbatim, can be re-fed to `generate_image` for the redesign.
- `DESIGN.md` (current) — tokens, type ramp, motion primitives. Reuse as the contract; extend with the OS-metaphor system (window chrome, taskbar, wallpaper).
- `docs/adal/EVALUATE.md` — gate structure (G1/G2/G3/G4/G5). New visual audit gate needed (no black void, no missing windows).

---

## 3. Current state — what the pushed build actually lacks

(See `docs/adal/redesign-audit.md` for the full audit; key points summarized here.)

- **Hero canvas is generic** — 80-node uniform mesh, no focal point, no parallax depth.
- **Body background is flat** — `oklch(0.13 0.01 60)` solid, no texture.
- **Work-grid visuals are placeholders** — 3 hand-authored SVG diagrams + 5 text-only cards.
- **Reveal-on-load defect** — 21/22 reveals stay at opacity 0 until scroll.
- **Zero media on the page** — `<video>`: 0, `<audio>`: 0, inline `<svg>` illustrations: 0.
- **Minimal interactivity** — 1 button (hamburger), no scroll-driven effects.
- **Card-link chips at 31 px** on mobile (touch-tap boundary).
- **No project thumbnails for 5/8 projects.**
- **Three.js vendored then deleted** in Round 3.
- **"Built with AdaL" is text-only** — no real receipts.

The mechanical gates pass (21/21). The visual deliverable does not match the brief.

---

## 4. Proposed product concept

### 4.1 Name and one-liner
**"toluOS — Tolu's Workstation."** Tagline: "Proof-first builder · AI systems · Web3 · Data — open the windows."

### 4.2 Concept
A single-page web app that renders as a dark cinematic desktop OS. The desktop is the home — every project is a draggable, resizable window with real chrome. Visitors explore Tolu's work the way they explore their own computer: open a window, move it, stack it, close it.

### 4.3 Information architecture

```
toluOS desktop (full viewport)
├── Wallpaper (hero canvas + A7 topo + accent glow)
├── Desktop icons (left column, 8 projects)
├── Welcome window (auto-opens on load, centered, draggable)
│   ├── Proof strip (3 cards: Live demos / Bootcamps / Hackathon work)
│   ├── Thesis one-liner
│   ├── CTAs (Email / GitHub / X)
│   └── "Built with AdaL" disclosure
├── 8 project windows (one per portfolioProjects entry)
│   ├── Stripe Clone — payment panel mockup, live demo, repo, X proof, README
│   ├── SignalForge — Solana devnet, hex network visual, README
│   ├── Vouch / Monad — seal stamps, live app, health endpoint, repo
│   ├── Crypto Scanner — radar concentric rings, repo, README, gallery
│   ├── X Monitor — social waveform, gallery link
│   ├── AgentTrust — security lattice, repo, README
│   ├── Memory Palace — branching knowledge graph, repo
│   └── Agent Skills — toolkit icon deck, no link (described)
├── Taskbar (bottom, 36 px tall)
│   ├── Start orb (left) — opens Welcome + sidebar menu
│   ├── Pinned: Welcome, Stripe, Vouch
│   ├── Running windows (tabs)
│   ├── Sound toggle
│   └── Live clock (right)
└── Right-click context menu (desktop only)
    ├── Reset window layout
    ├── Sound on/off
    ├── Built with AdaL — view source
    └── Keyboard shortcuts (?)
```

### 4.4 Project window content (each window)
- **Header**: thumbnail (1600×1000 AI-generated still, project-domain accent color)
- **Title bar**: project name + close (×) + minimize (−) + maximize (□)
- **Body**: thesis one-liner + proof paragraph + link buttons (live demo, repo, README, health endpoint, X proof, gallery)
- **Footer**: small wordmark + "Proof: live-verified 2026-09-18" status pill

### 4.5 Welcome window content
- **Title bar**: "Welcome — Tolu Shekoni"
- **Hero block**: stagger word entrance of headline, proof-strip 3-card grid, primary CTAs
- **Tab 1 — Proofs**: 8-row table of live-verified link statuses (HTTP code + last-checked)
- **Tab 2 — Receipts**: built-with-AdaL real evidence (full prompts, before/after screenshots, embedded AI outputs)
- **Tab 3 — Source**: link to the GitHub repo + git log

### 4.6 Desktop icons (8)
- Top-left, single column on desktop / 2-column wrap on mobile
- Each: 64×64 thumbnail, label below, drag to reposition
- Double-click to open as window

### 4.7 Taskbar
- Fixed bottom, 36 px tall
- Translucent dark background (`oklch(0.13 0.01 60 / 0.85)`), `backdrop-filter: blur(12px)`
- Start orb left (click → opens Welcome if not open, otherwise focuses it)
- Running windows as tabs (click → focus; click again → minimize; right-click → close)
- Pinned apps: Welcome, Stripe, Vouch
- Right: sound toggle, clock

---

## 5. Exact interactive systems

### 5.1 Desktop shell
- Full-viewport `<canvas>` (or two layered canvases: one for wallpaper, one for windows).
- Wallpaper = layered: A7 topo texture (PNG, 8% opacity, `mix-blend-mode: overlay`) + body gradient (cool→warm 180°) + corner accent glow (1200 px, `mix-blend-mode: screen`) + hero canvas (focal-point constellation, see §6.3).
- Right-click on desktop (not on a window) → context menu (Reset / Sound / Source / Shortcuts).
- Click on desktop (not on a window) → deselects all windows, brings focus to desktop.

### 5.2 Draggable, resizable windows
- Each window is a `<div class="window">` absolutely positioned on a `position: relative` container (the desktop).
- **Drag**: mousedown on title bar → mousemove updates `transform: translate(x, y)` → mouseup commits. Touch: same with touchstart/touchmove/touchend. **Snap to edges** at viewport ±20 px.
- **Resize**: 8 handles (n, s, e, w, ne, nw, se, sw). Mousedown on handle → mousemove updates `width`, `height`, `x`, `y`. Touch: same.
- **Min size**: 320 × 240. **Max size**: viewport × 0.92.
- **Z-index management**: click on a window → bring to front. Last-clicked = highest z-index.
- **Minimize**: animation (200 ms scale 1 → 0 + opacity 1 → 0), window hides, tab stays in taskbar.
- **Maximize**: animation (200 ms to viewport bounds).
- **Close**: animation (200 ms scale to 0 + opacity to 0), remove from DOM, taskbar tab gone.
- **Layout persistence**: window positions/sizes saved to `localStorage` under `toluOS.layout.v1`. Reset via right-click menu.

### 5.3 Window chrome (visual spec)
- Title bar: 28 px tall, `oklch(0.16 0.014 60)` background, project-domain accent color stripe (3 px left), project name in Fraunces 600 13 px, 3 controls (min/max/close) right-aligned.
- Body: `oklch(0.10 0.012 280)` background, 16 px padding, project content.
- Border: 1 px `oklch(1 0 0 / 0.08)`, border-radius 8 px.
- Shadow: `0 1.5rem 4rem oklch(0 0 0 / 0.5)` (existing --shadow-card).
- Resize handle: 4 px wide hit area, 1 px visual line, cursor changes per handle.

### 5.4 Taskbar
- Fixed bottom, 36 px tall, `oklch(0.10 0.012 280 / 0.92)` background, `backdrop-filter: blur(12px) saturate(140%)`, 1 px top border `oklch(1 0 0 / 0.08)`.
- Left: 32×32 start orb (Tolu's avatar circle, gold gradient).
- Center: horizontal scroll of window tabs (max-width: 60 vw, scrollable horizontally).
- Right: 32×32 sound toggle, 32×32 clock showing live time.
- Tab: 28 px tall, 8 px padding-x, project-domain accent color on active (2 px bottom border), hover lifts 2 px.
- Active tab = gold bottom border 2 px.
- Pinned tabs marked with a small 📌 emoji or pin icon.

### 5.5 Keyboard shortcuts (desktop only)
- `Esc` — close focused window (or focused dropdown)
- `Cmd/Ctrl+W` — close focused window
- `Cmd/Ctrl+M` — minimize focused window
- `Cmd/Ctrl+Tab` — cycle windows forward
- `Cmd/Ctrl+Shift+Tab` — cycle backward
- `Cmd/Ctrl+1..8` — open/focus project 1..8
- `Cmd/Ctrl+0` — open/focus Welcome window
- `Cmd/Ctrl+R` — reset window layout (with confirm dialog)
- `Cmd/Ctrl+M` (alternate) — toggle sound
- `?` — show keyboard shortcut overlay (modal window)

### 5.6 Mouse behavior
- Single click on icon: select (subtle highlight, 100 ms).
- Double click on icon: open as window (300 ms total).
- Click on title bar: focus window + start drag.
- Click on body of window: focus window.
- Click on resize handle: start resize.
- Right-click on desktop: open context menu.
- Right-click on window title bar: open per-window menu (Close / Minimize / Maximize / Always on top).
- Cursor changes: `default` on desktop, `pointer` on icons, `grab` on title bar, `grabbing` during drag, `nwse-resize` / `nesw-resize` / `ns-resize` / `ew-resize` on resize handles.

### 5.7 Mobile adaptation (< 768 px)
- Desktop metaphor collapses to a **tabbed single-window interface** (one project visible at a time).
- Tab bar at bottom replaces taskbar.
- No drag/resize (touch gesture).
- Wallpaper still visible as background.
- Welcome becomes the first tab, auto-shown.
- Swipe horizontally between project tabs.
- Pull-down from top = "back to desktop" with icon grid.

### 5.8 Sound
- Header sound toggle (always visible in taskbar on desktop, hidden on mobile).
- Default OFF.
- Toggle on → fade in over 2 s.
- Toggle off → fade out over 1 s.
- Persists in `localStorage`.
- If audio context blocked by browser policy → toggle shows tooltip "Tap to enable audio".

### 5.9 Right-click context menu
- Plain HTML/CSS menu, no library.
- Dismissed on outside click or `Esc`.
- Items per §4.7.

---

## 6. Art direction, palette, typography, background, motion, sound

### 6.1 Palette expansion (extends current DESIGN.md tokens)

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `oklch(0.13 0.01 60)` | Desktop wallpaper base |
| `--color-surface` | `oklch(0.18 0.015 60)` | Window body |
| `--color-ink-fg` | `oklch(0.93 0.008 60)` | Primary text |
| `--color-muted` | `oklch(0.62 0.02 60)` | Secondary text |
| `--color-rule` | `oklch(0.28 0.01 60)` | Hairline borders |
| `--color-accent` | `oklch(0.78 0.16 85)` | Gold — Welcome, base accents |
| `--color-accent-bg` | `oklch(0.20 0.04 85)` | Gold tinted bg |
| `--color-blue` | `oklch(0.65 0.19 245)` | Glacier blue — Stripe, generic chrome |
| `--color-amber-hot` | `oklch(0.7 0.18 70)` | Hot amber — Vouch, Crypto Scanner |
| `--color-deep-violet` | `oklch(0.32 0.14 290)` | Violet — Memory Palace |
| `--color-mint-green` | `oklch(0.78 0.18 160)` | Mint — SignalForge |
| `--color-cyan` | `oklch(0.78 0.10 200)` | Cyan — Agent Skills |
| `--color-blue-grey` | `oklch(0.55 0.04 230)` | Steel — X Monitor |
| `--color-deep-amber` | `oklch(0.45 0.10 60)` | Vault amber — AgentTrust |
| `--color-window-bg` | `oklch(0.10 0.012 280)` | Window content background |
| `--color-window-title` | `oklch(0.16 0.014 60)` | Window title bar |
| `--color-taskbar-bg` | `oklch(0.10 0.012 280 / 0.92)` | Taskbar background |

Hue sanity: all new colors fall in {60, 70, 85, 160, 200, 230, 245, 290}. None in {0} (pure neutral only via `oklch(0.93 0 0)` for white).

### 6.2 Background system (non-bland)
- **Layer 1** (desktop wallpaper base): `linear-gradient(160deg, oklch(0.08 0.014 260) 0%, oklch(0.13 0.01 60) 50%, oklch(0.16 0.014 50) 100%)` — diagonal shift cool → warm.
- **Layer 2** (topo texture): A7 PNG at 6% opacity, `mix-blend-mode: overlay`.
- **Layer 3** (constellation canvas): focal-point constellation (see §6.3) at 70% canvas opacity, color `#E8B34B` nodes on transparent, mixed via `screen` blend with wallpaper.
- **Layer 4** (corner accent): `radial-gradient(circle at 80% 20%, oklch(0.78 0.16 85 / 0.25), transparent 60%)` — top-right warm glow.
- **Layer 5** (cool accent): `radial-gradient(circle at 15% 85%, oklch(0.65 0.19 245 / 0.15), transparent 50%)` — bottom-left cool glow.
- **Layer 6** (film grain): existing `body::before` SVG noise at 5% opacity, `mix-blend-mode: overlay`.

### 6.3 Hero canvas — focal-point constellation (replaces uniform mesh)
- Central **core node**: 12 px radius, gold (`#E8B34B`), pulsing scale 1.0 → 1.15 every 4 s.
- **6 spokes** radiating at 60° intervals to 6 **cluster centers** at radius 280 px from core.
- Each cluster has **8–10 secondary nodes** clustered within 80 px.
- Nodes within a cluster connect to each other; spokes connect core to cluster centers.
- Mouse attract: within 200 px of mouse, nodes pulled toward mouse with soft force.
- Mouse click: toggles "explode" mode — all nodes fly outward to radius 800 px over 800 ms; click again to return.
- **Three depth layers** (back/mid/front) at different z-positions with different drift speeds for parallax.
- Slight floating motion on the core node (vertical sine wave, 6 s period, ±5 px).

### 6.4 Typography
- Display: Fraunces 600/700, optical sizing 144, tight negative tracking.
- Body: Source Sans 3 400/500/600.
- Mono: DM Mono 400/500.
- Project window title: Fraunces 600 13 px with project-domain color.
- Project window body: Source Sans 3 400 14 px line-height 1.55.
- Taskbar tabs: Source Sans 3 500 12 px.
- Hero h1: `clamp(3.9rem, 11vw, 9.5rem)` (unchanged).

### 6.5 Motion
- One easing site-wide: `cubic-bezier(0.16, 1, 0.3, 1)` (unchanged).
- Window open: 280 ms, scale 0.92 → 1, opacity 0 → 1, from spawn position.
- Window close: 200 ms, scale 1 → 0.96, opacity 1 → 0.
- Window minimize: 220 ms, scale 1 → 0.1, opacity 1 → 0, target = taskbar tab position.
- Window drag: 1:1 follow (no smoothing).
- Window resize: 1:1 follow.
- Welcome window staggers: header fade-in 200 ms, then content fades 100 ms later, then CTAs fade 100 ms later.
- Desktop icons: appear on load, stagger 40 ms each, scale 0.8 → 1, opacity 0 → 1, 300 ms.
- Taskbar slides up from below 200 ms after first icon appears.
- Marquee (below taskbar? above?) — decide based on visual.
- Constellation nodes: 6 s loop, vertical drift ±5 px on each node, phase offset by index.
- Reduced-motion: all of the above disabled (windows snap open/close, no scale/opacity tween).

### 6.6 Sound design
- **Ambient pad** (C1, generated): warm analog synth pad, 20–30 s loop, -18 LUFS, low minor key.
- **UI sounds** (small SFX, optional): window open (chime), window close (soft click), icon hover (subtle tick). Generated as 100–300 ms sine-wave bleeps.
- **Audio-reactive core node**: subtle pulse on hero core synced to audio RMS amplitude (when ambient is playing and user has toggled sound on).
- Default OFF. Toggle persists.

---

## 7. AdaL resources to reuse/adapt

### 7.1 Workflow prompts (AdaL bootcamp resources page)

**Prompt A — "Reverse-engineer any site into a design spec"** (verbatim from the resources page):
> Open TARGET_URL in the browser. Take full-page screenshots at 1440, 768 and 390 px. Then extract the design system from the live DOM: exact hex colors, font families and the .woff2 URLs, type scale, spacing rhythm, border radii, shadows, and every animation (keyframes, durations, easing, stagger). Record the hero animation as a short video and scrub it frame by frame to get the timing right. Write everything into design-spec.md — palette, typography, layout patterns, section inventory, motion notes. Do not rebuild yet.

**Apply to**: daedalOS, MotionSites hero previews (3 chosen), one Lapa reference, one Aceternity UI block. Output: a new `design-spec-os.md` per the existing DESIGN.md structure but extended with window chrome + taskbar.

**Prompt B — "Clone a preview you'd otherwise pay for"** (verbatim):
> Go to motionsites.ai and open the animated preview of HERO_NAME (free to watch). Study the preview video frame by frame: layout, palette, type, and the exact motion — what animates, in what order, with what easing. Recreate it as an original hero section for MY_PRODUCT using React + Tailwind + Framer Motion, matching the feel at near-100% fidelity but with my own copy and brand colors. Then screenshot your build next to the preview and iterate until they match.

**Apply to**: pick 1 MotionSites hero for the Welcome-window hero. Output: Welcome-window hero section. (Note: we use vanilla JS, not React+Tailwind, so we translate to `requestAnimationFrame` + CSS — same patterns.)

**Prompt C — "Build the full landing page from a reference set"** (verbatim):
> Study these references: URL_1, URL_2, URL_3. Screenshot each and analyze what makes them work: hero composition, section order, social proof placement, CTA rhythm, color and type choices. Write a design-spec.md for MY_PRODUCT that remixes the best patterns into one original design (dark mode, PINK_ACCENT). Then build the full landing page from that spec — hero, features, social proof, pricing, FAQ, footer — responsive at 1440/768/390. Open the result in the browser, screenshot it, critique it against the spec like a demanding art director, and fix what's off before showing me.

**Apply to**: daedalOS + 2 MotionSites heroes + 1 Lapa reference. Output: complete `design-spec-os.md` and `toluOS` build.

### 7.2 Image-gen prompts (Director's Console vocabulary — from `build-and-asset-plan.md` §2)

**Reuse verbatim** for:
- **A1 OG image** — verbatim A1 prompt.
- **A2 Hero backdrop** — verbatim A2 prompt at 1920×1080.
- **A3–A5 project thumbnails** — verbatim A3/A4/A5 prompts at 1600×1000.
- **A7 Topographic texture** — verbatim A7 prompt at 1920×1080.
- **A6 Favicon** — verbatim A6 prompt at 512×512.

**New prompts needed** (5 secondary project visuals, per §4.2):
- **A8 Crypto Scanner**: "Cinematic macro still: a holographic scanning radar with concentric amber rings, data points flickering along radial spokes, deep ink background, terminal green ticks scattered, atmospheric haze, ARRI Alexa 65 100mm probe lens, Kodak Vision3 500T, film grain, no text, 1600×1000."
- **A9 X Monitor**: "Cinematic still: a social-signal waveform abstract, multiple overlapping sine waves in slate-blue and gold, deep ink background, scanning-monitor glow, ARRI Alexa 35 85mm, Kodak Vision3 500T, film grain, no text, 1600×1000."
- **A10 AgentTrust**: "Cinematic still: a security shield lattice of interlocking amber-light beams, deep vault background, warm gold key light with cool blue rim, ARRI Alexa 65, Panavision anamorphic 40mm, Kodak Vision3 500T, film grain, no text, 1600×1000."
- **A11 Memory Palace**: "Cinematic still: a branching knowledge-graph of glowing violet nodes connected by fine silver filaments, deep ink background, museum-vault atmosphere, volumetric haze, ARRI Alexa 65, Panavision anamorphic 50mm, Kodak Vision3 500T, film grain, no text, 1600×1000."
- **A12 Agent Skills**: "Cinematic still: a stacked deck of glowing skill cards fanned out, cyan and warm-white accents, deep ink background, dramatic chiaroscuro, ARRI Alexa 35, Panavision Primo 50mm, Kodak Vision3 500T, film grain, no text, 1600×1000."

### 7.3 Video prompts (B1 hero loop + B2 demo video)

**Reuse verbatim** B1 prompt from `build-and-asset-plan.md` §2: "Slow cinematic dolly-in through a field of golden constellation particles connected by hairline threads of light, drifting in warm black space, anamorphic 2.39:1, ARRI Alexa 65 with Panavision C-Series anamorphic 50mm, Kodak Vision3 500T 5219, subtle film grain and halation, single volumetric amber light source, extremely slow camera push-in, particles parallax at multiple depths, seamless ambient loop, moody, premium, no text. 6–8 s, 1080p, silent."

**New B2 demo video**: 15–30 s screen-record of live toluOS, composited with B1 as intro + captions. The recording is one continuous mouse interaction: open Welcome → open Stripe → drag Stripe → close → open Vouch → minimize. Add captions via Remotion (use existing `.remotion/CaptionOverlay.tsx` template).

### 7.4 Audio prompts (C1 ambient + C2 voiceover)

**Reuse verbatim** C1 prompt from `build-and-asset-plan.md` §2: "Deep cinematic ambient drone: a warm analog synth pad in a low minor key, slow evolving texture with soft sub-bass pulses like a distant heartbeat, occasional delicate granular shimmer like dust in a light beam, no melody, no percussion, restrained, premium, seamless loop, -18 LUFS integrated."

**New C2 voiceover** (optional): 30 s read of:
> "I'm Tolu Shekoni. I build at the intersection of agentic AI, onchain trust, and data-driven product systems — and I publish the proof: live demos, repos, deployment artifacts. This is toluOS — open a window, run the apps, see the receipts. Built with AdaL."

### 7.5 FileSpace audit (existing)

Per the brief: "use existing FileSpace check plus image/video/audio tools."

The existing repo already has:
- `vendor/` (was Three.js, removed Round 3) — **re-add** `three.min.js` r149 per EXECUTE.md Stage 0.
- `assets/img/` — 3 AI-generated images + 3 SVG thumbnails + favicon set. Replace 3 SVGs with AI-generated PNGs; add A7 topo + 5 secondary thumbnails.
- `assets/video/` — empty. Add B1 + B2.
- `assets/audio/` — empty. Add C1.
- `docs/adal/assets/` — 8 browser-matrix screenshots + 3 edge-case screenshots + console/edge-case logs. Re-run after redesign.
- `docs/EXECUTE.md`, `build-and-asset-plan.md`, `EVALUATE.md`, `builder-plan.md`, `redesign-audit.md`, `EVALUATE-log.md` — full planning corpus. Add `reference-redesign-plan.md` (this file).
- `scripts/check.sh` + `browser-matrix.mjs` + `browser-edge.mjs` + `visual-audit.mjs` (to add) — validation stack.

`FileSpace check` = the FileSpace available for asset storage. GitHub repo size currently ~61 KB tracked + ~26 MB in-tree PNGs (committed but excluded from zip). All new assets (A7 + A8–A12 + B1 + B2 + C1 + visual-audit screenshots) estimated +25–35 MB. Stays under typical GitHub soft-limits.

---

## 8. Asset generation plan

### 8.1 Image generation (11 calls + 2 retries max)

| Order | Asset | Path | Source | Budget |
|---|---|---|---|---|
| 1 | A7 Topo texture | `assets/img/A7-topo.png` | A7 verbatim prompt | 1 call |
| 2 | A2 Hero backdrop | `assets/img/hero-backdrop.png` | A2 verbatim prompt at 1920×1080 | 1 call |
| 3 | A1 OG image | `assets/img/og.png` | A1 verbatim prompt at 1200×630 | 1 call |
| 4 | A6 Favicon | `assets/img/favicon.png` | A6 verbatim prompt at 512×512 | 1 call |
| 5 | A3 Stripe | `assets/img/project-stripe.png` | A3 verbatim prompt at 1600×1000 | 1 call |
| 6 | A4 Vouch | `assets/img/project-vouch.png` | A4 verbatim prompt at 1600×1000 | 1 call |
| 7 | A5 SignalForge | `assets/img/project-signalforge.png` | A5 verbatim prompt at 1600×1000 | 1 call |
| 8 | A8 Crypto Scanner | `assets/img/project-crypto-scanner.png` | A8 new prompt | 1 call |
| 9 | A9 X Monitor | `assets/img/project-x-monitor.png` | A9 new prompt | 1 call |
| 10 | A10 AgentTrust | `assets/img/project-agenttrust.png` | A10 new prompt | 1 call |
| 11 | A11 Memory Palace | `assets/img/project-memory-palace.png` | A11 new prompt | 1 call |
| 12 | A12 Agent Skills | `assets/img/project-agent-skills.png` | A12 new prompt | 1 call |

**Total: 12 image calls + max 2 retries per asset if off-brief** (per the existing rules). Cuts if budget-constrained: A8–A12 secondary thumbnails (use SVG fallbacks for those 5) before cutting A1–A7.

### 8.2 Video generation (2 calls)

| Order | Asset | Path | Source | Budget |
|---|---|---|---|---|
| 1 | B1 Hero loop | `assets/video/hero-loop.mp4` | B1 verbatim prompt, 6–8 s, 1080p, silent | 1 call (no retry per rules) |
| 2 | B2 Demo video | `assets/video/demo.mp4` | Screen-record live site + B1 intro + captions via Remotion | Compose (not a generative call) |

**Total: 1 generative video call + 1 screen-recording compose.**

### 8.3 Audio generation (1 call)

| Order | Asset | Path | Source | Budget |
|---|---|---|---|---|
| 1 | C1 Ambient | `assets/audio/ambient.mp3` | C1 verbatim prompt, 20–30 s, mono, -18 LUFS | 1 call (no retry) |

**C2 voiceover**: skip unless time permits (declarable as "cut" in cut log).

### 8.4 Total generative budget
- 12 image calls (max 2 retries = 24 worst case) + 1 video + 1 audio = **26 calls worst case**; **14 calls typical**.
- Current Round 3 budget was 3 calls. **This is a ~5× increase**, justified because the brief explicitly required these.

### 8.5 Cut order (per EXECUTE.md, applied to redesign)
1. C2 voiceover (lowest priority — declared cut already)
2. C1 ambient (next — auto-play audio is jury-killer; toggleable, lower urgency)
3. B2 demo (next — social post can use screenshots if video too costly)
4. **Never cut**: A1–A7 images, B1 hero loop, the site itself, validation scripts.

---

## 9. Files to change + implementation order

### 9.1 New files
- `docs/adal/design-spec-os.md` — extended DESIGN.md with toluOS chrome, window grammar, taskbar, palette expansion
- `assets/img/A7-topo.png` (1920×1080) — NEW topographic texture
- `assets/img/project-{crypto-scanner,x-monitor,agenttrust,memory-palace,agent-skills}.png` (1600×1000 each) — 5 NEW secondary thumbnails
- `assets/video/hero-loop.mp4` (1080p, 6–8 s) — NEW
- `assets/video/demo.mp4` (1080×1350 OR 1920×1080, 15–30 s) — NEW
- `assets/audio/ambient.mp3` (mono, 20–30 s, ≤3 MB) — NEW
- `vendor/three.min.js` (608 KB, r149 UMD) — RE-ADD per EXECUTE.md Stage 0
- `assets/img/project-{stripe,vouch,signalforge}.png` — REPLACE the 3 SVG placeholders with AI-generated PNGs (1600×1000 each)
- `assets/img/project-{stripe,vouch,signalforge}.png.svg-thumbs` — keep SVGs as low-bandwidth fallbacks? **No, drop them — the PNGs replace.**
- `scripts/visual-audit.mjs` — black-void detector (Playwright) per `redesign-audit.md §8.4`
- `assets/img/project-thumb-*.webp` (optional) — WebP variants for bandwidth

### 9.2 Modified files
- `index.html` — replace `<main>` skeleton with `<div id="desktop">` containing wallpaper + 8 desktop icons + taskbar + (welcome + project windows added dynamically by JS)
- `styles.css` — rewrite for toluOS chrome (window styles, taskbar, desktop icons, mobile tab mode); expand palette tokens
- `script.js` — replace with toluOS kernel: window manager, drag/resize, taskbar, sound toggle, keyboard shortcuts, mobile tab mode, constellation canvas (focal-point physics), audio context
- `DESIGN.md` — extend with toluOS design contract (or replace with `design-spec-os.md`)
- `SUBMISSION.md` — update asset inventory + cut log + screenshots
- `docs/adal/EVALUATE.md` — add new visual-quality gate (no screenshot has >5% black void, no missing thumbnails, no broken drag interactions)
- `docs/adal/EVALUATE-log.md` — log Round-5 N11 (visual failure → redesign) and Round-5 resolution
- `README.md` — refresh to describe toluOS

### 9.3 Deleted files
- `assets/img/project-{stripe,vouch,signalforge}.svg` — replaced by `.png` versions
- `docs/adal/redesign-audit.md` — superseded by `reference-redesign-plan.md` (this file)

### 9.4 Implementation order (gated)

**Stage A — Foundation (1 h)**
1. Re-add `vendor/three.min.js` r149.
2. Extend `DESIGN.md` → `design-spec-os.md` with the toluOS contract (palette, chrome, motion).
3. Generate **A7** topographic texture, **A2** hero backdrop at 1920×1080, **A1** OG, **A6** favicon. (Sequential, not parallel, to avoid Round 1 preempt issue.)
4. Generate **C1** ambient audio.

**Stage B — Core shell (2 h)**
5. Rewrite `index.html` skeleton: `#desktop` container with wallpaper layers + 8 desktop icons + `#taskbar`.
6. Rewrite `styles.css` for toluOS chrome: window styles, taskbar, desktop icons, mobile tab mode.
7. Rewrite `script.js` kernel: window manager (drag, resize, min/max/close, z-index), taskbar, keyboard shortcuts, sound toggle, mobile tab mode.
8. Browser smoke test: open 1 window, drag, close, switch.

**Stage C — Visual assets (2 h)**
9. Generate **A3, A4, A5** project thumbnails.
10. Generate **A8–A12** secondary thumbnails.
11. Generate **B1** hero video.
12. Wire thumbnails into 8 project windows.

**Stage D — Welcome + Receipts (1 h)**
13. Build the Welcome window with stagger headline + proof strip + CTAs + tabs (Proofs / Receipts / Source).
14. Build the per-window content: thesis + proof paragraph + link buttons + status pill.

**Stage E — Sound + reactive (0.5 h)**
15. Add audio toggle wired to C1 ambient (fade in/out, localStorage persistence).
16. Audio-reactive core node pulse via AudioContext.

**Stage F — Validation (1 h)**
17. Re-run `bash scripts/check.sh` → 21+/21+ PASS (extended gates).
18. Re-run `node scripts/browser-matrix.mjs` + `node scripts/browser-edge.mjs`.
19. New `node scripts/visual-audit.mjs` — black-void detection across viewport scrolls, must be <5% in any band.
20. Record B2 demo video (screen-record + Remotion compose).

**Stage G — Ship (0.25 h)**
21. Update `SUBMISSION.md`, `README.md`, `EVALUATE-log.md`.
22. Regenerate `submission.zip` (<4 MB target).
23. Commit + push (one human-confirmation gate).

### 9.5 Time budget
- Stages A–G: ~7.75 hours.
- Deadline: Sep 19 11:59 PM PT. As of 2026-09-18 ~18:30 PT, ~17.5 hours remain.

---

## 10. Measurable acceptance criteria

### 10.1 Mechanical (existing + extended)

- [ ] `bash scripts/check.sh` → **21+ / 21+ PASS** (T-1..T-12 + L-1..L-9 unchanged; add L-10 visual-no-black-void gate).
- [ ] `node scripts/browser-matrix.mjs` → 5 captures, 0 console errors, 0 network errors, 0 horizontal overflow at 1440 / 1920 / 390 / 320 + normal-motion.
- [ ] `node scripts/browser-edge.mjs` → V-5 reduced-motion, V-6 no-JS, V-7 subpath deploy all PASS.

### 10.2 Visual (new)

- [ ] **No black void** — `scripts/visual-audit.mjs` scrolls at 1440 px in 200 px increments, screenshots each, measures % black-pixels. Threshold: **<5% black void in any band**. Fails = redesign not done.
- [ ] **All 8 projects have thumbnails** — `node scripts/asset-audit.mjs` checks that `assets/img/project-*.png` exists for all 8 entries in `portfolioProjects`. Fails = any missing.
- [ ] **Hero canvas has a focal point** — visual review of `1440-home-normal-motion.png` confirms core node + 6 spokes + clusters are visible. Fails = canvas redesign not done.
- [ ] **Body has texture/depth** — visual review confirms A7 topo layer + corner glows are visible. Fails = background redesign not done.
- [ ] **Welcome window + 8 project windows open** — playwright test clicks each desktop icon, asserts the corresponding `.window` element exists with title matching. Fails = window grammar not done.

### 10.3 Interaction (new)

- [ ] **Window drag works** — playwright test: open window, mousedown on title bar, mousemove +200x +200y, assert `transform: translate(200px, 200px)` applied. Fails = drag handler broken.
- [ ] **Window resize works** — playwright test: open window, mousedown on se-resize handle, mousemove +100x +100y, assert width/height increased. Fails = resize handler broken.
- [ ] **Window close works** — playwright test: open window, click close button, assert window removed. Fails = close handler broken.
- [ ] **Keyboard shortcuts work** — playwright test: open 1 window, press `Cmd+W`, assert closed. Press `Cmd+1`, assert Stripe window opened.
- [ ] **Layout persists across reload** — playwright test: move a window, reload, assert window position preserved.
- [ ] **Mobile tab mode works** — playwright test at 390 px, assert no drag handles, swipe between tabs works.

### 10.4 Asset budget (extended)

- [ ] A1 OG: **exactly 1200×630, ≤700 KB**.
- [ ] A2 Hero backdrop: **≥1920×1080, ≤1.5 MB**.
- [ ] A3–A5 + A8–A12 thumbnails: **1600×1000 each, ≤800 KB each**.
- [ ] A6 Favicon: **512×512 (or 256×256 with documented trade-off), ≤200 KB**.
- [ ] A7 Topo: **1920×1080, ≤800 KB**.
- [ ] B1 video: **1080p, 6–8 s, ≤6 MB, no audio stream**.
- [ ] B2 demo: **1080×1350 OR 1920×1080, 15–30 s**.
- [ ] C1 audio: **≤3 MB, 20–30 s, mono, -18 LUFS**.
- [ ] Three.js vendored: **present in `vendor/three.min.js`, ≤700 KB** (r149 UMD).

### 10.5 Submission

- [ ] `submission.zip` < 4 MB (matrix PNGs excluded).
- [ ] `SUBMISSION.md` §5 asset inventory updated with all 11 images + 2 videos + 1 audio.
- [ ] `SUBMISSION.md` §6 cut log lists C2 voiceover as the only cut.

### 10.6 Adversarial visual review

- [ ] Spawn independent vision-model session with prompt: "This site is the redesign of a portfolio. It is supposed to be a desktop-OS metaphor in the spirit of daedalOS. The hero should have a focal-point constellation canvas. Each project should open as a draggable, resizable window with chrome. The body should have layered backgrounds (gradient + topo texture + accent glows). The 8 projects should each have AI-generated thumbnails matching their domain. There should be a taskbar at the bottom with running windows. Score each of these dimensions 0–10. PASS requires all ≥ 8."
- [ ] Repeat on mobile (390 px). PASS requires all ≥ 7.

---

## 11. Honest self-critique (candid)

The Round-3 build passed every mechanical gate and shipped a clean OG card. **It also looked like every other dark-mode portfolio template.** The user is right to reject it: the brief was not "make a structurally correct portfolio" but "make a portfolio that demonstrates the builder's eye and uses AdaL's media capabilities to their full extent". We treated the cut-log as gospel and cut the very deliverables that made the brief distinctive.

Adapting daedalOS's grammar is the highest-leverage move because:
1. The user's explicit reference (`dustinbrett.com`) shows the bar — desktop OS, real windows, real chrome, real apps.
2. The brief's call for "stunning art direction" + "non-bland palette" + "purposeful audio/video/image assets" maps cleanly to a desktop-metaphor redesign (one wallpaper + one taskbar + 8 windows + 1 ambient soundscape + 11 image assets + 1 video + 1 audio = real art direction).
3. The bootcamp's `design-spec.md` workflow + MotionSites prompts + Lapa references + Aceternity blocks give us concrete, citable patterns to adapt.
4. The scope is proportional: ~7.75 hours of work vs the ~17.5 hours of deadline remaining. Two rounds of mechanical validation, one round of adversarial vision review.

**What the redesign does NOT do:** we don't replicate daedalOS pixel-for-pixel. We adapt the **grammar** (windows, chrome, taskbar, draggable/resizable windows, contextual audio) and skip the implementation cost of a working virtual file system, Doom port, terminal emulator, or settings app. The result is a portfolio-shaped OS, not a full OS. **This is the right tradeoff for a hackathon submission.**

The redesign keeps the existing infrastructure (DESIGN.md, validation scripts, submission package, EXECUTE.md contract) and rewrites the visual + interaction layer. Mechanical gates remain the floor. The new visual audit gate (`visual-audit.mjs` black-void detection) is the new ceiling.

---

## 12. Next step

Authorize the redesign and the next session will execute Stage A (Foundation: re-add Three.js, extend DESIGN.md, generate A7/A2/A1/A6/C1). After each stage, mechanical gates run. Final session is Stage G (Ship: regenerate zip, commit, push).
