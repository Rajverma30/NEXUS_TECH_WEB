import { isMobile, prefersReducedMotion, whenVisible, clamp } from './core.js';

/**
 * Mid-page eye-catcher: Vraizen AI core ingesting & emitting particles
 */
export function initAiCore(section) {
  if (!section || prefersReducedMotion) {
    section?.classList.add('ai-core-static');
    return;
  }

  const canvas = section.querySelector('.ai-core-canvas');
  const core = section.querySelector('.ai-core-orb');
  if (!canvas || !core) return;

  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let dpr = 1;
  let particles = [];
  let streams = [];
  let progress = 0;
  let running = false;
  let raf = 0;

  const labels = ['LEADS', 'AUTOMATION', 'CUSTOMERS'];

  const resize = () => {
    const r = section.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = Math.min(r.height, 560);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  };

  const spawn = () => {
    const n = isMobile() ? 80 : 180;
    particles = Array.from({ length: n }, () => ({
      a: Math.random() * Math.PI * 2,
      dist: 80 + Math.random() * Math.min(w, h) * 0.42,
      speed: 0.004 + Math.random() * 0.01,
      r: Math.random() * 1.6 + 0.4,
      phase: Math.random(),
      inbound: Math.random() > 0.35,
    }));
    streams = labels.map((label, i) => ({
      label,
      angle: -Math.PI / 2 + ((i - 1) * Math.PI) / 5,
      packs: Array.from({ length: 8 }, (_, k) => ({ t: k / 8, speed: 0.004 + Math.random() * 0.003 })),
    }));
  };

  const onScroll = () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    progress = clamp(1 - Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.9), 0, 1);
    section.style.setProperty('--ai-p', progress.toFixed(3));
    section.classList.toggle('processing', progress > 0.35);
    section.classList.toggle('emitting', progress > 0.55);
    section.classList.toggle('collapsing', progress > 0.82);
  };

  const tick = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const inhale = progress > 0.3;

    for (const p of particles) {
      if (inhale && p.inbound) {
        p.dist = Math.max(28, p.dist - p.speed * 40 * (0.4 + progress));
      } else if (!inhale) {
        p.a += p.speed * 0.6;
      } else if (!p.inbound) {
        p.dist += p.speed * 20;
        if (p.dist > Math.min(w, h) * 0.45) {
          p.dist = 30;
          p.inbound = Math.random() > 0.5;
        }
      }
      if (p.dist < 32) {
        p.inbound = false;
        p.dist = 32 + Math.random() * 20;
      }
      const x = cx + Math.cos(p.a) * p.dist;
      const y = cy + Math.sin(p.a) * p.dist * 0.72;
      ctx.beginPath();
      ctx.fillStyle = `rgba(167,139,250,${0.25 + progress * 0.45})`;
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (progress > 0.5) {
      streams.forEach((s) => {
        s.packs.forEach((pack) => {
          pack.t += pack.speed;
          if (pack.t > 1) pack.t = 0;
          const d = 40 + pack.t * Math.min(w, h) * 0.32;
          const x = cx + Math.cos(s.angle) * d;
          const y = cy + Math.sin(s.angle) * d * 0.75;
          ctx.beginPath();
          ctx.fillStyle = `rgba(96,165,250,${0.7 * (1 - pack.t)})`;
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }

    raf = requestAnimationFrame(tick);
  };

  whenVisible(
    section,
    () => {
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    {
      once: false,
      threshold: 0.08,
      onLeave: () => {
        running = false;
        cancelAnimationFrame(raf);
        raf = 0;
      },
    }
  );

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  onScroll();
}
