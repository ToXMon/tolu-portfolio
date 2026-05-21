(function () {
  'use strict';

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
