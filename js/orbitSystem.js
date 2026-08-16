import { canCinema, isMobile, prefersReducedMotion, whenVisible, pointerNorm } from './core.js';

/**
 * Digital universe / platform orbital ecosystem
 */
export function initOrbitSystem(root) {
  if (!root) return;

  const orbit = root.querySelector('.orbit-ring');
  const nodes = [...root.querySelectorAll('.orbit-node')];
  if (!orbit || !nodes.length) return;

  // Mobile: fall back to marquee (handled in CSS via .orbit-mobile)
  if (isMobile() || prefersReducedMotion) {
    root.classList.add('orbit-mobile');
    return;
  }

  let angle = 0;
  let mx = 0;
  let my = 0;
  let running = true;
  let raf = 0;

  root.addEventListener(
    'mousemove',
    (e) => {
      const { x, y } = pointerNorm(e, root);
      mx = (x - 0.5) * 18;
      my = (y - 0.5) * 12;
    },
    { passive: true }
  );

  const place = () => {
    const n = nodes.length;
    nodes.forEach((node, i) => {
      const a = angle + (i / n) * Math.PI * 2;
      const rx = 38 + Math.sin(a * 2) * 2;
      const ry = 34;
      const x = 50 + Math.cos(a) * rx;
      const y = 50 + Math.sin(a) * ry;
      const depth = (Math.sin(a) + 1) / 2;
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      node.style.transform = `translate(-50%, -50%) scale(${0.85 + depth * 0.25}) translateZ(0)`;
      node.style.opacity = String(0.55 + depth * 0.45);
      node.style.zIndex = String(Math.round(depth * 10));
      node.classList.toggle('near', depth > 0.72);
    });
    orbit.style.transform = `perspective(900px) rotateX(${12 + my * 0.15}deg) rotateY(${mx * 0.2}deg)`;
  };

  const tick = () => {
    if (!running) return;
    angle += 0.0022;
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

  // Scroll gently advances rotation
  window.addEventListener(
    'scroll',
    () => {
      angle += 0.0008;
    },
    { passive: true }
  );

  place();
  if (canCinema()) {
    running = true;
    raf = requestAnimationFrame(tick);
  }
}
