# ToluOS — Tolu Shekoni's Workstation

Dark cinematic editorial single-page portfolio rendered as a **desktop OS metaphor**. Each project opens in a draggable, resizable window with full chrome. Built with AdaL (engineer mode), inspired by [dustinbrett.com (daedalOS)](https://dustinbrett.com/) and the [AdaL bootcamp resources page](https://sylphai-inc.github.io/adal-bootcamp-landing-page/slides/04-resources.html).

**Live:** https://toxmon.github.io/tolu-portfolio/

## What's here

- **Desktop metaphor**: 4 top-level tiles (Welcome, Projects folder, Résumé, Music) + draggable/resizable windows + taskbar + Now Playing widget + Quick Links + Launchpad (F4).
- **8 portfolio projects** open from a Finder-style Projects folder (Cmd+P). Power users still reach each directly via Cmd+1..9.
- **Résumé app** renders the full `.docx` inline — extracted to `assets/docs/resume.json` at build time via `node scripts/resume-extract.mjs` (vanilla node, no deps). Download link in the footer.
- **Music player** (Cmd+M or click the large Music tile) — Audius public REST, no auth. Trending + search + 9 genre chips + prev/next + AudioContext beat pulse.
- **Focal-point constellation canvas** with 6 spokes × 6 clusters × 9 secondary nodes each.
- **6-layer wallpaper**: gradient + topographic texture (A7) + constellation + warm glow + cool glow + grain.
- **Per-project domain accents**: Stripe (glacier blue), SignalForge (mint), Vouch (amber-hot), Crypto Scanner (amber-hot), X Monitor (blue-grey), AgentTrust (deep-amber), Memory Palace (violet), Agent Skills (cyan).
- **Welcome window**: stagger word-entrance, proof strip, 4 CTA buttons, 3 tabs (8 Projects · Receipts · Build process).
- **CSS/SVG banner cards** replace the AI-cinematic stills for Crypto Scanner, Agent Skills, and SignalForge (404 honesty card).
- **Mobile**: tabbed single-window interface, 8 mobile tabs above hidden taskbar.
- **Keyboard shortcuts**: `Cmd+W` close, `Cmd+M` minimize, `Cmd+0` Welcome, `Cmd+P` Projects folder, `Cmd+1..9` projects, `F4` Launchpad, `Space` play/pause Music, `?` show overlay.
- **Layout persistence**: window positions/sizes saved to `localStorage`.
- **No-JS fallback**: `<noscript>` banner + `.fallback-scroll` static section.
- **Reduced-motion**: all animations collapse to 0.01 ms; canvas skipped entirely.
- **Vendored Three.js** (`vendor/three.min.js`, r149 UMD, 594 KB) per `EXECUTE.md` Stage 0 — present and ready for a future 3D parallax variant.

## Local preview

```bash
cd tolu-portfolio
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy to GitHub Pages

1. Push to a public repo (default: `tolu-portfolio`).
2. **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
3. Live at `https://<your-username>.github.io/tolu-portfolio/`.

## File layout

```
index.html                # single-page document with desktop skeleton + fallback scroll + Now Playing widget + Quick Links + Launchpad
styles.css                # toluOS chrome (windows, taskbar, mobile tabs, 6-layer wallpaper) + banner cards + folder grid + résumé doc + music body + widgets + launchpad
script.js                 # window manager + drag/resize + keyboard + mobile + focal-point constellation + Projects folder + Résumé renderer + MusicApp + banner cards + Now Playing widget + Quick Links + Launchpad
DESIGN.md                 # original design contract (palette/type/motion)
docs/adal/design-spec-os.md # toluOS extension of DESIGN.md
vendor/three.min.js       # vendored r149 UMD
assets/img/projects/      # portfolio banners + thumbs (8 projects, moved from shots/ in Round 11)
assets/docs/              # Tolu_Shekoni_Resume.docx + generated resume.json
docs/adal/                # EXECUTE.md, build-and-asset-plan.md, EVALUATE.md, builder-plan.md, etc.
scripts/                  # check.sh (28 mechanical checks), browser-matrix.mjs, browser-edge.mjs, browser-probes.mjs, resume-extract.mjs
SUBMISSION.md             # build summary, asset inventory, social-post draft
```

## Validation

```bash
python3 -m http.server 8080
bash scripts/check.sh
node scripts/browser-matrix.mjs
node scripts/browser-edge.mjs
```

Latest results in `docs/adal/checks-latest.txt`, `docs/adal/assets/console.txt`, `docs/adal/assets/edge-cases.txt`.

## Customization

- **Email / X / GitHub**: search-and-replace across `index.html`, `script.js`.
- **Project list**: edit the `PROJECTS` array in `script.js`.
- **Palette / type / motion**: edit tokens in `:root` of `styles.css` (see `DESIGN.md`).
- **Window chrome / taskbar**: edit `.window` / `.taskbar` rules in `styles.css`.

## Known gaps

- **C1 ambient audio not generated** — AdaL audio capability not available in this session. Sound toggle is wired but does not play.
- **B1 hero video not generated** — AdaL video capability not available. Constellation canvas is the only motion element.
- **B2 demo video not generated** — same reason.
- **A3–A5 thumbnails** — 3 SVG placeholders (kept from Round 2) used in place of AI-generated cinematic stills because parallel `generate_image` calls were preempted.
