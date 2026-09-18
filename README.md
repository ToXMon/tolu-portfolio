# Tolu Shekoni — Portfolio Landing Page

A visually polished, GitHub-hostable single-page portfolio with a live GitHub metadata project showcase.

## What changed in V2

- Added a dynamic **Featured Repositories** section.
- Portfolio now fetches live metadata from GitHub API for selected repos:
  - `wijnaldum-eth/memevault`
  - `wijnaldum-eth/Zero2Production`
  - `tolu-jnj/DOT`
  - `tolu-jnj/allornothing`
  - `ToXMon/quickchops`
  - `ToXMon/Tier`
- On API failure/rate limits, page falls back to curated local card data.

## Contribution Map

| Source Account | Repo | Focus Area | Contribution Narrative |
|---|---|---|---|
| wijnaldum-eth | memevault | Hackathon / Web3 | Rapid onchain product experimentation and UX iteration |
| wijnaldum-eth | Zero2Production | Systems / Backend | Production-oriented implementation and architecture growth |
| tolu-jnj | DOT | Utility / Data | Practical utility build with disciplined execution |
| tolu-jnj | allornothing | Hackathon / Full Stack | Constraint-driven shipping and end-to-end delivery |
| ToXMon | quickchops | Product Experiment | Fast product iteration with clean UX focus |
| ToXMon | Tier | Systems / Automation | Structured system design and repeatable build patterns |

## Local preview

Open `index.html` directly in your browser, or run:

```bash
cd tolu-portfolio
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a repo (example: `tolu-portfolio`).
2. Push these files to the repo root.
3. In GitHub: **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main** (root)
5. Save.
6. Your site will be live at:
   - `https://<your-username>.github.io/tolu-portfolio/`

## Quick customization

- Change email: search `tolu.a.shekoni@gmail.com` across `index.html`, `script.js`, `footer`
- Change GitHub link: search `https://github.com/ToXMon` across `index.html`, `script.js`
- Update project list: edit the `portfolioProjects` array in `script.js`
- Color palette: edit CSS variables in `styles.css` under `:root` (see `DESIGN.md` for the token contract)

## Design contract

See [`DESIGN.md`](./DESIGN.md) for the full design contract — palette, type ramp, section order, motion primitives, craft details. The validation suite at `scripts/check.sh` enforces it.

## Validation

```bash
python3 -m http.server 8080      # local preview
bash scripts/check.sh            # full validation suite (T-1..T-12 + L-1..L-9)
```
