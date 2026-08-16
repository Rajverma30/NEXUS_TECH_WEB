import { prefersReducedMotion, whenVisible, canCinema, pointerNorm } from './core.js';

/**
 * Cinematic case study reveal + hover polish
 */
export function initCaseStudies() {
  document.querySelectorAll('.work-card').forEach((card) => {
    card.classList.add('cs-cinematic');

    const visual = card.querySelector('.work-visual');
    if (visual && !visual.querySelector('.cs-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'cs-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      visual.appendChild(overlay);

      const sheen = document.createElement('div');
      sheen.className = 'cs-sheen';
      sheen.setAttribute('aria-hidden', 'true');
      visual.appendChild(sheen);
    }

    whenVisible(card, () => {
      card.classList.add('cs-revealed');
    }, { threshold: 0.28 });

    if (!canCinema()) return;

    card.addEventListener('mousemove', (e) => {
      const { x, y } = pointerNorm(e, card);
      const dx = (x - 0.5) * 6;
      const dy = (y - 0.5) * 4;
      card.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  if (prefersReducedMotion) {
    document.querySelectorAll('.work-card').forEach((c) => c.classList.add('cs-revealed'));
  }
}
