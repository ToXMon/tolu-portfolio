// browser-matrix.mjs — Playwright capture script
// Captures the full-page screenshot at each target viewport AND console/network errors
// Emulates prefers-reduced-motion so the .reveal CSS anims don't leave sections at opacity 0
// in the stitched full-page screenshot.

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs/adal/assets');
const URL_BASE = 'http://localhost:8080';

const VIEWPORTS = [
  { name: '1440-home', width: 1440, height: 900 },
  { name: '1920-home', width: 1920, height: 1080 },
  { name: '390-home',  width: 390,  height: 844 },
  { name: '320-home',  width: 320,  height: 568 }
];

const browser = await chromium.launch();
const allConsole = [];
const allNetwork = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce', // forces .reveal -> opacity:1 instantly (default matrix)
    userAgent: 'Mozilla/5.0 PortfolioBrowserMatrix'
  });
  const page = await ctx.newPage();

  const consoleMsgs = [];
  const networkErrors = [];

  page.on('console', (msg) => {
    consoleMsgs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  page.on('pageerror', (err) => {
    consoleMsgs.push({ type: 'pageerror', text: err.message });
  });
  page.on('requestfailed', (req) => {
    networkErrors.push({
      url: req.url(),
      failure: req.failure()?.errorText || 'unknown'
    });
  });
  page.on('response', (res) => {
    const s = res.status();
    if (s >= 400) {
      networkErrors.push({ url: res.url(), status: s });
    }
  });

  await page.goto(URL_BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });
  // Reduced-motion CSS makes .reveal opacity 1 instantly; give layout 500ms to settle.
  await page.waitForTimeout(500);
  // Scroll through to trigger any IntersectionObserver-driven animations
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 60);
    });
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const file = path.join(OUT_DIR, `${vp.name}.png`);
  await page.screenshot({ path: file, fullPage: true });

  // Measure overflow safety
  const overflow = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
    horizScroll: document.documentElement.scrollWidth > window.innerWidth
  }));

  console.log(`[${vp.name}] saved → ${path.relative(ROOT, file)}  ` +
              `viewport=${vp.width}x${vp.height}  ` +
              `docW=${overflow.docW}  ` +
              `horizScroll=${overflow.horizScroll}  ` +
              `console=${consoleMsgs.length}  ` +
              `netErrs=${networkErrors.length}`);

  allConsole.push({ viewport: vp.name, messages: consoleMsgs });
  allNetwork.push({ viewport: vp.name, errors: networkErrors });

  await ctx.close();
}

