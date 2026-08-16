import { prefersReducedMotion, whenVisible, isMobile } from './core.js';

/**
 * Hero Growth Engine — network powering on
 */
export function initGrowthEngine(root) {
  if (!root) return;

  const svg = root.querySelector('.ge-svg');
  const nodes = [...root.querySelectorAll('.ge-node')];
  const links = [...root.querySelectorAll('.ge-link')];
  const packets = [...root.querySelectorAll('.ge-packet')];
  const metrics = root.querySelector('.ge-metrics');

  const boot = () => {
    root.classList.add('powered');
    nodes.forEach((n, i) => {
      setTimeout(() => n.classList.add('on'), prefersReducedMotion ? 0 : 180 + i * 140);
    });
    links.forEach((l, i) => {
      setTimeout(() => l.classList.add('on'), prefersReducedMotion ? 0 : 320 + i * 120);
    });
    setTimeout(() => {
      root.classList.add('flowing');
      packets.forEach((p) => p.classList.add('run'));
      metrics?.classList.add('live');
    }, prefersReducedMotion ? 0 : 1400);
    setTimeout(() => root.classList.add('breathing'), prefersReducedMotion ? 0 : 2200);
  };

  whenVisible(root, boot, { threshold: 0.2 });

  if (isMobile()) root.classList.add('ge-mobile');
}
