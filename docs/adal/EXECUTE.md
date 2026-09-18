# EXECUTE — Autonomous Build Brief (hand this to a fresh AdaL session)

Date: 2026-09-18 · Deadline: Sep 19, 2026 11:59 PM PT (hackathon submission)

> **How to use:** In a new AdaL session with the repo `ToXMon/tolu-portfolio` open, say:
> "Read `docs/adal/EXECUTE.md` and `docs/adal/build-and-asset-plan.md` and execute them end-to-end, autonomously. Do not stop to ask questions — make sensible default decisions, log them, and continue. Confirm only before pushing to GitHub."

## Operating mode
- Run in **engineer mode with auto-approve** (`adal --yolo`) so file edits, bash, and generation calls don't pause.
- Load capabilities up front: `browser-use` (verification) and `video` (B1/B2 + optional audio). Image generation is built-in (`generate_image`).
- Work autonomously: build → generate → verify → fix → package. One confirmation gate only: the final `git push`.
- Models: use a strong open-weight model for the build; use a vision-capable model for the evaluator pass and for reviewing generated assets (per screenshot-matrix discipline). Escalate only on verified capability gaps.

## Execution graph (in order — each stage gates the next)

### Stage 0 — Setup
1. `git status` — confirm clean tree, branch `main`.
2. Create dirs: `assets/img`, `assets/video`, `assets/audio`, `vendor`, `docs/adal`.
3. Vendor Three.js: download `three.min.js` (r160+) into `vendor/` so the site has zero CDN runtime deps.

### Stage 1 — DESIGN.md (design contract, ~1 step)
Write `DESIGN.md` at repo root per the build plan: tokens (ink `oklch(0.13 0.01 60)`, gold `oklch(0.78 0.16 85)`, blue `oklch(0.65 0.19 245)`), type ramp (Fraunces display / Source Sans 3 body / DM Mono labels), spacing scale, one easing `cubic-bezier(0.16,1,0.3,1)`, section order, motion notes. This file is the contract the build and the evaluator both check against.

### Stage 2 — Core site build
Rewrite `index.html`, `styles.css`, `script.js` per the build plan's section spec:
1. Hero: full-viewport, mouse-reactive **particle constellation canvas** (2D canvas, vanilla JS — adapt the physics from the threeui `constellation-field` concept: nodes drift, connect with hairline threads within radius, mouse attracts/repels; palette gold-on-ink), name at clamp(3.9rem, 11vw, 9.5rem) Fraunces, staggered word entrance, magnetic CTAs, proof strip. Static `assets/img/hero-backdrop.png` as CSS fallback for no-JS/reduced-motion.
2. Marquee (infinite CSS ticker), Thesis (pull-quote), Disciplines (numbered hover rows), Work (proof-first grid from the project data preserved from the old `script.js` — Stripe Clone, SignalForge, Vouch, Crypto Scanner, X Monitor, AgentTrust, Memory Palace, Agent Skills — featured cards use generated thumbnails), Built-with-AdaL section (prompts used + before/after + build log), Contact (oversized type, magnetic email CTA).
3. Craft: film-grain overlay (CSS), custom cursor dot (desktop only), selection color, focus-visible, OG meta tags → `assets/img/og.png`, favicon → `assets/img/favicon.png`, `prefers-reduced-motion` honored, semantic HTML, hamburger nav preserved.
4. Preserve ALL real copy, links, email, socials from the old files.

### Stage 3 — Asset generation (prompts verbatim in `build-and-asset-plan.md` §2)
Generate in this order; save to `assets/`; review each with the vision model and regenerate once if off-brief:
1. `generate_image` → A1 `assets/img/og.png` (1200×630), A2 `assets/img/hero-backdrop.png` (2K, 16:9), A3–A5 `assets/img/project-{stripe,vouch,signalforge}.png` (16:10), A6 `assets/img/favicon.png` (1:1), A7 `assets/img/topo-texture.png` (16:9).
2. Video capability (Veo) → B1 `assets/video/hero-loop.mp4` (6–8s constellation dolly-in, silent loop). Embed as `<video loop muted playsinline>` hero layer on capable devices; canvas stays primary.
3. If time: audio → C1 `assets/audio/ambient.mp3`, wired behind an OFF-by-default header toggle.

### Stage 4 — Verify (clone-anywebsite discipline)
1. Serve locally (`python3 -m http.server`), load browser-use, screenshot 1440×1400 / 1920×1200 / 390×844.
2. **Evaluator pass**: separate vision-model session, adversarial prompt — "This site is broken; prove it. Compare against DESIGN.md: type scale, spacing rhythm, palette, section order, mobile layout. Report deltas with pixel positions." Fix all findings; repeat until ACCEPT (max 3 rounds).
3. Checklist: no console errors, fonts load, reduced-motion works, mobile nav works, all links valid (curl each), Lighthouse-ish sanity (fast, no blocking deps).

### Stage 5 — Demo video + submission package
1. Screen-record the live site scroll (browser-use gif/video or QuickTime) → compose B2 demo video (B1 intro + recording + captions) via video capability.
2. Write `SUBMISSION.md`: build summary (what/who/how AdaL was used), screenshot set (save the Stage-4 matrix), social post draft (X + LinkedIn, tags @adalagent, links live site + demo video).
3. Create `submission.zip` of the repo source.

### Stage 6 — Ship (ONLY confirmation gate)
`git add -A && git commit -m "feat: cinematic proof-first portfolio rebuild — AdaL hackathon submission" && git push origin main` → verify https://toxmon.github.io/tolu-portfolio/ live → paste live URL into the Google Form with ZIP, screenshots, social post, summary.

## Hard rules
- Vanilla + vendored Three.js only; no build step, no npm, no frameworks.
- Every project claim on the page keeps its real link — proof-first is the brand.
- Scope discipline: if Stage 3 video or audio slips, ship without it. Never ship broken.
- Deadline: Sep 19 11:59 PM PT. Budget time backward from the Stage 6 form submission.
