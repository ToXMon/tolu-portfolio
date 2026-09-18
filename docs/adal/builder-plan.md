# Tolu Portfolio — Builder Implementation Plan

Date: 2026-09-18 · POC: Tolu Shekoni · Author: AdaL (planner role)
Source briefs: [`EXECUTE.md`](./EXECUTE.md) · [`build-and-asset-plan.md`](./build-and-asset-plan.md)
Deadline: Sep 19, 2026 11:59 PM PT — GitHub Pages + Google Form submission

---

## TL;DR

Rebuild `ToXMon/tolu-portfolio` as a dark cinematic editorial single-page site (vanilla HTML/CSS/JS + vendored Three.js, zero build step). Add a particle-constellation hero canvas, a "Built with AdaL" meta-section, and a static-fallback backdrop. Preserve every real project link/copy/email/social from the current `script.js` + `index.html`. Generate 7 image assets (OG, hero backdrop, 3 project thumbnails, favicon, topo texture), an optional B1 hero video loop, then run a clone-anywebsite screenshot verification matrix (1440 / 1920 / 390) with an adversarial evaluator pass. Stage 5 produces a `.remotion`-based B2 demo video, `SUBMISSION.md`, a screenshot set, and `submission.zip`. **One human-confirmation gate only: the final `git push` to `main`.**

---

## 1. Pre-flight checks (run first)

```bash
cd /Users/tolushekoni/tolu-portfolio
git status                       # expect: clean except untracked .remotion/ (AdaL-managed)
git branch --show-current        # expect: main
git remote -v                    # expect: origin https://github.com/ToXMon/tolu-portfolio.git
ls assets/                       # expect: empty (img/, video/, audio/ don't exist yet)
ls vendor/                       # expect: missing
node --version python3 --version ffmpeg -version   # all present on host (v24 / 3.14 / available)
```

If any preflight fails, stop and re-plan — **do not invent workarounds** for missing tooling.

