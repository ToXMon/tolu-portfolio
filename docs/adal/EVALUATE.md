# EVALUATE — Evaluator Plan & Acceptance Gates

Date: 2026-09-18 · Author: AdaL (evaluator planner) · Companion to `EXECUTE.md` (Stages 4–6) and `build-and-asset-plan.md`

> **Role of this doc.** This is the evaluation contract for the portfolio rebuild. The engineer session builds; the evaluator session (separate, adversarial prompt) grades against THIS file plus `DESIGN.md`. Nothing ships until every gate below passes or an explicit, logged exception applies. Deadline-safe: each gate has a cut-fallback so a failing optional asset never blocks the submission.

---

## 0. Findings from inspecting the repo (baseline for the gates)

1. **No tests, no CI, no scripts/, no package.json in the project.** Validation tooling is greenfield — the gates below are specified as concrete commands using only tools already present on the machine: `python3` (/opt/homebrew/bin), `curl`, `sips`, `ffprobe`. `ImageMagick identify` is NOT installed — do not write checks that need it.
2. **`DESIGN.md` does not exist yet** (Stage 1 pending). Every visual-delta check references it, so Gate 1 blocks until DESIGN.md is committed.
3. **`assets/`, `vendor/`, `docs/adal/assets/` exist but are empty.** Asset gates compare generated files against the inventory in §5.
4. **Real project data lives in `script.js` (`portfolioProjects`, 8 projects, ~19 unique external URLs).** `renderPortfolioProjects()` uses `grid.replaceChildren()` — static HTML fallback cards are *replaced* when JS runs, so both paths need checks (§6.3). `isSafeProjectLink()` already filters non-http(s) hrefs — keep it and test it.
5. **Reduced motion: CSS-only today** (`styles.css` L587, L792). No JS `matchMedia('prefers-reduced-motion')` guard exists — the new canvas constellation and B1 video layer MUST ship one (Gate 3, edge case E2).
6. **Repo will be served from a GitHub Pages *project subpath*** (`https://toxmon.github.io/tolu-portfolio/`). Absolute asset paths (`/assets/img/…`) will 404 in production while working on localhost — a top regression risk (Gate 2, check V-7).
7. **README.md is stale** (references deleted `projectSpecs`/`hello@tolushekoni.com` era). Listed as a Gate 4 cleanliness check.
8. **`.remotion/` exists (untracked)** with overlay components for the B2 demo video — B2 quality checks should confirm it still composes (or B2 was cut).

---

## 1. Gate structure

| Gate | Name | When | Blocks ship? |
|---|---|---|---|
| G1 | Contract & targeted checks | After each build stage (2/3) | Yes |
| G2 | Full-suite validation (`scripts/check.sh`) | Before screenshots, after every fix round | Yes |
| G3 | Browser screenshot matrix + interaction | Stage 4 | Yes |
| G4 | Adversarial vision-evaluator pass (DESIGN.md deltas) | Stage 4, max 3 rounds | Yes (with cut-fallbacks) |
| G5 | Asset quality gates (images/video/audio) | Stage 3, per asset | No — per-asset fallback defined |

**Evaluator session prompt (verbatim, per EXECUTE.md Stage 4.2):**
"You are an adversarial evaluator. This site is broken; prove it. Grade against `DESIGN.md` and `docs/adal/EVALUATE.md`. For each gate report PASS/FAIL with evidence (pixel positions, file paths, HTTP codes, command output). Do not be lenient. End with verdict ACCEPT or REJECT plus a numbered findings list ordered by severity."
**Model policy:** vision-capable open-weight model first (MiniMax M3-class per cost table). Escalate to proprietary only on verifiable error/absence of vision, and log the concrete reason in the round report.

---

## 2. G1 — Contract & targeted checks (fast, run per stage)

Each check is one command, exit 0 = pass.

