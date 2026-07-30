(function () {
  'use strict';

  var portfolioProjects = [
    {
      title: 'AdaL Educational Stripe Clone',
      label: 'Source + README',
      proof: 'Educational AdaL bootcamp project showing loop-engineered frontend practice through a Stripe-style interface study, with public repository and README evidence.',
      evidenceType: 'verified-docs',
      links: [
        {
          label: 'GitHub repository',
          href: 'https://github.com/ToXMon/adal-bootcamp-2',
          type: 'repo'
        },
        {
          label: 'README evidence',
          href: 'https://github.com/ToXMon/adal-bootcamp-2/blob/feat/stripe-clone-deploy/README.md',
          type: 'docs'
        }
      ],
      group: 'featured',
      publicCopySafe: true
    },
    {
      title: 'Encode Solana / SignalForge',
      label: 'Devnet + Docs',
      proof: 'Solana learning-to-shipping body of work across programs, token flows, dApp patterns, tests, and devnet verification evidence.',
      evidenceType: 'devnet',
      links: [],
      group: 'featured',
      publicCopySafe: true
    },
    {
      title: 'Vouch / Monad',
      label: 'Live + Source',
      proof: 'AI-verified commitment and claim protocol work for Monad trust workflows, backed by a public repository, README, live Worker root, and health endpoint evidence.',
      evidenceType: 'verified-live',
      links: [
        {
          label: 'Live app',
          href: 'https://vouch.tolu-a-shekoni.workers.dev',
          type: 'demo'
        },
        {
          label: 'Health endpoint',
          href: 'https://vouch.tolu-a-shekoni.workers.dev/api/health',
          type: 'demo'
        },
        {
          label: 'GitHub repository',
          href: 'https://github.com/ToXMon/vouch',
          type: 'repo'
        },
        {
          label: 'README',
          href: 'https://github.com/ToXMon/vouch/blob/main/README.md',
          type: 'docs'
        }
      ],
      group: 'featured',
      publicCopySafe: true
    },
    {
      title: 'Crypto Scanner',
      label: 'Repo + Workflow Gallery',
      proof: 'Crypto scanner tooling for token, liquidity, and market-risk review, supported by public repository evidence and a related workflow gallery rather than a hosted scanner dashboard claim.',
      evidenceType: 'verified-repo',
      links: [
        {
          label: 'GitHub repository',
          href: 'https://github.com/ToXMon/catecoin-scanner',
          type: 'repo'
        },
        {
          label: 'README',
          href: 'https://github.com/ToXMon/catecoin-scanner/blob/main/README.md',
          type: 'docs'
        },
        {
          label: 'Workflow gallery',
          href: 'https://toxmon.github.io/agent-workflows/',
          type: 'demo'
        }
      ],
      group: 'secondary',
      publicCopySafe: true
    },
    {
      title: 'X Monitor',
      label: 'Local Workflow',
      proof: 'Local social-signal monitoring workflow for narrative, trend, and research queue detection; no standalone public product URL is claimed.',
      evidenceType: 'local-only',
      links: [
        {
          label: 'Workflow gallery',
          href: 'https://toxmon.github.io/agent-workflows/',
          type: 'demo'
        }
      ],
      group: 'secondary',
      publicCopySafe: true
    },
    {
      title: 'AgentTrust',
      label: 'Repo + README',
      proof: 'Agent trust and verification protocol work with public repository and README evidence; no current live Akash frontend claim is included.',
      evidenceType: 'verified-repo',
      links: [
        {
          label: 'GitHub repository',
          href: 'https://github.com/ToXMon/agenttrust',
          type: 'repo'
        },
        {
          label: 'README',
          href: 'https://github.com/ToXMon/agenttrust/blob/main/README.md',
          type: 'docs'
        }
      ],
      group: 'secondary',
      publicCopySafe: true
    },
    {
      title: 'Memory Palace',
      label: 'Documented System',
      proof: 'Knowledge system for preserving context, recall, and durable output across agent workflows.',
      evidenceType: 'docs',
      links: [
        {
          label: 'GitHub repository',
          href: 'https://github.com/ToXMon/tolu',
          type: 'repo'
        }
      ],
      group: 'documented',
      publicCopySafe: true
    },
    {
      title: 'Agent Skills',
      label: 'Tooling',
      proof: 'Reusable Agent Zero skills and workflow tools packaged for repeatable agent workflows.',
      evidenceType: 'docs',
      links: [],
      group: 'documented',
      publicCopySafe: true
    }
  ];

  window.portfolioProjects = portfolioProjects;

  function formatProjectMeta(project) {
    var meta = [];
    if (project.group) {
      meta.push(project.group);
    }
    if (project.evidenceType) {
      meta.push(project.evidenceType);
    }
    return meta.join(' · ');
  }

  function isSafeProjectLink(link) {
    if (!link || !link.href || !link.label) {
      return false;
    }
    try {
      var url = new URL(link.href, window.location.href);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch (error) {
      return false;
    }
  }

  function renderPortfolioProjects(projects) {
    var grid = document.querySelector('.work-grid');
    if (!grid || !Array.isArray(projects) || !projects.length) {
      return;
    }

    var fragment = document.createDocumentFragment();

    projects.forEach(function (project, index) {
      var card = document.createElement('article');
      card.className = 'work-card reveal';

      var header = document.createElement('div');
      header.className = 'work-card-header';

      var number = document.createElement('span');
      number.className = 'work-card-num';
      number.textContent = String(index + 1).padStart(2, '0');
      header.appendChild(number);

      if (project.label) {
        var label = document.createElement('span');
        label.className = 'tag';
        label.textContent = project.label;
        header.appendChild(label);
      }

      card.appendChild(header);

      var title = document.createElement('h3');
      title.textContent = project.title || 'Untitled project';
      card.appendChild(title);

      if (project.proof) {
        var proof = document.createElement('p');
        proof.textContent = project.proof;
        card.appendChild(proof);
      }

      var metaText = formatProjectMeta(project);
      if (metaText) {
        var meta = document.createElement('p');
        meta.className = 'work-card-evidence';
        meta.textContent = metaText;
        card.appendChild(meta);
      }

      var links = Array.isArray(project.links) ? project.links.filter(isSafeProjectLink) : [];
      if (links.length) {
        var linkList = document.createElement('div');
        linkList.className = 'work-card-links';
        links.forEach(function (link) {
          var anchor = document.createElement('a');
          anchor.className = 'work-card-link';
          anchor.href = link.href;
          anchor.textContent = link.label;
          anchor.rel = 'noopener noreferrer';
          anchor.target = '_blank';
          linkList.appendChild(anchor);
        });
        card.appendChild(linkList);
      }

      fragment.appendChild(card);
    });

    grid.replaceChildren(fragment);
  }

  try {
    renderPortfolioProjects(portfolioProjects);
  } catch (error) {
    console.warn('Portfolio project rendering failed; static fallback remains.', error);
  }

  // 1. Staggered IntersectionObserver for .reveal animations
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var parent = entry.target.closest('section') || entry.target.closest('main');
            var siblings = parent ? parent.querySelectorAll('.reveal') : [entry.target];
            var index = Array.prototype.indexOf.call(siblings, entry.target);
            var delay = index * 100;

            setTimeout(function () {
              entry.target.classList.add('visible');
            }, delay);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // 2. Section rule divider animation
  var rules = document.querySelectorAll('.section-rule');
  if ('IntersectionObserver' in window && rules.length) {
    var ruleObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            ruleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    rules.forEach(function (el) {
      ruleObserver.observe(el);
    });
  } else {
    rules.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // 3. Hero text split animation
  function splitTextToWords(element) {
    var text = element.textContent;
    var words = text.split(/(\s+)/);
    element.innerHTML = '';
    words.forEach(function (word, i) {
      if (word.trim() === '') {
        element.appendChild(document.createTextNode(word));
        return;
      }
      var span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      span.style.verticalAlign = 'bottom';
      var inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.style.transform = 'translateY(110%)';
      inner.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
      inner.style.transitionDelay = i * 80 + 'ms';
      inner.textContent = word;
      span.appendChild(inner);
      element.appendChild(span);
    });
    requestAnimationFrame(function () {
      setTimeout(function () {
        var inners = element.querySelectorAll('span > span');
        inners.forEach(function (inner) {
          inner.style.transform = 'translateY(0)';
        });
      }, 200);
    });
  }

  // Apply hero text split on DOMContentLoaded
  var h1 = document.querySelector('.hero h1');
  if (h1) {
    splitTextToWords(h1);
  }

  // 4. Counter animation
  function animateCounter(element, target, duration) {
    duration = duration || 1200;
    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observe counters
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = parseInt(entry.target.getAttribute('data-count'), 10);
            if (!isNaN(target)) {
              animateCounter(entry.target, target);
            }
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // 5. Nav scroll effect
  var header = document.querySelector('.site-header');
  if (header) {
    var scrollTicking = false;
    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 100) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // 6. Hamburger toggle
  var hamburger = document.querySelector('.hamburger');
  if (hamburger && header) {
    hamburger.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // 7. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        if (header && header.classList.contains('nav-open')) {
          header.classList.remove('nav-open');
          if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });
})();
