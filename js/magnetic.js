import { canCinema, clamp, pointerNorm } from './core.js';

/**
 * Magnetic buttons + tilt cards + link underlines
 */
export function initMagnetic() {
  if (!canCinema()) return;

  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, [data-magnetic]').forEach((btn) => {
    if (btn.dataset.magneticInit) return;
    btn.dataset.magneticInit = '1';
    btn.classList.add('magnetic');

    const strength = Number(btn.dataset.magnetStrength || 10);

    btn.addEventListener('mousemove', (e) => {
      const { px, py } = pointerNorm(e, btn);
      const r = btn.getBoundingClientRect();
      const dx = (px - r.width / 2) / (r.width / 2);
      const dy = (py - r.height / 2) / (r.height / 2);
      btn.style.transform = `translate3d(${dx * strength}px, ${dy * strength * 0.6}px, 0)`;
      btn.classList.add('magnet-hot');
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.classList.remove('magnet-hot');
    });
  });

  document.querySelectorAll('.service-card, .work-card, .problem-card, .analytics-board, .dash-card').forEach((card) => {
    if (card.dataset.tiltInit) return;
    card.dataset.tiltInit = '1';
    card.classList.add('tilt-card');

    const glow = document.createElement('div');
    glow.className = 'tilt-glow';
    glow.setAttribute('aria-hidden', 'true');
    card.appendChild(glow);

    card.addEventListener('mousemove', (e) => {
      const { x, y } = pointerNorm(e, card);
      const rx = clamp((0.5 - y) * 8, -6, 6);
      const ry = clamp((x - 0.5) * 10, -8, 8);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      glow.style.opacity = '1';
      glow.style.background = `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(124,58,237,0.18), transparent 55%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      glow.style.opacity = '0';
    });
  });

  document.querySelectorAll('.nav-links a, .work-link, .footer-links a').forEach((link) => {
    link.classList.add('link-follow');
  });
}
