import { prefersReducedMotion } from './core.js';

/**
 * Short cinematic boot — skips if already fast / reduced motion
 */
export function initLoader() {
  const el = document.getElementById('pageLoader');
  if (!el) return;

  const skip = prefersReducedMotion || document.readyState === 'complete';
  const start = performance.now();

  const finish = () => {
    const elapsed = performance.now() - start;
    const wait = skip ? 0 : Math.max(0, 700 - elapsed);
    setTimeout(() => {
      el.classList.add('done');
      document.documentElement.classList.add('site-ready');
      setTimeout(() => el.remove(), 500);
    }, wait);
  };

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });

  // Safety: never block longer than 1.2s
  setTimeout(finish, 1200);
}
