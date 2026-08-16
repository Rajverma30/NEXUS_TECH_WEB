import { prefersReducedMotion, clamp, isMobile } from './core.js';

/**
 * Business Chaos → Connected System scroll story
 */
export function initChaosSystem(section) {
  if (!section) return;

  const stage = section.querySelector('.chaos-stage');
  const nodes = [...section.querySelectorAll('.chaos-node')];
  const warnings = [...section.querySelectorAll('.chaos-warn')];
  const core = section.querySelector('.chaos-core');
  const finale = section.querySelector('.chaos-finale');
  const lines = section.querySelector('.chaos-lines');

  if (!stage || !nodes.length) return;

  const update = () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0→1 as section scrolls through viewport
    const total = r.height - vh;
    const progress = total <= 0 ? 1 : clamp(-r.top / total, 0, 1);

    section.style.setProperty('--chaos-p', progress.toFixed(4));

    // Phase markers
    section.classList.toggle('phase-drift', progress < 0.18);
    section.classList.toggle('phase-warn', progress >= 0.12 && progress < 0.35);
    section.classList.toggle('phase-pull', progress >= 0.32 && progress < 0.55);
    section.classList.toggle('phase-core', progress >= 0.5 && progress < 0.72);
    section.classList.toggle('phase-align', progress >= 0.68 && progress < 0.88);
    section.classList.toggle('phase-pulse', progress >= 0.85);

    warnings.forEach((w) => w.classList.toggle('show', progress >= 0.15 && progress < 0.4));
    core?.classList.toggle('show', progress >= 0.48);
    lines?.classList.toggle('show', progress >= 0.55);
    finale?.classList.toggle('show', progress >= 0.86);

    if (prefersReducedMotion) {
      section.classList.add('phase-pulse', 'chaos-reduced');
      core?.classList.add('show');
      finale?.classList.add('show');
      lines?.classList.add('show');
    }
  };

  if (prefersReducedMotion) {
    update();
    return;
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  if (isMobile()) section.classList.add('chaos-mobile');
}