| ID | Check | Command (pattern) | Threshold |
|---|---|---|---|
| T-1 | DESIGN.md exists and defines tokens | `grep -q 'oklch(0.13 0.01 60)' DESIGN.md && grep -q 'cubic-bezier(0.16, 1, 0.3, 1)' DESIGN.md` | ink, gold `oklch(0.78 0.16 85)`, blue `oklch(0.65 0.19 245)`, single easing, type ramp, section order all present |
| T-2 | Palette consistency | `grep -E 'oklch\(0\.78 0\.16 85' styles.css` | accent tokens from DESIGN.md used; **zero** oklch literals with hue ∉ {60, 85, 245} family outside token block |
| T-3 | Single easing | `grep -oE 'cubic-bezier\([^)]*\)' styles.css \| sort -u` | exactly 1 unique value (+ `linear` allowed for marquee) |
| T-4 | Hero display scale | grep `clamp(` rule for hero h1 | `clamp(3.9rem, 11vw, 9.5rem)` per EXECUTE.md Stage 2 |
| T-5 | Fonts | `grep -c 'Fraunces\|Source+Sans+3\|DM+Mono' index.html` | all 3 families loaded; `display=swap`; CSS declares system fallbacks |
| T-6 | No forbidden deps | `grep -riE '<script src="https?|cdn\.jsdelivr|unpkg|react|vue|tailwind' index.html script.js` | zero matches; Three.js loads from local `vendor/` only |
| T-7 | Section order | ordered grep of section ids/headings in index.html | Hero → Marquee → Thesis → Disciplines → Work → Built-with-AdaL → Contact |
| T-8 | Real-copy preservation | grep index.html + script.js | email `tolu.a.shekoni@gmail.com`, `https://x.com/tolu_evm`, `https://github.com/ToXMon`, all 8 project titles (Stripe Clone, SignalForge, Vouch, Crypto Scanner, X Monitor, AgentTrust, Memory Palace, Agent Skills) present |
| T-9 | Accessibility basics | grep | `lang="en"`, one `<h1>`, skip-link, `prefers-reduced-motion` blocks (≥2), `:focus-visible` styles, all `<img>` have `alt` |
| T-10 | Craft features present | grep | film-grain overlay, custom cursor (desktop-gated), selection color, OG tags, favicon link, hamburger markup |
| T-11 | JS syntax | `node --check script.js` or `python3 -c` fetch + parse | zero syntax errors |
| T-12 | HTML sanity | `python3 -m html.parser` pass or tidy-equivalent grep for unclosed sections | parses; no duplicate element ids |

---

## 3. G2 — Full-suite validation

One command must run everything and emit a machine-readable report: `bash scripts/check.sh` (engineer to implement; this plan defines its contents).

**Suite = G1 (T-1…T-12) + L-1…L-9 below. Exit code 0 only if ALL pass. Writes `docs/adal/checks-latest.txt` with one line per check (`PASS|FAIL id detail`). Every fix round re-runs the FULL suite, not just failed checks (regression safety).**

| ID | Check | Method | Threshold |
|---|---|---|---|
| L-1 | Local serve reachable | `python3 -m http.server 8080` (bg) + `curl -sf localhost:8080/tolu-portfolio/ …` | HTTP 200 for `/`, `/styles.css`, `/script.js`, `/vendor/three.min.js`, every `assets/*` file referenced by HTML/CSS/JS |
| L-2 | Referenced-files-exist | parse `src=`, `href=`, `url(...)` from index.html/styles.css; assert each local file exists | 0 dangling references; 0 unreferenced asset files (orphaned generations = cost waste, flag warn) |
| L-3 | Relative paths only | `grep -E '(src|href)="/' index.html \| grep -v '//'; grep 'url(/' styles.css` | 0 absolute-root paths (subpath-safe on GitHub Pages). Exception: `og:image` which must be the **absolute production URL** `https://toxmon.github.io/tolu-portfolio/assets/img/og.png` (crawlers reject relative) |
| L-4 | External link liveness | `curl -s -o /dev/null -w '%{http_code}' -L -A 'Mozilla/5.0'` each URL in the canonical inventory below | 2xx/3xx. **Exempt to browser check (G3):** `x.com/*` (curl 403s by design). Known-fragile: `github.com/ToXMon/adal-bootcamp-2/blob/feat/stripe-clone-deploy/README.md` (branch may be deleted — 404 ⇒ change link to default-branch README, keep the claim honest) |
| L-5 | Live-demo freshness | same curl | `vouch.tolu-a-shekoni.workers.dev/api/health` returns 200 AND JSON; `stripe-clone-bn0.pages.dev` 200. If a demo is truly down: FAIL — fix the claim on-page (remove "Live" tag) rather than the demo; proof-first is the brand |
| L-6 | Budget | `wc -c` + gzip | HTML+CSS+JS ≤ 120 KB raw combined; JS executed synchronously ≤ 1 script tag before content; page with all above-fold images ≤ 2.5 MB |
| L-7 | Git hygiene | `git status --short` | no `.env`/secrets staged; `git diff --cached` greps clean for `api_key|token=|secret` |
| L-8 | README accuracy | grep | README matches reality (no `projectSpecs`/`hello@tolushekoni.com` residue) |
| L-9 | Clean-clone boot | `git clone <repo> /tmp/boot && cd /tmp/boot && python3 -m http.server` + curl | site renders with no files outside the repo (vendored deps committed) |

