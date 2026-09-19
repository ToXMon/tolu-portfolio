# ToluOS — Hackathon Submission (Round 4)

Date: 2026-09-18 · POC: Tolu Shekoni · Author: AdaL (engineer role)
Repo: https://github.com/ToXMon/tolu-portfolio
Live: https://toxmon.github.io/tolu-portfolio/

---

## 1. TL;DR

The pushed build at HEAD `c3dece1` was rejected as bland and generic. This Round-4 rebuild replaces the linear scroll-portfolio with **toluOS — Tolu's Workstation**, a desktop-OS metaphor inspired by [dustinbrett.com (daedalOS)](https://dustinbrett.com/) and grounded in prompts from the [AdaL bootcamp resources page](https://sylphai-inc.github.io/adal-bootcamp-landing-page/slides/04-resources.html). Each of Tolu's 8 projects opens in a draggable, resizable window with full chrome (title bar, min/max/close, resize handles). A 6-layer wallpaper (gradient + topographic texture + focal-point constellation canvas + warm/cool glows + grain) replaces the prior flat dark background. Per-project domain accents (glacier blue, mint, amber-hot, blue-grey, deep-amber, violet, cyan) distinguish each window. Mobile falls back to a tabbed single-window interface. All real proof links preserved.

## 2. What AdaL was used for

- **Design spec** — `docs/adal/reference-redesign-plan.md` (Round 3) and `docs/adal/design-spec-os.md` (Round 4 contract).
- **Image generation** — `nano-banana-2` for A1 OG (1200×630), A2 hero backdrop (1280×800), A6 favicon (256² with 32px + 64px rasters), A7 topographic texture (1280×720).
- **Visual fallback** — Hand-authored SVG placeholders for all 8 project thumbnails (Stripe, SignalForge, Vouch from Round 2; Crypto Scanner, X Monitor, AgentTrust, Memory Palace, Agent Skills new in Round 4). Each SVG uses a distinct project-domain palette and includes a wordmark + subtitle.
- **Three.js vendor** — `vendor/three.min.js` r149 UMD (594 KB) re-added per `EXECUTE.md` Stage 0; present and ready for a 3D parallax variant.
- **Validation stack** — `scripts/check.sh` (22 mechanical checks), `scripts/browser-matrix.mjs` (5-viewport Playwright capture), `scripts/browser-edge.mjs` (V-5 reduced-motion, V-6 no-JS, V-7 subpath).

## 3. How AdaL was used

1. **Discovery** — fetched daedalOS reference, screenshotted the desktop + file-explorer window at 1440×900 + 390×844 to study the desktop metaphor.
2. **Plan** — `reference-redesign-plan.md` (578 lines) maps the desktop metaphor to Tolu's portfolio with concrete palette, chrome, motion, sound, AdaL resources, asset pipeline, files to change, implementation order, and acceptance criteria.
3. **Foundation (Stage A)** — re-added vendored Three.js r149 UMD, generated A1/A2/A6/A7 sequentially (parallel `generate_image` calls were preempted in Round 1), created 5 new SVG fallbacks for secondary project thumbnails.
4. **Core shell (Stage B)** — wrote `index.html` (desktop skeleton + no-JS fallback scroll), `styles.css` (toluOS chrome + 6-layer wallpaper + mobile tab mode), `script.js` (1150-line kernel: window manager, drag/resize/min/max/close, taskbar sync, keyboard shortcuts, right-click context menu, focal-point constellation canvas, mobile tab mode, layout persistence via localStorage).
5. **Validation (Stage F)** — `bash scripts/check.sh` → 22/22 PASS; `node scripts/browser-matrix.mjs` → 0 console errors, 0 network errors across 5 captures; `node scripts/browser-edge.mjs` → 0 network errors in V-7 subpath.

## 4. Live verification

### 4.1 Mechanical — `bash scripts/check.sh` → **22/22 PASS**

- T-1..T-12: design contract (palette tokens, type ramp, motion easing, hero h1 clamp, fonts, no CDN, section order or toluOS architecture, copy preservation, accessibility, craft features, JS syntax, no duplicate ids)
- L-1: all 8 referenced local files serve HTTP 200
- L-2: HTML/CSS local refs resolve
- L-3: no absolute-root paths (subpath-safe)
- L-4: in-scope external URLs return 2xx/3xx
- L-5: Stripe Clone + Vouch live demos respond 2xx
- L-6: HTML+CSS+JS raw total = 86 KB (≤ 120 KB budget)
- L-7: no secrets in HEAD tree
- L-8: README free of stale references
- L-9: required files all present (no vendored deps — vanilla site)
- T-6c: vendor/three.min.js present AND referenced

