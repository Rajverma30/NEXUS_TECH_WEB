import { prefersReducedMotion } from './core.js';

/**
 * Signature "See the System" full-screen map overlay
 */
export function initSystemMap() {
  if (window.__vraizenSystemMapInit) return;
  window.__vraizenSystemMapInit = true;

  const overlay = document.getElementById('systemMap');
  const openBtn = document.querySelectorAll('[data-system-map]');
  if (!overlay || !openBtn.length) return;

  const packet = overlay.querySelector('.sm-packet');
  const status = overlay.querySelector('.sm-status');
  const closeBtn = overlay.querySelector('.sm-close');

  let running = false;

  const close = () => {
    overlay.classList.remove('open', 'zooming', 'mapping', 'packet-run', 'online');
    document.body.style.overflow = '';
    running = false;
    status?.classList.remove('show');
    packet?.classList.remove('run');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
  };

  const open = () => {
    if (running) return;
    running = true;
    document.body.style.overflow = 'hidden';
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');

    if (prefersReducedMotion) {
      overlay.classList.add('mapping', 'online');
      status?.classList.add('show');
      return;
    }

    overlay.classList.add('zooming');
    setTimeout(() => {
      overlay.classList.add('mapping');
      setTimeout(() => {
        overlay.classList.add('packet-run');
        packet?.classList.add('run');
        setTimeout(() => {
          overlay.classList.add('online');
          status?.classList.add('show');
        }, 2200);
      }, 600);
    }, 450);
  };

  openBtn.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  }));

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
}
