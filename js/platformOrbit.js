import { canCinema, isMobile, prefersReducedMotion, whenVisible } from './core.js';
import { PLATFORM_LIST, brandIcon } from './brandLogos.js';

/**
 * Desktop orbital platform ecosystem with colorful brand logos
 */
export function initPlatformOrbit(root) {
  if (!root) return;
  const orbit = root.querySelector('.pe-orbit');
  if (!orbit) return;

  if (isMobile() || prefersReducedMotion) {
    root.classList.add('pe-mobile');
    return;
  }

  orbit.innerHTML = PLATFORM_LIST.map(
    (p, i) => `
    <div class="pe-logo" data-brand="${p.brand}" data-i="${i}" style="--i:${i}">
      <span class="pe-icon">${brandIcon(p.brand)}</span>
      <span class="pe-tip"><strong>${p.name}</strong><br>${p.tip}</span>
    </div>`
  ).join('');

  const logos = [...orbit.querySelectorAll('.pe-logo')];
  let angle = -Math.PI / 2;
  let mx = 0;
  let my = 0;
  let running = false;
  let raf = 0;

  root.addEventListener(
    'mousemove',
    (e) => {
      const r = root.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 10;
      my = ((e.clientY - r.top) / r.height - 0.5) * 6;
    },
    { passive: true }
  );

  const place = () => {
    const n = logos.length;
    logos.forEach((logo, i) => {
      const a = angle + (i / n) * Math.PI * 2;
      const rx = 40;
      const ry = 36;
      const x = 50 + Math.cos(a) * rx + mx * 0.1;
      const y = 50 + Math.sin(a) * ry + my * 0.1;
      const depth = (Math.sin(a) + 1) / 2;
      logo.style.left = `${x}%`;
      logo.style.top = `${y}%`;
      logo.style.transform = `translate(-50%, -50%) scale(${0.92 + depth * 0.14})`;
      logo.style.opacity = '1';
      logo.style.zIndex = String(Math.round(2 + depth * 8));
      logo.classList.toggle('near', depth > 0.65);
    });
  };

  const tick = () => {
    if (!running) return;
    angle += canCinema() ? 0.0025 : 0;
    place();
    raf = requestAnimationFrame(tick);
  };

  whenVisible(
    root,
    () => {
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    {
      once: false,
      threshold: 0.1,
      onLeave: () => {
        running = false;
        cancelAnimationFrame(raf);
        raf = 0;
      },
    }
  );

  place();
}
