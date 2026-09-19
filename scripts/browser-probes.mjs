// browser-probes.mjs — Round-9 interaction probes (rYOS grammar, independently implemented)
// Covers: launch-origin animation, multi-instance windows, z-order/focus, edge snap
// (+ pre-snap restore), dock magnification/running indicators, app-following menubar,
// versioned layout persistence + v1 migration, mobile swipe-cycling, 44px targets,
// window-manager regressions (drag/resize/min/max/Esc), and perf budget.
// Exit 0 = all probes PASS.

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs/adal/assets');
const BASE = 'http://localhost:8080';

const browser = await chromium.launch();
const results = [];
const shots = [];

function pass(name, detail) { results.push({ name, ok: true, detail }); console.log(`  PASS ${name} — ${detail}`); }
function fail(name, detail) { results.push({ name, ok: false, detail }); console.log(`  FAIL ${name} — ${detail}`); }

async function newDesktop() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(900);
  return { ctx, page };
}

// ── P1: Launch-origin animation ────────────────────────────
{
  const { ctx, page } = await newDesktop();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // Close welcome first for a clean state
  await page.evaluate(() => window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id)));
  await page.waitForTimeout(400);
  const icon = page.locator('.desktop-icon').first();
  const iconRect = await icon.boundingBox();
  await icon.click();
  await page.waitForTimeout(120);
  const origin = await page.evaluate(() => window.toluOS.lastLaunchOrigin());
  await page.waitForTimeout(500);
  if (origin && iconRect &&
      origin.x >= iconRect.x - 2 && origin.x <= iconRect.x + iconRect.width + 2 &&
      origin.y >= iconRect.y - 2 && origin.y <= iconRect.y + iconRect.height + 2) {
    pass('P1 launch-origin', `origin {x:${origin.x.toFixed(0)},y:${origin.y.toFixed(0)}} within icon rect ${iconRect.x.toFixed(0)},${iconRect.y.toFixed(0)} ${iconRect.width.toFixed(0)}×${iconRect.height.toFixed(0)}`);
  } else {
    fail('P1 launch-origin', `origin ${JSON.stringify(origin)} vs icon ${JSON.stringify(iconRect)}`);
  }
  if (errors.length) fail('P1 pageerrors', errors.join('; ')); else pass('P1 pageerrors', '0');
  await ctx.close();
}

// ── P2: Multi-instance windows ─────────────────────────────
{
  const { ctx, page } = await newDesktop();
  await page.evaluate(() => window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id)));
  await page.waitForTimeout(400);
  // Open stripe twice via forceNew
  const a = await page.evaluate(() => window.toluOS.openProjectWindow('stripe', { forceNew: true }) !== null);
  const b = await page.evaluate(() => window.toluOS.openProjectWindow('stripe', { forceNew: true }) !== null);
  const wins = await page.evaluate(() => window.toluOS.windows());
  // Round 11: dock is trimmed to top-level apps only. Multi-instance lives in the
  // windows() Map; the badge lives on the Projects folder dock entry.
  const folderBadge = await page.evaluate(() => {
    const item = document.querySelector('.dock-item[data-dock-id="projects"]');
    return item ? { running: item.classList.contains('running'), badge: item.querySelector('.dock-badge').textContent } : null;
  });
  if (a && b && wins.filter(w => w.startsWith('stripe')).length === 2) {
    pass('P2 multi-instance', `instances: ${wins.filter(w => w.startsWith('stripe')).join(', ')}; projects-folder running=${folderBadge && folderBadge.running} badge="${folderBadge && folderBadge.badge}"`);
  } else {
    fail('P2 multi-instance', `wins=${JSON.stringify(wins)} folderBadge=${JSON.stringify(folderBadge)}`);
  }
  // Third click on the icon focuses (not another instance)
  await page.locator('.desktop-icon').first().click();
  await page.waitForTimeout(300);
  const winsAfter = await page.evaluate(() => window.toluOS.windows());
  if (winsAfter.filter(w => w.startsWith('stripe')).length === 2) {
    pass('P2 icon-refocus', 'third icon click focused existing, no new instance');
  } else {
    fail('P2 icon-refocus', `expected 2 stripe instances, got ${winsAfter.filter(w => w.startsWith('stripe')).length}`);
  }
  await ctx.close();
}

