/* ============================================================
   toluOS — script.js  (kernel)
   Vanilla IIFE. No external deps. Source: docs/adal/reference-redesign-plan.md §5
   ============================================================ */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile       = window.matchMedia('(max-width: 48rem)').matches;
  const coarsePointer  = window.matchMedia('(pointer: coarse)').matches;

 // Snap geometry (rYOS-inspired grammar, independently implemented)
  const SNAP_THRESHOLD = 20; // px from viewport edge that triggers a snap
  const MENUBAR_H = 28; // px, menubar height (top chrome)
  const STATUSBAR_H = 26; // px, statusbar height (bottom chrome)
  const SNAP_DURATION = 180; // ms, snap commit animation

 // Drop the .no-js class — JS is alive
  document.documentElement.classList.remove('no-js');

  const PROJECTS = [
    {
      id: 'stripe',
      label: 'Stripe Clone',
      title: 'AdaL Educational Stripe Clone',
      accent: 'var(--color-blue)',
      accentBg: 'oklch(0.20 0.04 245)',
      thumb: 'assets/img/projects/stripe-clone.png', // REAL captured screenshot
      icon:  'assets/img/projects/thumbs/stripe-clone.png',
      shot: 'assets/img/projects/stripe-clone.png',
      shotNote: 'Live URL captured 2026-09-18 — currently serves stripe.com (clone no longer deployed at this URL); other proof links intact.',
      proof: 'High-fidelity educational Stripe hero clone shipped from AdaL bootcamp as a React static site on Cloudflare Pages, with X submission proof, repo, and README evidence. Note: as of 2026-09-18 the live demo URL no longer serves Tolu\'s clone (it now redirects to stripe.com); the project links below remain the authoritative source of the work.',
      links: [
        { label: 'Live demo ↗',       href: 'https://stripe-clone-bn0.pages.dev/',                  type: 'demo' },
        { label: 'Bootcamp submit ↗', href: 'https://67a97296.stripe-clone-bn0.pages.dev/',        type: 'proof' },
        { label: 'X proof post',      href: 'https://x.com/tolu_evm/status/2073978784747786320',  type: 'proof' },
        { label: 'GitHub repo',       href: 'https://github.com/ToXMon/adal-bootcamp-2',           type: 'repo' },
        { label: 'README evidence',   href: 'https://github.com/ToXMon/adal-bootcamp-2/blob/feat/stripe-clone-deploy/README.md', type: 'docs' }
      ]
    },
    {
      id: 'signalforge',
      label: 'SignalForge',
      title: 'Encode Solana / SignalForge',
      accent: 'var(--color-mint-green)',
      accentBg: 'oklch(0.20 0.04 160)',
      thumb: 'assets/img/projects/signalforge-repo.png', // 404 page — the honest artifact
      icon:  'assets/img/projects/thumbs/signalforge-repo.png',
      bannerStyle: 'card-404',
      shots: ['assets/img/projects/signalforge-repo.png'],
      shot: 'assets/img/projects/signalforge-repo.png',
      shotNote: 'Repository URL `ToXMon/signalforge` returns 404 — captured the GitHub "Not Found" page as the artifact.',
      proof: 'Solana learning-to-shipping body of work across programs, token flows, dApp patterns, tests, and devnet verification evidence. Note: the public repo URL was not locatable on 2026-09-18.',
      links: []
    },
    {
      id: 'vouch',
      label: 'Vouch',
      title: 'Vouch / Monad',
      accent: 'var(--color-amber-hot)',
      accentBg: 'oklch(0.20 0.04 70)',
      thumb: 'assets/img/projects/vouch-app.png',
      icon:  'assets/img/projects/thumbs/vouch-app.png',
      shots: ['assets/img/projects/vouch-app.png', 'assets/img/projects/vouch-repo.png', 'assets/img/projects/vouch-health.png'],
      shot: 'assets/img/projects/vouch-app.png',
      shotNote: 'Three captures: live Vouch app (UI + Vouch/MONAD branding), GitHub repo page, and /api/health JSON response. All captured 2026-09-18.',
      proof: 'AI-verified commitment and claim protocol work for Monad trust workflows, backed by a public repository, live Worker root, and health endpoint evidence. Live and accessible as of 2026-09-18.',
      links: [
        { label: 'Live app ↗',      href: 'https://vouch.tolu-a-shekoni.workers.dev',             type: 'demo' },
        { label: 'Health endpoint', href: 'https://vouch.tolu-a-shekoni.workers.dev/api/health',   type: 'proof' },
        { label: 'GitHub repo',     href: 'https://github.com/ToXMon/vouch',                       type: 'repo' },
        { label: 'README',          href: 'https://github.com/ToXMon/vouch/blob/main/README.md',   type: 'docs' }
      ]
    },
    {
      id: 'crypto',
      label: 'Crypto Scanner',
      title: 'Crypto Scanner',
      accent: 'var(--color-amber-hot)',
      accentBg: 'oklch(0.20 0.04 70)',
      thumb: 'assets/img/projects/crypto-scanner.png', // desktop icon still (Round 10)
      icon:  'assets/img/projects/thumbs/crypto-scanner.png',
      bannerStyle: 'card', // window body uses CSS/SVG card banner
      shot: null,
      shotNote: 'Window uses a CSS/SVG banner card themed to the project (no authentic browser capture).',
      proof: 'Crypto scanner tooling for token, liquidity, and market-risk review, supported by public repository evidence and a related workflow gallery.',
      links: [
        { label: 'GitHub repo',         href: 'https://github.com/ToXMon/catecoin-scanner',                 type: 'repo' },
        { label: 'README',              href: 'https://github.com/ToXMon/catecoin-scanner/blob/main/README.md', type: 'docs' },
        { label: 'Workflow gallery ↗', href: 'https://toxmon.github.io/agent-workflows/',                  type: 'demo' }
      ]
    },
    {
      id: 'xmonitor',
      label: 'X Monitor',
      title: 'X Monitor',
      accent: 'var(--color-blue-grey)',
      accentBg: 'oklch(0.18 0.02 230)',
      thumb: 'assets/img/projects/workflows.png',
      icon:  'assets/img/projects/thumbs/workflows.png',
      shot: 'assets/img/projects/workflows.png',
      shotNote: 'Agent workflows gallery captured 2026-09-18 — "Cracked full-stack systems for agentic workflows" landing page.',
      proof: 'Local social-signal monitoring workflow for narrative, trend, and research queue detection; no standalone public product URL is claimed. The workflows gallery is the public-facing artifact for this work.',
      links: [
        { label: 'Workflow gallery ↗', href: 'https://toxmon.github.io/agent-workflows/', type: 'demo' }
      ]
    },
    {
      id: 'agenttrust',
      label: 'AgentTrust',
      title: 'AgentTrust',
      accent: 'var(--color-deep-amber)',
      accentBg: 'oklch(0.18 0.02 60)',
      thumb: 'assets/img/projects/agenttrust-repo.png',
      icon:  'assets/img/projects/thumbs/agenttrust-repo.png',
      shot: 'assets/img/projects/agenttrust-repo.png',
      shotNote: 'GitHub repo page captured 2026-09-18 — accessible.',
      proof: 'Agent trust and verification protocol work with public repository and README evidence.',
      links: [
        { label: 'GitHub repo', href: 'https://github.com/ToXMon/agenttrust',                     type: 'repo' },
        { label: 'README',      href: 'https://github.com/ToXMon/agenttrust/blob/main/README.md',   type: 'docs' }
      ]
    },
    {
      id: 'memory',
      label: 'Memory Palace',
      title: 'Memory Palace',
      accent: 'var(--color-deep-violet)',
      accentBg: 'oklch(0.18 0.04 290)',
      thumb: 'assets/img/projects/memory-repo.png',
      icon:  'assets/img/projects/thumbs/memory-repo.png',
      shot: 'assets/img/projects/memory-repo.png',
      shotNote: 'GitHub repo page (ToXMon/tolu) captured 2026-09-18 — accessible.',
      proof: 'Knowledge system for preserving context, recall, and durable output across agent workflows.',
      links: [
        { label: 'GitHub repo', href: 'https://github.com/ToXMon/tolu', type: 'repo' }
      ]
    },
    {
      id: 'skills',
      label: 'Agent Skills',
      title: 'Agent Skills',
      accent: 'var(--color-cyan)',
      accentBg: 'oklch(0.18 0.02 200)',
      thumb: 'assets/img/projects/agent-skills.png', // desktop icon still (Round 10)
      icon:  'assets/img/projects/thumbs/agent-skills.png',
      bannerStyle: 'card',
      shot: null,
      shotNote: 'Window uses a CSS/SVG banner card themed to the project (no authentic browser capture).',
      proof: 'Reusable Agent Zero skills and workflow tools packaged for repeatable agent workflows.',
      links: []
    },
    {
      id: 'resume',
      kind: 'resume',
      label: 'Résumé',
      title: 'Résumé — Tolu Shekoni',
      accent: 'var(--color-accent)',
      accentBg: 'var(--color-accent-bg)',
      thumb: 'assets/img/projects/resume.png', // AI brand still (Round 10)
      icon:  'assets/img/projects/thumbs/resume.png',
      shot: null,
      shotNote: 'Inline rendering of the full résumé document (generated from assets/docs/Tolu_Shekoni_Resume.docx at build time via scripts/resume-extract.mjs).',
      proof: 'Full-stack developer · data scientist · AI engineer. Nine years shipping data and AI products in regulated enterprise environments, backed by a public portfolio of full-stack, blockchain, and agent systems.',
      links: [
        { label: 'Download résumé (.docx)', href: 'assets/docs/Tolu_Shekoni_Resume.docx', type: 'demo' },
        { label: 'GitHub profile ↗',        href: 'https://github.com/ToXMon',              type: 'repo' },
        { label: 'Email Me',                href: 'mailto:tolu.a.shekoni@gmail.com',         type: 'docs' }
      ],
      resumeDocUrl: 'assets/docs/resume.json'
    }
  ];

  window.PORTFOLIO_PROJECTS = PROJECTS;

// Top-level apps: desktop icons + dock items. Welcome stays for power users.
// Order matters — matches the keyboard map: Cmd+0 Welcome, Cmd+P Projects, Cmd+M Music.
// (Resume is also reachable from the Welcome projects list / desktop icon.)
  const TOP_LEVEL_APPS = [
    { id: 'welcome', label: 'Welcome', title: 'Welcome', accent: 'var(--color-accent)', accentBg: 'var(--color-accent-bg)', icon: null, glyph: '◈', kind: 'welcome', tileSize: 'standard' },
    { id: 'projects', label: 'Projects', title: 'Projects — 8 portfolio builds', accent: 'var(--color-accent)', accentBg: 'var(--color-accent-bg)', icon: 'assets/img/projects/thumbs/projects-folder.svg', glyph: '▤', kind: 'projects-folder', tileSize: 'standard', count: PROJECTS.length },
    { id: 'resume', label: 'Résumé', title: 'Résumé — Tolu Shekoni', accent: 'var(--color-accent)', accentBg: 'var(--color-accent-bg)', icon: 'assets/img/projects/thumbs/resume.png', glyph: '§', kind: 'resume', tileSize: 'standard' },
    { id: 'music', label: 'Music', title: 'Music — Audius', accent: 'var(--color-accent)', accentBg: 'var(--color-accent-bg)', icon: 'assets/img/projects/thumbs/music.svg', glyph: '♪', kind: 'music', tileSize: 'large' }
  ];
  window.TOP_LEVEL_APPS = TOP_LEVEL_APPS;

