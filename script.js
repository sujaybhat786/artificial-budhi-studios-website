/* ============================================================
   ARTIFICIAL BUDHI STUDIOS — Interactive Scripts
   Particles, scroll reveals, Sri Yantra, nav, form.
   Colours are read from the tokens in tokens.css where the
   canvas allows it; canvas needs literals, so the few below are
   kept in one place and mirror --color-accent / --color-indigo.
   ============================================================ */

/* Canvas can't read CSS variables directly — these mirror tokens.css. */
const PALETTE = {
  accent: [227, 176, 75],
  indigo: [124, 143, 255],
  fg: [242, 241, 238],
};

const rgba = ([r, g, b], a) => `rgba(${r}, ${g}, ${b}, ${a})`;

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initParticles();
  initYantra();
  initForm();
});

/* ====================
   SCROLL REVEAL
   Standard tier: 24px rise, 500ms, fires once.
   Stagger is capped at 8 children so long grids don't crawl.
   ==================== */
function initScrollReveal() {
  const STAGGER_CAP = 8;
  const step = 60; // ms, mirrors --reveal-stagger

  // Apply staggered delays inside any [data-stagger] container.
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const children = group.querySelectorAll(':scope > .reveal');
    children.forEach((child, i) => {
      const index = Math.min(i, STAGGER_CAP - 1);
      child.style.transitionDelay = `${index * step}ms`;
    });
  });

  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ====================
   NAVBAR
   ==================== */
function initNavbar() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!hamburger || !navLinks) return;

  const setMenu = (open) => {
    hamburger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    setMenu(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Escape closes the mobile menu — an escape route per the a11y checklist.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenu(false);
      hamburger.focus();
    }
  });
}

/* ====================
   PARTICLE CANVAS
   ==================== */
function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = null;

  const PARTICLE_COUNT = Math.min(60, Math.max(20, Math.floor(window.innerWidth / 20)));
  const COLORS = [
    rgba(PALETTE.accent, 0.42),
    rgba(PALETTE.accent, 0.2),
    rgba(PALETTE.indigo, 0.38),
    rgba(PALETTE.indigo, 0.18),
    rgba(PALETTE.fg, 0.12),
  ];

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.01,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.09;
          ctx.beginPath();
          ctx.strokeStyle = rgba(PALETTE.indigo, alpha);
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawConnections();

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const scale = 0.6 + Math.sin(p.pulse) * 0.4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  }

  const heroSection = document.querySelector('.hero');
  init();

  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animationId) animate();
          } else if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        });
      },
      { threshold: 0.05 }
    );
    heroObserver.observe(heroSection);
  } else {
    animate();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });
}

/* ====================
   SRI YANTRA SVG
   ==================== */
function initYantra() {
  const container = document.getElementById('sri-yantra');
  if (!container) return;

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 500 500');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');

  const strokeColor = rgba(PALETTE.accent, 0.55);
  const strokeWidth = '0.8';
  const cx = 250;
  const cy = 250;

  [220, 200, 180].forEach((r) => {
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('stroke', strokeColor);
    circle.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(circle);
  });

  const sq = 210;
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', cx - sq);
  rect.setAttribute('y', cy - sq);
  rect.setAttribute('width', sq * 2);
  rect.setAttribute('height', sq * 2);
  rect.setAttribute('stroke', strokeColor);
  rect.setAttribute('stroke-width', strokeWidth);
  svg.appendChild(rect);

  const upTriangles = [
    { top: cy - 160, base: cy + 100, spread: 155 },
    { top: cy - 120, base: cy + 75, spread: 125 },
    { top: cy - 80, base: cy + 50, spread: 90 },
    { top: cy - 40, base: cy + 25, spread: 55 },
  ];

  upTriangles.forEach((t) => {
    const path = document.createElementNS(ns, 'polygon');
    path.setAttribute('points', `${cx},${t.top} ${cx - t.spread},${t.base} ${cx + t.spread},${t.base}`);
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
  });

  const downTriangles = [
    { bottom: cy + 160, top: cy - 100, spread: 155 },
    { bottom: cy + 120, top: cy - 75, spread: 120 },
    { bottom: cy + 80, top: cy - 50, spread: 85 },
    { bottom: cy + 45, top: cy - 30, spread: 55 },
    { bottom: cy + 20, top: cy - 15, spread: 30 },
  ];

  downTriangles.forEach((t) => {
    const path = document.createElementNS(ns, 'polygon');
    path.setAttribute('points', `${cx},${t.bottom} ${cx - t.spread},${t.top} ${cx + t.spread},${t.top}`);
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
  });

  const bindu = document.createElementNS(ns, 'circle');
  bindu.setAttribute('cx', cx);
  bindu.setAttribute('cy', cy);
  bindu.setAttribute('r', 3);
  bindu.setAttribute('fill', strokeColor);
  svg.appendChild(bindu);

  const addPetalRing = (count, radius, rx, ry) => {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;

      const petal = document.createElementNS(ns, 'ellipse');
      petal.setAttribute('cx', px);
      petal.setAttribute('cy', py);
      petal.setAttribute('rx', rx);
      petal.setAttribute('ry', ry);
      petal.setAttribute('transform', `rotate(${(angle * 180) / Math.PI + 90}, ${px}, ${py})`);
      petal.setAttribute('stroke', strokeColor);
      petal.setAttribute('stroke-width', '0.5');
      svg.appendChild(petal);
    }
  };

  addPetalRing(16, 175, 18, 8.1);
  addPetalRing(8, 155, 14, 6);

  container.appendChild(svg);
}

/* ====================
   FORM HANDLING (Netlify Forms)
   Body must be URL-encoded, not JSON.
   ==================== */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn = form.querySelector('#form-submit-btn');
  const status = form.querySelector('#form-status');

  const setStatus = (message, state) => {
    if (!status) return;
    status.textContent = message;
    if (state) {
      status.setAttribute('data-state', state);
    } else {
      status.removeAttribute('data-state');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      setStatus('Please fill in the required fields above.', 'error');
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setStatus('Sending your message...');

    const body = new URLSearchParams(new FormData(form)).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Form submission failed: ${res.status}`);
        setStatus('Thanks — your message is on its way. We’ll be in touch.', 'success');
        form.reset();
      })
      .catch(() => {
        setStatus('Something went wrong. Email us directly at hello@artificialbudhi.com.', 'error');
      })
      .finally(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      });
  });
}
