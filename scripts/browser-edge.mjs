// browser-edge.mjs — Edge-case browser matrix per EVALUATE.md V-5..V-7, V-9
// V-9 uses FRESH locators each iteration (Round-8 blocker B-R8-1: stale
// ElementHandles crashed 3/3 runs when syncMobileTabs rebuilt #mobile-tabs).

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
log.push('# Edge-case browser matrix — EVALUATE.md V-5..V-7 + V-9 mobile');
log.push(`Date: ${new Date().toISOString()}`);
log.push('');

// =============================================================
// V-9: Mobile 390px — verify every project window opens, is fully
// contained, and is usable. Fresh context (no localStorage) = cold load.
// Round-9: re-query .mobile-tab locators EVERY iteration (no stale
// handles), close windows via the app's own toluOS API (no DOM surgery).
// =============================================================
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    userAgent: 'Mozilla/5.0 PortfolioMobileV9'
  });
  const page = await ctx.newPage();
  const pageerrors = [];
  page.on('pageerror', e => pageerrors.push(e.message));
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500);

  const tabCount = await page.locator('.mobile-tab').count();
  if (tabCount < 2) {
    throw new Error('V-9 FAIL: no mobile tabs rendered');
  }
  const tabLabels = [];
  for (let i = 0; i < tabCount; i++) {
    tabLabels.push(await page.locator('.mobile-tab').nth(i).textContent());
  }
  log.push(`## V-9 mobile @ 390 (fresh context) — ${tabCount} tabs (Welcome + ${tabCount - 1} projects)`);

  const results = [];
  let allPassed = true;
  for (let i = 1; i < tabCount; i++) {
    // Close all open windows via the app's own API (keeps state consistent)
    await page.evaluate(() => {
      const ids = window.toluOS ? window.toluOS.windows() : [];
      ids.forEach(id => window.toluOS.closeWindow(id));
    });
    await page.waitForTimeout(350);  // let close animations finish
    // FRESH locator each iteration — the tab strip may have been re-rendered
    await page.locator('.mobile-tab').nth(i).click();
    await page.waitForTimeout(450);
    const r = await page.evaluate((label) => {
      const wins = Array.from(document.querySelectorAll('.window'));
      const visible = wins.filter(w => {
        if (!w.classList.contains('mobile-visible')) return false;
        const rect = w.getBoundingClientRect();
        const style = getComputedStyle(w);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        return rect.width > 100 && rect.height > 100;
      });
      const v = visible[0];
      if (!v) return { exists: false, tab: label };
      const rect = v.getBoundingClientRect();
      const titleEl = v.querySelector('.window-title-name');
      return {
        exists: true,
        tab: label,
        title: titleEl ? titleEl.textContent.trim() : null,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        x: rect.x, right: rect.right, top: rect.top, bottom: rect.bottom,
        fullyInsideViewportX: rect.x >= 0 && rect.right <= window.innerWidth,
        fullyInsideViewportY: rect.top >= 0 && rect.bottom <= window.innerHeight,
        horizOverflow: document.documentElement.scrollWidth > window.innerWidth,
        hasTitle: !!(titleEl && titleEl.textContent.trim().length > 0)
      };
    }, tabLabels[i].trim());
    const passed = r.exists && r.title && r.hasTitle && r.fullyInsideViewportX && r.fullyInsideViewportY && !r.horizOverflow;
    if (!passed) allPassed = false;
    results.push(r);
  }

  // Clean up windows via the API, then open one tab for the capture
  await page.evaluate(() => {
    window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id));
  });
  await page.waitForTimeout(400);
  await page.locator('.mobile-tab').nth(1).click();
  await page.waitForTimeout(500);
  const f = await shoot(page, 'v9-mobile-390.png');

  results.forEach(r => {
    log.push(`  tab "${r.tab}": passed=${r.exists && r.title && r.hasTitle && r.fullyInsideViewportX && r.fullyInsideViewportY && !r.horizOverflow}  title="${r.title || 'MISSING'}"  x=${(r.x || 0).toFixed(0)}..${(r.right || 0).toFixed(0)} (vp=${r.viewportWidth})  insideX=${r.fullyInsideViewportX}  insideY=${r.fullyInsideViewportY}  horizOverflow=${r.horizOverflow}  hasTitle=${r.hasTitle}`);
  });
  log.push(`  pageerrors: ${pageerrors.length}${pageerrors.length ? ' → ' + pageerrors.join('; ').slice(0, 200) : ''}`);
  log.push(`  saved: ${f}`);
  if (!allPassed) {
    log.push('  FAIL: one or more project tabs did not open a usable window');
    throw new Error('V-9 mobile health gate FAILED: some tabs not visible/usable');
  }
  log.push('  PASS: all project tabs open contained, titled, visible windows');
  log.push('');
  await ctx.close();
}