// Per-app default sizes for openProjectWindow
  function defaultSizeFor(id) {
    if (id === 'welcome') return { w: 640, h: 520 };
    if (id === 'projects') return { w: 720, h: 540 };
    if (id === 'music') return { w: 540, h: 520 };
    if (id === 'resume') return { w: 600, h: 620 };
    return { w: 560, h: 460 };
  }

  const iconsEl      = document.getElementById('desktop-icons');
  const windowsEl    = document.getElementById('windows');
  const taskbarEl    = document.getElementById('taskbar');
  const dockItemsEl  = document.getElementById('dock-items');
  const snapPreviewEl = document.getElementById('snap-preview');
  const menubarAppEl = document.getElementById('menubar-app');
  const menubarActionsEl = document.getElementById('menubar-actions');
  const statusbarMsgEl = document.getElementById('statusbar-message');
  const statusbarCountEl = document.getElementById('statusbar-count');
  const startBtnEl   = document.getElementById('start-btn');
  const soundBtnEl   = document.getElementById('sound-btn');
  const clockEl      = document.getElementById('clock');
  const ctxMenuEl    = document.getElementById('ctx-menu');
  const shortcutsEl  = document.getElementById('shortcuts-overlay');
  const mobileTabsEl = document.getElementById('mobile-tabs');
  const canvasEl     = document.getElementById('constellation');

 // Versioned layout persistence (D3): v2 stores per-instance rects keyed by
 // instance id ("project#2") plus a z-order. v1 (keyed by project id only) is
 // migrated on load; a corrupt or future-version blob is discarded safely.
  const LAYOUT_KEY_V2 = 'toluOS.layout.v2';
  const LAYOUT_KEY_V1 = 'toluOS.layout.v1';
  const LAYOUT_VERSION = 2;
  const windows = new Map(); // instanceId -> window state
  let nextZ = 100;
  let focusedId = null;
  const zOrder = []; // bottom→top stack of instanceIds

  function loadLayout() {
    try {
      const raw = localStorage.getItem(LAYOUT_KEY_V2);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.version === LAYOUT_VERSION && typeof data.windows === 'object') {
          return data;
        }
 // Wrong/corrupt version — safe discard
        return { version: LAYOUT_VERSION, windows: {}, zOrder: [] };
      }
 // Migrate v1 → v2 (per-project rects become instance rects for instance #1)
      const v1raw = localStorage.getItem(LAYOUT_KEY_V1);
      if (v1raw) {
        const v1 = JSON.parse(v1raw);
        const migrated = { version: LAYOUT_VERSION, windows: {}, zOrder: [] };
        if (v1 && typeof v1 === 'object') {
          Object.keys(v1).forEach((id) => {
            const r = v1[id];
            if (r && typeof r.x === 'number') {
              migrated.windows[id] = { x: r.x, y: r.y, w: r.w, h: r.h };
            }
          });
        }
        localStorage.setItem(LAYOUT_KEY_V2, JSON.stringify(migrated));
        localStorage.removeItem(LAYOUT_KEY_V1);
        return migrated;
      }
      return { version: LAYOUT_VERSION, windows: {}, zOrder: [] };
    } catch (_) {
      return { version: LAYOUT_VERSION, windows: {}, zOrder: [] };
    }
  }

  function saveLayout() {
    const data = { version: LAYOUT_VERSION, windows: {}, zOrder: zOrder.slice() };
    windows.forEach((w, instanceId) => {
      if (!w.minimized && !w.closing) {
        data.windows[instanceId] = { x: w.x, y: w.y, w: w.w, h: w.h, z: w.el.style.zIndex };
      }
    });
    try { localStorage.setItem(LAYOUT_KEY_V2, JSON.stringify(data)); } catch (_) {}
  }

  function resetLayout() {
    try { localStorage.removeItem(LAYOUT_KEY_V2); localStorage.removeItem(LAYOUT_KEY_V1); } catch (_) {}
 // Re-center all currently-open windows in a cascade
    let i = 0;
    windows.forEach((w) => {
      w.minimized = false;
      w.closing = false;
      w.maximized = false;
      w.snapped = null;
      const sz = defaultSizeFor(w.id);
      const defaultW = sz.w;
      const defaultH = sz.h;
      w.w = defaultW;
      w.h = defaultH;
      w.x = Math.max(20, (window.innerWidth - defaultW) / 2 + (i * 24 - 60));
      w.y = Math.max(MENUBAR_H + 12, (window.innerHeight - defaultH) / 2 + (i * 24 - 60));
      w.el.style.left = w.x + 'px';
      w.el.style.top = w.y + 'px';
      w.el.style.width = w.w + 'px';
      w.el.style.height = w.h + 'px';
      w.el.classList.remove('minimized');
      w.el.classList.remove('maximized');
      i++;
    });
    saveLayout();
  }

