# Submission package — toluOS (Round 11)

> Source: `toxmon.github.io/tolu-portfolio/` (live URL below). Built with AdaL.

---

## Live Project / Website URL

`https://toxmon.github.io/tolu-portfolio/`

---

## Tell us about your project

**toluOS** — Tolu Shekoni's workstation as a desktop operating system in the browser. Every project opens in its own draggable, resizable, snap-to-half window with full glass chrome, a menubar that follows the focused app, a translucent taskbar with running-window indicators, and a desktop metaphor you can actually navigate by mouse or keyboard.

The site is a personal portfolio for a full-stack developer / data scientist / AI engineer, but the *form* is the pitch: instead of a single long scroll page, your portfolio is something you boot into. There are 11 distinct modules in **190 KB of vanilla JavaScript** — no build step, no framework, no CDN scripts, no service worker.

What's in the OS:

- **Welcome window** — auto-opens on load. Stagger word-entrance headline, proof strip, four CTA buttons, three tabs (Projects / Receipts / Build process).
- **Projects folder** (Cmd+P) — a Finder-style grid of all 8 portfolio projects with LIVE / REPO badges. Click any card to open that project's window.
- **8 project windows** — each with a real browser capture or a CSS/SVG banner card, an honest `shotNote` about provenance, proof links, and a status footer.
- **Résumé window** — renders the full `Tolu_Shekoni_Resume.docx` *inline* via a vanilla Node extractor (`scripts/resume-extract.mjs`, no deps) that parses the .docx zip by hand and outputs `resume.json` at build time. Native typography (Fraunces headings, DM Mono labels, gold accent borders), no headless browser needed.
- **Music player** (Cmd+M) — Audius public REST integration with trending tracks, 9 genre chips, free-text search, prev/next queue, and an AudioContext analyser that drives a gold beat-pulse under the progress bar. No SDK script tag, no API key required (free tier: 10 req/s, 500K req/mo).
- **Draggable desktop icons** — pointer-drag to rearrange, persisted to `localStorage` (`toluOS.iconLayout.v1`). Right-click → "Reset desktop icons" restores the default grid.
- **Now Playing widget** — mirrors the Music app state top-right; auto-hides when no track is loaded.
- **Quick Links widget** — Résumé / Stripe Clone / Vouch / GitHub pills bottom-left with a receipt-freshness date.
- **Launchpad** (F4) — fullscreen grid overlay of all apps and projects, like macOS Launchpad.

Validation ships in the repo: `bash scripts/check.sh` runs **28 mechanical checks** (palette, type ramp, single easing site-wide, no CDN scripts, no secrets, payload budget ≤ 190 KB, resume.json parses, all 8 portfolio banners present). `node scripts/browser-probes.mjs` runs **18 Playwright interaction probes** (launch-origin animation, multi-instance, z-order/focus, edge-snap, dock magnification, versioned layout persistence, drag/resize, perf budget). `node scripts/browser-matrix.mjs` captures at 4 viewports + normal-motion. `node scripts/browser-edge.mjs` validates no-JS, reduced-motion, subpath-deploy.

The site is fully usable with JavaScript off (`<noscript>` banner + static fallback section), respects `prefers-reduced-motion` (all animations collapse to 0.01 ms), works on mobile (390 px tested), and is subpath-safe for GitHub Pages deployment.

---

## How did you use AdaL to build your project?

AdaL ran the entire workflow end-to-end as the engineer-of-record for this build, with me (the user) as product owner. Concrete use of AdaL across the lifecycle:

