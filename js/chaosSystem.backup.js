import { prefersReducedMotion, clamp, isMobile } from './core.js';

/**
 * Business Chaos → Connected System scroll story
 */
export function initChaosSystem(section) {
  if (!section) return;

  const stage = section.querySelector('.chaos-stage');
  const nodes = [...section.querySelectorAll('.chaos-node')];
  const core = section.querySelector('.chaos-core');
  const finale = section.querySelector('.chaos-finale');
  const svgBroken = section.querySelector('.chaos-svg-broken');
  const svgConnected = section.querySelector('.chaos-svg-connected');
  const warns = section.querySelector('.chaos-warns');

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

  const update = () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = Math.max(1, r.height - vh * 0.45);
    const progress = prefersReducedMotion ? 1 : clamp(-r.top / total, 0, 1);

    section.style.setProperty('--chaos-p', progress.toFixed(4));

    section.classList.toggle('phase-drift', progress < 0.2);
    section.classList.toggle('phase-warn', progress >= 0.08 && progress < 0.32);
    section.classList.toggle('phase-pull', progress >= 0.28 && progress < 0.48);
    section.classList.toggle('phase-core', progress >= 0.42 && progress < 0.62);
    section.classList.toggle('phase-align', progress >= 0.55 && progress < 0.78);
    section.classList.toggle('phase-pulse', progress >= 0.72);

    warns?.classList.toggle('show', progress >= 0.1 && progress < 0.35);
    core?.classList.toggle('show', progress >= 0.38);
    svgBroken?.classList.toggle('show', progress < 0.48);
    svgConnected?.classList.toggle('show', progress >= 0.48);
    finale?.classList.toggle('show', progress >= 0.75);

    if (progress < 0.48) drawBroken();
    if (progress >= 0.38) drawConnected();

    if (prefersReducedMotion) {
      section.classList.add('phase-pulse', 'chaos-reduced');
      core?.classList.add('show');
      finale?.classList.add('show');
      svgConnected?.classList.add('show');
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
