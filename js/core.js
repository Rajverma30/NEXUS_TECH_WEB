/**
 * Vraizen cinematic core — device flags, reduced-motion, helpers
 */
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

export const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;

export const isTablet = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 1100px) and (min-width: 901px)').matches;

export const canCinema = () => !prefersReducedMotion && !isMobile();

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

export function whenVisible(el, cb, opts = {}) {
  if (!el) return () => {};
  if (prefersReducedMotion) {
    cb(el);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cb(entry.target);
          if (opts.once !== false) io.unobserve(entry.target);
        } else if (opts.onLeave) {
          opts.onLeave(entry.target);
        }
      });
    },
    { threshold: opts.threshold ?? 0.25, rootMargin: opts.rootMargin ?? '0px' }
  );
  io.observe(el);
  return () => io.disconnect();
}

export function rafThrottle(fn) {
  let ticking = false;
  return (...args) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn(...args);
    });
  };
}

export function pointerNorm(e, el) {
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  return { x: clamp(x, 0, 1), y: clamp(y, 0, 1), px: e.clientX - r.left, py: e.clientY - r.top };
}