// ── P3: z-order / focus stack ──────────────────────────────
{
  const { ctx, page } = await newDesktop();
  await page.evaluate(() => window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id)));
  await page.waitForTimeout(400);
  await page.evaluate(() => { window.toluOS.openProjectWindow('stripe'); });
  await page.evaluate(() => { window.toluOS.openProjectWindow('vouch'); });
  const focusBefore = await page.evaluate(() => window.toluOS.focused());
  await page.evaluate(() => window.toluOS.focusWindow('stripe'));
  const focusAfter = await page.evaluate(() => window.toluOS.focused());
  const zAfter = await page.evaluate(() => window.toluOS.zOrder());
  const focusedClass = await page.evaluate(() => document.querySelector('.window[data-project="stripe"]').classList.contains('focused'));
  const menubarApp = await page.evaluate(() => document.getElementById('menubar-app').textContent);
  if (focusBefore === 'vouch' && focusAfter === 'stripe' && zAfter[zAfter.length - 1] === 'stripe' && focusedClass && /Stripe/.test(menubarApp)) {
    pass('P3 z-order/focus', `focus ${focusBefore}→${focusAfter}; stack top=${zAfter[zAfter.length - 1]}; menubar="${menubarApp}"`);
  } else {
    fail('P3 z-order/focus', `before=${focusBefore} after=${focusAfter} top=${zAfter[zAfter.length-1]} focusedClass=${focusedClass} menubar=${menubarApp}`);
  }
  await ctx.close();
}

// ── P4: Edge snap + pre-snap restore ───────────────────────
{
  const { ctx, page } = await newDesktop();
  await page.evaluate(() => window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id)));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.toluOS.openProjectWindow('stripe'));
  await page.waitForTimeout(300);
  // Drag to left edge (within 20px)
  const title = page.locator('.window[data-project="stripe"] .window-title');
  const tbox = await title.boundingBox();
  await page.mouse.move(tbox.x + tbox.width / 2, tbox.y + 10);
  await page.mouse.down();
  // move toward left edge, end inside snap zone (<20px from left)
  await page.mouse.move(10, 400, { steps: 12 });
  await page.waitForTimeout(120);
  const previewShown = await page.evaluate(() => {
    const p = document.getElementById('snap-preview');
    return p.classList.contains('active') && p.dataset.zone === 'left';
  });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const snapCheck = await page.evaluate(() => {
    const s = window.toluOS.stateOf('stripe');
    return { state: s, halfW: window.innerWidth / 2 };
  });
  const snapped = snapCheck.state;
  const snapOK = snapped.snapped === 'left' && snapped.x === 0 && Math.abs(snapped.w - snapCheck.halfW) < 2;
  if (previewShown && snapOK) {
    pass('P4 edge-snap', `preview shown; snapped=${snapped.snapped} x=${snapped.x} w=${snapped.w.toFixed(0)} (half=${snapCheck.halfW})`);
  } else {
    fail('P4 edge-snap', `preview=${previewShown} state=${JSON.stringify(snapped)}`);
  }
  // Drag off the snap → pre-snap rect restored
  const tbox2 = await title.boundingBox();
  await page.mouse.move(tbox2.x + 60, tbox2.y + 10);
  await page.mouse.down();
  await page.mouse.move(500, 420, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  const restored = await page.evaluate(() => window.toluOS.stateOf('stripe'));
  if (!restored.snapped && restored.w < snapCheck.halfW - 100) {
    pass('P4 snap-restore', `un-snapped; w restored to ${restored.w.toFixed(0)}px`);
  } else {
    fail('P4 snap-restore', `state=${JSON.stringify(restored)}`);
  }
  await ctx.close();
}

