# Visual Failure Audit + Redesign Plan

Date: 2026-09-18 · Author: AdaL (planner role, candid self-critique)
Trigger: User rejection — current pushed build (`42d1f58`) is bland, generic, insufficiently interactive, missing audio/video/image asset work.
Scope: Audit current build against original brief, identify omissions, propose redesign.

---

## 1. TL;DR (candid)

The pushed build passes 21/21 mechanical checks and a clean 5-viewport Playwright matrix. **It is not a strong visual deliverable.** The site is functionally correct, accessible, subpath-safe, and prints a clean OG card. As art direction, it falls well short of what `docs/adal/build-and-asset-plan.md` actually asked for. The brief specified a "stunning art direction, non-bland palette/background, meaningful Three.js or equivalent interactive hero, project-specific visuals matching each link/product, and purposeful audio/video/image assets." The shipped build has a 2D particle canvas, hand-authored SVG card placeholders, no video, no audio, no inline SVG illustrations, and a flat `oklch(0.13 0.01 60)` body background. The screenshots show this honestly. The mechanical-check gate is not the right quality bar.

**Root cause of failure:** the cut-log discipline (declared in `SUBMISSION.md §6`) was applied too liberally. B1 video, B2 video, C1 audio, C2 voiceover, A7 topo texture, A3–A5 AI-generated thumbnails were all marked "cut" or "fallback SVG" to stay inside budget and timeline. That left the hero as a thin 2D canvas on a flat dark surface, with three hand-drawn SVG card placeholders substituting for cinematic stills. The mechanical gates still pass because they're testing **structural correctness**, not **visual quality**.