**L-4 canonical link inventory (from current `script.js`, dedup with index.html):**
`stripe-clone-bn0.pages.dev/` · `67a97296.stripe-clone-bn0.pages.dev/` · `x.com/tolu_evm/status/2073978784747786320` · `github.com/ToXMon/adal-bootcamp-2` · `…/blob/feat/stripe-clone-deploy/README.md` · `vouch.tolu-a-shekoni.workers.dev` · `…/api/health` · `github.com/ToXMon/vouch` · `…/vouch/blob/main/README.md` · `github.com/ToXMon/catecoin-scanner` · `…/catecoin-scanner/blob/main/README.md` · `toxmon.github.io/agent-workflows/` · `github.com/ToXMon/agenttrust` · `…/agenttrust/blob/main/README.md` · `github.com/ToXMon/tolu` · `x.com/tolu_evm` · `github.com/ToXMon` · `mailto:tolu.a.shekoni@gmail.com` (presence check only, not curl).

---

## 4. G3 — Browser screenshot matrix + interaction gates

Tool: browser-use capability against the local server (Stage 4.1).

| ID | Viewport | Assertions |
|---|---|---|
| V-1 | 1440×1400 | full-page shot; hero canvas painting (non-blank pixels > 5% in hero region); section order matches T-7; no text overflow, no overlapping elements; save `docs/adal/assets/verify-1440.png` |
| V-2 | 1920×1200 | same; shot `verify-1920.png` |
| V-3 | 390×844 | **horizontal overflow = 0** (`document.documentElement.scrollWidth ≤ 390`); hamburger visible; open nav → `aria-expanded="true"`, tap link → closes & scrolls; tap targets ≥ 44 px; shot `verify-390.png` |
| V-4 | Console | 0 errors on load and during scroll; warnings only from third parties. Log captured to `docs/adal/assets/console.txt` |
| V-5 | Reduced motion | emulate `prefers-reduced-motion: reduce` → no entrance animations, canvas paused or replaced by `hero-backdrop.png`, video layer not autoplaying |
| V-6 | No-JS | disable JS → hero backdrop image visible, static work cards legible, contact links usable (no blank page) |
| V-7 | Subpath deploy | load via `http://localhost:8080/subpath-test/` (serve repo inside a subdir) → all assets 200 — catches the Pages-project-path class of bug |
| V-8 | Anchor/nav | every `#hash` link resolves to an existing id; smooth-scroll uses the single easing curve |
| V-9 | Perf sanity | scripted timings: DOMContentLoaded ≤ 500 ms local; LCP proxy (hero h1 painted) ≤ 1.5 s local; fonts render (Fraunces visible, no FOUT flash > 300 ms) |
| V-10 | X-links | open the exempted x.com URL in browser: HTTP 200 + visible post — else the "X proof" claim must be removed |

**Evidence rule:** screenshots are submission artifacts (Stage 5) — named, kept, and referenced in `SUBMISSION.md`.

---

## 5. G5 — Asset quality gates (A/B/C inventory)

Per-asset mechanical checks (part of check.sh) + vision review (G4). File dims via `sips -g pixelWidth -g pixelHeight` (images) and `ffprobe -v error -show_entries format=duration,size:stream=width,height,codec_name,bit_rate` (video/audio) — the installed toolchain on this machine.

| Asset | File | Mechanical threshold | Vision criteria (G4 rubric) |
|---|---|---|---|
| A1 OG | `assets/img/og.png` | 1200×630 ±0, ≤ 700 KB, PNG | text "TOLU SHEKONI" rendered correctly (zero misspellings/gibberish), palette anchors, negative space left third intact, legible at link-preview scale |
| A2 hero backdrop | `assets/img/hero-backdrop.png` | 2560×1440 (16:9), ≤ 1.5 MB | **no text, no watermarks**; ink/gold atmosphere; not brighter than base palette (must stay behind text ≥ 4.5:1 contrast when overlaid) |
| A3–A5 thumbnails | `assets/img/project-{stripe,vouch,signalforge}.png` | 1600×1000 (16:10) each, ≤ 800 KB | match per-project brief; no gibberish UI text on Stripe card (rendered UI text either legible-correct or absent); consistent palette as a set |
| A6 favicon | `assets/img/favicon.png` | 512×512, ≤ 200 KB; also wired `<link rel="icon">` | "TS" monogram legible at 32 px screenshot (downscale test via sips) |
| A7 topo texture | `assets/img/topo-texture.png` | 1920×1080, ≤ 800 KB | subtle: contour contrast delta ≤ ~10% of background (must not fight AdaL-section text) |
| B1 hero loop | `assets/video/hero-loop.mp4` | duration 6–8 s, ≥1080p, **no audio stream**, H.264, ≤ 6 MB; first/last-frame SSIM ≥ 0.9 (seamless loop check) | no text artifacts; palette; motion calm enough to sit behind UI |
| C1 ambient | `assets/audio/ambient.mp3` | 20–30 s, mono/stereo, ≤ 3 MB | toggle present, **default OFF**, no autoplay violation (browser policy) |
| C2 voiceover | submission package | — | script factually matches page claims |

