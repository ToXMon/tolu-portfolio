# Tolu Shekoni — Portfolio Landing Page

A visually polished, GitHub-hostable single-page portfolio.

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

- Change email: `index.html` search `hello@tolushekoni.com`
- Change GitHub link: `index.html` search `https://github.com/`
- Update wording in Hero/About/Work sections in `index.html`
- Color palette: edit CSS variables in `styles.css` under `:root`
