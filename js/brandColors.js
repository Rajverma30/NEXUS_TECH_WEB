import { brandIcon } from './brandLogos.js';

/**
 * Colorize existing platform marquee icons + enhance system map brands
 */
export function initBrandColors() {
  // Force colorful fills on marquee platform logos (not muted gray)
  document.querySelectorAll('.platform-logo').forEach((el) => {
    el.classList.add('brand-color');
    const brand = el.dataset.brand;
    const iconWrap = el.querySelector('.platform-icon');
    if (!brand || !iconWrap) return;
    const svg = brandIcon(brand);
    if (svg) iconWrap.innerHTML = svg;
  });

  // System map: inject brand icons next to key nodes
  document.querySelectorAll('.sm-node.brand[data-brand]').forEach((node) => {
    const brand = node.dataset.brand;
    if (brand === 'web' || brand === 'ai') return;
    const icon = brandIcon(brand);
    if (!icon) return;
    if (node.querySelector('.sm-brand-icon')) return;
    const wrap = document.createElement('span');
    wrap.className = 'sm-brand-icon';
    wrap.innerHTML = icon;
    node.prepend(wrap);
  });
}
