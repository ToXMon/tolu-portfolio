const sections = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.16 }
);
sections.forEach((s) => io.observe(s));

const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

const projectSpecs = [
  {
    owner: 'wijnaldum-eth',
    repo: 'memevault',
    category: 'Hackathon',
    stack: 'Solidity • Web3',
    blurb: 'Experimental onchain product build focused on practical token UX and rapid iteration.'
  },
  {
    owner: 'wijnaldum-eth',
    repo: 'Zero2Production',
    category: 'Learning Sprint',
    stack: 'Backend • Product Systems',
    blurb: 'From fundamentals to production patterns with a bias toward shipping usable software.'
  },
  {
    owner: 'tolu-jnj',
    repo: 'DOT',
    category: 'Hobby Project',
    stack: 'Data • Utilities',
    blurb: 'Utility-style project showing practical problem-solving and implementation discipline.'
  },
  {
    owner: 'tolu-jnj',
    repo: 'allornothing',
    category: 'Hackathon',
    stack: 'Full Stack',
    blurb: 'Fast-turn project built under tight constraints with a focus on functional execution.'
  },
  {
    owner: 'ToXMon',
    repo: 'quickchops',
    category: 'Product Experiment',
    stack: 'Frontend • Tooling',
    blurb: 'A lightweight product experiment focused on speed, utility, and iteration quality.'
  },
  {
    owner: 'ToXMon',
    repo: 'Tier',
    category: 'Systems Build',
    stack: 'Architecture • Automation',
    blurb: 'System-level build oriented around clean structure and repeatable delivery patterns.'
  }
];

const projectGrid = document.getElementById('project-grid');
const projectsStatus = document.getElementById('projects-status');

function toCard(project) {
  return `
    <article class="blur-card project-card">
      <p class="tag">${project.owner}</p>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-meta">
        <span class="pill">${project.category}</span>
        <span class="pill">${project.stack}</span>
        <span class="pill">★ ${project.stars}</span>
        <span class="pill">${project.language}</span>
      </div>
      <div class="project-links">
        <a href="${project.url}" target="_blank" rel="noopener noreferrer">Repository</a>
      </div>
    </article>`;
}

async function fetchRepo(spec) {
  const url = `https://api.github.com/repos/${spec.owner}/${spec.repo}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' }
  });
  if (!res.ok) throw new Error(`Failed: ${spec.owner}/${spec.repo}`);
  const data = await res.json();
  return {
    owner: spec.owner,
    title: data.name,
    category: spec.category,
    stack: spec.stack,
    description: data.description || spec.blurb,
    stars: data.stargazers_count ?? 0,
    language: data.language || 'Multi-language',
    url: data.html_url,
    updatedAt: data.updated_at
  };
}

async function renderProjects() {
  if (!projectGrid) return;

  const fallback = projectSpecs.map((spec) => ({
    owner: spec.owner,
    title: spec.repo,
    category: spec.category,
    stack: spec.stack,
    description: spec.blurb,
    stars: '—',
    language: 'N/A',
    url: `https://github.com/${spec.owner}/${spec.repo}`,
    updatedAt: null
  }));

  projectGrid.innerHTML = fallback.map(toCard).join('');

  try {
    const live = await Promise.all(projectSpecs.map(fetchRepo));
    live.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    projectGrid.innerHTML = live.map(toCard).join('');
    if (projectsStatus) {
      projectsStatus.textContent = `Live GitHub metadata synced • ${new Date().toLocaleString()}`;
    }
  } catch (error) {
    if (projectsStatus) {
      projectsStatus.textContent = 'Live metadata unavailable right now — showing curated project cards.';
    }
  }
}

renderProjects();

const canvas = document.getElementById('nebula');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(140, Math.floor(window.innerWidth / 10)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.5,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    hue: Math.random() > 0.5 ? 190 : 260
  }));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 72%, 0.65)`;
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy);

      if (d < 120) {
        ctx.strokeStyle = `rgba(140, 170, 255, ${0.09 * (1 - d / 120)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();
