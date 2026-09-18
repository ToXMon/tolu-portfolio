# Tolu Shekoni — Portfolio

Dark cinematic editorial single-page portfolio, vanilla HTML/CSS/JS, vendored Three.js,
zero build step, GitHub-Pages ready. Built with AdaL.

**Live:** https://toxmon.github.io/tolu-portfolio/

## What's here

- Hero with mouse-reactive particle-constellation canvas (2D, vanilla).
- Proof-first work grid: 8 real projects with live demo / repo / docs / X-proof / health-endpoint links.
- Built-with-AdaL meta-section (prompts used, before/after, build log).
- Full accessibility: skip link, prefers-reduced-motion (CSS + JS), no-JS fallback,
  keyboard-navigable, semantic landmarks.
- Mobile-first responsive, 320px overflow-safe.

## Local preview

The constellation canvas + module-style fetches need `http://` (not `file://`):

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
index.html              # single-page document
styles.css              # one :root block, all var(--…) resolve, single easing
script.js               # constellation canvas + reveal observer + magnetic CTA + cursor
DESIGN.md               # design contract (palette, type, motion, craft)
vendor/three.min.js     # vendored r149 UMD, no CDN at runtime
assets/img/             # og.png, favicon*, hero-backdrop.png, project-{stripe,vouch,signalforge}.svg
docs/adal/              # EXECUTE.md, build-and-asset-plan.md, EVALUATE.md, builder-plan.md
scripts/                # check.sh (21 mechanical checks), browser-matrix.mjs, browser-edge.mjs
SUBMISSION.md           # build summary, asset inventory, social-post draft
```

## Customization

- **Email / X / GitHub**: search-and-replace across `index.html`, `script.js`, footer.
- **Project list**: edit the `portfolioProjects` array in `script.js`.
- **Palette / type / motion**: edit tokens in `:root` of `styles.css` (see `DESIGN.md`).
- **Constellation physics**: edit `initConstellation()` in `script.js`.

## Validation

```bash
python3 -m http.server 8080   # serve
bash scripts/check.sh         # full mechanical suite (T-1..T-12 + L-1..L-9)
node scripts/browser-matrix.mjs   # 4-viewport Playwright screenshot + console capture
node scripts/browser-edge.mjs     # V-5/6/7 edge-case browser matrix
```

Latest run results in `docs/adal/checks-latest.txt`, `docs/adal/assets/console.txt`,
`docs/adal/assets/edge-cases.txt`.

## Built with AdaL

See the on-page "Built with AdaL" section (`#built-with-adal`) and `SUBMISSION.md` for
the full receipts — design contract, asset prompts, build log, social-post draft.
