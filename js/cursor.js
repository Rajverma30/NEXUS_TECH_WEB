import { canCinema, lerp } from './core.js';

/**
 * Subtle secondary cursor ring — does not replace native cursor
 */
export function initCursorFollower() {
  if (!canCinema()) return;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);

  let mx = -100;
  let my = -100;
  let rx = -100;
  let ry = -100;
  let scale = 1;
  let visible = false;

  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) {
      visible = true;
      ring.classList.add('visible');
    }
  };

  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener(
    'mouseleave',
    () => {
      visible = false;
      ring.classList.remove('visible');
    },
    { passive: true }
  );

  const interactive = 'a, button, .btn-primary, .btn-secondary, .nav-cta, .service-card, .work-card, .magnetic, [data-magnetic]';
  document.addEventListener(
    'mouseover',
    (e) => {
      if (e.target.closest?.(interactive)) {
        scale = 1.65;
        ring.classList.add('hot');
      }
    },
    true
  );
  document.addEventListener(
    'mouseout',
    (e) => {
      if (e.target.closest?.(interactive)) {
        scale = 1;
        ring.classList.remove('hot');
      }
    },
    true
  );

  const tick = () => {
    rx = lerp(rx, mx, 0.18);
    ry = lerp(ry, my, 0.18);
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
