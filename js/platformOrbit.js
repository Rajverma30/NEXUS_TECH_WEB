import { canCinema, isMobile, prefersReducedMotion, whenVisible } from './core.js';

const PLATFORMS = [
  { name: 'Google Ads', tip: 'Performance Marketing', brand: 'google' },
  { name: 'Meta', tip: 'Social Acquisition', brand: 'meta' },
  { name: 'Instagram', tip: 'Brand & Reach', brand: 'instagram' },
  { name: 'WhatsApp', tip: 'Conversational Sales', brand: 'whatsapp' },
  { name: 'LinkedIn', tip: 'B2B Demand', brand: 'linkedin' },
  { name: 'YouTube', tip: 'Video Attention', brand: 'youtube' },
  { name: 'Shopify', tip: 'Commerce', brand: 'shopify' },
  { name: 'Analytics', tip: 'Measurement', brand: 'analytics' },
  { name: 'WordPress', tip: 'Content Sites', brand: 'wordpress' },
];

/**
 * Desktop orbital platform ecosystem around Vraizen
 */
export function initPlatformOrbit(root) {
  if (!root) return;
  const orbit = root.querySelector('.pe-orbit');
  if (!orbit) return;

  if (isMobile() || prefersReducedMotion) {
    root.classList.add('pe-mobile');
    return;
  }

  orbit.innerHTML = PLATFORMS.map(
    (p, i) => `
    <div class="pe-logo" data-brand="${p.brand}" data-i="${i}" style="--i:${i}">
      <span>${p.name.split(' ')[0]}</span>
      <span class="pe-tip"><strong>${p.name}</strong><br>${p.tip}</span>
    </div>`
  ).join('');

  const logos = [...orbit.querySelectorAll('.pe-logo')];
  let angle = 0;
  let mx = 0;
  let my = 0;
  let running = false;
  let raf = 0;

  root.addEventListener(
    'mousemove',
    (e) => {
      const r = root.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 16;
      my = ((e.clientY - r.top) / r.height - 0.5) * 10;
    },
    { passive: true }
  );

  const place = () => {
    const n = logos.length;
    logos.forEach((logo, i) => {
      const a = angle + (i / n) * Math.PI * 2;
      const rx = 42;
      const ry = 34;
      const x = 50 + Math.cos(a) * rx + mx * 0.15;
      const y = 50 + Math.sin(a) * ry + my * 0.15;
      const depth = (Math.sin(a) + 1) / 2;
      logo.style.left = `${x}%`;
      logo.style.top = `${y}%`;
      logo.style.transform = `translate(-50%, -50%) scale(${0.88 + depth * 0.22})`;
      logo.style.opacity = String(0.55 + depth * 0.45);
      logo.style.zIndex = String(Math.round(1 + depth * 10));
      logo.classList.toggle('near', depth > 0.7);
    });
  };

  const tick = () => {
    if (!running) return;
    angle += canCinema() ? 0.003 : 0;
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