// Bonus: one normal-motion full-page capture at desktop width so the matrix shows
// the constellation canvas animating (reduced-motion hides it). This is the "live hero"
// evidence per evaluator N9.
//
// N10 fix: the site's `html { scroll-behavior: smooth }` CSS causes `window.scrollBy`
// calls to lag behind target scrollY during the staged scroll loop — IntersectionObservers
// fire late, the stitched full-page screenshot freezes unfired `.reveal` sections at
// opacity:0 (giving the captured image a 70-80 % black void below the fold). The fix
// is to override scroll-behavior to 'auto' (instant) before any scroll runs in this
// capture context. Site behavior is unchanged — we only mutate the test page.
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference', // NORMAL motion — canvas animates, reveal triggers via IO
    userAgent: 'Mozilla/5.0 PortfolioBrowserMatrix'
  });

  // Inject before any page script runs: instant scroll + disable smooth interpolation
  await ctx.addInitScript(() => {
    const apply = () => {
      try { document.documentElement.style.scrollBehavior = 'auto'; } catch (_) {}
      try { document.body && (document.body.style.scrollBehavior = 'auto'); } catch (_) {}
    };
    // Apply as soon as documentElement exists, and again on DOMContentLoaded
    apply();
    document.addEventListener('DOMContentLoaded', apply);
  });

  const page = await ctx.newPage();

  const consoleMsgs = [];
  const networkErrors = [];

  page.on('console', (msg) => {
    consoleMsgs.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (err) => {
    consoleMsgs.push({ type: 'pageerror', text: err.message });
  });
  page.on('response', (res) => {
    if (res.status() >= 400) networkErrors.push({ url: res.url(), status: res.status() });
  });

  await page.goto(URL_BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });
  // Wait for fonts + initial paint
  await page.waitForTimeout(800);

  // Re-apply override (CSS may have re-set it after addInitScript ran)
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
  });

  // Scroll through once to trigger every IntersectionObserver — reveals settle to opacity:1.
  //
  // Why this is tricky: script.js uses a per-sibling stagger — each reveal adds `.visible`
  // via `setTimeout(..., idx * 100ms)`, so the LAST reveal can lag ~22*100 = 2200ms after
  // its IO callback fires. We need to (1) trigger every IO by scrolling through every
  // section, (2) wait long enough for all stagger timeouts to complete, (3) verify via
  // getComputedStyle that opacity is actually 1 before screenshotting.
  const scrollReport = await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    let pos = 0;
    while (pos < total) {
      window.scrollTo(0, pos);
      // IO fires async after scroll; 80ms is enough for the observer to register intersection
      await new Promise((r) => setTimeout(r, 80));
      pos += step;
    }
    // Final pass — scroll to bottom and to top so every section has been "intersected"
    window.scrollTo(0, total);
    await new Promise((r) => setTimeout(r, 200));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 100));
    return { scrolledTo: total, totalReveals: document.querySelectorAll('.reveal').length };
  });

  // Wait for the worst-case stagger window: 22 reveals × 100 ms = 2200 ms, plus 600 ms
  // transition time. Total = ~2.8 s. Round up to 3 s for safety.
  await page.waitForTimeout(3000);

  // Re-check after waiting
  const finalReport = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('.reveal'));
    const firedReveals = all.filter((el) => getComputedStyle(el).opacity === '1').length;
    return { totalReveals: all.length, firedReveals };
  });
  const merged = { ...scrollReport, ...finalReport };

  const file = path.join(OUT_DIR, '1440-home-normal-motion.png');
  await page.screenshot({ path: file, fullPage: true });

  console.log(`[1440-home-normal-motion] saved → ${path.relative(ROOT, file)}  ` +
              `viewport=1440x900  ` +
              `console=${consoleMsgs.length}  ` +
              `netErrs=${networkErrors.length}  ` +
              `reveals=${merged.firedReveals}/${merged.totalReveals} fired`);

  allConsole.push({ viewport: '1440-home-normal-motion', messages: consoleMsgs });
  allNetwork.push({ viewport: '1440-home-normal-motion', errors: networkErrors });

  // Hard assertion: N10 health gate — if not all reveals fired, the capture is broken
  // (the normal-motion screenshot would be 70-80 % black void). Fail the script so the
  // capture never silently ships a defective image.
  if (merged.firedReveals < merged.totalReveals) {
    const msg = `N10 health gate FAILED: only ${merged.firedReveals}/${merged.totalReveals} .reveal elements fired in normal-motion capture. ` +
                `The site has ${merged.totalReveals - merged.firedReveals} hidden sections — the screenshot is defective. ` +
                `Refusing to ship.`;
    console.error(msg);
    throw new Error(msg);
  }

  await ctx.close();
}

await browser.close();

// Write console log
const consoleLines = [];
consoleLines.push('# Console messages + network errors — browser-matrix run');
consoleLines.push(`Date: ${new Date().toISOString()}`);
consoleLines.push(`URL: ${URL_BASE}/`);
consoleLines.push('');
for (const v of allConsole) {
  consoleLines.push(`## ${v.viewport}`);
  if (!v.messages.length) {
    consoleLines.push('(no console messages)');
  }
  for (const m of v.messages) {
    consoleLines.push(`  [${m.type}] ${m.text}${m.location ? ' @' + JSON.stringify(m.location) : ''}`);
  }
  consoleLines.push('');
}
consoleLines.push('');
consoleLines.push('# Network errors (4xx/5xx + request failures)');
for (const v of allNetwork) {
  consoleLines.push(`## ${v.viewport}`);
  if (!v.errors.length) {
    consoleLines.push('(no network errors)');
  }
  for (const e of v.errors) {
    if (e.status) consoleLines.push(`  HTTP ${e.status}  ${e.url}`);
    else          consoleLines.push(`  FAIL  ${e.url}  (${e.failure})`);
  }
  consoleLines.push('');
}

const consoleFile = path.join(OUT_DIR, 'console.txt');
fs.writeFileSync(consoleFile, consoleLines.join('\n'));
console.log(`\nConsole log written to ${path.relative(ROOT, consoleFile)}`);

// Summarize exit code
const totalConsoleErrors = allConsole.reduce((s, v) =>
  s + v.messages.filter((m) => m.type === 'error' || m.type === 'pageerror').length, 0);
const totalNetErrors = allNetwork.reduce((s, v) => s + v.errors.length, 0);
console.log(`\nTOTAL: console errors = ${totalConsoleErrors}, network errors = ${totalNetErrors}`);
process.exit((totalConsoleErrors + totalNetErrors) > 0 ? 1 : 0);