// ── P5: Dock magnification + running indicators ────────────
{
  const { ctx, page } = await newDesktop();
  await page.evaluate(() => window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id)));
  await page.waitForTimeout(400);
  const dock = page.locator('#dock-items');
  const box = await dock.boundingBox();
  // Hover over the first dock item (Round 11: dock trimmed to top-level apps)
  const firstItem = page.locator('.dock-item[data-dock-id="projects"]');
  const ibox = await firstItem.boundingBox();
  await page.mouse.move(ibox.x + ibox.width / 2, ibox.y + ibox.height / 2);
  await page.waitForTimeout(250);
  const scale = await page.evaluate(() => {
    const it = document.querySelector('.dock-item[data-dock-id="projects"]');
    return it.style.transform || '';
  });
  const scaled = /scale\((1\.[2-9]|1\.\d{2,})/.test(scale);
  if (scaled) {
    pass('P5 dock-magnification', `hover transform: "${scale}"`);
  } else {
    fail('P5 dock-magnification', `transform="${scale}"`);
  }
  // Running indicator dot on the Projects folder (any open project counts)
  await page.evaluate(() => window.toluOS.openProjectWindow('vouch'));
  await page.waitForTimeout(300);
  const dot = await page.evaluate(() => {
    const it = document.querySelector('.dock-item[data-dock-id="projects"]');
    return it ? { running: it.classList.contains('running'), dotOpacity: it.querySelector('.dock-dot').style.opacity } : null;
  });
  if (dot && dot.running && dot.dotOpacity === '1') {
    pass('P5 running-indicator', `projects folder dock dot visible (running=${dot.running})`);
  } else {
    fail('P5 running-indicator', JSON.stringify(dot));
  }
  await ctx.close();
}

// ── P6: Versioned layout persistence + v1 migration ────────
{
  // 6a: v2 round-trip
  {
    const { ctx, page } = await newDesktop();
    await page.evaluate(() => window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id)));
    await page.waitForTimeout(300);
    await page.evaluate(() => { window.toluOS.openProjectWindow('stripe'); });
    await page.evaluate(() => window.toluOS.commitSnap(undefined, 'left')); // no-op safety
    // Move via API-free drag is covered in P4; here set state through a drag
    const title = page.locator('.window[data-project="stripe"] .window-title');
    const tbox = await title.boundingBox();
    await page.mouse.move(tbox.x + tbox.width / 2, tbox.y + 10);
    await page.mouse.down();
    await page.mouse.move(tbox.x + 120, tbox.y + 60, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    const savedBefore = await page.evaluate(() => {
      window.toluOS.windows().forEach(id => { if (id !== 'stripe') window.toluOS.closeWindow(id); });
      const raw = localStorage.getItem('toluOS.layout.v2');
      return raw ? JSON.parse(raw) : null;
    });
    await page.waitForTimeout(400);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const after = await page.evaluate(() => {
      // reopen stripe (layout restore applies to open windows)
      window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id));
      window.toluOS.openProjectWindow('stripe');
      return window.toluOS.stateOf('stripe');
    });
    const savedStripe = savedBefore && savedBefore.windows && savedBefore.windows.stripe;
    if (savedBefore && savedBefore.version === 2 && savedStripe && after &&
        Math.abs(after.x - savedStripe.x) < 3 && Math.abs(after.y - savedStripe.y) < 3) {
      pass('P6a layout-v2-roundtrip', `v2 saved {x:${savedStripe.x},y:${savedStripe.y}} → restored {x:${after.x.toFixed(0)},y:${after.y.toFixed(0)}}`);
    } else {
      fail('P6a layout-v2-roundtrip', `saved=${JSON.stringify(savedStripe)} after=${JSON.stringify(after)}`);
    }
    await ctx.close();
  }
  // 6b: v1 → v2 migration
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('toluOS.layout.v1', JSON.stringify({ stripe: { x: 111, y: 121, w: 560, h: 480 } }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const migrated = await page.evaluate(() => {
      const v2 = localStorage.getItem('toluOS.layout.v2');
      const v1Gone = localStorage.getItem('toluOS.layout.v1') === null;
      return { v2: v2 ? JSON.parse(v2) : null, v1Gone };
    });
    if (migrated.v2 && migrated.v2.version === 2 && migrated.v2.windows.stripe &&
        migrated.v2.windows.stripe.x === 111 && migrated.v1Gone) {
      pass('P6b v1-migration', `v1 stripe{x:111} → v2 stripe{x:111} (canonical key); v1 key removed`);
    } else {
      fail('P6b v1-migration', JSON.stringify(migrated));
    }
    await ctx.close();
  }
}