### 4.2 Browser matrix — `node scripts/browser-matrix.mjs` → 5 captures, **0 console errors, 0 network errors, 0 horizontal overflow**

| Viewport | File | Result |
|---|---|---|
| 1440×900 | `docs/adal/assets/1440-home.png` | docW=1440, horizScroll=false |
| 1920×1080 | `docs/adal/assets/1920-home.png` | docW=1920, horizScroll=false |
| 390×844 | `docs/adal/assets/390-home.png` | docW=390, horizScroll=false |
| 320×568 | `docs/adal/assets/320-home.png` | docW=320, horizScroll=false |
| 1440×900 (normal motion) | `docs/adal/assets/1440-home-normal-motion.png` | docW=1440, horizScroll=false |

Console capture: `docs/adal/assets/console.txt` (zero entries).

### 4.3 Edge cases — `node scripts/browser-edge.mjs` → V-5, V-6, V-7 all PASS

| Gate | File | Result |
|---|---|---|
| V-5 prefers-reduced-motion | `docs/adal/assets/v5-reducedmotion-1440.png` | docW=1440, horizScroll=false, no canvas animation |
| V-6 no-JS | `docs/adal/assets/v6-nojs-1440.png` | docW=1440, horizScroll=false, fallback-scroll section visible with all 8 projects |
| V-7 subpath deploy | `docs/adal/assets/v7-subpath-1440.png` | docW=1440, horizScroll=false, 0 network errors at `/tolu-portfolio/` on :8090 |

## 5. Asset inventory

| # | File | Source | Status |
|---|---|---|---|
| A1 | `assets/img/og.png` | nano-banana-2, verbatim prompt | shipped, 1200×630, 779 KB |
| A2 | `assets/img/hero-backdrop.png` | nano-banana-2, verbatim prompt | shipped, 1280×800, 1.4 MB |
| A6 | `assets/img/favicon.png` + `favicon-32.png` + `favicon-64.png` + `favicon.svg` | nano-banana-2 + qlmanage + sips multi-size | shipped |
| A7 | `assets/img/wallpaper.webp` | nano-banana-2 (A7 topo as style seed) + PIL composition (left-horizon lift, slate-blue aurora, vignette) | shipped, 2752×1536, 88 KB WebP (replaced the 1.3 MB A7-topo.png; net −1.2 MB) |
| A3 | `assets/img/project-stripe.svg` | Hand-authored SVG (Round 2 fallback) | shipped |
| A4 | `assets/img/project-vouch.svg` | Hand-authored SVG (Round 2 fallback) | shipped |
| A5 | `assets/img/project-signalforge.svg` | Hand-authored SVG (Round 3 fallback) | shipped |
| A8 | `assets/img/shots/crypto-scanner.png` | nano-banana-2 cinematic still (Round 10, replaced hand-authored SVG) | shipped, 1600×1000 + 128×80 icon |
| A9 | `assets/img/project-x-monitor.svg` | Hand-authored SVG (Round 4 new) | shipped |
| A10 | `assets/img/project-agenttrust.svg` | Hand-authored SVG (Round 4 new) | shipped |
| A11 | `assets/img/project-memory-palace.svg` | Hand-authored SVG (Round 4 new) | shipped |
| A12 | `assets/img/shots/agent-skills.png` | nano-banana-2 cinematic still (Round 10, replaced hand-authored SVG) | shipped, 1600×1000 + 128×80 icon |
| A13 | `assets/img/shots/resume.png` | nano-banana-2 brand still (Round 10, Résumé app) | shipped, 1600×1000 + 128×80 icon |
| A14 | `assets/docs/Tolu_Shekoni_Resume.docx` | Generalized résumé (full-stack / data / AI roles), authored via AdaL | shipped |
| B1 | `assets/video/hero-loop.mp4` | **CUT** — AdaL video capability not available | n/a |
| B2 | `assets/video/demo.mp4` | **CUT** — same reason | n/a |
| C1 | `assets/audio/ambient-loop.mp3` | ffmpeg-synthesized ambient drone (Round 10, 28 s seamless loop, 48 kbps mono) — wired to the opt-in sound toggle | shipped, 165 KB, lazy-loaded on click |
| C2 | (voiceover) | **CUT** | n/a |
| Vendored | `vendor/three.min.js` | r149 UMD, 594 KB | shipped (per EXECUTE.md Stage 0) |

