# Tolu Portfolio — Build & Asset Plan

Date: 2026-09-18 · POC: Tolu Shekoni · Author: AdaL
Deadline: Hackathon submission Sep 19, 2026 11:59 PM PT

TL;DR: Rebuild the portfolio as a dark cinematic editorial single-page site (vanilla HTML/CSS/JS + vendored Three.js, zero build step for GitHub Pages), elevate it with AI-generated media assets (hero OG image, project thumbnails, cinematic intro clip, ambient audio, favicon) whose prompts are grounded in Director's Console Cinema Prompt Engineering vocabulary, generate assets with AdaL's image/video capabilities, verify via the clone-anywebsite screenshot-matrix discipline, and ship with a "Built with AdaL" section that turns our process into judging evidence.

---

## 1. Website build spec

### Stack (Ponytail discipline: minimum code, native first)
- `index.html`, `styles.css`, `script.js` — clean rewrites, same 3-file structure, `git push` = deployed.
- Three.js vendored into `vendor/` (no CDN runtime dependency).
- Google Fonts CDN (Fraunces + Source Sans 3 + DM Mono) with system fallbacks.
- Everything else native: IntersectionObserver reveals, CSS custom properties, scroll-driven effects, `<dialog>`, native form validation.

### Design direction — "Dark Cinematic Editorial"
- Palette: deep ink `oklch(0.13 0.01 60)` base, warm gold `oklch(0.78 0.16 85)` accent, cool blue `oklch(0.65 0.19 245)` secondary — evolution of current direction, one coherent token system (deleting the current triple-override CSS).
- Type: Fraunces (display serif, optical sizing, tight negative tracking) / Source Sans 3 (body) / DM Mono (labels, evidence tags).
- One easing curve site-wide: `cubic-bezier(0.16, 1, 0.3, 1)`.

### Sections
1. **Hero** — full-viewport: mouse-reactive particle constellation canvas (adapted from threeui `constellation-field`, palette-tuned to ink+gold), name at 9rem+ editorial scale, staggered word entrance, magnetic CTAs, proof strip (live demos / bootcamps / hackathon work).
2. **Marquee** — infinite ticker: "Proof before polish · Live links over claims · Bootcamp velocity, production standards."
3. **Thesis** — editorial pull-quote: technology as applied science.
4. **Disciplines** — numbered list, hover-expanding rows: Business Excellence, Web3 Engineering, AI Systems, Data Science.
5. **Work** — proof-first grid from the real project data (Stripe Clone, SignalForge/Solana, Vouch/Monad, Crypto Scanner, X Monitor, AgentTrust, Memory Palace, Agent Skills): featured projects get large cards with AI-generated thumbnails + live links; every claim visibly linked.
6. **Built with AdaL** — the meta-section: prompts used, before/after, build log. Judges' "effective use of AdaL" + "originality" criteria in one move.
7. **Contact** — oversized typographic closer, magnetic email CTA.

### Craft details
Film-grain overlay, custom cursor dot (desktop), custom selection color, focus-visible states, favicon + OG image, `prefers-reduced-motion` respected, no-JS fallback content, semantic HTML.

### Verification (clone-anywebsite discipline)
DESIGN.md as contract → build → browser screenshot matrix at 1440×1400 / 1920×1200 / 390×844 → independent evaluator model critiques screenshots adversarially → fix rounds → push.

---

## 2. Asset plan (image / video / audio)

All prompts below use Director's Console CPE grammar: real cameras (ARRI Alexa 65), lenses (Panavision C-Series anamorphic), film stocks (Kodak Vision3 500T 5219), lighting (ARRI SkyPanel S360-C, tungsten practicals), aspect ratios, and movement language. This grounding is what separates "AI-looking" output from cinematic output.

