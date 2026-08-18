import { prefersReducedMotion, clamp, isMobile } from './core.js';

/**
 * Business Chaos → Connected System scroll story
 * - animation finishes earlier while section is still sticky
 * - warning popups stay near related nodes
 * - final headline appears after nodes move away from center
 */
export function initChaosSystem(section) {
  if (!section) return;

  const stage = section.querySelector('.chaos-stage');
  const nodes = [...section.querySelectorAll('.chaos-node')];
  const core = section.querySelector('.chaos-core');
  const finale = section.querySelector('.chaos-finale');
  const svgBroken = section.querySelector('.chaos-svg-broken');
  const svgConnected = section.querySelector('.chaos-svg-connected');
  const popups = [...section.querySelectorAll('.chaos-popup')];

  if (!stage || !nodes.length) return;

  const getCenter = (el) => {
    const sr = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - sr.left + r.width / 2,
      y: r.top - sr.top + r.height / 2,
    };
  };

  const drawBroken = () => {
    if (!svgBroken) return;
    const sr = stage.getBoundingClientRect();
    svgBroken.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
    svgBroken.innerHTML = '';
    const pts = nodes.map(getCenter);
    const cx = sr.width / 2;
    const cy = sr.height / 2;

    // Lines toward center that stop short — connection lost
    pts.forEach((p) => {
      const dx = cx - p.x;
      const dy = cy - p.y;
      const endX = p.x + dx * 0.55;
      const endY = p.y + dy * 0.55;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(p.x));
      line.setAttribute('y1', String(p.y));
      line.setAttribute('x2', String(endX));
      line.setAttribute('y2', String(endY));
      line.setAttribute('class', 'chaos-line-broken');
      svgBroken.appendChild(line);
      // X mark at break point
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'chaos-break-x');
      g.setAttribute('transform', `translate(${endX},${endY})`);
      g.innerHTML = '<line x1="-5" y1="-5" x2="5" y2="5"/><line x1="5" y1="-5" x2="-5" y2="5"/>';
      svgBroken.appendChild(g);
    });

    // Random cross-links between nodes (messy, not through core)
    const pairs = [[0, 2], [1, 3], [4, 5], [2, 6]];
    pairs.forEach(([a, b]) => {
      if (!pts[a] || !pts[b]) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(pts[a].x));
      line.setAttribute('y1', String(pts[a].y));
      line.setAttribute('x2', String(pts[b].x));
      line.setAttribute('y2', String(pts[b].y));
      line.setAttribute('class', 'chaos-line-cross');
      svgBroken.appendChild(line);
    });
  };

  const drawConnected = () => {
    if (!svgConnected || !core) return;
    const sr = stage.getBoundingClientRect();
    svgConnected.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
    svgConnected.innerHTML = `
      <defs>
        <linearGradient id="chaosLiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3B82F6"/>
          <stop offset="100%" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>`;
    const c = getCenter(core);

    nodes.forEach((node) => {
      const p = getCenter(node);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(c.x));
      line.setAttribute('y1', String(c.y));
      line.setAttribute('x2', String(p.x));
      line.setAttribute('y2', String(p.y));
      line.setAttribute('class', 'chaos-line-live');
      svgConnected.appendChild(line);
    });
  };

  const updatePopups = (show, animProgress) => {
    if (!popups.length) return;

    if (!show) {
      popups.forEach((p) => {
        p.style.opacity = '0';
      });
      return;
    }

    popups.forEach((popup) => {
      const id = popup.dataset.for;
      const node = nodes.find((n) => n.dataset.id === id);
      if (!node) return;
      const c = getCenter(node);

      popup.style.left = `${c.x}px`;
      popup.style.top = `${c.y - 42}px`;
      popup.style.opacity = String(clamp((animProgress - 0.1) / 0.22, 0, 1));
    });
  };

  const update = () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = Math.max(1, r.height - vh * 0.45);
    const progress = prefersReducedMotion ? 1 : clamp(-r.top / total, 0, 1);
    const animProgress = prefersReducedMotion ? 1 : clamp(progress / 0.7, 0, 1);

    section.style.setProperty('--chaos-p', animProgress.toFixed(4));

    section.classList.toggle('phase-drift', animProgress < 0.2);
    section.classList.toggle('phase-warn', animProgress >= 0.08 && animProgress < 0.32);
    section.classList.toggle('phase-pull', animProgress >= 0.28 && animProgress < 0.48);
    section.classList.toggle('phase-core', animProgress >= 0.42 && animProgress < 0.62);
    section.classList.toggle('phase-align', animProgress >= 0.55 && animProgress < 0.78);
    section.classList.toggle('phase-pulse', animProgress >= 0.72);
    section.classList.toggle('chaos-final', animProgress >= 0.74);

    core?.classList.toggle('show', animProgress >= 0.38);
    svgBroken?.classList.toggle('show', animProgress < 0.48);
    svgConnected?.classList.toggle('show', animProgress >= 0.48);
    finale?.classList.toggle('show', animProgress >= 0.75);
    updatePopups(animProgress >= 0.1 && animProgress < 0.36, animProgress);

    if (animProgress < 0.48) drawBroken();
    if (animProgress >= 0.38) drawConnected();

    if (prefersReducedMotion) {
      section.classList.add('phase-pulse', 'chaos-reduced', 'chaos-final');
      core?.classList.add('show');
      finale?.classList.add('show');
      svgConnected?.classList.add('show');
      updatePopups(false, 1);
      drawConnected();
    }
  };

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
  window.addEventListener('resize', () => {
    update();
  }, { passive: true });

  update();
  if (isMobile()) section.classList.add('chaos-mobile');
}
