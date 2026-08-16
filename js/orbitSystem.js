import { canCinema, isMobile, prefersReducedMotion, whenVisible, pointerNorm } from './core.js';

/**
 * Clean digital universe orbit — single ring, no duplicates
 */
export function initOrbitSystem(root) {
  if (!root) return;

  const wrap = root.querySelector('.orbit-wrap') || root;
  const orbit = wrap.querySelector('.orbit-ring');
  const nodes = [...wrap.querySelectorAll('.orbit-ring > .orbit-node')];
  if (!orbit || !nodes.length) return;

  if (isMobile() || prefersReducedMotion) {
    wrap.classList.add('orbit-mobile');
    return;
  }

  wrap.classList.add('orbit-ready');

  let angle = -Math.PI / 2;
  let mx = 0;
  let my = 0;
  let running = false;
  let raf = 0;

  wrap.addEventListener(
    'mousemove',
    (e) => {
      const { x, y } = pointerNorm(e, wrap);
      mx = (x - 0.5) * 12;
      my = (y - 0.5) * 8;
    },
    { passive: true }
  );

  const place = () => {
    const n = nodes.length;
    nodes.forEach((node, i) => {
      const a = angle + (i / n) * Math.PI * 2;
      const rx = 40;
      const ry = 36;
      const x = 50 + Math.cos(a) * rx;
      const y = 50 + Math.sin(a) * ry;
      const depth = (Math.sin(a) + 1) / 2;
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      node.style.transform = `translate(-50%, -50%) scale(${0.9 + depth * 0.15})`;
      node.style.opacity = '1';
      node.style.zIndex = String(Math.round(2 + depth * 8));
      node.classList.toggle('near', depth > 0.7);
    });
    orbit.style.transform = `perspective(900px) rotateX(${8 + my * 0.1}deg) rotateY(${mx * 0.15}deg)`;
  };

  const tick = () => {
    if (!running) return;
    angle += 0.002;
    place();
    raf = requestAnimationFrame(tick);
  };

  whenVisible(
    wrap,
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
  if (canCinema()) {
    running = true;
    raf = requestAnimationFrame(tick);
  }
}
