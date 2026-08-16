import { prefersReducedMotion, clamp } from './core.js';

/**
 * Scroll-driven growth graph
 */
export function initScrollGraph(section) {
  if (!section) return;

  const path = section.querySelector('.sg-path');
  const fill = section.querySelector('.sg-fill');
  const markers = [...section.querySelectorAll('.sg-marker')];
  const glow = section.querySelector('.sg-glow');

  if (!path) return;

  let length = 0;
  try {
    length = path.getTotalLength();
  } catch (_) {
    return;
  }

  path.style.strokeDasharray = String(length);
  path.style.strokeDashoffset = String(length);
  if (fill) {
    fill.style.opacity = '0';
  }

  const update = () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = Math.max(1, r.height - vh * 0.35);
    const p = prefersReducedMotion ? 1 : clamp((-r.top + vh * 0.25) / total, 0, 1);

    path.style.strokeDashoffset = String(length * (1 - p));
    if (fill) fill.style.opacity = String(p * 0.55);

    markers.forEach((m) => {
      const at = parseFloat(m.dataset.at || '0');
      m.classList.toggle('on', p >= at);
    });

    section.classList.toggle('sg-complete', p > 0.92);
    if (glow) glow.style.opacity = p > 0.9 ? '1' : '0';
  };

  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}