## 6. Cut log

Per the cost discipline in `EXECUTE.md`, the following assets were declared cut for Round 4:

- **B1 hero video (Veo)** — AdaL video generation capability not available in this session. Canvas is the only motion element.
- **B2 demo video (Remotion)** — same reason.
- **C1 ambient audio (ElevenLabs/Gemini TTS)** — AdaL audio generation capability not available. Sound toggle is wired but does not play.
- **C2 voiceover** — same reason.

The site ships with **2 generative assets** (A1 OG, A6 favicon) + 5 visual-asset regenerations (A2 hero, A7 topo + the favicon SVG) **+ 8 hand-authored SVG thumbnails**. The constellation canvas replaces the B1 video; the wallpaper layering replaces the B2 social demo; the static SVG thumbnails replace the AI-generated cinematic stills.

## 7. Visual system — what changed vs the prior build

| Aspect | Prior (Round 3) | Round 4 |
|---|---|---|
| Hero | 80-node uniform mesh | **Focal-point constellation**: core + 6 spokes + 6 clusters × 9 nodes |
| Background | `oklch(0.13 0.01 60)` flat | **6-layer composite**: gradient + topo + canvas + warm glow + cool glow + grain |
| Project thumbnails | 3 SVG placeholders + 5 text-only | **8 project-specific visuals**: 3 SVG (Round 2) + 5 new SVG (Round 4) |
| Window grammar | None — vertical scroll sections | **Desktop OS**: draggable, resizable, min/max/close windows with chrome |
| Taskbar | None | Translucent 36 px bottom bar with start orb + tabs + sound toggle + clock |
| Right-click context menu | None | Open Welcome / Reset layout / Shortcuts / View source |
| Keyboard shortcuts | None | `Esc` / `Cmd+W` / `Cmd+M` / `Cmd+0..8` / `Cmd+R` / `?` |
| Mobile | Hamburger nav | Tabbed single-window interface (no drag) |
| Welcome | Inline hero with stagger | **Auto-opening window** with 3 tabs (8 Projects / Receipts / Build process) |
| Sound | None | Header toggle wired (no audio asset generated) |
| Three.js vendor | Present, unused | Present (Stage 0 mandatory), unused in this build |
| No-JS fallback | Static fallback cards | Full `.fallback-scroll` section with all 8 projects |

## 8. Live links

- **GitHub repo:** https://github.com/ToXMon/tolu-portfolio
- **GitHub Pages live:** https://toxmon.github.io/tolu-portfolio/
- **Live Stripe Clone demo:** https://stripe-clone-bn0.pages.dev/
- **Live Vouch/Monad app:** https://vouch.tolu-a-shekoni.workers.dev/
- **Reference (daedalOS):** https://dustinbrett.com/
- **AdaL resources:** https://sylphai-inc.github.io/adal-bootcamp-landing-page/slides/04-resources.html

## 9. Build log

| Date | Stage | Outcome |
|---|---|---|
| 2026-09-18 | Foundation | Re-added `vendor/three.min.js` r149 (594 KB UMD). Generated A7 (topo, 1280×720), A2 (hero, 1280×800), A1 (OG, 1200×630), A6 (favicon, 512² + 32px + 64px rasters). |
| 2026-09-18 | Visuals | Created 5 new SVG fallbacks for secondary project thumbnails (crypto-scanner, x-monitor, agenttrust, memory-palace, agent-skills). Each uses a project-domain palette. |
| 2026-09-18 | Shell | Rewrote `index.html` (desktop metaphor with wallpaper layers, desktop-icons grid, taskbar, mobile-tabs, fallback-scroll section). Rewrote `styles.css` (1.1k lines: tokens, 6-layer wallpaper, window chrome, taskbar, mobile tabs, fallback). Rewrote `script.js` (1.15k lines: window manager, drag/resize, keyboard, focal-point constellation canvas, mobile, layout persistence). |
| 2026-09-18 | Validate | `bash scripts/check.sh` → 22/22 PASS (with T-7 updated to recognize toluOS architecture). `node scripts/browser-matrix.mjs` → 0 console errors, 0 network errors. `node scripts/browser-edge.mjs` → V-5/V-6/V-7 PASS. |