**Status of the audit on the live site (https://toxmon.github.io/tolu-portfolio/):**
- Body background: `oklch(0.13 0.01 60)` flat — `background-image: none` (no topographical texture, no atmospheric gradient).
- Hero canvas: 1, present, 1920×1748 px (huge but visually thin — ~80 nodes drawn as ~1px dots + 1px lines).
- `<video>` elements on the page: **0** (B1 missing).
- `<audio>` elements on the page: **0** (C1 missing).
- Inline `<svg>` illustrations: **0** (no decorative SVGs).
- Interactive elements (`<button>`, `[onclick]`, `[role=button]`): **1** (the hamburger). The `cta-magnetic` class is in CSS but never matched at scale — only 1 element uses it (`cta-magnetic` on the email button), and the effect requires a fine pointer.
- Reveal observer: 22 `.reveal` elements, **1 visible on initial load** (only the hero one). The other 21 are at `opacity: 0` until the user scrolls. **The middle of the page is literally invisible until scroll.** This is a real UX defect, not just a screenshot artifact.

---

## 2. Brief compliance matrix (per-build-asset-plan §1, §2, §3)

| Brief item | Status | Evidence |
|---|---|---|
| **§1 Hero** mouse-reactive particle constellation canvas, palette gold-on-ink | Partial — present but generic | `script.js:155-220`; 80 nodes, random drift, 1px gold lines within 130 px; no central focal point, no parallax depth, no story. The brief said "adapt the physics from the threeui `constellation-field` concept" — we did the minimum literal reading. |
| **§1 Hero** name at 9rem+ editorial scale | Done | `clamp(3.9rem, 11vw, 9.5rem)` Fraunces 700 |
| **§1 Hero** staggered word entrance | Done | `splitTextToWords()` in `script.js:115-145` |
| **§1 Hero** magnetic CTAs | Marginal — 1 element, requires fine pointer | `.cta-magnetic` class; effect on email button only |
| **§1 Hero** proof strip | Done | `.proof-strip` with 3 dt/dd pairs |
| **§1 Marquee** infinite CSS ticker | Done | `@keyframes marquee` 40 s linear |
| **§1 Thesis** editorial pull-quote | Done — generic content | "technology as applied science" |
| **§1 Disciplines** numbered hover rows | Done — generic content | 4 items: Business Excellence, Web3 Engineering, AI Systems, Data Science |
| **§1 Work** proof-first grid | Done — cards render, but visuals are placeholders | 8 cards rendered from `portfolioProjects`; only 3 featured; thumbnails are hand-authored SVG, not AI-generated |
| **§1 Built with AdaL** meta-section | Done — text only, no real evidence | 3 cards (prompts/before-after/build log); the "Prompts used" card is one `<details>` collapse with one prompt per asset |
| **§1 Contact** oversized type, magnetic email CTA | Done | `clamp(2.5rem, 8vw, 6.5rem)` |
| **§1 Craft** film-grain overlay, custom cursor dot, selection color, focus-visible | Done | `body::before` grain, `.cursor-dot`, `::selection`, `:focus-visible` |
| **§1 Reduced-motion** | Done | CSS @media + JS matchMedia |
| **§1 No-JS fallback** | Done (after Round 2 fix) | Static cards + noscript bar |
| **§2 A1 OG image (1200×630)** | Done | `nano-banana-2` → 779 KB; spec-exact dims after Round-2 crop |
| **§2 A2 Hero backdrop (2560×1440)** | Partial — wrong dims | Generated at 2K then resized to 1280×800 (1.4 MB) to meet ≤1.5 MB cap; **spec was 2560×1440, ratio 16:9** — current is 16:10 |
| **§2 A3–A5 Project thumbnails (1600×1000 each, AI-generated cinematic stills)** | **REPLACED** with hand-authored SVG | `project-stripe.svg`, `project-vouch.svg`, `project-signalforge.svg` — competent diagrams, **not the cinematic stills the brief specified** ("shot on ARRI Alexa 35 with 50mm Panavision Primo, f/1.8, Kodak Vision3 500T"). The "Before" column of the bwa-compare panel calls this out: "Stacked `:root` blocks; undefined `var(--font-mono)`" — but the build did not deliver the cinematic photography it called for. |
| **§2 A6 Favicon (512×512)** | Partial — wrong dims | Generated at 1K → resized to 256×256; spec was 512×512. Visual legibility is OK; trade-off was budget. |
| **§2 A7 Topo texture** | **CUT** | No background texture generated; section uses solid dark instead |
| **§2 B1 Cinematic hero intro loop (6–8 s, 1080p, silent)** | **CUT** | `assets/video/` is empty; brief explicitly required "embedded as an optional `<video loop muted playsinline>` layer behind hero text on capable devices". The cut-log called B1 "cut-first"; **EXECUTE.md Stage 3.2 made it part of the build, not the cut list.** |
| **§2 B2 Social demo video (15–30 s)** | **CUT — and declared** | `SUBMISSION.md §6` declares B2 cut; X/LinkedIn posts reference screenshots instead of a video |
| **§2 C1 Ambient audio loop (20–30 s, off by default)** | **CUT** | `assets/audio/` is empty |
| **§2 C2 Voiceover for demo video** | **CUT** | Not generated |
| **§3 Vendor Three.js r160+** | **DELETED in Round 3** | Original EXECUTE.md Stage 0 said "Vendor Three.js: download `three.min.js` (r160+) into `vendor/`". Deleted as "dead code" in Round 3 because canvas is 2D. But the brief required the **presence** of vendored Three.js even if unused — it was an explicit deliverable, not a refactoring target. |
| **§1 Stack** "scroll-driven effects" | **NOT IMPLEMENTED** | Build plan §1 lists "scroll-driven effects" as part of the stack; the build has zero scroll-driven CSS animations (only the IntersectionObserver reveal opacity/translateY) |

---

## 3. Visual failure audit (candid)

### 3.1 The hero is small and generic
- The constellation canvas is 1920×1748 px but the actual node/link rendering is visually thin: ~80 nodes at 0.6-2 px radius, 1 px lines. At normal viewing distance this reads as a faint dust effect, not a constellation. There is no focal point — no central anchor, no spiral, no signature shape. Random dots + random lines = "any particle network effect". **The brief said "stunning art direction"; this is forgettable.**
- The backdrop image (which is hidden when canvas mounts, but visible on no-JS / reduced-motion) is visually stronger than the canvas. On reduced-motion / no-JS paths, the backdrop carries the entire hero.

### 3.2 The body background is flat
- `body { background: var(--color-ink) }` — `oklch(0.13 0.01 60)`. No topographical texture (A7 was cut), no atmospheric gradient beyond a tiny corner-glow on `body::after` (480×480 max, `mix-blend-mode` not set), no film grain as a background layer (the `body::before` grain is on the foreground layer). The brief said "non-bland palette/background" — this is bland.

### 3.3 The work grid visuals are placeholder-grade
- The 3 featured cards use SVG thumbnails that are **website mockup diagrams**, not "cinematic stills shot on ARRI Alexa 35 with 50mm Panavision Primo". The Stripe thumbnail is a checkout panel with `$ 248.00` and a `PAY NOW` button. The Vouch thumbnail is two interlocking polygon seals. The SignalForge thumbnail is a hexagonal mesh. These are competent technical illustrations but **do not match the brief's "minimal cinematic product still" / "cinematic concept still" / "cinematic macro still" tone** — they look like Figma artboards, not photography.
- 5 secondary cards (X Monitor, AgentTrust, Memory Palace, Agent Skills) have **no thumbnail at all** — they render as text-only cards. The brief said "every claim visibly linked" — they're linked but not visually represented.

### 3.4 The reveal observer causes an invisible page on first load
- 22 `.reveal` elements, opacity 0 by default. On a fresh page load with no scroll, only 1 fires (the hero one). Sections below the fold are **literally invisible** until the user scrolls past them. This was confirmed by the live screenshot — the middle of the page is a black void.
- The Round-2 fix added `.no-js` class to `<html>` so JS-disabled users see everything. But JS IS running on the live site, so `.no-js` is removed → 21 of 22 reveals stay at `opacity: 0` until scroll.
- **This is a real UX defect.** The Round-3 screenshot evidence used `reducedMotion: 'reduce'` which bypasses this via CSS — but that's a test-only path. Default users hit it.

### 3.5 The "Built with AdaL" section is text-only
- Three cards with essay text: "Director's Console vocabulary" (one collapsed `<details>` with 3 prompt excerpts), "Before / After" (two ul lists), "Build log" (one HTML table). No actual AI-generated artifacts, no before/after visual comparison, no real receipts. **The section claims to be evidence of AI work but is itself human-written prose about AI work.**

### 3.6 No audio, no video, no inline illustrations
- `<video>` count on the live page: 0. `<audio>` count: 0. Inline `<svg>` illustrations: 0. The brief specified a layered media experience (cinematic hero video, ambient audio, project-specific visuals). The shipped site has only one 2D canvas + the AI-generated hero backdrop.
- The 3 hand-authored SVG thumbnails are functional but they are **project mockups**, not the "visual identity per project card" the brief described.

### 3.7 The interactive surface is minimal
- 1 button (hamburger), 0 onclick handlers, 0 role=button elements outside the nav. Magnetic CTA on 1 element. Cursor dot on desktop. Reveal-on-scroll on 22 elements (but only 1 fires on initial load). **No scroll-driven animations, no parallax, no audio-reactive visuals, no interactive project previews, no cursor trails beyond a single dot.**

### 3.8 The card-link chips are tiny
- 16 secondary `.work-card-link` chips render at 31 px tall at 390 px viewport. Per the Round-3 evaluator this was logged as N7 ("WCAG 2.5.8 inline-text-context exception applies; primary CTAs all ≥47 px"). **WCAG 2.5.8 explicitly carves out inline-text-equivalent contexts**, but at 31 px on mobile, these are at the boundary of touch-tappable.

---

## 4. What was omitted or generic (per project)

| Asset | Original brief | What shipped | Verdict |
|---|---|---|---|
| Hero canvas | "adapted from threeui constellation-field" with **stunning art direction** | 80 random nodes, 1px lines, uniform drift | Generic; no focal point, no signature |
| Project Stripe | "minimal cinematic product still" — ARRI Alexa 35, f/1.8, Kodak Vision3 500T | SVG checkout panel mockup | Placeholder; not cinematic |
| Project Vouch | "two abstract geometric seal-stamps … anamorphic lens flare" | SVG polygon seals | Placeholder; competent diagram but not cinematic |
| Project SignalForge | "molten gold filament lines … sparks of amber light" | SVG hex mesh with wordmark | Placeholder; decent after Round-2 fix but not cinematic |
| X Monitor, AgentTrust, Memory Palace, Agent Skills | "proof-first grid" | Text-only cards, no thumbnail | Generic |
| B1 hero video | "Slow cinematic dolly-in through golden constellation particles" | None — `assets/video/` empty | **Omitted** |
| B2 demo video | "Screen-record + B1 + captions" | None — declared cut in §6 | **Omitted — declared** |
| C1 ambient audio | "warm analog synth pad in low minor key" | None | **Omitted** |
| C2 voiceover | Optional — for B2 | None | **Omitted** |
| A7 topo texture | "faint warm-gold topographic contour lines" | None | **Omitted** |
| Scroll-driven effects | Build plan §1 stack | None | **Omitted** |
| Three.js vendored | EXECUTE.md Stage 0 mandatory | Deleted in Round 3 as "dead code" | **Deviated from Stage 0** |

---

## 5. What the redesign must change

To meet the brief's actual quality bar ("stunning art direction, non-bland palette/background, meaningful Three.js or equivalent interactive hero, project-specific visuals matching each link/product, and purposeful audio/video/image assets"), the redesign must:

1. **Real AI-generated cinematic stills** for A3–A5 (project thumbnails). Use `generate_image` with the verbatim prompts from `build-and-asset-plan.md` §A3–A5. If `generate_image` is unavailable, generate **two attempts max**, then ship a programmatic fallback that's clearly labelled as a fallback in the README.
2. **Visual thumbnails for ALL 8 projects**, not just 3. Use the project's domain (Stripe = fintech UI, Vouch = trust, SignalForge = Solana network, Crypto Scanner = data viz, X Monitor = social, AgentTrust = security, Memory Palace = knowledge, Agent Skills = developer tools). Each gets a distinct visual treatment — color palette variation, icon/wordmark, or generated thumbnail.
3. **A real hero asset** beyond the canvas. Either: (a) regenerate B1 as a video and embed behind the canvas as `<video loop muted playsinline>`, or (b) commit to the canvas as the hero and add a WebGL/WebGPU 3D fallback via vendored Three.js (the EXECUTE.md Stage 0 requirement).
4. **A non-bland body background**. Generate A7 (topographic contour texture), apply as a subtle background layer with `mix-blend-mode` for depth. Or generate an atmospheric gradient overlay (dark slate → ink → warm-black diagonal).
5. **Fix the reveal-on-load defect**. Either: (a) fire every reveal on initial load (no IntersectionObserver), or (b) use the IntersectionObserver to ALSO fire when an element is below the fold on initial load (use `rootMargin: '100% 0% 100% 0%'` or fire on a `requestIdleCallback` after a short delay), or (c) use a CSS `@starting-style` + transition instead of opacity-0 default.
6. **Real "Built with AdaL" evidence**. Show the actual screenshots taken during the build, the actual prompts used (full text, not excerpts), the actual diff between the prior version and this one (file-level), the actual generation outputs (cropped, embedded as `<img>`).
7. **Add audio (C1)** wired behind an off-by-default header toggle. Even at -18 LUFS, an ambient layer adds sensory depth.
8. **Add B2 demo video** — it's a hackathon social-post requirement, not optional.
9. **Add scroll-driven effects** as the build plan §1 stack calls out: parallax background shifts, scroll-progress bars on work cards, text-color shifts on section entry.
10. **Tappable card-link chips** — bump min-height to 44 px on all viewports.

---

## 6. New visual system (concrete spec)

### 6.1 Palette expansion
The current palette has ink + gold + blue + neutrals. The redesign adds:
- `--color-amber-hot: oklch(0.7 0.18 70)` — for the "shipping velocity" copy and B1 glow halo.
- `--color-deep-violet: oklch(0.32 0.14 290)` — for the Vouch seal (Monad trust = purple/violet territory in Web3 conventions).
- `--color-mint-green: oklch(0.78 0.18 160)` — for SignalForge (Solana green).
- `--color-glacier-blue: oklch(0.78 0.10 230)` — for Stripe Clone's subtle accent.
All four are still warm-leaning and within the "dark cinematic editorial" family. Add A1–A7 sanity-check: any new `oklch()` literal must fall in hues {60, 70, 85, 160, 230, 245, 290}.

### 6.2 Background system (non-bland)
- **Layer 1** (body bg): `linear-gradient(180deg, oklch(0.10 0.012 280) 0%, oklch(0.13 0.01 60) 50%, oklch(0.16 0.014 50) 100%)` — diagonal shift from cool to warm.
- **Layer 2** (body::before): topographical contour texture (A7, regenerated) — 8% opacity, `mix-blend-mode: overlay`.
- **Layer 3** (body::after): existing corner-glow, but expanded from 480 px to 1200 px and `mix-blend-mode: screen`.
- **Layer 4** (per-section ambient): each `<section>` gets a unique accent-glow positioned at the section's "personality corner" (thesis: top-left warm, disciplines: bottom-right blue, work: center halo, etc.).

### 6.3 Hero canvas — meaningful narrative
Replace the 80-node uniform mesh with a **focal-point constellation**: a central "core" node (large, animated, pulsing) with 6 "spokes" radiating outward to 6 "cluster" groups, each cluster having 8–10 secondary nodes. Mouse attracts to the core on click, or pushes the spokes outward. The constellation has **shape**, not just density. Add subtle camera-floating parallax — three depth layers (back/mid/front) drift at different speeds.

### 6.4 Project thumbnails — all 8, distinct visual identities
- **Stripe Clone** (glacier-blue accent): floating checkout holographic panel over brushed steel. Cinematic chiaroscuro.
- **Vouch / Monad** (deep-violet accent): two interlocking hexagonal seals with amethyst rim light, anamorphic flare.
- **SignalForge / Solana** (mint-green accent): molten gold filaments over black steel, sparks.
- **Crypto Scanner** (amber accent): scanning radar concentric rings with data points, terminal green ticks.
- **X Monitor** (blue-grey accent): social-waveform / signal-trace abstract.
- **AgentTrust** (deep-amber accent): security shield lattice over dark vault.
- **Memory Palace** (violet-mauve accent): branching knowledge-graph nodes in a museum-archive frame.
- **Agent Skills** (cyan accent): stacked card deck / toolkit iconography.
Each card has a distinct icon AND a generated (or SVG-fallback) thumbnail. The 8-card visual identity becomes a portfolio in itself.

### 6.5 Scroll-driven effects (per build plan §1 stack)
- Hero h1: `translateY` parallax as user scrolls past (slow drift upward, 0.4× scroll speed).
- Section rule dividers: width grows on section intersection (already implemented as `.section-rule.visible`).
- Work cards: image parallax inside card (slow drift upward at 0.6× speed, masked by card).
- Built-with-AdaL section: sticky "scroll-progress" indicator on the right edge, showing 0–100% as user scrolls through the page.
- Cinema-panel: opacity fades from 1 → 0.4 over the first 600 px of scroll (so it doesn't compete with the work grid).

### 6.6 Audio system
- Generate C1 ambient (warm analog synth pad, 20–30 s loop, -18 LUFS, off by default).
- Wire behind a header toggle. Toggle persists in `localStorage`.
- On click, fade in over 2 s. On toggle off, fade out over 1 s.
- Audio-reactive visual: subtle pulse on the hero core node synced to the audio's RMS amplitude (using `AudioContext.getByteFrequencyData`).

### 6.7 Reveal fix
Replace the IntersectionObserver-only reveal pattern with a hybrid:
- Reveals at `opacity: 0` initially
- On `requestIdleCallback` (with a 200 ms timeout fallback), query every `.reveal` element's bounding box. If the element is in the viewport OR within 800 px below the fold, mark it as `.visible` immediately.
- Otherwise, let the IntersectionObserver handle the rest.
This guarantees the page never looks half-empty.

### 6.8 "Built with AdaL" section — actual receipts
- **Prompts used**: full verbatim text from `build-and-asset-plan.md` for each generated asset, displayed in a scrollable code block per asset (not just excerpts).
- **Before / After**: real side-by-side screenshots of the prior site vs the new site at the same viewport, with annotated callouts.
- **Build log**: actual commit-by-commit diff with line counts (not the current hand-written table).
- **AI-output gallery**: 6–8 thumbnails of the actual generated images embedded as `<img>` (not described in prose).

---

## 7. Asset pipeline (concrete)

### 7.1 Image generation order
1. **A7 Topographic texture** (1920×1080, "subtle dark texture, faint warm-gold topographic contour lines on deep warm-black, almost imperceptible, like an archival engineering blueprint") — regenerate.
2. **A3 Stripe Clone thumbnail** (1600×1000) — verbatim A3 prompt.
3. **A4 Vouch / Monad thumbnail** (1600×1000) — verbatim A4 prompt.
4. **A5 SignalForge / Solana thumbnail** (1600×1000) — verbatim A5 prompt.
5. **A2 Hero backdrop** (1920×1080, ≤1.5 MB) — verbatim A2 prompt, downscale if needed.
6. **A1 OG** (1200×630, ≤700 KB) — verbatim A1 prompt, post-process for size.
7. **5 secondary project visuals** (Crypto Scanner, X Monitor, AgentTrust, Memory Palace, Agent Skills) — domain-specific mini-prompts derived from §6.4 above.

### 7.2 Video generation
- **B1 Hero loop** (6–8 s, 1080p, silent, seamless) — verbatim B1 prompt. **One generation, no regeneration** per the cost rules.
- **B2 Demo video** (15–30 s, 1080×1350 portrait OR 1920×1080 landscape) — screen-record live site scroll with playwright (15 s of scroll), compose with B1 as intro, add captions. The video capability output is the deliverable; even a single 20 s clip would satisfy the social-post requirement.

### 7.3 Audio generation
- **C1 Ambient** (20–30 s, mono, ≤3 MB, -18 LUFS) — verbatim C1 prompt. Single attempt.

### 7.4 Cost discipline
Total budget per the existing rules:
- 7 image gen calls × max 2 attempts = 14 image calls.
- 1 video call (B1).
- 1 audio call (C1).
- 1 video compose (B2).
- ≈17 generative calls total.

The current build used ~3 image calls (hero, og, favicon). The redesign uses ~17. This is a ~5× cost increase but is the actual brief. Per the cost-cut order, if budget is constrained: cut C1 audio first, then B2 demo, then B1 hero loop. Never cut images or the site itself.

---

## 8. Validation needed (post-redesign)

1. **Mechanical re-run**: `bash scripts/check.sh` → 21/21 PASS.
2. **Browser matrix re-run**: `node scripts/browser-matrix.mjs` + `node scripts/browser-edge.mjs` → all captures clean, all reveals fired.
3. **Asset dimension audit**:
   - A1 OG: exactly 1200×630.
   - A2 backdrop: ≥1920×1080, ≤1.5 MB.
   - A3–A5: 1600×1000 each, ≤800 KB each.
   - A6 favicon: 256×256 (per Round-3 trade-off) + 32×32 PNG + SVG.
   - A7 topo: 1920×1080, ≤800 KB.
   - B1 video: 1080p, 6–8 s, ≤6 MB.
   - B2 demo: 1080×1350 or 1920×1080, 15–30 s.
   - C1 audio: ≤3 MB, 20–30 s, mono.
4. **Visual audit** — re-run `node scripts/visual-audit.mjs` (NEW) which uses playwright to:
   - Scroll the page end-to-end at 1440px and screenshot the rendered viewport at every 200 px increment.
   - Count the number of black-void (>95% black) pixels per screenshot. **Threshold: <5% black void in any screenshot.**
   - Confirm the constellation core is visible at the hero, that the body background has texture/depth, that every section's first viewport of content shows visible reveals (not at opacity:0).
5. **Audio toggle smoke test**: load page with audio enabled, toggle on, confirm audio plays, toggle off, confirm audio stops. Verify no console error.
6. **Video fallback**: load page on a browser without `<video>` support (or with autoplay blocked), confirm canvas + backdrop take over.

---

## 9. Risks (rebuild)

1. **Budget overrun**: 17 generative calls vs current 3. Per the cost-cut order, cut order: C1 → B2 → B1. The site itself and the 7 images are must-ship.
2. **`generate_image` reliability**: in Round 1, parallel calls for A3–A5 were preempted. Single sequential calls with explicit waits would be more reliable but slower. Plan: serial, not parallel.
3. **`generate_image` may re-emit the same content**: use varied prompt suffixes (e.g. "wide shot", "macro detail", "off-center composition") to force variation.
4. **Hero canvas redesign**: changing from "uniform mesh" to "focal-point constellation" requires new physics. Implementation in vanilla JS is doable in ~150 lines but needs testing for performance on mobile.
5. **Audio API browser policy**: audio must be user-initiated. The header toggle satisfies this. Auto-play attempts will fail silently — log it.
6. **Reveal fix changes the "stagger" aesthetic**: pre-firing all reveals removes the 100 ms-per-sibling cascade. **Acceptable trade-off** — better to have visible content than elegant stagger that hides the page.
7. **Time budget**: this redesign is ~3–4 hours of additional work vs the original ~3 hours. Deadline is Sep 19 11:59 PM PT. As of 2026-09-18 ~18:00 PT, ~18 hours remain.

---

## 10. Definition of done (rebuild)

1. ✓ All 8 project cards have a distinct visual identity (5 generated + 3 from A3–A5).
2. ✓ Body has a layered background (gradient + A7 topo + section accent glows).
3. ✓ Hero has a focal-point constellation canvas (core + spokes + clusters), not a uniform mesh.
4. ✓ Reveal pattern doesn't hide the page on initial load (idleCallback pre-fire).
5. ✓ B1 hero video embedded as `<video loop muted playsinline>` behind canvas.
6. ✓ C1 ambient audio wired behind a header toggle (off by default).
7. ✓ B2 demo video produced (screen-record + B1 + captions).
8. ✓ "Built with AdaL" shows real receipts (full prompts, before/after screenshots, embedded AI outputs).
9. ✓ Scroll-driven effects: hero parallax, work-card image parallax, scroll-progress indicator.
10. ✓ Card-link chips ≥44 px tall on all viewports.
11. ✓ `bash scripts/check.sh` → 21/21 PASS.
12. ✓ `node scripts/browser-matrix.mjs` + `node scripts/browser-edge.mjs` → all clean.
13. ✓ New `node scripts/visual-audit.mjs` → no screenshot has >5% black void.
14. ✓ `submission.zip` < 4 MB.

---

## 11. Files to change

| File | Action |
|---|---|
| `index.html` | Rewrite hero (add `<video>`), all 8 work cards (new thumbnails), audio toggle in header, reveal fix (move script to head, add pre-fire logic in JS) |
| `styles.css` | New palette tokens (amber-hot, deep-violet, mint-green, glacier-blue); body background gradient + topo layer; per-section accent glows; revised hero canvas styles; scroll-driven animations; 44 px card-link min-height |
| `script.js` | New constellation physics (core + spokes + clusters); audio toggle + AudioContext; scroll-driven animations (parallax, progress bar); reveal pre-fire via requestIdleCallback; 5 new thumbnail data refs in portfolioProjects |
| `DESIGN.md` | New palette + canvas physics + audio system + reveal pattern |
| `assets/img/A7-topo.png` | **NEW** — topographic contour texture (1920×1080) |
| `assets/img/project-{stripe,vouch,signalforge}.png` | **REPLACE** SVG with AI-generated PNG (1600×1000 each) |
| `assets/img/project-{crypto-scanner,x-monitor,agenttrust,memory-palace,agent-skills}.png` | **NEW** — 5 AI-generated secondary thumbnails |
| `assets/img/hero-backdrop.png` | **REGENERATE** to 1920×1080 verbatim spec |
| `assets/img/og.png` | Regenerate to spec dims (already 1200×630, but verify) |
| `assets/video/hero-loop.mp4` | **NEW** — B1 hero video |
| `assets/video/demo.mp4` | **NEW** — B2 demo video |
| `assets/audio/ambient.mp3` | **NEW** — C1 ambient audio |
| `vendor/three.min.js` | **RE-ADD** — per EXECUTE.md Stage 0 (or document deviation) |
| `scripts/visual-audit.mjs` | **NEW** — black-void detector across viewport scrolls |
| `SUBMISSION.md` | Update asset inventory + cut log |
| `docs/adal/EVALUATE-log.md` | Add the visual-quality N11 finding + redesign plan reference |

---

## 12. Critical self-critique summary

The current build is **technically correct but visually inadequate**. The brief asked for a portfolio that **demonstrates the builder's eye**, and the shipped build demonstrates mechanical gate-passing instead. The honest read is that the original 21-check pass and the subsequent rounds polished a structurally-correct skeleton while leaving the visual surface as the minimum literal reading of the brief. **Cutting B1/B2/C1/C2/A7/Three.js-vendor was rationalized as cost discipline but collectively reduced the deliverable from "stunning" to "unremarkable".** A redesign is warranted. The mechanical gates should remain the floor, not the ceiling.
