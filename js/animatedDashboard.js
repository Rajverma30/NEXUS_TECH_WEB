import { prefersReducedMotion, whenVisible } from './core.js';

/**
 * Alive marketing dashboard — breathing + status + chart particles
 */
export function initAnimatedDashboard(board) {
  if (!board) return;

  board.classList.add('dash-alive');

  // Ensure demo label
  if (!board.querySelector('.demo-badge')) {
    const badge = document.createElement('div');
    badge.className = 'demo-badge';
    badge.textContent = 'SIMULATED DATA';
    board.prepend(badge);
  }

  // Status strip
  if (!board.querySelector('.dash-status')) {
    const status = document.createElement('div');
    status.className = 'dash-status';
    status.innerHTML = `
      <span><i></i> Google Ads — Active</span>
      <span><i></i> Meta Ads — Active</span>
      <span><i></i> SEO — Optimizing</span>
      <span><i></i> AI Automation — Running</span>`;
    board.appendChild(status);
  }

  whenVisible(board, () => {
    board.classList.add('in-view');
    const path = board.querySelector('.animate-draw, .chart-line');
    if (path && !prefersReducedMotion) {
      try {
        const len = path.getTotalLength?.();
        if (len) {
          path.style.strokeDasharray = String(len);
          path.style.strokeDashoffset = String(len);
          requestAnimationFrame(() => {
            path.style.transition = 'stroke-dashoffset 1.8s ease';
            path.style.strokeDashoffset = '0';
          });
        }
      } catch (_) {}
    }
  });
}