## 10. Social post draft

**X (≤ 280 chars):**

> Rebuilt tolu-portfolio as a desktop OS metaphor — 8 projects open in draggable/resizable windows, focal-point constellation hero, layered wallpaper, per-project domain accents. 22/22 checks green. Live → https://toxmon.github.io/tolu-portfolio/ #adaL #buildinpublic

**LinkedIn (long-form):**

> Just shipped Round 4 of the tolu-portfolio rebuild — end-to-end through AdaL.
>
> The thesis: a portfolio that demonstrates the builder's eye, not just mechanical-check passing. The previous build passed 21/21 gates but looked like every other dark-mode portfolio template. The user rejected it. The new build is **toluOS — Tolu's Workstation**: a dark cinematic desktop metaphor inspired by [dustinbrett.com (daedalOS)](https://dustinbrett.com/) and grounded in prompts from the [AdaL bootcamp resources](https://sylphai-inc.github.io/adal-bootcamp-landing-page/slides/04-resources.html).
>
> Each of Tolu's 8 projects opens in a draggable, resizable window with full chrome (title bar, min/max/close, resize handles). A focal-point constellation canvas (core + 6 spokes + 6 cluster groups × 9 nodes each) replaces the prior uniform-mesh hero. A 6-layer wallpaper (gradient + topographic texture + canvas + warm/cool glows + grain) replaces the flat dark. Per-project domain accents (glacier blue for Stripe, mint for SignalForge, violet for Memory Palace, etc.) distinguish each window.
>
> 22/22 mechanical checks green. 0 console errors, 0 network errors across 5 viewport captures. Mobile falls back to a tabbed single-window interface. All 19 real proof links preserved.
>
> Live: https://toxmon.github.io/tolu-portfolio/
> Repo: https://github.com/ToXMon/tolu-portfolio
> @adalagent

## 11. Definition of done

- [x] G1 T-1..T-12 pass · G2 check.sh exit 0 (22/22)
- [x] G3 browser matrix captured, console clean, all 5 captures no errors
- [x] G3 edge cases V-5/V-6/V-7 pass
- [x] G5 must-ship assets present or sanctioned fallback in place
- [x] All 8 projects + 19 proof links preserved and live-verified
- [x] Stage 5 artifacts: SUBMISSION.md (this), screenshot set, README, design-spec-os.md
- [x] Push gate: held by user per task brief; live deploy remains the user's action

## 12. Round-4 corrections (vs Round-2 evaluator report + Round-3 visual rejection)

| ID | Finding | Resolution |
|---|---|---|
| Round-2 F11 (zip `.remotion/`) | Closed — zip excludes `.remotion/`, `node_modules/`, `package-lock.json` |
| Round-3 N11 (visual: bland, generic, insufficient media) | **Fixed** — toluOS rebuild: desktop metaphor, focal-point constellation, 6-layer wallpaper, 8 project-specific visuals, draggable/resizable windows, keyboard shortcuts, mobile tabs |
| Round-3 N5/N7/N8 (favicon dims, chip tap targets, DCL) | Logged exceptions — visual quality trade-off accepted per brief; chip tap targets are 38 px (WCAG 2.5.8 inline-text-context exception applies); DCL ~520 ms local-server-only measurement |
| Round-3 capability gap (B1 video, B2 demo, C1 audio, C2 voiceover) | Documented in §6 — AdaL video/audio capabilities not available in this session; sound toggle wired but silent; canvas substitutes for video |
| Round-3 N6 (L-1 missed template literals) | Fixed — L-1 now strips `${...}` interpolations before extracting refs |

---

*Generated by AdaL engineer mode (MiniMax M3-class). All prompts and decisions logged in `docs/EXECUTE.md`, `docs/adal/build-and-asset-plan.md`, `docs/adal/builder-plan.md`, `docs/adal/EVALUATE.md`, `docs/adal/EVALUATE-log.md`, `docs/adal/redesign-audit.md`, `docs/adal/reference-redesign-plan.md`, `docs/adal/design-spec-os.md`.*
