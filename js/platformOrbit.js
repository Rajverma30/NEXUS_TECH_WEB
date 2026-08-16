import { isMobile, prefersReducedMotion } from './core.js';
import { PLATFORM_LIST, brandIcon } from './brandLogos.js';

/**
 * Platform ecosystem — logos on a CSS ring; VRAIZEN locked to true center.
 */
export function initPlatformOrbit(root) {
  if (!root) return;
  const orbit = root.querySelector('.pe-orbit');
  if (!orbit) return;

  const count = PLATFORM_LIST.length;
  root.style.setProperty('--pe-count', String(count));
  root.classList.add('pe-ready');

  orbit.innerHTML = PLATFORM_LIST.map(
    (p, i) => `
    <div class="pe-logo" data-brand="${p.brand}" style="--i:${i}">
      <span class="pe-icon">${brandIcon(p.brand)}</span>
      <span class="pe-tip"><strong>${p.name}</strong><br>${p.tip}</span>
    </div>`
  ).join('');

  if (isMobile() || prefersReducedMotion) {
    root.classList.add('pe-mobile');
  }
}