// ── P7: Mobile swipe-cycling + 44px targets ────────────────
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) PortfolioTouch'
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1200);
  // Open two windows via tabs
  await page.locator('.mobile-tab').nth(1).click();  // stripe
  await page.waitForTimeout(400);
  await page.locator('.mobile-tab').nth(3).click();  // vouch
  await page.waitForTimeout(400);
  const focusedBefore = await page.evaluate(() => window.toluOS.focused());
  // Swipe left on the desktop (not in a window body): cycles to next
  await page.touchscreen.tap(200, 100); // ensure focus outside window body? tap top area
  const swipe = await page.evaluate(() => {
    // Synthesize a touch swipe via TouchEvent (Playwright has no direct swipe)
    const target = document.getElementById('desktop');
    const mk = (x, y) => new Touch({ identifier: 1, target, clientX: x, clientY: y });
    target.dispatchEvent(new TouchEvent('touchstart', { touches: [mk(300, 300)], bubbles: true }));
    target.dispatchEvent(new TouchEvent('touchend', { changedTouches: [mk(80, 305)], bubbles: true }));
    return true;
  });
  await page.waitForTimeout(300);
  const focusedAfter = await page.evaluate(() => window.toluOS.focused());
  // Left swipe pages forward: focus moves DOWN the z-stack. With stack
  // [welcome, stripe, vouch] (bottom→top), from vouch the next down is stripe.
  if (swipe && focusedBefore === 'vouch' && focusedAfter === 'stripe') {
    pass('P7 swipe-cycle', `swipe-left: focus ${focusedBefore} → ${focusedAfter} (next down z-stack)`);
  } else {
    fail('P7 swipe-cycle', `before=${focusedBefore} after=${focusedAfter}`);
  }
  // 44px touch targets
  const targetSizes = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.mobile-tab'));
    const rects = tabs.map(t => t.getBoundingClientRect());
    return {
      count: rects.length,
      minHeight: Math.min(...rects.map(r => r.height)),
      allAbove44: rects.every(r => r.height >= 44)
    };
  });
  if (targetSizes.allAbove44 && targetSizes.count >= 9) {
    pass('P7 touch-44px', `${targetSizes.count} tabs, min height ${targetSizes.minHeight.toFixed(0)}px ≥ 44px`);
  } else {
    fail('P7 touch-44px', JSON.stringify(targetSizes));
  }
  // window controls ≥44px
  const ctrl = await page.evaluate(() => {
    const w = document.querySelector('.window.mobile-visible');
    if (!w) return null;
    const c = w.querySelector('.window-control');
    const r = c.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  if (ctrl && ctrl.w >= 44 && ctrl.h >= 44) {
    pass('P7 window-controls-44px', `control ${ctrl.w}×${ctrl.h}`);
  } else {
    fail('P7 window-controls-44px', JSON.stringify(ctrl));
  }
  await ctx.close();
}

// ── P8: Window-manager regressions (R8 §5 preserved) ───────
{
  const { ctx, page } = await newDesktop();
  await page.evaluate(() => window.toluOS.windows().forEach(id => window.toluOS.closeWindow(id)));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.toluOS.openProjectWindow('stripe'));
  await page.waitForTimeout(300);
  // Drag
  const title = page.locator('.window[data-project="stripe"] .window-title');
  const tbox = await title.boundingBox();
  await page.mouse.move(tbox.x + tbox.width / 2, tbox.y + 10);
  await page.mouse.down();
  await page.mouse.move(tbox.x + tbox.width / 2 + 140, tbox.y + 78, { steps: 8 });
  await page.mouse.up();
  const afterDrag = await page.evaluate(() => window.toluOS.stateOf('stripe'));
  // Resize (se handle)
  const se = page.locator('.window[data-project="stripe"] .window-resize.se');
  const sbox = await se.boundingBox();
  await page.mouse.move(sbox.x + 3, sbox.y + 3);
  await page.mouse.down();
  await page.mouse.move(sbox.x + 103, sbox.y + 73, { steps: 6 });
  await page.mouse.up();
  const afterResize = await page.evaluate(() => window.toluOS.stateOf('stripe'));
  if (afterDrag && afterResize && afterResize.w > afterDrag.w + 90 && afterResize.h > afterDrag.h + 60) {
    pass('P8 drag+resize', `drag ok; resize ${afterDrag.w.toFixed(0)}×${afterDrag.h.toFixed(0)} → ${afterResize.w.toFixed(0)}×${afterResize.h.toFixed(0)}`);
  } else {
    fail('P8 drag+resize', `afterDrag=${JSON.stringify(afterDrag)} afterResize=${JSON.stringify(afterResize)}`);
  }
  // Minimize → restore from dock (Round 11: dock is trimmed; restore via the
// window-level API rather than clicking a dock item that no longer exists)
  await page.evaluate(() => window.toluOS.minimizeWindow('stripe'));
  await page.waitForTimeout(300);
  const minOpacity = await page.evaluate(() => getComputedStyle(document.querySelector('.window[data-project="stripe"]')).opacity);
  await page.evaluate(() => window.toluOS.openProjectWindow('stripe')); // restores minimized
  await page.waitForTimeout(300);
  const restOpacity = await page.evaluate(() => getComputedStyle(document.querySelector('.window[data-project="stripe"]')).opacity);
  const focusedAfterRestore = await page.evaluate(() => window.toluOS.focused());
  if (parseFloat(minOpacity) < 0.1 && parseFloat(restOpacity) > 0.9 && focusedAfterRestore === 'stripe') {
    pass('P8 minimize+restore', `opacity ${minOpacity} → ${restOpacity}, focus restored`);
  } else {
    fail('P8 minimize+restore', `min=${minOpacity} restored=${restOpacity} focus=${focusedAfterRestore}`);
  }
  // Esc closes focused
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const winsAfterEsc = await page.evaluate(() => window.toluOS.windows());
  if (!winsAfterEsc.includes('stripe')) {
    pass('P8 esc-close', 'Esc closed the focused window');
  } else {
    fail('P8 esc-close', `windows=${JSON.stringify(winsAfterEsc)}`);
  }
  await ctx.close();
}

