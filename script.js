/* ============================================================
   ARTIFICIAL BUDHI STUDIOS — Interactive Scripts
   Particles, scroll reveals, Sri Yantra animation, nav logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Scroll-triggered reveal (IntersectionObserver) ----
  initScrollReveal();

  // ---- Navbar scroll behavior ----
  initNavbar();

  // ---- Particle canvas in hero ----
  initParticles();

  // ---- Sri Yantra SVG animation ----
  initYantra();

  // ---- Form handling ----
  initForm();
});

/* ====================
   SCROLL REVEAL
   ==================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Use IntersectionObserver for performant scroll-triggered animations
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

  // Scroll: add glass bg
  let lastScroll = 0;
  const onScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ====================
   PARTICLE CANVAS
   Lightweight particle glow behind hero
   ==================== */
function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationId;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const PARTICLE_COUNT = Math.min(60, Math.floor(window.innerWidth / 20));
  const COLORS = [
    'rgba(242, 166, 35, 0.4)',
    'rgba(242, 166, 35, 0.2)',
    'rgba(29, 158, 117, 0.3)',
    'rgba(29, 158, 117, 0.15)',
    'rgba(232, 224, 208, 0.1)',
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
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(242, 166, 35, ${alpha})`;
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

      // Wrap around edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const scale = 0.6 + Math.sin(p.pulse) * 0.4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * scale * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, '0.03)');
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Only animate when hero is visible (IntersectionObserver)
  const heroSection = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!animationId) animate();
        } else {
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        }
      });
    },
    { threshold: 0.05 }
  );

  init();
  heroObserver.observe(heroSection);
  window.addEventListener('resize', () => {
    resize();
    // Re-scatter particles on significant resize
    if (Math.abs(particles.length - PARTICLE_COUNT) > 5) {
      init();
    }
  });
}

/* ====================
   SRI YANTRA SVG
   Programmatically generate a simplified Sri Yantra
   ==================== */
function initYantra() {
  const container = document.getElementById('sri-yantra');
  if (!container) return;

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 500 500');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');

  const strokeColor = 'rgba(242, 166, 35, 0.6)';
  const strokeWidth = '0.8';
  const cx = 250, cy = 250;

  // Outer circles
  [220, 200, 180].forEach((r) => {
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('stroke', strokeColor);
    circle.setAttribute('stroke-width', strokeWidth);
    svg.appendChild(circle);
  });

  // Outer square (Bhupura) with gates
  const sq = 210;
  const gate = 20;
  // Simple square
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', cx - sq);
  rect.setAttribute('y', cy - sq);
  rect.setAttribute('width', sq * 2);
  rect.setAttribute('height', sq * 2);
  rect.setAttribute('stroke', strokeColor);
  rect.setAttribute('stroke-width', strokeWidth);
  svg.appendChild(rect);

  // Upward triangles (Shiva - masculine)
  const upTriangles = [
    { top: cy - 160, base: cy + 100, spread: 155 },
    { top: cy - 120, base: cy + 75, spread: 125 },
    { top: cy - 80, base: cy + 50, spread: 90 },
    { top: cy - 40, base: cy + 25, spread: 55 },
  ];

  upTriangles.forEach((t) => {
    const path = document.createElementNS(ns, 'polygon');
    path.setAttribute(
      'points',
      `${cx},${t.top} ${cx - t.spread},${t.base} ${cx + t.spread},${t.base}`
    );
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
  });

  // Downward triangles (Shakti - feminine)
  const downTriangles = [
    { bottom: cy + 160, top: cy - 100, spread: 155 },
    { bottom: cy + 120, top: cy - 75, spread: 120 },
    { bottom: cy + 80, top: cy - 50, spread: 85 },
    { bottom: cy + 45, top: cy - 30, spread: 55 },
    { bottom: cy + 20, top: cy - 15, spread: 30 },
  ];

  downTriangles.forEach((t) => {
    const path = document.createElementNS(ns, 'polygon');
    path.setAttribute(
      'points',
      `${cx},${t.bottom} ${cx - t.spread},${t.top} ${cx + t.spread},${t.top}`
    );
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
  });

  // Central bindu (dot)
  const bindu = document.createElementNS(ns, 'circle');
  bindu.setAttribute('cx', cx);
  bindu.setAttribute('cy', cy);
  bindu.setAttribute('r', 3);
  bindu.setAttribute('fill', strokeColor);
  svg.appendChild(bindu);

  // Lotus petals - simplified outer ring
  const petalCount = 16;
  const petalRadius = 175;
  const petalSize = 18;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(angle) * petalRadius;
    const py = cy + Math.sin(angle) * petalRadius;

    const petal = document.createElementNS(ns, 'ellipse');
    petal.setAttribute('cx', px);
    petal.setAttribute('cy', py);
    petal.setAttribute('rx', petalSize);
    petal.setAttribute('ry', petalSize * 0.45);
    petal.setAttribute(
      'transform',
      `rotate(${(angle * 180) / Math.PI + 90}, ${px}, ${py})`
    );
    petal.setAttribute('stroke', strokeColor);
    petal.setAttribute('stroke-width', '0.5');
    svg.appendChild(petal);
  }

  // Inner lotus petals
  const innerPetalCount = 8;
  const innerPetalRadius = 155;
  for (let i = 0; i < innerPetalCount; i++) {
    const angle = (i / innerPetalCount) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(angle) * innerPetalRadius;
    const py = cy + Math.sin(angle) * innerPetalRadius;

    const petal = document.createElementNS(ns, 'ellipse');
    petal.setAttribute('cx', px);
    petal.setAttribute('cy', py);
    petal.setAttribute('rx', 14);
    petal.setAttribute('ry', 6);
    petal.setAttribute(
      'transform',
      `rotate(${(angle * 180) / Math.PI + 90}, ${px}, ${py})`
    );
    petal.setAttribute('stroke', strokeColor);
    petal.setAttribute('stroke-width', '0.5');
    svg.appendChild(petal);
  }

  container.appendChild(svg);
}

/* ====================
   FORM HANDLING
   ==================== */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Show success message
    const btn = form.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = '✓ Message sent!';
    btn.style.background = 'linear-gradient(135deg, var(--emerald), var(--emerald-dim))';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}
