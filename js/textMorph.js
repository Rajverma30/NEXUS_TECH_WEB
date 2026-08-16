import { prefersReducedMotion } from './core.js';

const PHRASES = ['GROW BUSINESSES', 'GENERATE LEADS', 'AUTOMATE GROWTH', 'SCALE FASTER'];

/**
 * Smooth vertical morph for hero supporting concept
 */
export function initTextMorph(el) {
  if (!el) return;
  if (prefersReducedMotion) {
    el.textContent = PHRASES[0];
    return;
  }

  let idx = 0;
  const inner = document.createElement('span');
  inner.className = 'morph-inner';
  inner.textContent = PHRASES[0];
  el.textContent = '';
  el.appendChild(inner);
  el.setAttribute('aria-live', 'polite');

  const cycle = () => {
    idx = (idx + 1) % PHRASES.length;
    inner.classList.add('out');
    setTimeout(() => {
      inner.textContent = PHRASES[idx];
      inner.classList.remove('out');
      inner.classList.add('in');
      setTimeout(() => inner.classList.remove('in'), 450);
    }, 320);
  };

  setInterval(cycle, 2800);
}