// =============================================================
// V-9b: Receipts terminal-state gate (Round-8 blocker B-R8-2 / D2)
// Open the Receipts tab, then assert every row reaches a terminal state
// (reachable / unreachable / timeout / blocked) within 12 s. Zero "queued".
// =============================================================
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 PortfolioReceiptsV9b'
  });
  const page = await ctx.newPage();
  const pageerrors = [];
  page.on('pageerror', e => pageerrors.push(e.message));
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(800);

  // Click the Receipts tab inside the (auto-opened) Welcome window
  await page.locator('.welcome-tab[data-tab="receipts"]').click();
  // Wait up to 12 s for all rows to reach a terminal state
  const deadline = Date.now() + 12000;
  let rows = [];
  while (Date.now() < deadline) {
    rows = await page.evaluate(() => Array.from(document.querySelectorAll('#receipt-rows tr')).map(tr => {
      const cells = tr.querySelectorAll('td');
      return {
        url: tr.dataset.url,
        status: cells[2] ? cells[2].textContent.trim() : '(no cell)'
      };
    }));
    const nonTerminal = rows.filter(r => /queued|probing/.test(r.status));
    if (rows.length > 0 && nonTerminal.length === 0) break;
    await page.waitForTimeout(500);
  }
  const nonTerminal = rows.filter(r => /queued|probing/.test(r.status));
  const reachable = rows.filter(r => r.status.startsWith('reachable')).length;
  log.push(`## V-9b receipts terminal-state @ 1440`);
  log.push(`  rows: ${rows.length}  reachable: ${reachable}  nonTerminal: ${nonTerminal.length}`);
  nonTerminal.forEach(r => log.push(`    STUCK: ${r.url} → "${r.status}"`));
  log.push(`  pageerrors: ${pageerrors.length}`);
  if (nonTerminal.length > 0 || rows.length < 10) {
    throw new Error(`V-9b FAIL: ${nonTerminal.length} non-terminal receipt rows (of ${rows.length})`);
  }
  log.push('  PASS: every receipts row reached a terminal measured state');
  log.push('');
  await ctx.close();
}

// =============================================================
// V-6: No-JS
// =============================================================
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('V-6 pageerror:', e.message));
  const resp = await page.goto('http://localhost:8080/', { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(500);
  const f = await shoot(page, 'v6-nojs-1440.png');
  const m = await measureOverflow(page);
  const fallback = await page.evaluate(() => {
    const el = document.querySelector('.fallback-scroll');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { exists: true, w: r.width, h: r.height, projectLinks: el.querySelectorAll('.fallback-projects a').length };
  });
  log.push(`## V-6 no-JS @ 1440 — HTTP ${resp.status()}`);
  log.push(`  saved: ${f}`);
  log.push(`  documentElement.scrollWidth = ${m.docW}  window.innerWidth = ${m.winW}  horizScroll = ${m.horizScroll}`);
  log.push(`  fallback-scroll: ${JSON.stringify(fallback)}`);
  if (!fallback || !fallback.exists || fallback.projectLinks < 8) {
    log.push(`  WARN: fallback-scroll missing or has < 8 project links — V-6 incomplete`);
  }
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
  page.on('pageerror', e => console.error('V-5 pageerror:', e.message));
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(800);
  const f = await shoot(page, 'v5-reducedmotion-1440.png');
  const m = await measureOverflow(page);
  const desktop = await page.evaluate(() => ({
    icons: document.querySelectorAll('.desktop-icon').length,
    windows: document.querySelectorAll('.window').length,
    heroRenderer: !!(window.toluOS && window.toluOS.heroStats && window.toluOS.heroStats.renderer),
    heroParticles: window.toluOS && window.toluOS.heroStats ? window.toluOS.heroStats.particles : 0,
    canvasFrames: !!(window.toluOS && window.toluOS.heroStats && window.toluOS.heroStats.renderer === '2d-fallback')
  }));
  log.push(`## V-5 reduced-motion @ 1440`);
  log.push(`  saved: ${f}`);
  log.push(`  documentElement.scrollWidth = ${m.docW}  horizScroll = ${m.horizScroll}`);
  log.push(`  icons = ${desktop.icons}  windows = ${desktop.windows}  renderer = ${desktop.heroRenderer} (2d-fallback expected under RM)`);
  if (desktop.icons < 8 || desktop.windows < 1) {
    log.push(`  WARN: reduced-motion broke desktop metaphor`);
  }
  log.push('');
  await ctx.close();
}

// =============================================================
// V-7: subpath deploy — emulate GitHub-Pages project subpath
// =============================================================
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await ctx.newPage();

  const { spawn } = await import('child_process');
  const tmpRoot = '/tmp/tolu-subpath-test';
  const subpath = '/tolu-portfolio';
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmpRoot, subpath.slice(1)), { recursive: true });
  const { execSync } = await import('child_process');
  execSync(
    `rsync -a --exclude='.git' --exclude='node_modules' --exclude='submission.zip' --exclude='package-lock.json' ` +
    `${ROOT}/ ${tmpRoot}${subpath}/`
  );

  const subPort = 8090;
  const subServer = spawn('python3', ['-m', 'http.server', String(subPort), '--bind', '127.0.0.1', '--directory', tmpRoot], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
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
  const desktop = await page.evaluate(() => ({
    icons: document.querySelectorAll('.desktop-icon').length,
    windows: document.querySelectorAll('.window').length,
    dock: document.querySelectorAll('.dock-item').length
  }));
  log.push(`## V-7 subpath deploy @ 1440 — HTTP ${resp.status()}`);
  log.push(`  served from: ${tmpRoot}${subpath}/  on http://localhost:${subPort}${subpath}/`);
  log.push(`  saved: ${f}`);
  log.push(`  documentElement.scrollWidth = ${m.docW}  horizScroll = ${m.horizScroll}`);
  log.push(`  icons = ${desktop.icons}  windows = ${desktop.windows}  dock = ${desktop.dock}`);
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