**Generation policy (cost):** each asset generated ONCE, reviewed once, regenerated at most ONCE. After one regen still off-brief → apply cut-fallback: A1/A2/A3–A5/A6/A7 are must-ship so they get a **programmatic fallback** (CSS gradient / canvas frame-grab) and a logged FAIL→FALLBACK note; B1/C1/C2 ship-less per the cut order (C1→C2→B1→B2). Never let G5 block Stage 6.

---

## 6. G4 — Adversarial vision-evaluator pass (the design-delta gate)

Inputs per round: the 3 screenshots + asset contact sheet + DESIGN.md + this file. Output: numbered findings with severity **Critical / Major / Minor**, pixel positions, and gate-ID mapping.

**Scoring rubric (0–10 each):** type scale & ramp · spacing rhythm · palette fidelity · section order/composition · motion quality · mobile layout · asset cohesion (does every asset look like one art direction) · craft details (grain, cursor, selection, focus) · copy/proof integrity.

| Decision rule | Threshold |
|---|---|
| ACCEPT | every dimension ≥ 8, **0 Critical, 0 Major**, ≤ 2 Minor (Minor may be logged and deferred) |
| FIX round | any Critical/Major → engineer fixes, re-run full G2 + affected G3, re-evaluate |
| Termination | max **3 rounds**. Round 3 REJECT with only Minor/asset findings → ship with logged exceptions in `docs/adal/EVALUATE-log.md`; Critical findings → apply cut-fallbacks (drop the asset/feature) and re-verify, because "never ship broken" outranks the feature |

Round reports saved: `docs/adal/eval-round-{1,2,3}.md` (judge evidence of the process itself — feeds "Built with AdaL").

---

## 7. Edge-case register (must be exercised each full validation)

- **E1** Canvas: mouse leaves window → no stuck attraction; tab hidden → rAF paused; no WebGL/canvas-2d → static fallback.
- **E2** Reduced motion honored in **JS too** (matchMedia guard — currently absent in codebase).
- **E3** Fonts blocked/offline → system fallback stack renders at intended sizes.
- **E4** JS error mid-render → static HTML fallback cards remain (try/catch already wraps renderer; verify `replaceChildren` never leaves grid empty — `if (!projects.length) return` guards this; test with empty array).
- **E5** `links: []` projects (SignalForge, Agent Skills) → card renders, no empty link list, no broken UI.
- **E6** `isSafeProjectLink`: inject `javascript:`/`mailto:` hrefs in data → not rendered as anchors.
- **E7** Very long project titles on 320 px viewport → no overflow.
- **E8** Hamburger: click, Escape, resize-to-desktop while open → state and `aria-expanded` consistent.
- **E9** Rapid scroll on mobile → reveals settle visible (no permanently invisible `.reveal` elements: assert all reveals reach opacity 1).
- **E10** Dark mode forced by OS — `color-scheme: dark` means no white flash; refresh mid-scroll → positions not broken.

---

## 8. Acceptance summary (ship checklist)

- [ ] G1 all T-checks pass · G2 `scripts/check.sh` exit 0
- [ ] G3 matrix captured, V-4 console clean, V-5/V-6/V-7 pass
- [ ] G4 verdict ACCEPT (or logged exceptions per §6 termination rule)
- [ ] G5 must-ship assets pass or have logged programmatic fallback in place
- [ ] All 8 projects + proof links live-verified (L-4/L-5/V-10)
- [ ] Stage 5 artifacts exist: `SUBMISSION.md`, screenshot set, ZIP, social post draft; B2 present or cut logged
- [ ] `git status` clean after commit; push only on user confirm

**Definition of done = every box above, with the check output and round reports committed under `docs/adal/`.**