Palette anchors for every asset: deep warm-black ink (#1C1A17), warm gold (#E8B34B), cool slate blue (#4A7FB5). Consistent across all generations so assets feel like one art direction.

### A. Static images (generate with AdaL `generate_image`, nano-banana-2, 2K)

**A1. OG / social share image (1200×630)** — the link preview when the site is posted.
> Cinematic wide shot, anamorphic 2.39:1 framing: a lone constellation of golden particle nodes connected by thin light threads floating over a deep warm-black void, shallow depth of field, shot on ARRI Alexa 65 with Panavision C-Series anamorphic lens, Kodak Vision3 500T 5219 film stock, subtle film grain, single warm key light from frame right simulating an ARRI SkyPanel through full CTO, deep shadows, editorial composition with generous negative space on the left third for typography, the words "TOLU SHEKONI" in elegant serif type and "Proof-first builder — AI systems · Web3 · Data" in small monospaced type set into the negative space.

**A2. Hero backdrop still (fallback for no-WebGL / reduced-motion, 2560×1440)**
> Abstract cinematic background: a vast dark field of fine golden dust particles drifting through warm black space, extremely shallow depth of field, bokeh highlights in amber and slate blue, shot on ARRI Alexa 65, 100mm macro probe lens, Kodak Vision3 500T 5219, heavy atmospheric haze, single volumetric light shaft from upper left, deep warm-black shadows with amber rim light, subtle film grain, no text, no objects, pure atmospheric texture.

**A3–A5. Project thumbnails (3 featured projects, 1600×1000 each)** — visual identity per project card.
- Stripe Clone:> Minimal cinematic product still: a sleek dark payment-checkout interface floating as a glowing holographic panel above a black marble surface, gold and warm-white UI accents, dramatic chiaroscuro lighting, shot on ARRI Alexa 35 with 50mm Panavision Primo, f/1.8, Kodak Vision3 500T, deep ink background with subtle blue rim light, film grain, editorial negative space.
- Vouch / Monad:> Cinematic concept still: two abstract geometric seal-stamps of warm gold light interlocking above a dark reflective plane, symbolizing verified trust on-chain, volumetric haze, shot on ARRI Alexa 65, Panavision anamorphic 40mm, Kodak Vision3 500T 5219, deep blacks, amber key light with cool blue fill, anamorphic lens flare, film grain, no text.
- SignalForge / Solana:> Cinematic macro still: molten gold filament lines forging into a crystalline geometric network over a black steel surface, sparks of amber light, extreme macro on ARRI Alexa 65 with probe lens, Kodak Vision3 500T, dramatic single-source tungsten lighting through haze, deep shadow falloff, film grain, no text.

**A6. Favicon / brand mark (512×512)**
> Minimal monogram mark: the letters "TS" constructed from a single continuous thin golden line forming a subtle constellation node pattern, on pure warm-black background, flat vector style, high contrast, centered, generous padding, no other elements.

**A7. "Built with AdaL" section background texture (1920×1080, very subtle)**
> Extremely subtle dark texture: faint warm-gold topographic contour lines on deep warm-black, almost imperceptible, like an archival engineering blueprint left in the dark, matte, low contrast, no text, no objects.

### B. Video (AdaL video capability — Veo; used two ways)

**B1. Cinematic hero intro loop (6–8s, 1080p, silent, seamless loop)** — embedded as an optional `<video loop muted playsinline>` layer behind hero text on high-end devices, with the canvas constellation as the primary effect and this as the cinematic alternative. Also doubles as the core of the social-post demo video.
> Slow cinematic dolly-in through a field of golden constellation particles connected by hairline threads of light, drifting in warm black space, anamorphic 2.39:1, shot on ARRI Alexa 65 with Panavision C-Series anamorphic 50mm, Kodak Vision3 500T 5219 film emulation, subtle film grain and halation, single volumetric amber light source, extremely slow camera push-in, particles parallax at multiple depths, seamless ambient loop, moody, premium, no text.

**B2. Social demo video (15–30s, 1080×1350 or 1920×1080)** — screen-record the live site (scroll through hero → work → AdaL section), then compose with B1 as intro/outro and captions via AdaL's Remotion/video tooling. This feeds the hackathon's required social post.

### C. Audio (AdaL video capability — ElevenLabs/Gemini TTS; strictly optional, off by default)

**C1. Ambient hero loop (20–30s, seamless)** — behind a small sound toggle in the header, default OFF (auto-playing audio is a jury killer; opt-in only).
> Deep cinematic ambient drone: a warm analog synth pad in a low minor key, slow evolving texture with soft sub-bass pulses like a distant heartbeat, occasional delicate granular shimmer like dust in a light beam, no melody, no percussion, restrained, premium, seamless loop, -18 LUFS integrated, designed to sit quietly under a visual experience.

**C2. Voiceover for the social demo video (optional)** — short script read over B2: who Tolu is, what the site proves, built with AdaL.

---

## 3. Generation workflow & next steps

1. **DESIGN.md** — write the design contract first (inspo reference specs remixed).
2. **Build core site** — index/styles/script rewrite + constellation hero (threeui-derived).
3. **Generate A-assets** (AdaL `generate_image`, nano-banana-2, 2K) → save to `tolu-portfolio/assets/` → wire into cards/OG/favicon.
4. **Generate B1** (AdaL video, Veo) → embed as cinematic hero variant.
5. **Verify** — browser screenshot matrix (1440/1920/390) → evaluator adversarial pass → fix rounds.
6. **Record B2** social demo video (screen capture + B1 + optional C2 voiceover) via AdaL video tooling.
7. **Generate C1** ambient loop only if time remains; wire behind an off-by-default toggle.
8. **Package submission** — ZIP of source, screenshot set, live URL, social post (with B2 video, tags AdaL), build summary — per the hackathon doc's checklist.
9. **Push** to `ToXMon/tolu-portfolio` main → GitHub Pages live.

### Fallbacks / priorities (deadline is tomorrow 11:59 PM PT)
- Must-ship: core site + A1 OG image + A3–A5 thumbnails + verification + submission package.
- Time-permitting: B1 hero loop, B2 demo video (high value for the social post requirement — prioritize over audio).
- Cut-first: C1 audio, C2 voiceover.
