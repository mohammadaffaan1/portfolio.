/**
 * Mohammad Affaan's Premium Dark Portfolio
 * Main JavaScript File — Stage 2
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initActiveNavLink();
  initHeroCanvas();
  initGitHubRepos();
});

/**
 * 1. Scroll Reveal (Intersection Observer)
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('reveal--visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/**
 * 2. Navbar Scroll Effect
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
}

/**
 * 3. Mobile Menu Toggle
 */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.classList.remove('active');
    menu.classList.remove('nav-mobile-menu--open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.classList.add('active');
    menu.classList.add('nav-mobile-menu--open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('nav-mobile-menu--open');
    isOpen ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/**
 * 4. Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      const navbarHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * 5. Active Nav Link Highlighting
 */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], .nav-mobile-link[href^="#"]');
  
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('nav-link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav-link--active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-20% 0px -60% 0px' 
  });

  sections.forEach(section => observer.observe(section));
}

/**
 * 6. Hero Canvas Background
 */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  let particles = [];
  let animationId;
  let isVisible = true;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const count = Math.min(Math.floor((rect.width * rect.height) / 20000), 60);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 0.5 + 1,
      });
    }
  }

  function draw() {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 138, 219, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124, 138, 219, 0.3)';
      ctx.fill();
    });
  }

  function update() {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    });
  }

  function loop() {
    if (!isVisible) return;
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  const visObs = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !reducedMotion) {
      cancelAnimationFrame(animationId);
      loop();
    }
  }, { threshold: 0 });
  visObs.observe(canvas.parentElement);

  resize();
  createParticles();
  
  if (reducedMotion) {
    draw();
  } else {
    loop();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
      if (reducedMotion) draw();
    }, 250);
  });
}

/**
 * 7. GitHub Repository Fetcher
 * Fetches public repos from GitHub API and renders them.
 * Fails silently — the profile link is always available.
 */
async function initGitHubRepos() {
  const container = document.getElementById('githubRepos');
  if (!container) return;

  try {
    const response = await fetch('https://api.github.com/users/mohammadaffaan1/repos?sort=pushed&per_page=6');
    if (!response.ok) return;
    
    const repos = await response.json();
    if (!Array.isArray(repos) || !repos.length) return;

    // Filter out forks and user profile config repository
    const filtered = repos
      .filter(r => r && !r.fork && r.name !== 'mohammadaffaan1')
      .slice(0, 3);

    if (!filtered.length) return;

    container.innerHTML = filtered.map(repo => {
      const rawUrl = typeof repo.html_url === 'string' ? repo.html_url : '';
      const safeUrl = rawUrl.startsWith('https://github.com/') ? rawUrl : 'https://github.com/mohammadaffaan1';
      const name = escapeHtml(repo.name || 'Repository');
      const desc = escapeHtml(repo.description || 'No description provided');
      const lang = repo.language ? escapeHtml(repo.language) : '';
      const stars = Number.isInteger(repo.stargazers_count) && repo.stargazers_count > 0 ? repo.stargazers_count : 0;

      return `
        <a href="${safeUrl}" class="github-repo" target="_blank" rel="noopener noreferrer">
          <h4 class="github-repo-name">${name}</h4>
          <p class="github-repo-desc">${desc}</p>
          <div class="github-repo-meta">
            ${lang ? `<span class="github-repo-lang">${lang}</span>` : ''}
            ${stars > 0 ? `<span>★ ${stars}</span>` : ''}
          </div>
        </a>
      `;
    }).join('');
  } catch (e) {
    // Silently fail — the direct profile link is always available
  }
}

/**
 * Utility: Pure-function HTML Escaping (XSS Prevention)
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