**1. Ideation + design contract.** AdaL authored `DESIGN.md` (palette: oklch ink + warm gold accent; type: Fraunces / Source Sans 3 / DM Mono; motion: single `cubic-bezier(0.16, 1, 0.3, 1)` easing site-wide) and `docs/adal/design-spec-os.md` (the toluOS extension that maps the desktop metaphor to Tolu's portfolio). Every visual decision is traceable back to one of these contracts and the `scripts/check.sh` gates.

**2. Asset generation.** AdaL generated the wallpapers (A1 OG, A2 hero, A6 favicon, A7 topo), the project thumbnails (3 AI-generated cinematic stills + 5 hand-authored SVG fallbacks), and the ambient audio loop (ffmpeg-synthesized 28 s drone). All asset prompts and provenance are recorded in `media_assets.json` and `SUBMISSION.md §5`.

**3. Engineering.** AdaL wrote `script.js` (1921 lines of vanilla IIFE — window manager, drag/resize, keyboard, mobile, focal-point constellation canvas, MusicApp module, banner cards, Now Playing widget, Quick Links, Launchpad, icon drag-and-drop with localStorage), `styles.css` (1432 lines — chrome, wallpaper layers, banner cards, project folder grid, résumé document, music body + transport, widgets, launchpad overlay), `index.html` (the desktop skeleton + welcome window), and the build-time `scripts/resume-extract.mjs` (a vanilla-Node .docx parser, no deps, that writes structured JSON the Résumé window renders).

**4. Validation.** AdaL authored the validation gate itself: 28 mechanical checks in `check.sh` and 18 Playwright interaction probes in `browser-probes.mjs`. Every check fires on every push. The browser probes assert multi-instance windows, z-order/focus, edge-snap, dock magnification, drag-and-resize, and the versioned localStorage layout persistence — the kind of integration tests most portfolios never get.

**5. Iteration.** Eleven commits over multiple rounds (`feat:` / `fix:` / `chore:` / `docs:` conventional commits). Each round re-runs the suite, evaluates evaluator feedback, fixes the failures, then pushes. The Round-2 evaluator flag (hardcoded `live-verified` pill) is now itself a `check.sh` regression (L-13), so it can't come back.

**6. Honesty discipline.** Every receipt is a runtime probe (no-cors GET to the live URL), not a fabricated status. Every "honest artifact" in the receipts panel (e.g. SignalForge's GitHub 404 page, Crypto Scanner's AI cinematic still) is labelled inline so visitors know what's real and what's documented-but-not-shipped.

---

## Social Media Post (X / Twitter) — draft for openscreen demo recording

> Use openscreen to record a 30–60 s demo of: launching the site → Welcome opens → drag the Welcome window → click Projects folder → click a project → press Cmd+P to open Projects again → press F4 for Launchpad → click Music → click a trending track → close.

**Thread (7 posts, ≤ 280 chars each):**

```
1/ What if your portfolio opened as a desktop OS instead of a scroll page? I rebuilt mine as one. 11 modules. 190 KB vanilla JS. Draggable windows. Inline résumé. Audius player. Built with @AdaL. 🧵
```

```
2/ The shell came first. Wallpaper. Menubar that follows the focused app. Glass taskbar. Each project opens in a draggable, resizable, snap-to-half window. Positions persist to localStorage. Press F4 for a Launchpad.
```

```
3/ I render my full résumé inside a window. A vanilla-Node script parses the .docx → JSON at build time, then the window renders it with native typography — Fraunces headings, DM Mono labels, gold accent borders. No headless browser.
```

```
4/ The music player was the fun one. Audius REST client — trending + search + 9 genre chips + prev/next — wired to an AudioContext analyser. The progress bar pulses gold with the beat. No SDK script tag, free tier, 10 req/s.
```

```
5/ Every shortcut is keyboard-first. Cmd+1..9 still maps to all 9 projects. New: Cmd+P (Projects folder), Cmd+M (Music), F4 (Launchpad), Space (play/pause). Right-click the desktop for the full menu.
```

```
6/ The validation that ships with it: `bash scripts/check.sh` runs 28 mechanical gates — palette, type, no CDN scripts, payload budget, secrets, all 8 portfolio banners. Playwright runs 18 interaction probes + 4 viewports + no-JS + reduced-motion.
```

```
7/ Live: toxmon.github.io/tolu-portfolio
Code: github.com/ToXMon/tolu-portfolio
Built end-to-end with @AdaL.
If you're a recruiter: yes, the résumé window has a Download .docx link in the footer. 7/7
```

---

## Screenshots (1–3, included)

| File | Shows |
|---|---|
| `docs/adal/assets/submission-desktop.png` | toluOS desktop: 4 top-level tiles (Welcome / Projects / Résumé / Music), clock scene widget, Quick Links, dock, wallpaper + constellation |
| `docs/adal/assets/submission-music.png` | Music window with a playing track (Jazcardan — Nature · Deep House · 2:55), genre chips, now-playing strip with transport + volume |
| `docs/adal/assets/submission-projects.png` | Projects folder window: 4-column grid of all 8 portfolio projects with LIVE / REPO badges |
| `docs/adal/assets/submission-launchpad.png` | Launchpad (F4): 4×4 grid of all apps + projects on a frosted overlay |
| `docs/adal/assets/submission-resume.png` | Résumé window: full document rendered inline (name, role, contact, summary, TECHNICAL SKILLS) |

---

## Submission .zip

Contents of `tolu-portfolio-submission.zip` (see `zip` command in §Build below):

```
tolu-portfolio/
├── index.html
├── styles.css
├── script.js
├── DESIGN.md
├── README.md
├── SUBMISSION.md
├── assets/
│   ├── audio/  (ambient-loop.mp3)
│   ├── docs/    (Tolu_Shekoni_Resume.docx + resume.json)
│   ├── img/
│   │   ├── og.png, hero-backdrop.png, wallpaper.webp, favicon.*
│   │   └── projects/  (8 portfolio banners + thumbs + folder + music SVG icons)
│   └── media_assets.json
├── vendor/three.min.js
├── scripts/
│   ├── check.sh
│   ├── browser-matrix.mjs
│   ├── browser-edge.mjs
│   ├── browser-probes.mjs
│   └── resume-extract.mjs
└── docs/adal/
    ├── EXECUTE.md, build-and-asset-plan.md, EVALUATE.md, builder-plan.md, …
    └── assets/  (eval screenshots, edge-case report, browser-matrix captures)
```