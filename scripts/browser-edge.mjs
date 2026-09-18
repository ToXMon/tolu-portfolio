// browser-edge.mjs — Edge-case browser matrix per EVALUATE.md V-5..V-7
// Tests reduced-motion (already covered in browser-matrix.mjs), no-JS, and subpath deploy.

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs/adal/assets');

async function shoot(page, name) {
  const file = path.join(OUT_DIR, name);
  await page.screenshot({ path: file, fullPage: true });
  return path.relative(ROOT, file);
}

async function measureOverflow(page) {
  return await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
    horizScroll: document.documentElement.scrollWidth > window.innerWidth,
    cards: document.querySelectorAll('.work-card').length
  }));
}

const browser = await chromium.launch();
const log = [];
log.push('# Edge-case browser matrix — EVALUATE.md V-5..V-7');
log.push(`Date: ${new Date().toISOString()}`);
log.push('');

// =============================================================
// V-6: No-JS
// =============================================================
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false
  });
  const page = await ctx.newPage();
  const resp = await page.goto('http://localhost:8080/', { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(500);
  const f = await shoot(page, 'v6-nojs-1440.png');
  const m = await measureOverflow(page);
  log.push(`## V-6 no-JS @ 1440 — HTTP ${resp.status()}`);
  log.push(`  saved: ${f}`);
  log.push(`  documentElement.scrollWidth = ${m.docW}  window.innerWidth = ${m.winW}  horizScroll = ${m.horizScroll}`);
  log.push(`  static fallback .work-card count = ${m.cards}`);
  log.push('');
  await ctx.close();
}

// =============================================================
// V-5: prefers-reduced-motion (separate, larger viewport)
// =============================================================
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(800);
  const f = await shoot(page, 'v5-reducedmotion-1440.png');
  const m = await measureOverflow(page);
  log.push(`## V-5 reduced-motion @ 1440`);
  log.push(`  saved: ${f}`);
  log.push(`  documentElement.scrollWidth = ${m.docW}  horizScroll = ${m.horizScroll}`);
  log.push(`  cards = ${m.cards}`);
  log.push('');
  await ctx.close();
}

// =============================================================
// V-7: subpath deploy — emulate GitHub-Pages project subpath
// =============================================================
{
  // The repo serves as the subpath itself. To emulate, we test asset resolution under /tolu-portfolio/
  // We serve a wrapped directory: mkdir -p /tmp/subpath-test/tolu-portfolio
  // cp -r the repo into /tmp/subpath-test/tolu-portfolio and serve /tmp/subpath-test on :8081
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await ctx.newPage();

  // First, check relative-path resilience by loading from a subpath via symlink.
  // Simpler: spawn a subpath server in the background.
  const { spawn } = await import('child_process');
  const tmpRoot = '/tmp/tolu-subpath-test';
  const subpath = '/tolu-portfolio';
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmpRoot, subpath.slice(1)), { recursive: true });
  // Copy repo contents (no .git, no node_modules, no submission.zip)
  const { execSync } = await import('child_process');
  execSync(
    `rsync -a --exclude='.git' --exclude='node_modules' --exclude='submission.zip' --exclude='package-lock.json' ` +
    `${ROOT}/ ${tmpRoot}${subpath}/`
  );

  const subPort = 8090;
  const subServer = spawn('python3', ['-m', 'http.server', String(subPort), '--bind', '127.0.0.1', '--directory', tmpRoot], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  // Wait for the server to be reachable (up to 10s)
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`http://localhost:${subPort}/tolu-portfolio/`);
      if (r.ok) { ready = true; break; }
    } catch (_) { /* not ready */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!ready) {
    log.push(`  subpath server never became reachable; aborting V-7`);
    subServer.kill();
    await ctx.close();
  } else {

  const networkErrors = [];
  page.on('response', (res) => {
    if (res.status() >= 400) networkErrors.push({ url: res.url(), status: res.status() });
  });
  page.on('requestfailed', (req) => networkErrors.push({ url: req.url(), failure: req.failure()?.errorText }));

  const resp = await page.goto(`http://localhost:${subPort}${subpath}/`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(800);
  const f = await shoot(page, 'v7-subpath-1440.png');
  const m = await measureOverflow(page);
  log.push(`## V-7 subpath deploy @ 1440 — HTTP ${resp.status()}`);
  log.push(`  served from: ${tmpRoot}${subpath}/  on http://localhost:${subPort}${subpath}/`);
  log.push(`  saved: ${f}`);
  log.push(`  documentElement.scrollWidth = ${m.docW}  horizScroll = ${m.horizScroll}`);
  log.push(`  cards = ${m.cards}`);
  log.push(`  network errors: ${networkErrors.length}`);
  for (const e of networkErrors.slice(0, 10)) {
    log.push(`    - ${e.status || e.failure}  ${e.url}`);
  }
  log.push('');

  await ctx.close();
  subServer.kill();
  } // end of else (ready)
}

await browser.close();

const out = path.join(OUT_DIR, 'edge-cases.txt');
fs.writeFileSync(out, log.join('\n'));
console.log(log.join('\n'));
console.log(`\nEdge-case report: ${path.relative(ROOT, out)}`);