**Inventory of the current state** (so the rebuild doesn't lose anything):
- `index.html` (188 lines): about / focus / work / contact sections + hamburger nav + cinema-panel + proof-strip. Real copy & real CTAs (`mailto:tolu.a.shekoni@gmail.com`, `https://x.com/tolu_evm`, `https://github.com/ToXMon`, `https://stripe-clone-bn0.pages.dev/`).
- `styles.css` (1007 lines): tokens already use `oklch()` palette (paper `oklch(0.13 0.01 60)`, accent `oklch(0.78 0.16 85)`, etc.), Fraunces/Source Sans 3/DM Mono fonts already linked. **Known bug** (must be fixed in the rebuild, see §4): the "agency-cinematic pass" at the bottom of the file references `var(--font-mono)`, `var(--text)`, `var(--accent)`, `var(--muted)` — none of which are defined; only `--color-*` variants are. Two stacked `:root {}` blocks; hero has 3 layered pseudo-elements (`:after`, `::after` blob, `body::after` glow) that compete for z-index.
- `script.js` (446 lines): `portfolioProjects` array — 8 real projects with live demo/repo/docs links (Stripe Clone, SignalForge, Vouch, Crypto Scanner, X Monitor, AgentTrust, Memory Palace, Agent Skills). Renderer writes cards into `.work-grid`. Hero text word-split, reveal observer, section rule, counter, nav scroll, hamburger, smooth scroll all already implemented — **port these forward**.
- `.remotion/` (AdaL-managed, NOT tracked): 5 templates (`CaptionOverlay`, `GlassSplit`, `SplitLayout`, `TitleOverlay`, `VibeTitle`) + `package.json` (remotion 4.0.x) + `index.ts`/`Root.tsx` + empty `custom/` for user compositions. Use `SplitLayout`/`GlassSplit`/`CaptionOverlay` for B2.
- `assets/`: empty. Need to create `assets/img`, `assets/video`, `assets/audio`.
- `docs/adal/`: contains the briefs + empty `assets/` staging dir.

---

## 2. Files to create / change

| Path | Action | Source of truth |
|---|---|---|
| `DESIGN.md` | **create** | EXECUTE.md §Stage 1 — design contract |
| `index.html` | **rewrite** (clean replace) | build plan §1 sections |
| `styles.css` | **rewrite** (clean replace, deletes stacked `:root` bug + undefined vars) | build plan §1 + DESIGN.md tokens |
| `script.js` | **rewrite** (port `portfolioProjects` + animations + add constellation canvas + add cursor dot + add magnetic CTA) | build plan §1 + EXECUTE.md §Stage 2 |
| `vendor/three.min.js` | **create** (download r160+ from `unpkg.com/three@0.160.0/build/three.min.js`) | EXECUTE.md §Stage 0 |
| `assets/img/og.png` | **create** via `generate_image` A1 | build plan §A1 |
| `assets/img/hero-backdrop.png` | **create** via `generate_image` A2 | build plan §A2 |
| `assets/img/project-stripe.png` | **create** via `generate_image` A3 | build plan §A3 |
| `assets/img/project-vouch.png` | **create** via `generate_image` A4 | build plan §A4 |
| `assets/img/project-signalforge.png` | **create** via `generate_image` A5 | build plan §A5 |
| `assets/img/favicon.png` | **create** via `generate_image` A6 | build plan §A6 |
| `assets/img/topo-texture.png` | **create** via `generate_image` A7 | build plan §A7 |
| `assets/video/hero-loop.mp4` | **create** via video cap (B1) — cut-first | build plan §B1 |
| `assets/audio/ambient.mp3` | **create** via video cap (C1) — cut-first | build plan §C1 |
| `assets/img/screenshots/{1440,1920,390}-*.png` | **create** via browser-use | EXECUTE.md §Stage 4 |
| `.remotion/custom/DemoVideo.tsx` | **create** (B2 composition) | EXECUTE.md §Stage 5 |
| `SUBMISSION.md` | **create** | EXECUTE.md §Stage 5 |
| `submission.zip` | **create** (zip the source tree) | EXECUTE.md §Stage 5 |
| `README.md` | **edit** (refresh live URL + AdaL mention) | n/a |

`.remotion/*` (Root.tsx, package.json, etc.) is AdaL-managed — **never edit by hand**; let the video capability regenerate Root.tsx when it adds the new `DemoVideo` composition to `custom/`.

---

## 3. Stage 0 — Setup (≈ 5 min)

```bash
cd /Users/tolushekoni/tolu-portfolio
mkdir -p assets/img assets/video assets/audio assets/img/screenshots vendor docs/adal

# Vendor Three.js (r160+) — no CDN at runtime
curl -fsSL https://unpkg.com/three@0.160.0/build/three.min.js -o vendor/three.min.js
test -s vendor/three.min.js && echo "three.min.js OK: $(wc -c < vendor/three.min.js) bytes" || echo "FAIL"

git add -A && git commit -m "chore: vendor three.js + create assets scaffolding" --allow-empty
```

**Done:** vendor present, all `assets/` subdirs exist, one tiny commit so any rollback is clean.

---

## 4. Stage 1 — `DESIGN.md` (≈ 10 min)

Write the design contract at repo root. Evaluator (Stage 4) judges deltas against this file.

Required contents (verbatim from EXECUTE.md §Stage 1 + build plan §1):

```
# Tokens
--color-ink: oklch(0.13 0.01 60)        /* deep warm-black paper */
--color-surface: oklch(0.18 0.015 60)
--color-ink-fg: oklch(0.93 0.008 60)    /* primary text */
--color-muted: oklch(0.62 0.02 60)
--color-rule: oklch(0.28 0.01 60)
--color-accent: oklch(0.78 0.16 85)     /* warm gold */
--color-accent-bg: oklch(0.20 0.04 85)
--color-blue: oklch(0.65 0.19 245)      /* cool blue secondary */
--ease-out-exp: cubic-bezier(0.16, 1, 0.3, 1)

# Type
--font-display: 'Fraunces', Georgia, serif           /* opsz 144, wght 300/600/700 */
--font-body: 'Source Sans 3', system-ui, sans-serif /* wght 400/500/600 */
--font-mono: 'DM Mono', ui-monospace, monospace       /* wght 400/500 */

# Type ramp (clamp())
h1 hero: clamp(3.9rem, 11vw, 9.5rem)    Fraunces 700, letter-spacing -0.095em, line-height 0.86
h2 section: clamp(2.5rem, 7vw, 6.5rem) Fraunces 600, letter-spacing -0.06em
h3 card: clamp(1.35rem, 3vw, 2rem)     Source Sans 3 600
.label / kicker: 0.68-0.75rem DM Mono 500, letter-spacing 0.13-0.16em, uppercase

# Section order (must render top→bottom)
1. site-header (fixed, glass on scroll)
2. hero — full-viewport, particle constellation canvas, name, staggered word entrance, magnetic CTAs, proof-strip
3. marquee — infinite CSS ticker
4. thesis — editorial pull-quote (gold left border)
5. disciplines — numbered hover rows
6. work — proof-first grid of 8 real projects (featured = 2-col span with thumbnails)
7. built-with-adal — prompts used + before/after + build log
8. contact — oversized type, magnetic email CTA
9. footer

# Motion
- one easing: cubic-bezier(0.16, 1, 0.3, 1)
- reveals: opacity 0→1 + translateY(1.25rem → 0), 600ms, stagger 100ms per sibling
- word entrance: translateY(110% → 0), 600ms, stagger 80ms
- reduced-motion: kills all transforms; keeps opacity
- no-JS: hero shows assets/img/hero-backdrop.png as static background

# Craft details
- film-grain overlay: CSS pseudo-element, fixed, 4% opacity noise (SVG data URI), pointer-events:none, z-index above bg below content
- custom cursor dot: desktop-only (matchMedia (hover: hover) && (pointer: fine)), 8px, follows mouse with lerp 0.18
- selection color: var(--color-accent) on var(--color-ink)
- focus-visible: 2px solid var(--color-accent) + 2px offset
- favicon: assets/img/favicon.png; OG image: assets/img/og.png (1200x630)
```

**Done:** `DESIGN.md` committed, all tokens defined once (this also forces us to delete the duplicate-`:root` bug and the undefined `var(--text)/--accent/--muted/--font-mono` references in the existing `styles.css`).

---

## 5. Stage 2 — Core site build (≈ 90 min, biggest stage)

### 5.1 `index.html` rewrite

Single-page document. Semantic landmarks: `<header>`, `<main>`, sections per design order, `<footer>`. Key additions vs. current file:

- `<canvas id="constellation" aria-hidden="true">` inside `.hero`, behind `.hero-content`.
- `<video>` tag for B1, conditionally inserted after Stage 3 generates the file.
- `<img class="hero-backdrop">` (CSS background, `position: absolute; inset:0; object-fit:cover; z-index:-1`) for no-JS / reduced-motion fallback. Marked `<noscript>`-style hidden when canvas mounts.
- `.built-with-adal` section: 3-card layout (Prompts used · Before/After · Build log) + a `<details>` collapsible build-log table (date · stage · outcome).
- `<link rel="icon" href="assets/img/favicon.png">` + `<meta property="og:image" content="assets/img/og.png">` + Twitter card meta.
- Hamburger nav preserved, but link list updates to: `#about`, `#work`, `#built-with-adal`, `#contact`.

### 5.2 `styles.css` rewrite

Single clean `styles.css`. Structure:

```
:root { tokens from DESIGN.md }                /* one block only */
*, *::before, *::after { box-sizing }          /* reset */
html, body { ... }                              /* base, film-grain overlay via body::before */
h1-h3, .label, .container, .skip-link           /* typography + layout primitives */
.site-header, .hamburger, .nav-links           /* nav */
.hero, #constellation, .hero-content, .cta,
  .cta-secondary, .proof-strip, .cinema-panel   /* hero */
.agency-marquee                                 /* marquee */
.thesis                                         /* thesis (gold left border) */
.disciplines, .discipline-item                  /* disciplines (numbered rows) */
.work, .work-grid, .work-card                   /* work grid; .work-card.featured = 2-col */
.built-with-adal                                /* NEW meta-section */
.contact                                        /* oversized closer */
footer                                           /* minimal */
.reveal, .section-rule                          /* motion primitives */
.cursor-dot                                      /* desktop custom cursor */
@media (prefers-reduced-motion: reduce)        /* one block at end */
@media (max-width: 900px)                       /* one block at end */
@media (max-width: 48rem)                       /* mobile nav */
```

**Fix the existing bugs** by making sure every `var(--…)` resolves. The rebuild is clean-rewrite so the undefined-variable problem goes away naturally.

### 5.3 `script.js` rewrite

Order in the IIFE:
1. **Data block (port from current `script.js` verbatim)** — `portfolioProjects` array, all 8 projects with links. Mark Stripe Clone, SignalForge, Vouch as `featured: true`.
2. **Render projects** — port `renderPortfolioProjects()` and `isSafeProjectLink()`. For featured cards, append `<img class="project-thumb" loading="lazy" decoding="async">` pointing at `assets/img/project-{stripe|signalforge|vouch}.png`.
3. **Constellation canvas** — vanilla 2D canvas. Physics:
   - 80–140 nodes (devicePixelRatio-scaled count), random init positions + velocities (vx, vy ∈ [-0.15, 0.15] px/frame).
   - Drift integration each frame.
   - For each pair within 130px, draw 1px gold line, alpha = `1 - dist/130`.
   - Mouse: track `(mx, my)`. Nodes within 180px get `attract`/`repress` vector — alternate attract on click, soft repel on hover (configurable). Mouse leave → relax.
   - `requestAnimationFrame` loop, capped delta (1/30 s) to survive tab throttling.
   - Resize handler updates canvas size & node count.
   - `prefers-reduced-motion: reduce` → static render of N pre-positioned nodes, no rAF, no mouse.
   - **Fallback**: if `<noscript>` or canvas unsupported, the static `.hero-backdrop` image is the visual.
4. **Hero word entrance** — port current `splitTextToWords()`.
5. **Reveal observer** — port current `IntersectionObserver` block.
6. **Magnetic CTA** — `mousemove` on `.cta` (only on `(hover: hover)`), translate by `(mx - rect.centerX) * 0.18`, capped at ±8px. Reset on mouseleave.
7. **Cursor dot** — single `<div class="cursor-dot">` appended to body; rAF lerp toward mouse position; hidden on `(hover: none)` or touch.
8. **Marquee** — pure CSS (already defined); JS not needed but a `prefers-reduced-motion` toggle pauses it.
9. **Nav scroll, hamburger, smooth scroll** — port from current file.
10. **No-op if `IntersectionObserver` missing** — set `.reveal.visible` immediately (already done in current code, keep).

### 5.4 Verification gate (post-rewrite, pre-Stage 3)

```bash
cd /Users/tolushekoni/tolu-portfolio
python3 -m http.server 8080 &
SERVER_PID=$!
sleep 1
curl -fsS http://localhost:8080/ > /dev/null && echo "OK index"
curl -fsS http://localhost:8080/styles.css > /dev/null && echo "OK css"
curl -fsS http://localhost:8080/script.js  > /dev/null && echo "OK js"
curl -fsS http://localhost:8080/vendor/three.min.js > /dev/null && echo "OK vendor"
# link-check every href in script.js's portfolioProjects (substr grep is fine here)
kill $SERVER_PID
```

**Done Stage 2:** site serves cleanly, all real copy preserved, no `undefined`-var console errors, constellation canvas animates, project grid renders 8 cards with 3 featured thumbnails.

---

## 6. Stage 3 — Asset generation (≈ 45 min if all 7 images)

Use AdaL `generate_image` with model **`nano-banana-2`** (default; supports google_search_grounding if needed), **2K** resolution. **Generate each once**, vision-review once, regenerate at most once if off-brief. Save under `assets/img/` with exact filenames below.

Order (cheapest-iteration first → highest-stakes last):

| # | Path | Size | Prompt source | Notes |
|---|---|---|---|---|
| A6 | `assets/img/favicon.png` | 1:1 | build plan §A6 (TS monogram) | Cheap; validates color discipline first |
| A1 | `assets/img/og.png` | 1200×630 (use 16:9) | build plan §A1 | "TOLU SHEKONI" + subtitle in negative space — strict typography |
| A3 | `assets/img/project-stripe.png` | 16:10 | build plan §A3 (Stripe Clone) | First project thumbnail; sets visual language |
| A4 | `assets/img/project-vouch.png` | 16:10 | build plan §A4 (Vouch/Monad) | |
| A5 | `assets/img/project-signalforge.png` | 16:10 | build plan §A5 (SignalForge) | |
| A2 | `assets/img/hero-backdrop.png` | 16:9 (2K) | build plan §A2 | No-text atmospheric fallback; can fall back to first A2 prompt verbatim |
| A7 | `assets/img/topo-texture.png` | 16:9 (2K) | build plan §A7 | Very subtle; ok if low-contrast |

After each batch, vision-review with the model (Stage 4 evaluator model is also vision-capable). Reject criterion: off-palette (wrong gold/ink), text artifacts (A1 only — must be legible), watermarks. Maximum one regenerate per image. If still off-brief after one regen, **ship anyway** with that asset (cost guardrail).

### B1 (optional — cut-first per budget order)

`assets/video/hero-loop.mp4` — generated via AdaL video capability (Veo). Prompt verbatim from build plan §B1. **Only call if Stage 3 image budget is intact.** Embed:

```html
<video class="hero-loop" src="assets/video/hero-loop.mp4" loop muted playsinline preload="metadata" aria-hidden="true"></video>
```

…conditionally appended by `script.js` via `if (await canPlayHeroLoop()) document.querySelector('.hero').appendChild(video)` — feature-detect via a 200ms `loadedmetadata` test, fallback to canvas-only.

### C1 (cut-first)

`assets/audio/ambient.mp3` — only if budget remains. Wire behind a small OFF-by-default `<button class="sound-toggle">` in the header.

### Git checkpoints

```bash
git add assets/img/og.png assets/img/favicon.png && git commit -m "asset: og + favicon"
git add assets/img/project-*.png && git commit -m "asset: project thumbnails"
git add assets/img/hero-backdrop.png assets/img/topo-texture.png && git commit -m "asset: backdrop + topo"
git add assets/video/hero-loop.mp4 && git commit -m "asset: hero loop (optional)"
```

---

## 7. Stage 4 — Verify (≈ 30 min)

1. Serve: `python3 -m http.server 8080` (keep alive in background).
2. Load **browser-use** capability. Screenshot matrix:
   - `assets/img/screenshots/1440-home.png` (1440×1400, full above-fold + scroll for 1400px)
   - `assets/img/screenshots/1440-work.png` (1440×1200, work section)
   - `assets/img/screenshots/1920-home.png` (1920×1200, hero)
   - `assets/img/screenshots/390-home.png` (390×844, mobile hero)
   - `assets/img/screenshots/390-work.png` (390×844, mobile work grid)
3. **Independent evaluator pass** — spawn a fresh vision-capable session with `consult(model_tags=["minimax:minimax-MiniMax-M3", "google:google-gemini-3-flash-preview"])`. Adversarial prompt:
   > "This site is broken; prove it. Compare against `DESIGN.md`: type scale (clamp values), spacing rhythm (8-pt-ish), palette tokens (`oklch(0.13 0.01 60)` ink, `oklch(0.78 0.16 85)` gold), section order (hero→marquee→thesis→disciplines→work→built-with-adal→contact), mobile layout (390px). Report each finding as `path · selector · pixel position · expected vs actual · severity (blocker/major/minor)`. Be specific; vague feedback is useless."
4. Triage findings. **Blockers** fix immediately; **majors** fix in batches; **minors** log to `docs/adal/verify-notes.md` and accept if out of time.
5. **Re-run** the screenshot matrix after fixes. Max **3 evaluator rounds**; after that, ship what we have (scope discipline).
6. Final checklist (mechanical):
   - [ ] No console errors (browser-use DevTools)
   - [ ] Fonts load (no FOUT > 200ms; no missing-glyph squares)
   - [ ] `prefers-reduced-motion` honored (toggle in DevTools, verify reveals are static)
   - [ ] Hamburger nav opens/closes at < 768px
   - [ ] All 8 project links return 200 (curl HEAD each)
   - [ ] Constellation canvas doesn't run on reduced-motion / no-JS
   - [ ] OG image renders when curling `/assets/img/og.png` (image preview)

---

## 8. Stage 5 — Demo video + submission package (≈ 45 min)

### B2 demo video via `.remotion/custom/DemoVideo.tsx`

- New composition in `.remotion/custom/` (the user-facing dir per `.remotion/.gitignore`). Use the `SplitLayout` template as the base — left-side editorial type, right-side screen-capture of the live site.
- Screen-capture: browser-use records 8–12s of scrolling the live site (hero → marquee → work). Save to `.remotion/public/site-scroll.mp4` (Remotion's static file convention).
- Add a short `CaptionOverlay` sequence over the first 3s with this script (read aloud OR typed captions):
  > "Tolu Shekoni — proof-first builder. AI systems, Web3, Data. Built with AdaL."
- Render with the AdaL video capability at 1080×1350 (portrait for X/IG) OR 1920×1080 (landscape for LinkedIn). Pick one — **portrait first** because X is the primary post target.
- Output: `assets/video/demo.mp4`. Reference it from `SUBMISSION.md` (after upload to a public URL — use `transfer.sh` or attach to the form if the brief allows).

### `SUBMISSION.md` at repo root

Sections (per hackathon brief + build plan §3):
1. **TL;DR** — what was built, who it's for, live URL.
2. **What AdaL was used for** — DESIGN.md (contract), Stage 2 site build, all 7 image assets, B1 hero loop, B2 demo video, Stage 4 evaluator pass.
3. **How AdaL was used** — the role it played (planning → drafting → generating → verifying). Quote the actual prompts from `DESIGN.md`/§A1-A7/§B1 verbatim (the brief literally asked for this evidence).
4. **Screenshots** — embed the Stage-4 matrix (`assets/img/screenshots/*.png`) inline.
5. **Live links** — GitHub repo URL + GitHub Pages URL.
6. **Build log** — 6-row table (date · stage · outcome) — feeds the "Built with AdaL" section on the page.
7. **Social post draft** — X (≤ 280 chars) + LinkedIn long-form, both mentioning `@adalagent`, with live site + demo video URLs.

### `submission.zip`

```bash
cd /Users/tolushekoni/tolu-portfolio
zip -r submission.zip . \
  -x ".git/*" ".remotion/node_modules/*" ".remotion/.git/*" \
     "submission.zip" "*.DS_Store"
ls -lh submission.zip     # sanity: file exists, reasonable size (< 50 MB without video)
```

---

## 9. Stage 6 — Ship (ONE confirmation gate)

This is the **only** place where the build pauses for human confirmation per EXECUTE.md.

```bash
cd /Users/tolushekoni/tolu-portfolio
git status --short
git add -A
git commit -m "feat: cinematic proof-first portfolio rebuild — AdaL hackathon submission

Co-Authored-By: AdaL <adal@sylph.ai>"
git push origin main
```

**Then** (no further confirmation gate, per brief):
1. Wait ~60s, then `curl -fsS -I https://toxmon.github.io/tolu-portfolio/` (expect 200).
2. Spot-check the live page renders.
3. Paste the live URL + the GitHub repo URL + the `submission.zip` + `SUBMISSION.md` text + the social-post draft into the Google Form.

---

## 10. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Open-weight model errors on image gen / code review | medium | Fall back path: nano-banana-pro (better text fidelity, $0.18/img vs $0.04) only on A1 (typography-critical) — every other image stays on nano-banana-2 |
| Constellation canvas perf tanks on mobile | medium | Cap node count at `min(140, devicePixelRatio * 60)`; on `(hover: none)` cap at 50 nodes; use `Math.round(dpr)` once per resize |
| Three.js vendor download blocked / 404 | low | Mirror: try `cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js` first, then unpkg |
| Existing `styles.css` undefined-vars create layout drift | high if not rewritten | Clean-rewrite `styles.css` from scratch using `DESIGN.md` tokens — do NOT patch the existing file |
| GitHub Pages cache shows stale version after push | medium | Hard-refresh + `curl -H 'Cache-Control: no-cache'` to verify; wait 90s post-push |
| Stage 4 evaluator pass loops beyond 3 rounds | medium | Hard cap at 3 rounds per EXECUTE.md; ship what we have |
| Video capability (B1/B2) is the most expensive single call | high if B1 forced | B1 is **cut-first** per budget order; B2 demo video is **higher priority than B1** (feeds the social post which is required) |
| Live links in `portfolioProjects` rot (404 on Stripe Clone, etc.) | medium | `curl -fsSL -o /dev/null -w '%{http_code}\n' <url>` for every link; replace any 404 with a documented "Archived — see repo" fallback in the card |
| Hackathon form limits on attachment size | medium | Host the demo video externally (transfer.sh or YouTube unlisted) and link in the form rather than attaching the zip+video |
| Time-zone mishap on the deadline | low | Budget time backward: Stage 6 push must land by **Sep 19 11:00 PM PT** to leave a 1-hr buffer for form submission |

---

## 11. Measurable done criteria

1. ✅ `git log origin/main` shows the new feat commit on top, after a clean push.
2. ✅ `curl -fsS https://toxmon.github.io/tolu-portfolio/` returns 200 with `<title>Tolu Shekoni` and at least 6 `<section>` landmarks.
3. ✅ `assets/img/{og,favicon,hero-backdrop,project-stripe,project-vouch,project-signalforge,topo-texture}.png` all exist and are non-empty.
4. ✅ Stage-4 screenshot matrix exists in `assets/img/screenshots/` with at least 5 PNGs (1440×home+work, 1920×home, 390×home+work).
5. ✅ `SUBMISSION.md` exists at repo root, contains live URL, screenshot embeds, social-post draft, build-log table.
6. ✅ `submission.zip` exists at repo root, size < 50 MB.
7. ✅ All 8 portfolio project links resolve to 200 (or are explicitly archived with a documented fallback).
8. ✅ `prefers-reduced-motion` toggle disables constellation animation, reveals, marquee scroll.
9. ✅ Mobile (390px) hamburger nav opens/closes; proof-strip stacks to 1 column.
10. ✅ Google Form submitted with live URL + repo URL + `SUBMISSION.md` content + zip + social post + demo video link.

---

## 12. Cost guardrails & cut order (per EXECUTE.md)

- Build: **default to open-weight model** (MiniMax-M3-class is currently active and sufficient). Escalate to a proprietary model **only** with a concrete blocking reason logged in `docs/adal/verify-notes.md` (e.g. "vision-required evaluator pass failed on open-weight; switching to gemini-3-flash-preview because [reason]").
- Image budget: 7 images × max 2 gens = 14 image calls. One batched evaluation pass at the end (vision review).
- Video budget: **at most 2 video calls** total (B1 hero loop + B2 demo video). B1 is cut-first.
- Audio: cut-first per brief.
- Hard cuts (in this order, per EXECUTE.md): C1 ambient audio → C2 voiceover → B1 hero loop → B2 demo video. **Never cut**: Stage 2 site, Stage 4 verify, Stage 5 submission artifacts.

---

## 13. Time budget (reverse-engineered from deadline)

| Stage | Block | Cumulative |
|---|---|---|
| 0 — Setup | 5 min | 5 min |
| 1 — DESIGN.md | 10 min | 15 min |
| 2 — Site rewrite | 90 min | 1 h 45 min |
| 3 — Assets (7 imgs + B1 optional) | 45–120 min | 2 h 30 – 4 h 45 min |
| 4 — Verify + evaluator rounds | 30–60 min | 3 h – 5 h 45 min |
| 5 — B2 demo + SUBMISSION.md + zip | 45 min | 3 h 45 – 6 h 30 min |
| 6 — Push + form | 15 min | 4 h – 6 h 45 min |

Deadline buffer: **Stage 6 push must complete by Sep 19 11:00 PM PT**, leaving 1 hour before the 11:59 PM PT form-submission cutoff. If we drift past 9:30 PM PT on any single stage, **cut Stage 3 video + audio immediately** and finish the must-ship list.

---

## 14. Single open question (resolved)

> *“Do we vendor Three.js at all if the constellation is a 2D canvas?”*

**Resolved: yes, vendor it.** The brief explicitly requires it ("zero CDN runtime deps"). Use it only if time remains for a WebGL fallback variant of the hero — otherwise it sits unused at `vendor/three.min.js` and that's fine. **No action needed beyond Stage 0 download.**

---

## 15. Plan summary

- **Plan path:** `docs/adal/builder-plan.md` (this file)
- **Files changed:** 4 rewritten (HTML/CSS/JS/DESIGN.md) + 7 images + 1 video (cut-first) + 1 audio (cut-first) + 1 SUBMISSION.md + 1 zip + 1 README refresh + 1 vendor/three.min.js + 1 .remotion/custom/DemoVideo.tsx
- **Confirmation gates:** 1 (the Stage 6 `git push`)
- **Done criteria:** 10 measurable checks (see §11)
- **Hard cuts:** C1 audio → C2 voiceover → B1 hero loop → B2 demo video (in that order)
- **Model policy:** open-weight default; escalate only with logged concrete reason