// ── P9: Performance budget (D4) ────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  let transfer = 0;
  const resources = [];
  page.on('response', async (res) => {
    try {
      const url = new URL(res.url());
      if (url.origin !== new URL(BASE).origin) return;
      const headers = res.headers();
      const len = parseInt(headers['content-length'] || '0', 10);
      resources.push({ url: res.url(), status: res.status(), len });
    } catch (_) {}
  });
  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(1200);
  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    let transfer = 0;
    res.forEach(r => { transfer += (r.transferSize || 0); });
    return {
      dcl: nav ? nav.domContentLoadedEventEnd : 0,
      transfer: transfer,
      htmlBytes: nav ? nav.transferSize : 0
    };
  });
  const totalTransferKB = (perf.transfer / 1024).toFixed(0);
  if (perf.transfer <= 1.1 * 1024 * 1024 && perf.dcl <= 1200) {
    pass('P9 perf-budget', `transfer ${totalTransferKB} KB (≤ 1.1 MB), DCL ${perf.dcl.toFixed(0)} ms (local, ≤ 1200 ms)`);
  } else {
    fail('P9 perf-budget', `transfer ${totalTransferKB} KB, DCL ${perf.dcl.toFixed(0)} ms`);
  }
  await ctx.close();
}

await browser.close();

// Report
const failed = results.filter(r => !r.ok);
const report = [
  '# Round-9 interaction probes — rYOS grammar (independently implemented)',
  `Date: ${new Date().toISOString()}`,
  '',
  ...results.map(r => `${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  — ${r.detail}`),
  '',
  `Total: ${results.length}  PASS: ${results.length - failed.length}  FAIL: ${failed.length}`
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'round9-probes.txt'), report);
console.log('\n' + report);
process.exit(failed.length ? 1 : 0);