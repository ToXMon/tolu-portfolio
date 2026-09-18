/* ============================================================
   Tolu Shekoni Portfolio — script.js
   Vanilla IIFE. No external deps. Source of truth: DESIGN.md
   ============================================================ */
(function () {
  'use strict';

  // Flip the .no-js class off as soon as this script executes, so CSS that
  // depends on JS-driven reveal animations can take over. If JS is disabled,
  // the class stays and the no-script fallback styles apply.
  document.documentElement.classList.remove('no-js');

  /* ----------------------------------------------------------------
     1. Reduced-motion + capability probes
     ---------------------------------------------------------------- */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasIO         = 'IntersectionObserver' in window;
  const hasCanvas     = (() => {
    const c = document.createElement('canvas');
    return !!(c.getContext && c.getContext('2d'));
  })();

  /* ----------------------------------------------------------------
     2. Safe-link helper (port from prior version)
     ---------------------------------------------------------------- */
  function isSafeProjectLink(link) {
    if (!link || !link.href || !link.label) return false;
    try {
      const url = new URL(link.href, window.location.href);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch (_) {
      return false;
    }
  }

  /* ----------------------------------------------------------------
     3. Project data (8 real projects, links preserved)
     ---------------------------------------------------------------- */
  const portfolioProjects = [
    {
      title: 'AdaL Educational Stripe Clone',
      label: 'Live',
      proof: 'High-fidelity educational Stripe hero clone shipped from AdaL bootcamp as a React static site on Cloudflare Pages, with public demo, X submission proof, repo, and README evidence.',
      thumbnail: 'assets/img/project-stripe.svg',
      featured: true,
      links: [
        { label: 'Live demo ↗',       href: 'https://stripe-clone-bn0.pages.dev/',                  type: 'demo' },
        { label: 'Bootcamp submit ↗', href: 'https://67a97296.stripe-clone-bn0.pages.dev/',        type: 'proof' },
        { label: 'X proof post',      href: 'https://x.com/tolu_evm/status/2073978784747786320',  type: 'proof' },
        { label: 'GitHub repo',       href: 'https://github.com/ToXMon/adal-bootcamp-2',           type: 'repo' },
        { label: 'README evidence',   href: 'https://github.com/ToXMon/adal-bootcamp-2/blob/feat/stripe-clone-deploy/README.md', type: 'docs' }
      ]
    },
    {
      title: 'Encode Solana / SignalForge',
      label: 'Devnet',
      proof: 'Solana learning-to-shipping body of work across programs, token flows, dApp patterns, tests, and devnet verification evidence.',
      thumbnail: 'assets/img/project-signalforge.svg',
      featured: true,
      links: []
    },
    {
      title: 'Vouch / Monad',
      label: 'Live',
      proof: 'AI-verified commitment and claim protocol work for Monad trust workflows, backed by a public repository, live Worker root, and health endpoint evidence.',
      thumbnail: 'assets/img/project-vouch.svg',
      featured: true,
      links: [
        { label: 'Live app ↗',       href: 'https://vouch.tolu-a-shekoni.workers.dev',           type: 'demo' },
        { label: 'Health endpoint',  href: 'https://vouch.tolu-a-shekoni.workers.dev/api/health', type: 'proof' },
        { label: 'GitHub repo',      href: 'https://github.com/ToXMon/vouch',                   type: 'repo' },
        { label: 'README',           href: 'https://github.com/ToXMon/vouch/blob/main/README.md', type: 'docs' }
      ]
    },
    {
      title: 'Crypto Scanner',
      label: 'Repo',
      proof: 'Crypto scanner tooling for token, liquidity, and market-risk review, supported by public repository evidence and a related workflow gallery.',
      featured: false,
      links: [
        { label: 'GitHub repo',        href: 'https://github.com/ToXMon/catecoin-scanner',                type: 'repo' },
        { label: 'README',             href: 'https://github.com/ToXMon/catecoin-scanner/blob/main/README.md', type: 'docs' },
        { label: 'Workflow gallery ↗', href: 'https://toxmon.github.io/agent-workflows/',                 type: 'demo' }
      ]
    },
    {
      title: 'X Monitor',
      label: 'Local',
      proof: 'Local social-signal monitoring workflow for narrative, trend, and research queue detection; no standalone public product URL is claimed.',
      featured: false,
      links: [
        { label: 'Workflow gallery ↗', href: 'https://toxmon.github.io/agent-workflows/', type: 'demo' }
      ]
    },
    {
      title: 'AgentTrust',
      label: 'Repo',
      proof: 'Agent trust and verification protocol work with public repository and README evidence.',
      featured: false,
      links: [
        { label: 'GitHub repo', href: 'https://github.com/ToXMon/agenttrust',                type: 'repo' },
        { label: 'README',      href: 'https://github.com/ToXMon/agenttrust/blob/main/README.md', type: 'docs' }
      ]
    },
    {
      title: 'Memory Palace',
      label: 'Documented',
      proof: 'Knowledge system for preserving context, recall, and durable output across agent workflows.',
      featured: false,
      links: [
        { label: 'GitHub repo', href: 'https://github.com/ToXMon/tolu', type: 'repo' }
      ]
    },
    {
      title: 'Agent Skills',
      label: 'Tooling',
      proof: 'Reusable Agent Zero skills and workflow tools packaged for repeatable agent workflows.',
      featured: false,
      links: []
    }
  ];

  window.portfolioProjects = portfolioProjects;

  /* ----------------------------------------------------------------
     4. Project card renderer (rewrites the work-grid)
     ---------------------------------------------------------------- */
  function renderPortfolioProjects(projects) {
    const grid = document.getElementById('work-grid');
    if (!grid || !Array.isArray(projects) || !projects.length) return;

    const frag = document.createDocumentFragment();

    projects.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = 'work-card reveal' + (project.featured ? ' featured' : '');
      card.setAttribute('role', 'listitem');

      const header = document.createElement('div');
      header.className = 'work-card-header';

      const num = document.createElement('span');
      num.className = 'work-card-num';
      num.textContent = String(index + 1).padStart(2, '0');
      header.appendChild(num);

      if (project.label) {
        const label = document.createElement('span');
        label.className = 'tag';
        label.textContent = project.label;
        header.appendChild(label);
      }
      card.appendChild(header);

      // thumbnail (if a featured project and the image exists; safe <img> onerror hides)
      if (project.thumbnail && project.featured) {
        const img = document.createElement('img');
        img.className = 'work-card-thumb';
        img.src = project.thumbnail;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('error', () => { img.style.display = 'none'; });
        card.appendChild(img);
      }

      const title = document.createElement('h3');
      title.textContent = project.title || 'Untitled project';
      card.appendChild(title);

      if (project.proof) {
        const proof = document.createElement('p');
        proof.textContent = project.proof;
        card.appendChild(proof);
      }

      const links = (project.links || []).filter(isSafeProjectLink);
      if (links.length) {
        const list = document.createElement('div');
        list.className = 'work-card-links';
        links.forEach((link) => {
          const a = document.createElement('a');
          a.className = 'work-card-link' + (link.type === 'demo' ? ' work-card-link--demo' : link.type === 'proof' ? ' work-card-link--proof' : '');
          a.href = link.href;
          a.textContent = link.label;
          a.rel = 'noopener noreferrer';
          a.target = '_blank';
          list.appendChild(a);
        });
        card.appendChild(list);
      }

      frag.appendChild(card);
    });

    grid.replaceChildren(frag);

    // Re-trigger reveal observer for the freshly rendered cards.
    if (hasIO) {
      const fresh = grid.querySelectorAll('.reveal');
      fresh.forEach((el) => revealObserver.observe(el));
    } else {
      grid.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    }
  }

  /* ----------------------------------------------------------------
     5. Reveal observer (port from prior version)
     ---------------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = hasIO ? new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target.closest('section') || entry.target.closest('main');
          const siblings = parent ? parent.querySelectorAll('.reveal') : [entry.target];
          const idx = Array.prototype.indexOf.call(siblings, entry.target);
          const delay = Math.max(0, idx) * 100;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  ) : null;

  if (revealObserver) {
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------------
     6. Section-rule divider
     ---------------------------------------------------------------- */
  const rules = document.querySelectorAll('.section-rule');
  if (hasIO && rules.length) {
    const ruleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            ruleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    rules.forEach((el) => ruleObserver.observe(el));
  } else {
    rules.forEach((el) => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------------
     7. Hero word entrance (staggered translateY)
     ---------------------------------------------------------------- */
  function splitTextToWords(element) {
    if (!element || !element.textContent) return;
    const text = element.textContent;
    const words = text.split(/(\s+)/);
    element.textContent = '';
    words.forEach((word, i) => {
      if (word.trim() === '') {
        element.appendChild(document.createTextNode(word));
        return;
      }
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      span.style.verticalAlign = 'bottom';
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.style.transform = 'translateY(110%)';
      inner.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
      inner.style.transitionDelay = (i * 80) + 'ms';
      inner.textContent = word;
      span.appendChild(inner);
      element.appendChild(span);
    });
    requestAnimationFrame(() => {
      setTimeout(() => {
        element.querySelectorAll('span > span').forEach((inner) => {
          inner.style.transform = 'translateY(0)';
        });
      }, 200);
    });
  }

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !reducedMotion) {
    splitTextToWords(heroTitle);
  }

  /* ----------------------------------------------------------------
     8. Constellation canvas (vanilla 2D)
     ---------------------------------------------------------------- */
  const canvas = document.getElementById('constellation');
  const backdrop = document.querySelector('.hero-backdrop');

  function initConstellation() {
    if (!canvas || !hasCanvas || reducedMotion) {
      if (canvas) canvas.classList.add('disabled');
      // backdrop stays visible (its default)
      return;
    }

    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    const mouse = { x: -1000, y: -1000, active: false, attract: false };
    const linkRadius = 130;
    const mouseRadius = 180;
    const maxSpeed = 0.18;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.floor(rect.width  * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(rect.width, rect.height);
    }

    function seed(w, h) {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const baseCount = Math.floor(w / 12);
      const count = Math.max(40, Math.min(140, isCoarse ? Math.floor(baseCount * 0.5) : baseCount));
      nodes = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * maxSpeed * 2,
        vy: (Math.random() - 0.5) * maxSpeed * 2,
        r: Math.random() * 1.4 + 0.6,
        phase: Math.random() * Math.PI * 2
      }));
    }

    function step(w, h, dt) {
      // Cap dt to survive tab throttling.
      const cdt = Math.min(dt, 1 / 30);
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Mouse interaction: attract or repel
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d  = Math.hypot(dx, dy);
          if (d > 0 && d < mouseRadius) {
            const f = (1 - d / mouseRadius) * 0.4;
            if (mouse.attract) {
              n.vx -= (dx / d) * f;
              n.vy -= (dy / d) * f;
            } else {
              n.vx += (dx / d) * f;
              n.vy += (dy / d) * f;
            }
          }
        }

        // Drift + integrate
        n.x += n.vx;
        n.y += n.vy;

        // Mild drag so velocity doesn't blow up
        n.vx *= 0.992;
        n.vy *= 0.992;

        // Re-energize if too slow
        if (Math.abs(n.vx) < 0.02 && Math.abs(n.vy) < 0.02) {
          n.vx += (Math.random() - 0.5) * 0.06;
          n.vy += (Math.random() - 0.5) * 0.06;
        }

        // Wrap-around so it looks infinite
        if (n.x < -10) n.x = w + 10;
        else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        else if (n.y > h + 10) n.y = -10;

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'oklch(0.85 0.14 85 / 0.95)';
        ctx.fill();
      }

      // Draw links (gold threads)
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.hypot(dx, dy);
          if (d < linkRadius) {
            const alpha = (1 - d / linkRadius) * 0.55;
            ctx.strokeStyle = `oklch(0.82 0.13 85 / ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    function loop(t) {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dt = lastT ? (t - lastT) / 1000 : 1 / 60;
      lastT = t;
      step(w, h, dt);
      rafId = requestAnimationFrame(loop);
    }

    let lastT = 0;
    let rafId = 0;

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
    }
    function onClick() {
      mouse.attract = !mouse.attract;
    }

    function start() {
      resize();
      // Hide the static backdrop once canvas is live
      if (backdrop) backdrop.classList.add('hidden');
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(rafId);
      if (backdrop) backdrop.classList.remove('hidden');
    }

    // Throttled resize
    let resizeT = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(resize, 150);
    });

    canvas.addEventListener('mousemove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave, { passive: true });
    canvas.addEventListener('click', onClick);

    // Pause when off-screen to save battery
    if (hasIO) {
      const hero = document.querySelector('.hero');
      if (hero) {
        const visObserver = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) start(); else stop();
        }, { threshold: 0.01 });
        visObserver.observe(hero);
      } else {
        start();
      }
    } else {
      start();
    }
  }

  /* ----------------------------------------------------------------
     9. Magnetic CTA (desktop with fine pointer only)
     ---------------------------------------------------------------- */
  if (finePointer) {
    const ctas = document.querySelectorAll('.cta-magnetic, .hero-actions .cta');
    ctas.forEach((cta) => {
      cta.addEventListener('mousemove', (e) => {
        const r = cta.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.18;
        cta.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      });
      cta.addEventListener('mouseleave', () => {
        cta.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------------
     10. Custom cursor dot
     ---------------------------------------------------------------- */
  if (finePointer) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    let dotX = -100, dotY = -100, mouseX = -100, mouseY = -100;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!dot.classList.contains('active')) dot.classList.add('active');
    }, { passive: true });
    document.addEventListener('mouseleave', () => dot.classList.remove('active'));

    (function dotLoop() {
      dotX += (mouseX - dotX) * 0.18;
      dotY += (mouseY - dotY) * 0.18;
      dot.style.transform = `translate3d(${dotX - 4}px, ${dotY - 4}px, 0)`;
      requestAnimationFrame(dotLoop);
    })();
  }

  /* ----------------------------------------------------------------
     11. Nav scroll effect + hamburger + smooth scroll
     ---------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const hamburger = header.querySelector('.hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const isOpen = header.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Smooth-scroll for in-page anchors, close mobile nav on click
    header.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        if (header.classList.contains('nav-open')) {
          header.classList.remove('nav-open');
          if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ----------------------------------------------------------------
     12. Bootstrap
     ---------------------------------------------------------------- */
  try {
    renderPortfolioProjects(portfolioProjects);
  } catch (err) {
    console.warn('Project render failed; static fallback remains.', err);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConstellation);
  } else {
    initConstellation();
  }
})();