function buildWindowEl(project, opts = {}) {
    const win = document.createElement('article');
    const kindClass = project.kind ? ` window-${project.kind}` : '';
    win.className = 'window' + (opts.welcome ? ' welcome-window' : '') + kindClass;
    win.dataset.project = project.id;
    win.style.setProperty('--window-accent', project.accent);
    win.style.setProperty('--window-accent-bg', project.accentBg);
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-labelledby', `win-title-${project.id}`);
    win.tabIndex = -1;

// Title bar
    const title = document.createElement('header');
    title.className = 'window-title';
    title.innerHTML = `
      <span class="window-title-name" id="win-title-${project.id}">${escapeHtml(opts.titleText || project.label)}${opts.instanceNum > 1 ? ' <span class="window-title-instance">· ' + opts.instanceNum + '</span>' : ''}</span>
      <div class="window-controls">
        <button class="window-control window-control-min" aria-label="Minimize" data-act="min">−</button>
        <button class="window-control window-control-max" aria-label="Maximize" data-act="max">□</button>
        <button class="window-control window-control-close" aria-label="Close" data-act="close">×</button>
      </div>
    `;

// Body
    const body = document.createElement('div');
    body.className = 'window-body';

    if (opts.welcome) {
      body.appendChild(buildWelcomeBody(project));
    } else if (project.kind === 'projects-folder') {
      body.appendChild(buildProjectsFolderBody(project));
    } else if (project.kind === 'resume') {
      body.appendChild(buildResumeBody(project));
    } else if (project.kind === 'music') {
      body.appendChild(buildMusicBody(project));
    } else {
// Default: shots + proof + links (existing pattern). Banner-card projects skip the
      // primary thumbnail and render an inline CSS/SVG banner instead.
      const useCard = project.bannerStyle === 'card' || project.bannerStyle === 'card-404';

      if (useCard) {
        const card = buildCardBanner(project);
        if (card) body.appendChild(card);
      } else {
        const shots = Array.isArray(project.shots) && project.shots.length
          ? project.shots
          : [project.shot || project.thumb].filter(Boolean);
        if (shots.length) {
          const primary = document.createElement('div');
          primary.className = 'window-thumb';
          const primaryImg = document.createElement('img');
          primaryImg.src = shots[0];
          primaryImg.alt = project.title + (project.shot ? ' (real browser capture)' : ' (illustration)');
          primaryImg.loading = 'lazy';
          primaryImg.decoding = 'async';
          primaryImg.addEventListener('error', () => { primary.style.display = 'none'; });
          primary.appendChild(primaryImg);
          body.appendChild(primary);

          if (shots.length > 1) {
            const strip = document.createElement('div');
            strip.className = 'window-shots-strip';
            shots.slice(1).forEach((src, i) => {
              const wrap = document.createElement('a');
              wrap.href = src;
              wrap.target = '_blank';
              wrap.rel = 'noopener noreferrer';
              wrap.className = 'window-shot-thumb';
              const im = document.createElement('img');
              im.src = src;
              im.alt = project.title + ' capture ' + (i + 2);
              im.loading = 'lazy';
              im.decoding = 'async';
              im.addEventListener('error', () => { wrap.style.display = 'none'; });
              wrap.appendChild(im);
              strip.appendChild(wrap);
            });
            body.appendChild(strip);
          }
        }
      }

// capture-source note (honest about provenance)
      if (project.shotNote) {
        const note = document.createElement('p');
        note.className = 'window-shot-note';
        note.textContent = project.shotNote;
        body.appendChild(note);
      }

// title h2
      const h2 = document.createElement('h2');
      h2.textContent = project.title;
      body.appendChild(h2);

// proof
      const p = document.createElement('p');
      p.textContent = project.proof;
      body.appendChild(p);

// links
      if (project.links && project.links.length) {
        const ul = document.createElement('ul');
        project.links.forEach((link) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.label;
          a.rel = 'noopener noreferrer';
          a.target = '_blank';
          if (link.type === 'demo') a.classList.add('demo-link');
          li.appendChild(a);
          ul.appendChild(li);
        });
        body.appendChild(ul);
      }

// status footer — honest, no fabricated verification claims.
// The date shown is when the source PROJECTS data was last reviewed, not
// a runtime verification claim.
      const status = document.createElement('div');
      status.className = 'window-status';
      const lastCheck = '2026-09-18'; // data-reviewed date (see SUBMISSION.md), NOT a live check
      const hasShot = !!project.shot;

      status.innerHTML = `
        <span>toluOS · v1 · ${lastCheck}</span>
        <span>${hasShot ? 'authentic capture 2026-09-18' : 'links only'}</span>
      `;
      body.appendChild(status);
    }

 // resize handles
    ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].forEach((dir) => {
      const h = document.createElement('div');
      h.className = 'window-resize ' + dir;
      h.dataset.resize = dir;
      win.appendChild(h);
    });

    win.appendChild(title);
    win.appendChild(body);
    return win;
  }

  function buildWelcomeBody(project) {
    const wrap = document.createElement('div');
    wrap.className = 'welcome-body';

 // Headline
    const h1 = document.createElement('h1');
    h1.className = 'welcome-headline';
    const headlineText = 'Tolu Shekoni turns bootcamp velocity into shipped, verifiable products.';
    headlineText.split(' ').forEach((w) => {
      const span = document.createElement('span');
      span.className = 'word';
      const inner = document.createElement('span');
      inner.textContent = w;
      span.appendChild(inner);
      h1.appendChild(span);
    });
    wrap.appendChild(h1);
 // Trigger word-stagger after a short delay
    setTimeout(() => h1.classList.add('shown'), 80);

 // Lead
    const lead = document.createElement('p');
    lead.className = 'welcome-lead';
    lead.textContent = 'I build at the intersection of agentic AI, onchain trust, and data-driven product systems — then publish the proof: live demos, repos, docs, and deployment artifacts. Open any icon below to inspect the work.';
    wrap.appendChild(lead);

 // CTA row
    const ctaRow = document.createElement('div');
    ctaRow.className = 'welcome-cta-row';
    [
      { label: 'Email Me',           href: 'mailto:tolu.a.shekoni@gmail.com', primary: true },
      { label: 'X / @tolu_evm ↗',   href: 'https://x.com/tolu_evm',            primary: false },
      { label: 'GitHub ↗',          href: 'https://github.com/ToXMon',          primary: false },
      { label: 'View Stripe Clone ↗', href: 'https://stripe-clone-bn0.pages.dev/', primary: false }
    ].forEach((c) => {
      const a = document.createElement('a');
      a.className = 'welcome-cta' + (c.primary ? '' : ' secondary');
      a.href = c.href;
      a.textContent = c.label;
      if (c.href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      ctaRow.appendChild(a);
    });
    wrap.appendChild(ctaRow);

 // Proof strip
    const dl = document.createElement('dl');
    dl.className = 'welcome-proof-strip';
    [['Live demos', 'Cloudflare Pages · Workers'], ['Bootcamps', 'AdaL · Encode Solana'], ['Hackathon work', 'Monad · AgentTrust']].forEach(([dt, dd]) => {
      const d = document.createElement('div');
      const dtEl = document.createElement('dt');
      dtEl.textContent = dt;
      const ddEl = document.createElement('dd');
      ddEl.textContent = dd;
      d.appendChild(dtEl);
      d.appendChild(ddEl);
      dl.appendChild(d);
    });
    wrap.appendChild(dl);

 // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'welcome-tabs';
    const tabData = [
      { id: 'projects', label: PROJECTS.length + ' Projects' },
      { id: 'receipts', label: 'Receipts' },
      { id: 'process',  label: 'Build process' }
    ];
    const tabPanels = {};
    tabData.forEach((t) => {
      const b = document.createElement('button');
      b.className = 'welcome-tab';
      b.dataset.tab = t.id;
      b.textContent = t.label;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', t.id === 'projects' ? 'true' : 'false');
      b.addEventListener('click', () => switchTab(t.id));
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs);

 // Panels
 // Projects panel
    const projPanel = document.createElement('div');
    projPanel.className = 'welcome-panel active';
    projPanel.dataset.panel = 'projects';
    projPanel.innerHTML = '<p class="wp-note" style="margin-bottom:0.5rem;">Click any desktop icon to open that project as a draggable, resizable window. Use the taskbar to switch between them.</p>';
    PROJECTS.forEach((p) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0.4rem;border-bottom:1px dashed oklch(1 0 0 / 0.06);cursor:pointer;';
      row.innerHTML = `
        <span style="width:8px;height:8px;border-radius:50%;background:${p.accent};flex-shrink:0;"></span>
        <span style="flex:1;font-size:0.85rem;color:var(--color-ink-fg);">${escapeHtml(p.title)}</span>
        <button class="welcome-tab" data-open-project="${p.id}" style="flex-shrink:0;">Open ↗</button>
      `;
      row.querySelector('button').addEventListener('click', () => focusOrOpen(p.id));
      projPanel.appendChild(row);
    });
    tabPanels.projects = projPanel;
    wrap.appendChild(projPanel);

 // Receipts panel — honest live-probe of each link (reachable / unreachable)
    const recPanel = document.createElement('div');
    recPanel.className = 'welcome-panel';
    recPanel.dataset.panel = 'receipts';
    recPanel.innerHTML = `
      <p class="wp-note">Each link is probed in your browser when you open this tab (GET, no-cors, 5 s timeout). "reachable" means the host responded without error; we can't read status codes through no-cors, so we never claim HTTP 200.</p>
      <table class="receipt-table">
        <thead><tr><th>Project</th><th>URL</th><th>Status</th></tr></thead>
        <tbody id="receipt-rows"></tbody>
      </table>
      <p class="wp-note-sm">Generated asset prompts (build-and-asset-plan.md §2):</p>
      <pre class="receipt-prompt">A1 OG: "Cinematic wide shot, anamorphic 2.39:1 framing: a lone constellation of golden particle nodes connected by thin light threads floating over a deep warm-black void…"
A7 Topo: "Extremely subtle dark texture: faint warm-gold topographic contour lines on deep warm-black, almost imperceptible, like an archival engineering blueprint…"
(full set: build-and-asset-plan.md §2)</pre>
      <p class="wp-note-sm">Music: Audius public REST, no auth (free tier: 10 req/s, 500 K req/mo). Drop a bearer token at the top of the MusicApp module in script.js to lift the rate limit. Resume doc rendered inline from <code>assets/docs/resume.json</code> (extracted from <code>Tolu_Shekoni_Resume.docx</code> via <code>node scripts/resume-extract.mjs</code>).</p>
    `;
    tabPanels.receipts = recPanel;
    wrap.appendChild(recPanel);

 // Process panel
    const procPanel = document.createElement('div');
    procPanel.className = 'welcome-panel';
    procPanel.dataset.panel = 'process';
    procPanel.innerHTML = `
      <p class="wp-note">Built with AdaL (engineer mode). The brief was a single-page portfolio

      <p class="wp-label"><strong>Layers of the build:</strong></p>
      <ol class="wp-list">
        <li><strong>Foundation</strong> — vendored Three.js r149, generated A1/A2/A6/A7 assets.</li>
        <li><strong>Shell</strong> — wallpaper scene, 8 icons, draggable/resizable/snappable windows, dock, mobile tabs.</li>
        <li><strong>Visuals</strong> — 8 project thumbnails (AI-generated + hand-authored SVG fallbacks).</li>
        <li><strong>Welcome</strong> — auto-opening window: headline, proof strip, 3 tabs.</li>
        <li><strong>Validation</strong> — check.sh, browser-matrix (4 viewports), browser-edge (reduced-motion, no-JS, subpath, mobile).</li>
      </ol>
      <p class="wp-label"><strong>Validation scripts in this repo:</strong></p>
      <ul class="wp-list-tight">
        <li><code>bash scripts/check.sh</code> — mechanical checks (palette, type ramp, asset refs, a11y)</li>
        <li><code>node scripts/browser-matrix.mjs</code> — capture at 1440/1920/390/320 + normal-motion</li>
        <li><code>node scripts/browser-edge.mjs</code> — reduced-motion / no-JS / subpath / mobile</li>
      </ul>
    `;
    tabPanels.process = procPanel;
    wrap.appendChild(procPanel);

    function switchTab(id) {
      tabs.querySelectorAll('.welcome-tab').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === id ? 'true' : 'false'));
      wrap.querySelectorAll('.welcome-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === id));
 // Lazy probes — fire only when Receipts tab is first opened.
 // Look up the Welcome window's state object from the windows Map.
      if (id === 'receipts') {
        const ws = windows.get('welcome');
        if (ws && !ws._receiptsProbed) {
          ws._receiptsProbed = true;
 // Mark visible rows immediately (still "probing…"); async fill in.
          const rowsEl = wrap.querySelector('#receipt-rows');
          if (rowsEl) primeReceiptRows(rowsEl);
          runReceiptProbes(ws);
        }
      }
    }

    return wrap;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

 // instanceId format: "welcome", "stripe", "stripe#2", "vouch#3", …
 // Project-level focusOrOpen targets the *most recent* instance of a project.
  function splitInstanceId(instanceId) {
    const m = /^(.*?)(?:#(\d+))?$/.exec(instanceId);
    return { id: m[1], num: m[2] ? parseInt(m[2], 10) : 1 };
  }

  function instancesOf(id) {
    const out = [];
    windows.forEach((state, instanceId) => {
      if (state.id === id && !state.closing) out.push({ instanceId, state });
    });
    return out;
  }

  function topInstanceOf(id) {
 // Walk zOrder top→bottom; first window of this project wins
    for (let i = zOrder.length - 1; i >= 0; i--) {
      const state = windows.get(zOrder[i]);
      if (state && state.id === id && !state.closing) return zOrder[i];
    }
    return null;
  }

 // Launch-origin animation: the window genie-expands from the clicked icon's
 // rect (rYOS grammar, independently implemented). reducedMotion → no-op.
  let lastLaunchOrigin = null; // {x, y, w, h} of the source icon rect
  function applyLaunchOrigin(state, origin) {
    if (!origin || reducedMotion) return;
    const el = state.el;
 // scale from the origin's center to the final rect
    const sx = origin.w / state.w, sy = origin.h / state.h;
    const dx = (state.x + state.w / 2) - (origin.x + origin.w / 2);
    const dy = (state.y + state.h / 2) - (origin.y + origin.h / 2);
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    el.style.opacity = '0';
    requestAnimationFrame(() => {
      el.style.transition = 'transform 220ms var(--ease-out-exp), opacity 220ms var(--ease-out-exp)';
      el.style.transform = 'translate(0, 0) scale(1, 1)';
      el.style.opacity = '1';
      setTimeout(() => {
        el.style.transition = '';
        el.style.transform = '';
      }, SNAP_DURATION + 60);
    });
  }

  function openProjectWindow(id, opts = {}) {
    const isWelcome = id === 'welcome';
 // Round 11: id may be a portfolio project OR a top-level app (Welcome, Projects,
 // Resume, Music). Search both arrays.
    const project = PROJECTS.find((p) => p.id === id) || TOP_LEVEL_APPS.find((p) => p.id === id);
    if (!isWelcome && !project) return null;
    const projectRef = isWelcome
      ? { id: 'welcome', label: 'Welcome — Tolu Shekoni', title: 'Welcome', accent: 'var(--color-accent)', accentBg: 'var(--color-accent-bg)' }
      : project;

 // Existing instance of this project: focus/restore it (project-level entry
 // points — desktop icon, shortcuts, mobile tabs — reuse the top instance).
    if (!opts.forceNew) {
      const existing = topInstanceOf(id);
      if (existing) {
        const state = windows.get(existing);
        if (state.closing) {
          clearTimeout(state.closeTimer);
          state.closing = false;
          state.el.classList.remove('closing');
        }
        if (state.minimized) {
          state.minimized = false;
          state.el.classList.remove('minimized');
        }
        focusWindow(existing);
        return state;
      }
    }

 // Multi-instance: spawn #N+1 for this project
    let instanceNum = 1;
    if (!isWelcome) {
      instanceNum = instancesOf(id).length + 1;
      const used = new Set(instancesOf(id).map((x) => splitInstanceId(x.instanceId).num));
      while (used.has(instanceNum)) instanceNum++;
    }
    const instanceId = (!isWelcome && instanceNum > 1) ? `${id}#${instanceNum}` : id;
    const stored = loadLayout().windows[instanceId] || {};
    const el = buildWindowEl(projectRef, { welcome: isWelcome, instanceNum, titleText: (!isWelcome && instanceNum > 1) ? project.label : undefined });
    const sz = defaultSizeFor(id);
    const defaultW = sz.w;
    const defaultH = sz.h;
    const w = stored.w || defaultW;
    const h = stored.h || defaultH;
    // Default position: right-of-center so the aurora horizon stays visible
    // (art-directed composition — the light lives right-of-center).
    const x = stored.x !== undefined ? stored.x : Math.max(20, Math.min(window.innerWidth - w - 20, (window.innerWidth - w) / 2 + (isWelcome ? 90 : 0) + (windows.size * 24 - 60)));
    const y = stored.y !== undefined ? stored.y : Math.max(MENUBAR_H + 12, (window.innerHeight - h) / 2 + (windows.size * 24 - 60));

    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.zIndex = String(++nextZ);

    windowsEl.appendChild(el);

    const state = {
      id,
      instanceId,
      el,
      project: projectRef,
      x, y, w, h,
      minimized: false,
      closing: false,
      maximized: false,
      snapped: null
    };
    windows.set(instanceId, state);
    zOrder.push(instanceId);

 // open animation — from launch origin if provided, else generic pop
    if (opts.origin) {
      lastLaunchOrigin = { ...opts.origin, instanceId };
      applyLaunchOrigin(state, opts.origin);
    } else {
      el.classList.add('opening');
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('opening')));
    }

    bindWindowInteractions(state);
    syncTaskbar();
    focusWindow(instanceId);

 // Receipts probes are deferred until the Receipts tab is first opened.
 // This eliminates the page-load probe storm (was 12 parallel fetches).
    return state;
  }

  function focusWindow(instanceId) {
    const state = windows.get(instanceId);
    if (!state || state.closing || state.minimized) return;
    nextZ++;
    state.el.style.zIndex = String(nextZ);
 // Maintain the zOrder stack (bottom→top)
    const idx = zOrder.indexOf(instanceId);
    if (idx >= 0) zOrder.splice(idx, 1);
    zOrder.push(instanceId);

 // Mobile: only one window visible at a time — mark focused as mobile-visible
 // and hide others. Desktop uses the default stacking.
    if (isMobile) {
      windows.forEach((s) => {
        if (s.instanceId !== instanceId) s.el.classList.remove('mobile-visible');
      });
      state.el.classList.add('mobile-visible');
    }
 // Focused-window lighting: only the focused window carries .focused
    windows.forEach((s) => {
      if (s.instanceId !== instanceId) s.el.classList.remove('focused');
    });
    state.el.classList.add('focused');
    focusedId = instanceId;
    syncTaskbar();
    syncMenubar();
    tickClock();
  }

  function closeWindow(instanceId) {
    const state = windows.get(instanceId);
    if (!state || state.closing) return;
    state.closing = true;
    state.el.classList.add('closing');
    state.closeTimer = setTimeout(() => {
      state.el.remove();
      windows.delete(instanceId);
      const idx = zOrder.indexOf(instanceId);
      if (idx >= 0) zOrder.splice(idx, 1);
 // Focus the new top window (if any)
      const next = topWindow();
      if (next) focusWindow(next.instanceId);
      else { focusedId = null; syncMenubar(); }
      syncTaskbar();
      saveLayout();
    }, 220);
  }

  function topWindow() {
    for (let i = zOrder.length - 1; i >= 0; i--) {
      const s = windows.get(zOrder[i]);
      if (s && !s.closing && !s.minimized) return { instanceId: zOrder[i], state: s };
    }
    return null;
  }

  function minimizeWindow(instanceId) {
    const state = windows.get(instanceId);
    if (!state) return;
    state.minimized = true;
    state.el.classList.add('minimized');
    if (focusedId === instanceId) {
      const next = topWindow();
      focusedId = next ? next.instanceId : null;
    }
    syncTaskbar();
    syncMenubar();
    saveLayout();
  }

  function cycleWindows(dir = 1) {
    const visible = zOrder.filter((iid) => {
      const s = windows.get(iid);
      return s && !s.closing && !s.minimized;
    });
    if (visible.length < 2) {
      if (visible.length === 1) focusWindow(visible[0]);
      return;
    }
    const pos = visible.indexOf(focusedId);
    const next = visible[(pos + dir + visible.length) % visible.length];
    focusWindow(next);
  }

  function toggleMaximize(instanceId) {
    const state = windows.get(instanceId);
    if (!state) return;
    if (!state.maximized) {
      state.maximized = true;
      state.savedRect = { x: state.x, y: state.y, w: state.w, h: state.h };
      state.el.style.left = '0px';
      state.el.style.top = MENUBAR_H + 'px';
      state.el.style.width = '100vw';
      state.el.style.height = (window.innerHeight - MENUBAR_H - STATUSBAR_H) + 'px';
      state.el.classList.add('maximized');
    } else {
      state.maximized = false;
      const r = state.savedRect || { x: 80, y: 80, w: 560, h: 480 };
      state.el.style.left = r.x + 'px';
      state.el.style.top = r.y + 'px';
      state.el.style.width = r.w + 'px';
      state.el.style.height = r.h + 'px';
      state.el.classList.remove('maximized');
    }
  }

 // Commit an edge snap: save pre-snap rect for restore, apply half-screen
 // geometry, and record it in state (rYOS grammar, independently implemented).
  function commitSnap(state, zone) {
    if (!state || state.maximized) return;
    if (!state.snapped) state.preSnapRect = { x: state.x, y: state.y, w: state.w, h: state.h };
    const W = window.innerWidth;
    const H = window.innerHeight - MENUBAR_H - STATUSBAR_H;
    state.snapped = zone;
    state.x = zone === 'left' ? 0 : W / 2;
    state.y = MENUBAR_H;
    state.w = W / 2;
    state.h = H;
    if (!reducedMotion) {
      state.el.style.transition = 'left ' + SNAP_DURATION + 'ms var(--ease-out-exp), top ' + SNAP_DURATION + 'ms var(--ease-out-exp), width ' + SNAP_DURATION + 'ms var(--ease-out-exp), height ' + SNAP_DURATION + 'ms var(--ease-out-exp)';
    }
    state.el.style.left = state.x + 'px';
    state.el.style.top = state.y + 'px';
    state.el.style.width = state.w + 'px';
    state.el.style.height = state.h + 'px';
    setTimeout(() => { state.el.style.transition = ''; }, SNAP_DURATION + 40);
  }

  function bindWindowInteractions(state) {
    const el = state.el;
    const title = el.querySelector('.window-title');
    const minBtn = el.querySelector('[data-act="min"]');
    const maxBtn = el.querySelector('[data-act="max"]');
    const closeBtn = el.querySelector('[data-act="close"]');

    minBtn.addEventListener('click', (e) => { e.stopPropagation(); minimizeWindow(state.instanceId); });
    maxBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMaximize(state.instanceId); });
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(state.instanceId); });

 // Double-click title = toggle maximize
    title.addEventListener('dblclick', (e) => {
      if (e.target.closest('.window-control')) return;
      toggleMaximize(state.instanceId);
    });

    el.addEventListener('mousedown', () => focusWindow(state.instanceId), true);

 // ── Edge-snap helpers ─────────────────────────────────────
    function snapZoneFor(nx) {
      const W = window.innerWidth;
      if (nx <= SNAP_THRESHOLD) return 'left';
      if (nx + state.w >= W - SNAP_THRESHOLD) return 'right';
      return null;
    }
    function showSnapPreview(zone) {
      if (!snapPreviewEl) return;
      const W = window.innerWidth, H = window.innerHeight - MENUBAR_H - STATUSBAR_H;
      const r = zone === 'left'
        ? { x: 0, y: MENUBAR_H, w: W / 2, h: H }
        : { x: W / 2, y: MENUBAR_H, w: W / 2, h: H };
      snapPreviewEl.style.left = r.x + 'px';
      snapPreviewEl.style.top = r.y + 'px';
      snapPreviewEl.style.width = r.w + 'px';
      snapPreviewEl.style.height = r.h + 'px';
      snapPreviewEl.classList.add('active');
      snapPreviewEl.dataset.zone = zone;
    }
    function hideSnapPreview() {
      if (!snapPreviewEl) return;
      snapPreviewEl.classList.remove('active');
      delete snapPreviewEl.dataset.zone;
    }

 // Drag
    title.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-control')) return;
      if (state.maximized) return;
      e.preventDefault();
      focusWindow(state.instanceId);
 // If dragging a snapped window: un-snap first, re-anchoring the drag to
 // the cursor (the window shrinks to its pre-snap rect under the pointer).
      if (state.snapped) {
        const pre = state.preSnapRect;
        state.w = pre.w; state.h = pre.h;
        state.x = e.clientX - pre.w / 2;
        state.y = Math.max(MENUBAR_H, e.clientY - 16);
        el.style.width = state.w + 'px';
        el.style.height = state.h + 'px';
        el.style.left = state.x + 'px';
        el.style.top = state.y + 'px';
        state.snapped = null;
      }
      const startX = e.clientX, startY = e.clientY;
      const origX = state.x, origY = state.y;
      title.classList.add('dragging');
      const onMove = (mv) => {
        let nx = origX + (mv.clientX - startX);
        let ny = origY + (mv.clientY - startY);
 // Soft clamp to viewport (keep 60px of titlebar visible)
        if (nx < -state.w + 60) nx = -state.w + 60;
        if (ny < MENUBAR_H) ny = MENUBAR_H;
        if (nx > window.innerWidth - 60) nx = window.innerWidth - 60;
        if (ny > window.innerHeight - STATUSBAR_H - 4) ny = window.innerHeight - STATUSBAR_H - 4;
        state.x = nx; state.y = ny;
        state.el.style.left = nx + 'px';
        state.el.style.top = ny + 'px';
 // Live snap preview while hovering the snap zone
        const zone = snapZoneFor(nx);
        if (zone) showSnapPreview(zone); else hideSnapPreview();
      };
      const onUp = () => {
        title.classList.remove('dragging');
        hideSnapPreview();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
 // Commit the snap if the drop point is inside a zone
        const zone = snapZoneFor(state.x);
        if (zone) commitSnap(state, zone);
        saveLayout();
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

 // Touch drag
    title.addEventListener('touchstart', (e) => {
      if (state.maximized) return;
      if (e.target.closest('.window-control')) return;
      const t = e.touches[0];
      const startX = t.clientX, startY = t.clientY;
      const origX = state.x, origY = state.y;
      title.classList.add('dragging');
      const onMove = (mv) => {
        const tt = mv.touches[0];
        let nx = origX + (tt.clientX - startX);
        let ny = origY + (tt.clientY - startY);
        if (ny < MENUBAR_H) ny = MENUBAR_H;
        if (ny > window.innerHeight - STATUSBAR_H - 4) ny = window.innerHeight - STATUSBAR_H - 4;
        state.x = nx; state.y = ny;
        state.el.style.left = nx + 'px';
        state.el.style.top = ny + 'px';
      };
      const onUp = () => {
        title.classList.remove('dragging');
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
        saveLayout();
      };
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }, { passive: true });

 // Resize
    el.querySelectorAll('.window-resize').forEach((h) => {
      const dir = h.dataset.resize;
      h.addEventListener('mousedown', (e) => {
        if (state.maximized) return;
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX, startY = e.clientY;
        const startW = state.w, startH = state.h;
        const startLx = state.x, startLy = state.y;
        const onMove = (mv) => {
          let dx = mv.clientX - startX, dy = mv.clientY - startY;
          let nw = startW, nh = startH, nx = startLx, ny = startLy;
          if (dir.includes('e')) nw = Math.max(280, startW + dx);
          if (dir.includes('s')) nh = Math.max(180, startH + dy);
          if (dir.includes('w')) { nw = Math.max(280, startW - dx); nx = startLx + (startW - nw); }
          if (dir.includes('n')) { nh = Math.max(180, startH - dy); ny = startLy + (startH - nh); }
          state.w = nw; state.h = nh; state.x = nx; state.y = ny;
          state.el.style.width = nw + 'px';
          state.el.style.height = nh + 'px';
          state.el.style.left = nx + 'px';
          state.el.style.top = ny + 'px';
        };
        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          saveLayout();
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });
  }

  function renderDesktopIcons() {
    iconsEl.innerHTML = '';
    TOP_LEVEL_APPS.forEach((p) => {
      const btn = document.createElement('button');
      btn.className = 'desktop-icon' + (p.tileSize === 'large' ? ' desktop-icon-large' : '');
      btn.dataset.openProject = p.id;
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('aria-label', `Open ${p.title}`);
 // Use the icon (or thumb) as the desktop icon; SVG / PNG both fine.
      const iconSrc = p.icon || null;
      const thumbInner = iconSrc
        ? `<img src="${escapeHtml(iconSrc)}" alt="" loading="lazy" decoding="async">`
        : `<span class="desktop-icon-glyph" aria-hidden="true">${escapeHtml(p.glyph || '◈')}</span>`;
      btn.innerHTML = `
        <div class="desktop-icon-thumb${iconSrc ? '' : ' desktop-icon-thumb-glyph'}">${thumbInner}</div>
        <span class="desktop-icon-label">${escapeHtml(p.label)}${p.count ? ` <span class="desktop-icon-count">${p.count}</span>` : ''}</span>
      `;
      btn.addEventListener('click', (e) => {
 // Launch-origin: open from this icon's rect (or focus existing instance)
        const existing = topInstanceOf(p.id);
        if (existing) { focusWindow(existing); return; }
        const r = btn.getBoundingClientRect();
        openProjectWindow(p.id, { origin: { x: r.x, y: r.y, w: r.width, h: r.height } });
      });
      btn.addEventListener('dblclick', (e) => {
        e.preventDefault();
 // Double-click: second instance (multi-instance grammar)
        const r = btn.getBoundingClientRect();
        openProjectWindow(p.id, { forceNew: true, origin: { x: r.x, y: r.y, w: r.width, h: r.height } });
      });
      iconsEl.appendChild(btn);
    });
  }

  function focusOrOpen(id) { openProjectWindow(id); }

 //    Dock: pinned items = all 8 projects + Welcome; running indicators
 //    (dots + count badge) reflect live instances; hover magnification uses
 //    a cosine falloff around the hovered item (rYOS-inspired, vanilla).
  let dockBuilt = false;
  const dockItemEls = new Map(); // projectId -> { btn, dot, badge }

  function buildDock() {
    if (dockBuilt || !dockItemsEl) return;
    dockBuilt = true;
 // Trimmed dock: 4 entries — Welcome, Projects folder, Résumé, Music.
 // Power users reach individual projects via Cmd+1..9 + the Projects folder window.
    const entries = TOP_LEVEL_APPS.slice();
    entries.forEach((entry) => {
      const btn = document.createElement('button');
      btn.className = 'dock-item';
      btn.dataset.dockId = entry.id;
      btn.setAttribute('aria-label', entry.label);
      btn.title = entry.label;
      const iconSrc = entry.id === 'welcome' ? null : entry.icon;
      const dockInner = iconSrc
        ? `<img src="${escapeHtml(iconSrc)}" alt="" loading="lazy" decoding="async">`
        : escapeHtml(entry.glyph || '◈');
      btn.innerHTML = `
        <span class="dock-thumb" aria-hidden="true">${dockInner}</span>
        <span class="dock-label">${escapeHtml(entry.label)}</span>
        <span class="dock-dot" aria-hidden="true"></span>
        <span class="dock-badge" aria-hidden="true"></span>
      `;
      btn.addEventListener('click', () => {
 // Dock click: focus top instance, or open if none; ⌥/Alt-click = new instance
        if (btn.altKey) {
          openProjectWindow(entry.id, { forceNew: true });
        } else {
          const top = topInstanceOf(entry.id);
          if (top) {
            const state = windows.get(top);
            if (state.minimized) {
              state.minimized = false;
              state.el.classList.remove('minimized');
            }
            focusWindow(top);
          } else {
 // Launch-origin: expand from the clicked dock icon
            const r = btn.getBoundingClientRect();
            openProjectWindow(entry.id, { origin: { x: r.x, y: r.y, w: r.width, h: r.height } });
          }
        }
      });
      btn.addEventListener('dblclick', () => openProjectWindow(entry.id, { forceNew: true }));
      dockItemsEl.appendChild(btn);
      dockItemEls.set(entry.id, {
        btn,
        dot: btn.querySelector('.dock-dot'),
        badge: btn.querySelector('.dock-badge')
      });
    });

 // Magnification: cosine falloff, transform-only, pointer-fine only
    if (finePointer && !reducedMotion && !isMobile) {
      const items = Array.from(dockItemsEl.children);
      dockItemsEl.addEventListener('mousemove', (e) => {
        items.forEach((it) => {
          const r = it.getBoundingClientRect();
          const center = r.x + r.width / 2;
          const dist = Math.abs(e.clientX - center);
          const range = 90;
          const t = Math.max(0, 1 - dist / range);
          const scale = 1 + 0.38 * (0.5 - 0.5 * Math.cos(Math.PI * t)); // cosine ease
          it.style.transform = `translateY(${(1 - scale) * 6}px) scale(${scale})`;
        });
      });
      dockItemsEl.addEventListener('mouseleave', () => {
        items.forEach((it) => { it.style.transform = ''; });
      });
    }
  }

  function syncDock() {
    if (!dockItemsEl) return;
 // Count live instances per project
    const running = new Map(); // projectId -> count
    let focusedProject = null;
    let projectsCount = 0; // for the Projects folder dock entry — counts any portfolio project
    windows.forEach((state) => {
      if (state.closing) return;
      running.set(state.id, (running.get(state.id) || 0) + 1);
      if (state.id !== 'welcome' && state.id !== 'projects' && state.id !== 'music' && state.id !== 'resume') projectsCount++;
      if (state.instanceId === focusedId && !state.minimized) focusedProject = state.id;
    });
    dockItemEls.forEach((parts, projectId) => {
      let n = running.get(projectId) || 0;
 // Projects folder dock entry lights up whenever any portfolio project is running
      if (projectId === 'projects') n = projectsCount > 0 ? 1 : 0;
      parts.btn.classList.toggle('running', n > 0);
      parts.btn.classList.toggle('focused', projectId === focusedProject);
      parts.dot.style.opacity = n > 0 ? '1' : '0';
      if (n > 1) {
        parts.badge.textContent = String(n);
        parts.badge.style.opacity = '1';
      } else {
        parts.badge.style.opacity = '0';
      }
    });
  }

 // App-following menubar: shows the focused project + window controls
  function syncMenubar() {
    if (!menubarAppEl) return;
    const state = focusedId ? windows.get(focusedId) : null;
    if (state && !state.closing && !state.minimized) {
      const inst = splitInstanceId(state.instanceId);
      menubarAppEl.textContent = state.id === 'welcome' ? 'Welcome' : (state.project.label + (inst.num > 1 ? ' — #' + inst.num : ''));
      if (menubarActionsEl) menubarActionsEl.hidden = false;
    } else {
      menubarAppEl.textContent = 'Desktop';
      if (menubarActionsEl) menubarActionsEl.hidden = true;
    }
    syncStatusbar();
  }

  function syncStatusbar() {
    if (!statusbarMsgEl) return;
    const n = Array.from(windows.values()).filter((s) => !s.closing).length;
    const state = focusedId ? windows.get(focusedId) : null;
    statusbarMsgEl.textContent = state && !state.closing
      ? `Focused: ${state.project.label}`
      : 'toluOS — no windows open';
    if (statusbarCountEl) statusbarCountEl.textContent = `${n} window${n === 1 ? '' : 's'}`;
  }

  function syncTaskbar() {
    buildDock();
    syncDock();
    syncMobileTabs();
  }

  function syncMobileTabs() {
    mobileTabsEl.innerHTML = '';
    if (!isMobile) return;
 // Always include Welcome as the first mobile tab (open or focus)
    const welcomeTab = document.createElement('button');
    welcomeTab.className = 'mobile-tab';
    welcomeTab.style.setProperty('--tab-accent', 'var(--color-accent)');
    welcomeTab.textContent = 'Welcome';
    welcomeTab.setAttribute('aria-selected', (focusedId && focusedId.startsWith('welcome')) ? 'true' : 'false');
    welcomeTab.addEventListener('click', () => {
      if (windows.has('welcome')) focusWindow('welcome');
      else openProjectWindow('welcome');
    });
    mobileTabsEl.appendChild(welcomeTab);
    PROJECTS.forEach((p) => {
      const b = document.createElement('button');
      b.className = 'mobile-tab';
      b.style.setProperty('--tab-accent', p.accent);
      b.textContent = p.label;
      const isFocused = focusedId && focusedId.startsWith(p.id) && (focusedId === p.id || focusedId.startsWith(p.id + '#'));
      b.setAttribute('aria-selected', isFocused ? 'true' : 'false');
      b.addEventListener('click', () => openProjectWindow(p.id));
      mobileTabsEl.appendChild(b);
    });
  }

 // Mobile swipe-to-cycle: horizontal swipe on the desktop cycles focus
 // between open windows (rYOS phone grammar, independently implemented).
  function setupMobileSwipe() {
    if (!isMobile || !coarsePointer) return;
    let startX = 0, startY = 0, startT = 0;
    const SWIPE_THRESHOLD = 80;
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) { startX = -1; return; }
      const t = e.touches[0];
 // Ignore swipes that start inside a window body (scrollable content)
      if (e.target.closest('.window-body') || e.target.closest('.window-title')) { startX = -1; return; }
      startX = t.clientX; startY = t.clientY; startT = Date.now();
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
      if (startX < 0) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Date.now() - startT;
      startX = -1;
      if (dt > 600) return;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
 // Left swipe → focus the next window DOWN the z-stack (page-forward);
      // right swipe → back up. Matches page-right / page-left metaphor.
      cycleWindows(dx < 0 ? -1 : 1);
    }, { passive: true });
  }

 //    Reads window.THREE (vendored at vendor/three.min.js).
 //    Reveals ~2200 stars across 3 depth layers with parallax
 //    drift + mouse pull. Surface runtime evidence:
 //      window.toluOS.heroScene  → the THREE.Scene instance
 //      window.toluOS.heroStats  → { renderer, particles, layers }
  function initConstellation() {
    if (!canvasEl) return;
    if (typeof window.THREE !== 'object' || !window.THREE.WebGLRenderer) {
      console.warn('THREE.js not available — falling back to 2D starfield');
      init2DFallback();
      return;
    }
    if (reducedMotion) {
 // Under prefers-reduced-motion: WebGL is fine (it's a visual effect, not motion),
 // but the brief asked for a static star render. Render the 2D fallback (deterministic
 // first frame, no rAF loop). The designer contract says: RM variant shows a static
 // desktop starfield rather than an animated one.
      init2DFallback();
      return;
    }
    const THREE = window.THREE;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    const mouse = { x: 0, y: 0, active: false };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0c0a, 0.0008);

    const camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 2000);
    camera.position.set(0, 0, 600);

 // transparent overlay renderer so wallpaper shows through
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

 // 3 depth layers × ~750 stars (back/mid/front)
    function makeLayer(count, distance, sizeRange, color, drift) {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const phases = new Float32Array(count);
      const sizes = new Float32Array(count);
      const cR = ((color >> 16) & 0xff) / 255;
      const cG = ((color >> 8)  & 0xff) / 255;
      const cB = (color & 0xff) / 255;
      for (let i = 0; i < count; i++) {
        positions[i*3 + 0] = (Math.random() - 0.5) * 1400;
        positions[i*3 + 1] = (Math.random() - 0.5) * 900;
        positions[i*3 + 2] = distance + (Math.random() - 0.5) * 120;
 // subtle hue variation toward warm
        const jitter = (Math.random() - 0.5) * 0.08;
        colors[i*3 + 0] = Math.min(1, Math.max(0, cR + jitter));
        colors[i*3 + 1] = Math.min(1, Math.max(0, cG + jitter * 0.5));
        colors[i*3 + 2] = Math.min(1, Math.max(0, cB - jitter * 0.3));
        phases[i] = Math.random() * Math.PI * 2;
        sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const sprite = makeStarSprite();
      const mat = new THREE.PointsMaterial({
        size: 6,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      const points = new THREE.Points(geo, mat);
      points.userData = { phases, drift, sizes, original: positions.slice() };
      return points;
    }

 // Procedural star sprite (radial gradient → soft circular dot)
    function makeStarSprite() {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const cx = c.getContext('2d');
      const g = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0.00, 'rgba(255,255,255,1)');
      g.addColorStop(0.30, 'rgba(255,230,170,0.85)');
      g.addColorStop(0.60, 'rgba(255,180,80,0.25)');
      g.addColorStop(1.00, 'rgba(0,0,0,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    }

    const GOLD = 0xE8B34B;
    const BLU  = 0x4A7FB5;
    const WARM = 0xffd28a;
    const farLayer  = makeLayer( 800, -350, [1.6, 2.6], GOLD, 0.0001);
    const midLayer  = makeLayer( 600, -180, [2.4, 3.6], WARM, 0.0003);
    const nearLayer = makeLayer( 800,    0, [3.0, 5.0], GOLD, 0.0006);
    const blueLayer = makeLayer( 400, -260, [2.0, 3.0], BLU,  0.0002);
    const layers = [farLayer, blueLayer, midLayer, nearLayer];
    layers.forEach((l) => scene.add(l));

 // central gold core — a glowing sprite billboard
    const coreMat = new THREE.SpriteMaterial({
      map: makeStarSprite(),
      color: 0xfff0c8,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coreSprite = new THREE.Sprite(coreMat);
    coreSprite.scale.set(180, 180, 1);
    coreSprite.position.set(0, 0, 50);
    scene.add(coreSprite);

 // 6 amber filaments from core outward (in screen space)
    const filaments = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const dist = 320;
      const mat = new THREE.LineBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0, 0,
        Math.cos(ang) * dist, Math.sin(ang) * dist, 0
      ]), 3));
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      filaments.push({ line, ang, dist });
    }

 // Expose for tests + visual audits
    window.toluOS = window.toluOS || {};
    window.toluOS.heroScene = scene;
    window.toluOS.heroStats = {
      renderer: !!renderer,
      camera: !!camera,
      particles: 800 + 400 + 600 + 800, // far + blue + mid + near
      layers: layers.length,
      filaments: filaments.length,
      coreSprite: !!coreSprite,
      threeVersion: THREE.REVISION || 'unknown'
    };

    function resize() {
      const rect = canvasEl.getBoundingClientRect();
      w = rect.width; h = rect.height;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();

 // Animation
    let lastT = 0;
    function step(t) {
      rafId = requestAnimationFrame(step);
      const dt = lastT ? (t - lastT) / 1000 : 1 / 60;
      lastT = t;

 // Parallax: drift layers at their own rates; near layer faster than far
      layers.forEach((layer) => {
        const u = layer.userData;
        const positions = layer.geometry.attributes.position.array;
        const orig = u.original;
        const phases = u.phases;
        const t2 = t * u.drift;
        for (let i = 0; i < phases.length; i++) {
 // gentle per-star twinkle + horizontal drift
          positions[i*3 + 0] = orig[i*3 + 0] + Math.sin(t2 + phases[i]) * 4 + (mouse.active ? (mouse.x - w/2) * 0.003 * (1 + i % 3) : 0);
          positions[i*3 + 1] = orig[i*3 + 1] + Math.cos(t2 * 0.7 + phases[i]) * 3 + (mouse.active ? -(mouse.y - h/2) * 0.003 * (1 + i % 3) : 0);
        }
        layer.geometry.attributes.position.needsUpdate = true;
        layer.rotation.z += dt * 0.005;
      });

 // Core breathing
      const pulse = 1 + Math.sin(t * 0.0009) * 0.15;
      coreSprite.scale.set(180 * pulse, 180 * pulse, 1);

 // Filaments rotate slowly
      filaments.forEach((f) => {
        f.ang += dt * 0.06;
        const pos = f.line.geometry.attributes.position.array;
        pos[2] = Math.cos(f.ang) * f.dist;
        pos[3] = Math.sin(f.ang) * f.dist;
        f.line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    }

    function onMove(e) {
      const rect = canvasEl.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() { mouse.active = false; }
    canvasEl.addEventListener('mousemove', onMove, { passive: true });
    canvasEl.addEventListener('mouseleave', onLeave, { passive: true });

    let resizeT = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(resize, 200);
    });

    rafId = requestAnimationFrame(step);
    window.toluOS.heroStats.framesStarted = true;
  }

 // Fallback: if THREE.js is missing or WebGL unavailable, render a 2D
 // starfield on the same canvas. Honest non-deceptive fallback.
  function init2DFallback() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars = [];
    for (let i = 0; i < 1200; i++) {
      stars.push({
        x: Math.random() * 1400 - 700,
        y: Math.random() * 900 - 450,
        r: Math.random() * 1.6 + 0.4,
        z: Math.random() * 600 - 200,
        ph: Math.random() * Math.PI * 2
      });
    }
    function resize() {
      const rect = canvasEl.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvasEl.width = Math.floor(w * dpr);
      canvasEl.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    let lastT = 0;
    function step(t) {
      requestAnimationFrame(step);
      const dt = lastT ? (t - lastT) / 1000 : 1 / 60;
      lastT = t;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const fov = 600;
      for (const s of stars) {
        const z = s.z + 400;
        if (z <= 0) continue;
        const sx = cx + (s.x / z) * fov;
        const sy = cy + (s.y / z) * fov;
        const r = Math.max(0.2, (s.r * fov) / z);
        const alpha = Math.min(1, 800 / z);
        ctx.fillStyle = `oklch(0.85 0.14 85 / ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    let resizeT = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(resize, 200);
    });
    requestAnimationFrame(step);
    window.toluOS = window.toluOS || {};
    window.toluOS.heroStats = { renderer: '2d-fallback', particles: stars.length, layers: 1 };
  }

 //    For each project link, fire `fetch(url, {mode:'no-cors', signal:timeout})`
 //    and label the row honestly:
 //      • resolves within timeout → "reachable"  (green pill)
 //    Probes are NOT fired on page load. They fire when the Receipts tab is first
 //    opened (see switchTab). Capped at 4 concurrent. Each probe has a 5 s timeout
 //    with AbortController cleanup. No console errors are produced for known-blocking
 //    hosts (x.com, twitter.com) — those rows are marked "blocked" up front.
 //    For every URL we report one of: reachable / unreachable / timeout / blocked.
 //    Status codes are NOT readable in no-cors mode; we never claim "200".
  const RECEIPT_SKIP_HOSTS = new Set(['x.com', 'twitter.com', 't.co']);
  const RECEIPT_TIMEOUT_MS = 5000;
  const RECEIPT_MAX_CONCURRENT = 4;

  function primeReceiptRows(rowsEl) {
    const items = collectReceiptItems();
    items.forEach((item) => {
      const tr = document.createElement('tr');
      tr.dataset.url = item.url;
      tr.innerHTML = `
        <td>${escapeHtml(item.project)}</td>
        <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><

        <td class="status-pending">${item.skipReason ? 'blocked' : 'queued'}</td>
      `;
      rowsEl.appendChild(tr);
    });
  }

  function collectReceiptItems() {
    const links = [];
    PROJECTS.forEach((p) => {
      (p.links || []).forEach((l) => {
        if (!l.href.startsWith('http')) return;
        let host = '';
        try { host = new URL(l.href).host; } catch (_) { return; }
        const skip = RECEIPT_SKIP_HOSTS.has(host) || Array.from(RECEIPT_SKIP_HOSTS).some((h) => host === h || host.endsWith('.' + h));
        links.push({
          project: p.title,
          url: l.href,
          skipReason: skip ? 'blocked-by-cors' : ''
        });
      });
    });
 // dedupe by URL
    const seen = new Set();
    return links.filter((x) => {
      if (seen.has(x.url)) return false;
      seen.add(x.url);
      return true;
    });
  }

  function runReceiptProbes(welcomeState) {
    if (!welcomeState) return;
    const rowsEl = welcomeState.el.querySelector('#receipt-rows');
    if (!rowsEl) return;
    const items = collectReceiptItems();
 // Row lookup by normalized URL (fixes B-R8-2: a.href normalizes with a
 // trailing slash for the workers.dev root, so raw item.url keys missed).
    const rowByUrl = new Map();
    Array.from(rowsEl.children).forEach((tr) => {
      const a = tr.querySelector('a[href]');
      if (a) rowByUrl.set(a.href, tr);
    });
 // Every item MUST resolve to a row; a miss would strand a "queued" row.
    items.forEach((item) => {
      if (!rowByUrl.has(item.url)) {
 // anchor.href normalization fallback: match on tr.dataset.url
        const tr = Array.from(rowsEl.children).find((r) => r.dataset.url === item.url);
        if (tr) rowByUrl.set(item.url, tr);
      }
    });

 // Terminal-state watchdog: after 12 s no row may still be "queued".
 // This is a safety net — runProbe always settles — but a stranded row
 // would be a permanent non-terminal state (the R8 blocker).
    const watchdog = setTimeout(() => {
      const stuck = Array.from(rowsEl.querySelectorAll('.status-pending'))
        .filter((td) => td.textContent === 'queued');
      stuck.forEach((td) => {
        td.classList.remove('status-pending');
        td.textContent = 'unreachable (no response)';
        td.style.color = 'var(--color-muted)';
      });
    }, RECEIPT_TIMEOUT_MS * 2 + 2000);

 // Concurrency-capped scheduler
    let cursor = 0;
    let active = 0;
    const next = () => {
      while (active < RECEIPT_MAX_CONCURRENT && cursor < items.length) {
        const item = items[cursor++];
        active++;
        runProbe(item, rowByUrl.get(item.url)).finally(() => {
          active--;
          if (cursor >= items.length && active === 0) clearTimeout(watchdog);
          next();
        });
      }
    };
    next();
  }

  function runProbe(item, row) {
    return new Promise((resolve) => {
 // No matching row (shouldn't happen — rows are primed from the same data):
 // resolve but expose the miss for diagnostics rather than silently swallowing.
      if (!row) { console.warn('receipts: no row for', item.url); return resolve(); }
      if (item.skipReason) {
        setStatus(row, 'blocked', 0);
        return resolve();
      }
      const start = Date.now();
      let settled = false;
      const ac = new AbortController();
      const t = setTimeout(() => {
        if (settled) return;
        settled = true;
        ac.abort();
        setStatus(row, 'timeout', Date.now() - start);
        resolve();
      }, RECEIPT_TIMEOUT_MS);

      fetch(item.url, { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: ac.signal })
        .then(() => {
          if (settled) return;
          settled = true;
          clearTimeout(t);
          setStatus(row, 'reachable', Date.now() - start);
          resolve();
        })
        .catch((err) => {
          if (settled) return;
          settled = true;
          clearTimeout(t);
 // AbortError = our timeout fired; other errors = host unreachable.
          const kind = (err && err.name === 'AbortError') ? 'timeout' : 'unreachable';
          setStatus(row, kind, Date.now() - start, err && err.name || 'error');
          resolve();
        });
    });
  }

  function setStatus(tr, kind, ms, note) {
    const cell = tr.querySelector('.status-pending');
    if (!cell) return;
    cell.classList.remove('status-pending');
 // Cell has been seen — remove the placeholder class
    if (kind === 'reachable') {
      cell.textContent = 'reachable (' + ms + 'ms)';
      cell.parentElement.classList.add('status-2xx');
      cell.style.color = 'oklch(0.78 0.18 145)';
    } else if (kind === 'unreachable') {
      cell.textContent = 'unreachable' + (note ? ' (' + note + ')' : '');
      cell.parentElement.classList.add('status-other');
      cell.style.color = 'var(--color-muted)';
    } else if (kind === 'timeout') {
      cell.textContent = 'timeout (' + ms + 'ms)';
      cell.parentElement.classList.add('status-other');
      cell.style.color = 'var(--color-muted)';
    } else if (kind === 'blocked') {
      cell.textContent = 'blocked (CORS)';
      cell.parentElement.classList.add('status-other');
      cell.style.color = 'var(--color-muted)';
    }
  }

  function tickClock() {
    if (!clockEl) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}`;
    clockEl.dateTime = now.toISOString();
    // Scene widget mirror (desktop only, honest local clock + window count)
    const wt = document.getElementById('scene-widget-time');
    const wd = document.getElementById('scene-widget-date');
    const ws = document.getElementById('scene-widget-status');
    if (wt) wt.textContent = `${hh}:${mm}`;
    if (wd) wd.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (ws) {
      const n = Array.from(windows.values()).filter((s) => !s.closing).length;
      ws.textContent = n > 0 ? `toluOS · ${n} window${n === 1 ? '' : 's'} open` : 'toluOS · standby';
    }
  }
  setInterval(tickClock, 30000);
  tickClock();

  function setupSoundToggle() {
    if (!soundBtnEl) return;
 // C1 ambient loop — assets/audio/ambient-loop.mp3 (28 s seamless, ffmpeg-synthesized).
 // Opt-in only: browsers block autoplay and the brief mandates default OFF. The
 // asset loads lazily on first click so it never counts against initial transfer.
    let audio = null;
    let loaded = false;
    function setState(on) {
      soundBtnEl.setAttribute('aria-pressed', on ? 'true' : 'false');
      soundBtnEl.title = on ? 'Ambient audio: on' : 'Ambient audio: off';
    }
    setState(false);
    soundBtnEl.addEventListener('click', () => {
      if (!loaded) {
        audio = new Audio('assets/audio/ambient-loop.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        loaded = true;
      }
      if (audio.paused) {
        audio.play().then(() => setState(true)).catch(() => setState(false));
      } else {
        audio.pause();
        setState(false);
      }
    });
  }

  function setupStartBtn() {
    if (!startBtnEl) return;
    startBtnEl.addEventListener('click', () => {
      const w = windows.get('welcome');
      if (w) {
        if (w.minimized) {
          w.minimized = false;
          w.el.classList.remove('minimized');
          focusWindow('welcome');
        } else focusWindow('welcome');
      } else openProjectWindow('welcome');
    });
  }

  function setupContextMenu() {
    if (!ctxMenuEl) return;
    function close() { ctxMenuEl.classList.remove('open'); ctxMenuEl.innerHTML = ''; ctxMenuEl.setAttribute('aria-hidden', 'true'); }
    function open(x, y) {
      ctxMenuEl.innerHTML = `
        <button class="ctx-menu-item" data-act="welcome">Open Welcome</button>
        <button class="ctx-menu-item" data-act="reset">Reset window layout</button>
        <div class="ctx-menu-divider"></div>
        <button class="ctx-menu-item" data-act="shortcuts">Keyboard shortcuts…</button>
        <button class="ctx-menu-item" data-act="source">View source on GitHub ↗</button>
      `;
      ctxMenuEl.querySelectorAll('.ctx-menu-item').forEach((b) => {
        b.addEventListener('click', () => {
          const a = b.dataset.act;
          if (a === 'welcome') openProjectWindow('welcome');
          else if (a === 'reset') resetLayout();
          else if (a === 'shortcuts') showShortcuts();
          else if (a === 'source') window.open('https://github.com/ToXMon/tolu-portfolio', '_blank');

          close();
        });
      });
      ctxMenuEl.classList.add('open');
      ctxMenuEl.setAttribute('aria-hidden', 'false');
 // clamp to viewport
      const rect = ctxMenuEl.getBoundingClientRect();
      const px = Math.min(x, window.innerWidth - rect.width - 8);
      const py = Math.min(y, window.innerHeight - rect.height - 8);
      ctxMenuEl.style.left = px + 'px';
      ctxMenuEl.style.top = py + 'px';
    }
    document.addEventListener('contextmenu', (e) => {
 // only when target is the desktop (not in a window or icon)
      if (e.target.closest('.window') || e.target.closest('.desktop-icon') || e.target.closest('.taskbar')) return;
      e.preventDefault();
      open(e.clientX, e.clientY);
    });
    document.addEventListener('click', (e) => {
      if (!ctxMenuEl.classList.contains('open')) return;
      if (e.target.closest('.ctx-menu')) return;
      close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  function showShortcuts() {
    if (!shortcutsEl) return;
    shortcutsEl.classList.add('open');
    shortcutsEl.setAttribute('aria-hidden', 'false');
  }
  function hideShortcuts() {
    if (!shortcutsEl) return;
    shortcutsEl.classList.remove('open');
    shortcutsEl.setAttribute('aria-hidden', 'true');
  }
  function setupShortcuts() {
    if (!shortcutsEl) return;
    shortcutsEl.addEventListener('click', (e) => {
      if (e.target === shortcutsEl) hideShortcuts();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideShortcuts();
    });
  }

  function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      const mod = e.metaKey || e.ctrlKey;
 // ? to show shortcuts
      if (e.key === '?' && !mod) { showShortcuts(); e.preventDefault(); return; }
 // Esc closes focused window
      if (e.key === 'Escape') {
        if (shortcutsEl.classList.contains('open')) { hideShortcuts(); e.preventDefault(); return; }
        if (focusedId && windows.has(focusedId)) {
          const state = windows.get(focusedId);
          if (!state.minimized && !state.closing) { closeWindow(focusedId); e.preventDefault(); }
        }
        return;
      }
 // Cmd/Ctrl+Tab — cycle windows (z-order stack)
      if (mod && e.key === 'Tab') {
        e.preventDefault();
        cycleWindows(e.shiftKey ? -1 : 1);
        return;
      }
 // Cmd/Ctrl + …
      if (mod) {
        if (e.key === 'w' || e.key === 'W') {
          if (focusedId && windows.has(focusedId)) { closeWindow(focusedId); e.preventDefault(); }
          return;
        }
        if (e.key === 'm' || e.key === 'M') {
          if (focusedId && windows.has(focusedId)) { minimizeWindow(focusedId); e.preventDefault(); }
          return;
        }
        if (e.key === 'r' || e.key === 'R') { resetLayout(); e.preventDefault(); return; }
        if (e.key === '0') { openProjectWindow('welcome'); e.preventDefault(); return; }
        if (e.key === 'p' || e.key === 'P') { openProjectWindow('projects'); e.preventDefault(); return; }
        if (/^[1-9]$/.test(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (PROJECTS[idx]) { openProjectWindow(PROJECTS[idx].id); e.preventDefault(); }
        }
      }
 // F4 = launchpad (no modifier required — matches macOS grammar)
      if (e.key === 'F4' && !mod) {
        e.preventDefault();
        if (window.toluOS && window.toluOS.launchpad) window.toluOS.launchpad.toggle();
        return;
      }
 // Space = play/pause music when no input is focused
      if (e.key === ' ' && !mod) {
        const t = e.target;
        const isInput = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
        if (!isInput) {
          e.preventDefault();
          MusicApp.toggle();
        }
      }
    });
  }

 // Menubar window controls (min/max/close on the focused window)
  function setupMenubarActions() {
    if (!menubarActionsEl) return;
    menubarActionsEl.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-act]');
      if (!b || !focusedId) return;
      if (b.dataset.act === 'min') minimizeWindow(focusedId);
      else if (b.dataset.act === 'max') toggleMaximize(focusedId);
      else if (b.dataset.act === 'close') closeWindow(focusedId);
    });
  }

 // Wallpaper parallax (Round 10): the scene image drifts gently opposite the
 // pointer, sized oversized so edges never show. Independent of Three.js;
 // reducedMotion or coarse pointers → static image.
  function setupWallpaperParallax() {
    const wpScene = document.querySelector('.wp-scene');
    if (!wpScene || reducedMotion || !finePointer) return;
    let px = 0, py = 0, tx = 0, ty = 0;
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -22;
      ty = (e.clientY / window.innerHeight - 0.5) * -14;
    };
    const ease = () => {
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      wpScene.style.transform = 'translate(' + px.toFixed(1) + 'px, ' + py.toFixed(1) + 'px) scale(1.03)';
      requestAnimationFrame(ease);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    requestAnimationFrame(ease);
  }

// ============================================================
// Round 11 — Card banners / Projects folder / Résumé body / Music body
// ============================================================

// buildCardBanner — inline CSS/SVG hero banner for projects without real captures
  function buildCardBanner(project) {
    const wrap = document.createElement('div');
    wrap.className = `banner-card banner-card-${project.bannerStyle || 'card'}`;
    wrap.style.setProperty('--window-accent', project.accent || 'var(--color-accent)');

    if (project.bannerStyle === 'card-404') {
      wrap.innerHTML = `
        <div class="banner-card-grid"></div>
        <div class="banner-card-404">
          <div class="banner-card-404-code">404</div>
          <div class="banner-card-404-title">repo link rot</div>
          <div class="banner-card-404-sub">Public repo URL not locatable on 2026-09-18. Receipt captured from the GitHub "Not Found" page — shown in the strip below.</div>
          <a class="banner-card-404-link" href="https://github.com/ToXMon/signalforge" target="_blank" rel="noopener noreferrer">Verify on GitHub ↗</a>
        </div>`;
      return wrap;
    }

    // bannerStyle === 'card' — themed by project id
    if (project.id === 'crypto') {
      wrap.innerHTML = `
        <svg class="banner-card-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="bg-c" cx="0.5" cy="0.6" r="0.7">
              <stop offset="0%" stop-color="oklch(0.20 0.04 70)" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="oklch(0.10 0.02 70)" stop-opacity="0.95"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="url(#bg-c)"/>
          <g fill="none" stroke="var(--window-accent)" stroke-width="0.8" opacity="0.55">
            <circle cx="400" cy="280" r="40"/>
            <circle cx="400" cy="280" r="80"/>
            <circle cx="400" cy="280" r="130"/>
            <circle cx="400" cy="280" r="190"/>
            <circle cx="400" cy="280" r="260"/>
          </g>
          <g stroke="var(--window-accent)" stroke-width="1.4" fill="none" opacity="0.85">
            <path d="M120 280 Q200 240 280 260 T440 240 T600 250 T720 230"/>
            <path d="M120 320 Q220 300 320 310 T520 290 T720 305"/>
          </g>
          <g fill="var(--window-accent)" opacity="0.7">
            <circle cx="180" cy="180" r="3"/><circle cx="660" cy="200" r="3"/>
            <circle cx="700" cy="350" r="3"/><circle cx="160" cy="400" r="3"/>
          </g>
          <text x="40" y="450" font-family="Fraunces, serif" font-size="34" font-weight="700" fill="var(--window-accent)">Crypto Scanner</text>
          <text x="40" y="475" font-family="Source Sans 3, sans-serif" font-size="14" fill="oklch(0.78 0.02 60)">Token · liquidity · market-risk review</text>
        </svg>`;
    } else if (project.id === 'skills') {
      // 4×4 grid of skill tiles, one highlighted (the active skill)
      const tiles = [];
      const active = 7;
      for (let i = 0; i < 16; i++) {
        const x = 80 + (i % 4) * 160;
        const y = 90 + Math.floor(i / 4) * 90;
        const isActive = i === active;
        tiles.push(`<rect x="${x}" y="${y}" width="120" height="64" rx="6"
          fill="${isActive ? 'var(--window-accent)' : 'oklch(0.16 0.02 200 / 0.85)'}"
          stroke="var(--window-accent)" stroke-width="${isActive ? 1.6 : 0.6}" opacity="${isActive ? 1 : 0.7}"/>`);
        if (isActive) {
          tiles.push(`<text x="${x + 60}" y="${y + 38}" text-anchor="middle" font-family="DM Mono, monospace" font-size="13" font-weight="600" fill="oklch(0.13 0.01 60)">Active</text>`);
        }
      }
      wrap.innerHTML = `
        <svg class="banner-card-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="bg-s" cx="0.5" cy="0.4" r="0.7">
              <stop offset="0%" stop-color="oklch(0.20 0.04 200)" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="oklch(0.10 0.02 200)" stop-opacity="0.95"/>
            </radialGradient>
          </defs>
          <rect width="800" height="500" fill="url(#bg-s)"/>
          ${tiles.join('')}
          <text x="40" y="460" font-family="Fraunces, serif" font-size="32" font-weight="700" fill="var(--window-accent)">Agent Skills</text>
          <text x="40" y="482" font-family="Source Sans 3, sans-serif" font-size="14" fill="oklch(0.78 0.02 60)">20+ reusable Agent Zero skills</text>
        </svg>`;
    } else {
      // generic fallback
      wrap.innerHTML = `
        <div class="banner-card-grid"></div>
        <div class="banner-card-label">${escapeHtml(project.title)}</div>`;
    }
    return wrap;
  }

// buildProjectsFolderBody — Finder-style grid of all 8 portfolio projects
  function buildProjectsFolderBody(project) {
    const wrap = document.createElement('div');
    wrap.className = 'folder-body';

    const intro = document.createElement('p');
    intro.className = 'folder-intro';
    intro.textContent = `${PROJECTS.length} portfolio builds — click any card to open the project window.`;
    wrap.appendChild(intro);

    const grid = document.createElement('div');
    grid.className = 'folder-grid';
    PROJECTS.forEach((p) => {
      const card = document.createElement('button');
      card.className = 'folder-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('aria-label', `Open ${p.title}`);
      card.style.setProperty('--window-accent', p.accent);
      const thumbSrc = p.thumb || p.icon || '';
      const liveLink = (p.links || []).find(l => l.type === 'demo' || l.type === 'repo');
      card.innerHTML = `
        <div class="folder-card-thumb"><img src="${escapeHtml(thumbSrc)}" alt="" loading="lazy" decoding="async"></div>
        <div class="folder-card-meta">
          <div class="folder-card-title">${escapeHtml(p.label)}</div>
          <div class="folder-card-sub">${escapeHtml((p.title || '').split(' / ')[0])}</div>
        </div>
        ${liveLink ? `<div class="folder-card-badge">${escapeHtml(liveLink.type === 'demo' ? 'LIVE' : 'REPO')}</div>` : ''}`;
      card.addEventListener('click', () => focusOrOpen(p.id));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

// buildResumeBody — inline render of assets/docs/resume.json
  const RESUME_CACHE = { data: null, inflight: null };
  async function loadResumeDoc(url) {
    if (RESUME_CACHE.data) return RESUME_CACHE.data;
    if (RESUME_CACHE.inflight) return RESUME_CACHE.inflight;
    RESUME_CACHE.inflight = fetch(url).then(r => r.json()).then(d => { RESUME_CACHE.data = d; return d; }).catch(e => { RESUME_CACHE.inflight = null; throw e; });
    return RESUME_CACHE.inflight;
  }

  function renderResumeDoc(data) {
    const root = document.createElement('div');
    root.className = 'resume-doc';

    // Header
    const head = document.createElement('header');
    head.className = 'resume-doc-head';
    const name = document.createElement('h1');
    name.className = 'resume-doc-name';
    name.textContent = data.name || '';
    head.appendChild(name);
    if (data.role) {
      const role = document.createElement('p');
      role.className = 'resume-doc-role';
      role.textContent = data.role;
      head.appendChild(role);
    }
    if (Array.isArray(data.contact) && data.contact.length) {
      const contact = document.createElement('p');
      contact.className = 'resume-doc-contact';
      data.contact.forEach((item, i) => {
        if (i) contact.appendChild(document.createTextNode(' · '));
        const isLink = /(https?:\/\/|@|github\.com|x\.com)/.test(item);
        if (isLink) {
          let href = item;
          if (item.startsWith('@')) href = 'mailto:' + item.slice(1);
          else if (item.includes('@') && !item.includes('://')) href = 'mailto:' + item;
          else if (/^github\.com\//i.test(item)) href = 'https://' + item;
          else if (/^x\.com\//i.test(item)) href = 'https://' + item;
          const a = document.createElement('a');
          a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
          a.textContent = item;
          contact.appendChild(a);
        } else {
          contact.appendChild(document.createTextNode(item));
        }
      });
      head.appendChild(contact);
    }
    root.appendChild(head);

    if (data.summary) {
      const s = document.createElement('p');
      s.className = 'resume-doc-summary';
      s.textContent = data.summary;
      root.appendChild(s);
    }

    // Sections
    (data.sections || []).forEach((section) => {
      const sec = document.createElement('section');
      sec.className = 'resume-doc-section';
      const h = document.createElement('h2');
      h.className = 'resume-doc-section-title';
      h.textContent = section.title;
      sec.appendChild(h);

      if (section.type === 'skills') {
        const rows = document.createElement('div');
        rows.className = 'resume-doc-skill-rows';
        section.rows.forEach((row) => {
          const r = document.createElement('div');
          r.className = 'resume-doc-skill-row';
          const lab = document.createElement('span');
          lab.className = 'resume-doc-skill-label';
          lab.textContent = row.label;
          r.appendChild(lab);
          const val = document.createElement('span');
          val.className = 'resume-doc-skill-value';
          row.items.forEach((item, i) => {
            if (i) val.appendChild(document.createTextNode(' · '));
            val.appendChild(document.createTextNode(item));
          });
          r.appendChild(val);
          rows.appendChild(r);
        });
        sec.appendChild(rows);
      } else if (section.type === 'experience') {
        section.entries.forEach((entry) => {
          const e = document.createElement('article');
          e.className = 'resume-doc-job';
          const t = document.createElement('h3');
          t.className = 'resume-doc-job-title';
          t.textContent = entry.title;
          e.appendChild(t);
          if (entry.meta) {
            const m = document.createElement('p');
            m.className = 'resume-doc-job-meta';
            m.textContent = entry.meta;
            e.appendChild(m);
          }
          if (entry.bullets && entry.bullets.length) {
            const ul = document.createElement('ul');
            ul.className = 'resume-doc-bullets';
            entry.bullets.forEach((b) => {
              const li = document.createElement('li');
              li.textContent = b;
              ul.appendChild(li);
            });
            e.appendChild(ul);
          }
          sec.appendChild(e);
        });
      } else if (section.type === 'projects') {
        const list = document.createElement('ul');
        list.className = 'resume-doc-project-list';
        (section.items || []).forEach((p) => {
          const li = document.createElement('li');
          li.className = 'resume-doc-project';
          const name = document.createElement('strong');
          name.textContent = p.name;
          li.appendChild(name);
          if (p.description) {
            li.appendChild(document.createTextNode(' — ' + p.description));
          }
          list.appendChild(li);
        });
        sec.appendChild(list);
      } else {
        const ul = document.createElement('ul');
        ul.className = 'resume-doc-list';
        (section.items || []).forEach((t) => {
          const li = document.createElement('li');
          li.textContent = t;
          ul.appendChild(li);
        });
        sec.appendChild(ul);
      }
      root.appendChild(sec);
    });

    // Footer with download link
    if (data.generatedAt) {
      const f = document.createElement('footer');
      f.className = 'resume-doc-footer';
      f.innerHTML = `<span>Last updated ${escapeHtml(data.generatedAt)}</span><a href="assets/docs/Tolu_Shekoni_Resume.docx" target="_blank" rel="noopener noreferrer">Download .docx ↗</a>`;
      root.appendChild(f);
    }
    return root;
  }

  function buildResumeBody(project) {
    const wrap = document.createElement('div');
    wrap.className = 'resume-body';
    const placeholder = document.createElement('p');
    placeholder.className = 'resume-loading';
    placeholder.textContent = 'Loading résumé…';
    wrap.appendChild(placeholder);
    loadResumeDoc(project.resumeDocUrl || 'assets/docs/resume.json').then((data) => {
      wrap.innerHTML = '';
      wrap.appendChild(renderResumeDoc(data));
    }).catch((e) => {
      wrap.innerHTML = '';
      const err = document.createElement('p');
      err.className = 'resume-loading';
      err.textContent = 'Failed to load résumé (' + (e.message || e) + '). Download the .docx in the fallback section below.';
      wrap.appendChild(err);
    });
    return wrap;
  }

// ============================================================
// MusicApp — Audius public REST, no auth. Module-scoped singleton.
// ============================================================
  const GENRES = [
    { key: 'all',         label: 'All' },
    { key: 'Electronic',  label: 'Electronic' },
    { key: 'Lo-Fi',       label: 'Lo-Fi' },
    { key: 'Ambient',     label: 'Ambient' },
    { key: 'Hip-Hop/Rap', label: 'Hip-Hop/Rap' },
    { key: 'House',       label: 'House' },
    { key: 'Techno',      label: 'Techno' },
    { key: 'Jazz',        label: 'Jazz' },
    { key: 'Classical',   label: 'Classical' }
  ];

  const MusicApp = (function () {
    const API = 'https://discoveryprovider.audius.co/v1';
    const APP_NAME = 'toluOS';
    // To lift the rate limit: register at audius.co/api-plans, then add the
    // bearer token below and include it in HEADERS ('Authorization': 'Bearer ...').
    const HEADERS = { 'X-App-Name': APP_NAME };

    const state = {
      queue: [],     // [{ id, title, user, duration, artwork, streamUrl, genre }]
      index: -1,
      playing: false,
      volume: 0.5,
      genre: 'all',
      query: '',
      pending: false,
      track: null    // currently loaded track object (mirrors state.queue[index])
    };

    let audio = null;
    let ctx = null;        // AudioContext (lazy, user-gesture gated)
    let analyser = null;
    let rafId = null;
    const cache = new Map();
    const CACHE_TTL = 5 * 60 * 1000;

    const subscribers = new Set();

    function emit() {
      subscribers.forEach((fn) => {
        try { fn(state); } catch (_) {}
      });
    }
    function subscribe(fn) { subscribers.add(fn); return () => subscribers.delete(fn); }

    async function fetchJSON(path, params) {
      const url = new URL(API + path);
      url.searchParams.set('appName', APP_NAME);
      Object.keys(params || {}).forEach((k) => {
        if (params[k] !== undefined && params[k] !== null) url.searchParams.set(k, params[k]);
      });
      const cached = cache.get(url.toString());
      if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
      const res = await fetch(url.toString(), { headers: HEADERS });
      if (!res.ok) throw new Error('Audius ' + res.status);
      const json = await res.json();
      cache.set(url.toString(), { ts: Date.now(), data: json });
      return json;
    }

    function shapeTrack(t) {
      return {
        id: t.id,
        title: t.title,
        user: (t.user && (t.user.name || t.user.handle)) || 'Unknown',
        handle: (t.user && t.user.handle) || '',
        duration: t.duration || 0,
        genre: t.genre || '',
        mood: t.mood || '',
        artwork: (t.artwork && (t.artwork['480x480'] || t.artwork['150x150'] || t.artwork['1000x1000'])) || '',
        streamUrl: (t.stream && t.stream.url) || '',
        permalink: t.permalink || ''
      };
    }

    async function trending(genre) {
      const params = { limit: 20 };
      if (genre && genre !== 'all') params.genre = genre;
      const json = await fetchJSON('/tracks/trending', params);
      return (json.data || []).map(shapeTrack);
    }
    async function search(q) {
      const json = await fetchJSON('/tracks/search', { query: q, limit: 20 });
      return (json.data || []).map(shapeTrack);
    }

    function ensureAudio() {
      if (audio) return audio;
      audio = new Audio();
      audio.preload = 'auto';
      audio.volume = state.volume;
      audio.addEventListener('ended', () => next());
      audio.addEventListener('error', () => {
        // Honest fallback: keep UI in sync but show a "stream unavailable" hint
        state.playing = false;
        emit();
      });
      return audio;
    }

    function ensureCtx() {
      if (ctx) return ctx;
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        const src = ctx.createMediaElementSource(ensureAudio());
        src.connect(analyser);
        analyser.connect(ctx.destination);
      } catch (_) {
        ctx = null; analyser = null;
      }
      return ctx;
    }

    function load(i) {
      if (i < 0 || i >= state.queue.length) return;
      state.index = i;
      state.track = state.queue[i];
      const a = ensureAudio();
      a.src = state.track.streamUrl || '';
      a.load();
      emit();
    }

    function play() {
      if (state.index < 0 && state.queue.length) load(0);
      const a = ensureAudio();
      ensureCtx(); // user-gesture gate: ctx created here
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
      a.play().then(() => {
        state.playing = true;
        emit();
        startBeat();
      }).catch(() => {
        state.playing = false;
        emit();
      });
    }
    function pause() {
      if (audio) audio.pause();
      state.playing = false;
      stopBeat();
      emit();
    }
    function toggle() { state.playing ? pause() : play(); }
    function next() {
      if (!state.queue.length) return;
      const ni = (state.index + 1) % state.queue.length;
      load(ni);
      if (state.playing) play();
    }
    function prev() {
      if (!state.queue.length) return;
      const ni = (state.index - 1 + state.queue.length) % state.queue.length;
      load(ni);
      if (state.playing) play();
    }
    function setVolume(v) {
      state.volume = Math.max(0, Math.min(1, v));
      if (audio) audio.volume = state.volume;
      emit();
    }
    function setQueue(q) { state.queue = q; state.index = -1; state.track = null; emit(); }
    function setGenre(g) { state.genre = g; emit(); }
    function setQuery(q) { state.query = q; }

    async function loadTrending(genre) {
      state.pending = true; emit();
      try {
        const tracks = await trending(genre || state.genre);
        setQueue(tracks);
      } catch (e) {
        setQueue([]);
      } finally {
        state.pending = false; emit();
      }
    }
    async function runSearch(q) {
      if (!q) { loadTrending(state.genre); return; }
      state.pending = true; emit();
      try {
        const tracks = await search(q);
        setQueue(tracks);
      } catch (e) {
        setQueue([]);
      } finally {
        state.pending = false; emit();
      }
    }

    // AudioContext beat pulse — writes state.beatEnergy (0..1) on emit().
    let energy = 0;
    function tickBeat() {
      if (!analyser || !state.playing) { energy *= 0.85; state.beatEnergy = energy; emit(); rafId = requestAnimationFrame(tickBeat); return; }
      const arr = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(arr);
      // bass band only (first 12 bins ~ 0–1.7 kHz)
      let sum = 0;
      for (let i = 0; i < 12; i++) sum += arr[i];
      const level = sum / (12 * 255);
      energy = energy * 0.7 + level * 0.3;
      state.beatEnergy = energy;
      emit();
      rafId = requestAnimationFrame(tickBeat);
    }
    function startBeat() {
      if (rafId) return;
      tickBeat();
    }
    function stopBeat() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      energy = 0;
      state.beatEnergy = 0;
      emit();
    }

    return { state, subscribe, play, pause, toggle, next, prev, setVolume, loadTrending, runSearch, setGenre, setQuery, getGenres: () => GENRES };
  })();

  // Allow other windows (folder, etc.) to refresh Music state via a single emitter
  window.MusicApp = MusicApp;

  function buildMusicBody(project) {
    const wrap = document.createElement('div');
    wrap.className = 'audio-body';

    // Search row
    const searchRow = document.createElement('div');
    searchRow.className = 'audio-search-row';
    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'audio-search';
    search.placeholder = 'Search Audius…';
    search.setAttribute('aria-label', 'Search Audius tracks');
    searchRow.appendChild(search);
    const searchBtn = document.createElement('button');
    searchBtn.className = 'audio-search-btn';
    searchBtn.textContent = 'Search';
    searchRow.appendChild(searchBtn);
    wrap.appendChild(searchRow);

    // Genre chips
    const chips = document.createElement('div');
    chips.className = 'audio-chips';
    MusicApp.getGenres().forEach((g) => {
      const c = document.createElement('button');
      c.className = 'audio-chip' + (g.key === MusicApp.state.genre ? ' active' : '');
      c.dataset.genre = g.key;
      c.textContent = g.label;
      chips.appendChild(c);
    });
    wrap.appendChild(chips);

    // Track list
    const list = document.createElement('div');
    list.className = 'audio-list';
    list.id = 'audio-list';
    const placeholder = document.createElement('p');
    placeholder.className = 'audio-list-empty';
    placeholder.textContent = 'Loading trending tracks…';
    list.appendChild(placeholder);
    wrap.appendChild(list);

    // Now-playing strip
    const np = document.createElement('div');
    np.className = 'audio-now-playing';
    np.id = 'audio-now-playing';
    np.innerHTML = `
      <div class="audio-np-art"><span class="audio-np-art-glyph">♪</span></div>
      <div class="audio-np-meta">
        <div class="audio-np-title">Nothing playing</div>
        <div class="audio-np-artist">Search or pick a track to start</div>
      </div>
      <div class="audio-transport">
        <button class="audio-btn" data-act="prev" aria-label="Previous">⏮</button>
        <button class="audio-btn primary" data-act="play" aria-label="Play / pause">▶</button>
        <button class="audio-btn" data-act="next" aria-label="Next">⏭</button>
      </div>
      <div class="audio-progress"><div class="audio-progress-fill"></div></div>
      <div class="audio-volume">
        <span class="audio-volume-label">VOL</span>
        <input type="range" class="audio-volume-slider" min="0" max="100" value="50" aria-label="Volume">
      </div>`;
    wrap.appendChild(np);

    // Render queue into list
    function renderList() {
      const q = MusicApp.state.queue;
      list.innerHTML = '';
      if (MusicApp.state.pending && q.length === 0) {
        const p = document.createElement('p');
        p.className = 'audio-list-empty';
        p.textContent = 'Loading…';
        list.appendChild(p);
        return;
      }
      if (!q.length) {
        const p = document.createElement('p');
        p.className = 'audio-list-empty';
        p.textContent = 'No tracks — try another genre or search term.';
        list.appendChild(p);
        return;
      }
      q.forEach((t, i) => {
        const row = document.createElement('button');
        row.className = 'audio-row' + (i === MusicApp.state.index ? ' playing' : '');
        row.dataset.idx = i;
        const dur = t.duration ? formatDuration(t.duration) : '';
        row.innerHTML = `
          <div class="audio-row-art">${t.artwork ? `<img src="${escapeHtml(t.artwork)}" alt="" loading="lazy" decoding="async">` : '<span class="audio-row-art-glyph">♪</span>'}</div>
          <div class="audio-row-meta">
            <div class="audio-row-title">${escapeHtml(t.title)}</div>
            <div class="audio-row-artist">${escapeHtml(t.user)} · ${escapeHtml(t.genre || '')}</div>
          </div>
          <div class="audio-row-time">${dur}</div>`;
        row.addEventListener('click', () => {
          MusicApp.state.index = i;
          MusicApp.state.track = t;
          MusicApp.play();
        });
        list.appendChild(row);
      });
    }

    function renderNP() {
      const t = MusicApp.state.track;
      np.classList.toggle('active', !!t);
      np.classList.toggle('playing', MusicApp.state.playing);
      const artEl = np.querySelector('.audio-np-art');
      if (t && t.artwork) {
        artEl.innerHTML = `<img src="${escapeHtml(t.artwork)}" alt="" loading="lazy" decoding="async">`;
      } else if (t) {
        artEl.innerHTML = `<span class="audio-np-art-glyph">♪</span>`;
      } else {
        artEl.innerHTML = `<span class="audio-np-art-glyph">♪</span>`;
      }
      np.querySelector('.audio-np-title').textContent = t ? t.title : 'Nothing playing';
      np.querySelector('.audio-np-artist').textContent = t ? `${t.user} · ${t.genre || ''}` : 'Search or pick a track to start';
      np.querySelector('[data-act="play"]').textContent = MusicApp.state.playing ? '⏸' : '▶';

      // Progress
      const fill = np.querySelector('.audio-progress-fill');
      if (t && audio && audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + '%';
      } else {
        fill.style.width = '0%';
      }
      fill.style.setProperty('--beat', MusicApp.state.beatEnergy || 0);
      // Beat energy drives a subtle gold glow under the progress fill
      fill.style.boxShadow = MusicApp.state.playing
        ? `0 0 ${6 + (MusicApp.state.beatEnergy || 0) * 18}px oklch(0.78 0.16 85 / ${0.25 + (MusicApp.state.beatEnergy || 0) * 0.5})`
        : 'none';
    }

    // Event wiring
    chips.addEventListener('click', (e) => {
      const c = e.target.closest('.audio-chip');
      if (!c) return;
      chips.querySelectorAll('.audio-chip').forEach((cc) => cc.classList.toggle('active', cc === c));
      MusicApp.setGenre(c.dataset.genre);
      MusicApp.loadTrending(c.dataset.genre);
    });
    function doSearch() {
      const q = search.value.trim();
      MusicApp.setQuery(q);
      MusicApp.runSearch(q);
    }
    searchBtn.addEventListener('click', doSearch);
    search.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    np.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'prev') MusicApp.prev();
      else if (b.dataset.act === 'play') MusicApp.toggle();
      else if (b.dataset.act === 'next') MusicApp.next();
    });
    np.querySelector('.audio-volume-slider').addEventListener('input', (e) => {
      MusicApp.setVolume(parseInt(e.target.value, 10) / 100);
    });

    // Subscribe to state changes
    const unsub = MusicApp.subscribe(() => { renderList(); renderNP(); });

    // Lazy-load trending on first render (after the window is built)
    setTimeout(() => MusicApp.loadTrending('all'), 50);

    // Cleanup when the window is closed
    setTimeout(() => {
      const win = wrap.closest('.window');
      if (win) win.addEventListener('window-closed', unsub, { once: true });
    }, 0);

    // Trigger initial paint
    renderList();
    renderNP();
    return wrap;
  }

  function formatDuration(s) {
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  }

// ============================================================
// Now-Playing desktop widget + Quick Links + Launchpad overlay
// ============================================================
  function setupNowPlayingWidget() {
    const w = document.getElementById('now-playing-widget');
    if (!w) return;
    function paint() {
      const t = MusicApp.state.track;
      w.classList.toggle('active', !!t);
      const art = w.querySelector('.npw-art');
      const title = w.querySelector('.npw-title');
      const artist = w.querySelector('.npw-artist');
      const play = w.querySelector('[data-act="play"]');
      const fill = w.querySelector('.npw-fill');
      if (t && t.artwork) {
        art.innerHTML = `<img src="${escapeHtml(t.artwork)}" alt="" loading="lazy" decoding="async">`;
      } else {
        art.innerHTML = `<span class="npw-glyph">♪</span>`;
      }
      title.textContent = t ? t.title : 'Pick a track';
      artist.textContent = t ? `${t.user} · ${t.genre || ''}` : 'Music — open the player';
      play.textContent = MusicApp.state.playing ? '⏸' : '▶';
      const beat = MusicApp.state.beatEnergy || 0;
      fill.style.transform = `scaleX(${MusicApp.state.playing ? (1 + beat * 0.05) : 1})`;
      fill.style.boxShadow = MusicApp.state.playing
        ? `0 0 ${6 + beat * 18}px oklch(0.78 0.16 85 / ${0.25 + beat * 0.5})`
        : 'none';
    }
    MusicApp.subscribe(paint);
    w.querySelector('[data-act="play"]').addEventListener('click', () => MusicApp.toggle());
    w.querySelector('[data-act="open"]').addEventListener('click', () => focusOrOpen('music'));
    w.querySelector('[data-act="next"]').addEventListener('click', () => MusicApp.next());
    paint();
  }

  function setupQuickLinks() {
    const q = document.getElementById('quick-links');
    if (!q) return;
    const links = [
      { label: 'Résumé', href: 'assets/docs/Tolu_Shekoni_Resume.docx', glyph: '§' },
      { label: 'Stripe Clone', href: 'https://stripe-clone-bn0.pages.dev/', glyph: '✦' },
      { label: 'Vouch', href: 'https://vouch.tolu-a-shekoni.workers.dev', glyph: '◆' },
      { label: 'GitHub', href: 'https://github.com/ToXMon', glyph: '◐' }
    ];
    q.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'ql-pills';
    links.forEach((l) => {
      const a = document.createElement('a');
      a.className = 'ql-pill';
      a.href = l.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `<span class="ql-glyph">${escapeHtml(l.glyph)}</span><span class="ql-label">${escapeHtml(l.label)}</span><span class="ql-arrow">↗</span>`;
      list.appendChild(a);
    });
    q.appendChild(list);
    const meta = document.createElement('p');
    meta.className = 'ql-meta';
    meta.textContent = 'Receipt freshness: 2026-09-18 — see Welcome › Receipts for live probes.';
    q.appendChild(meta);
  }

  function setupLaunchpad() {
    const pad = document.getElementById('launchpad');
    if (!pad) return;
    let lastFocus = null;
    function paint() {
      pad.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'lp-grid';
      const items = [
        ...TOP_LEVEL_APPS.map((a) => ({ id: a.id, label: a.label, sub: a.title, glyph: a.glyph, icon: a.icon })),
        ...PROJECTS.map((p) => ({ id: p.id, label: p.label, sub: p.title, glyph: '◫', icon: p.icon || p.thumb }))
      ];
      items.forEach((it) => {
        const btn = document.createElement('button');
        btn.className = 'lp-cell';
        btn.dataset.id = it.id;
        const inner = it.icon
          ? `<div class="lp-cell-icon"><img src="${escapeHtml(it.icon)}" alt="" loading="lazy" decoding="async"></div>`
          : `<div class="lp-cell-icon lp-cell-glyph"><span>${escapeHtml(it.glyph)}</span></div>`;
        btn.innerHTML = `${inner}<div class="lp-cell-label">${escapeHtml(it.label)}</div>`;
        btn.addEventListener('click', () => {
          hide();
          focusOrOpen(it.id);
        });
        grid.appendChild(btn);
      });
      pad.appendChild(grid);
    }
    function show() {
      lastFocus = focusedId;
      paint();
      pad.classList.add('open');
      pad.setAttribute('aria-hidden', 'false');
    }
    function hide() {
      pad.classList.remove('open');
      pad.setAttribute('aria-hidden', 'true');
    }
    function toggle() { pad.classList.contains('open') ? hide() : show(); }
    pad.addEventListener('click', (e) => { if (e.target === pad) hide(); });
    // Expose for keyboard handler
    window.toluOS = window.toluOS || {};
    window.toluOS.launchpad = { show, hide, toggle };
  }

  function init() {
    renderDesktopIcons();
    buildDock();
    setupStartBtn();
    setupSoundToggle();
    setupContextMenu();
    setupShortcuts();
    setupKeyboard();
    setupMobileSwipe();
    setupMenubarActions();
    setupWallpaperParallax();
    initConstellation();
    setupNowPlayingWidget();
    setupQuickLinks();
    setupLaunchpad();
    syncMenubar();

// Auto-open Welcome window on first load (desktop metaphor "home")
    setTimeout(() => openProjectWindow('welcome'), 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

 // Expose minimal API for tests. MERGE with any prior assignments (initConstellation
 // sets `heroStats`, `heroScene` on window.toluOS — preserve those).
  window.toluOS = Object.assign(window.toluOS || {}, {
    openProjectWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    resetLayout,
    showShortcuts,
    cycleWindows,
    commitSnap,
    windows: () => Array.from(windows.keys()),
    instanceOrder: () => zOrder.slice(),
    zOrder: () => zOrder.slice(),
    focused: () => focusedId,
    lastLaunchOrigin: () => lastLaunchOrigin,
    layoutVersion: () => LAYOUT_VERSION,
    stateOf: (iid) => {
      const s = windows.get(iid);
      return s ? { x: s.x, y: s.y, w: s.w, h: s.h, snapped: s.snapped || null } : null;
    }
  });

})();
