import { canCinema, isMobile, prefersReducedMotion, whenVisible } from './core.js';

/**
 * Subtle interactive particle / grid field behind hero
 */
export function initParticleField(container) {
  if (!container || prefersReducedMotion) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'particle-field';
  canvas.setAttribute('aria-hidden', 'true');
  container.prepend(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  let w = 0;
  let h = 0;
  let dpr = 1;
  let particles = [];
  let mx = -9999;
  let my = -9999;
  let running = true;
  let raf = 0;

  const count = () => {
    if (isMobile()) return 28;
    if (!canCinema()) return 40;
    return 70;
  };

  const resize = () => {
    const r = container.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  };

  const spawn = () => {
    const n = count();
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.4 + 0.4,
      o: Math.random() * 0.35 + 0.08,
    }));
  };

  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  };
  const onLeave = () => {
    mx = -9999;
    my = -9999;
  };

  if (canCinema()) {
    container.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('mouseleave', onLeave, { passive: true });
  }

  const drawGrid = () => {
    ctx.strokeStyle = 'rgba(124,58,237,0.04)';
    ctx.lineWidth = 1;
    const step = 56;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  const tick = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    drawGrid();

    // soft cursor ripple
    if (mx > -100) {
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
      g.addColorStop(0, 'rgba(99,102,241,0.12)');
      g.addColorStop(0.5, 'rgba(124,58,237,0.05)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mx, my, 120, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of particles) {
      if (mx > -100) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 140) {
          const f = (1 - dist / 140) * 0.35;
          p.vx += (dx / dist) * f * 0.08;
          p.vy += (dy / dist) * f * 0.08;
        }
      }
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx + Math.sin(p.y * 0.01) * 0.05;
      p.y += p.vy + Math.cos(p.x * 0.01) * 0.05;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(167,139,250,${p.o})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };

  whenVisible(
    container,
    () => {
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    {
      once: false,
      threshold: 0.05,
      onLeave: () => {
        running = false;
        cancelAnimationFrame(raf);
        raf = 0;
      },
    }
  );

  resize();
  window.addEventListener('resize', resize, { passive: true });
  running = true;
  raf = requestAnimationFrame(tick);
}
