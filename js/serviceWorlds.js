import { prefersReducedMotion } from './core.js';

/**
 * Per-service mini-world hover animations
 */
const WORLDS = {
  automation: `
    <div class="sw-world sw-auto">
      <span class="sw-n" style="--i:0"></span><span class="sw-n" style="--i:1"></span>
      <span class="sw-n" style="--i:2"></span><span class="sw-n" style="--i:3"></span>
      <div class="sw-flow"><span>Trigger</span><i></i><span>AI</span><i></i><span>Action</span><i></i><span>Result</span></div>
    </div>`,
  chatbots: `
    <div class="sw-world sw-chat">
      <div class="sw-bubble user">I need a website.</div>
      <div class="sw-bubble ai">Let's find the right solution.</div>
      <div class="sw-badge">LEAD QUALIFIED</div>
    </div>`,
  website: `
    <div class="sw-world sw-web">
      <div class="sw-browser"><div class="sw-dots"></div><div class="sw-bar"></div><div class="sw-cards"><i></i><i></i><i></i></div></div>
      <div class="sw-badge">READY TO CONVERT</div>
    </div>`,
  marketing: `
    <div class="sw-world sw-mkt">
      <div class="sw-pipe"><span>Ads</span><i></i><span>Clicks</span><i></i><span>Visitors</span><i></i><span>Leads</span></div>
      <div class="sw-nums"><b data-rise="128">0</b> visitors</div>
    </div>`,
  ads: `
    <div class="sw-world sw-ads">
      <div class="sw-metric"><label>CTR</label><b data-rise="4.8" data-dec="1" data-suf="%">0%</b></div>
      <div class="sw-metric"><label>Clicks</label><b data-rise="842">0</b></div>
      <div class="sw-metric"><label>Conv.</label><b data-rise="67">0</b></div>
    </div>`,
  seo: `
    <div class="sw-world sw-seo">
      <div class="sw-rank" data-ranks="#47,#21,#8,#3">#47</div>
      <div class="sw-hint">Ranking climb (conceptual)</div>
    </div>`,
  leads: `
    <div class="sw-world sw-funnel">
      <div class="sw-funnel-shape"><i></i><i></i><i></i></div>
      <div class="sw-badge">QUALIFIED LEADS</div>
    </div>`,
  whatsapp: `
    <div class="sw-world sw-wa">
      <div class="sw-pipe vertical"><span>AD</span><i></i><span>LEAD</span><i></i><span>WHATSAPP</span><i></i><span>FOLLOW-UP</span><i></i><span>CUSTOMER</span></div>
    </div>`,
  ecommerce: `
    <div class="sw-world sw-web">
      <div class="sw-browser"><div class="sw-dots"></div><div class="sw-bar"></div><div class="sw-cards"><i></i><i></i></div></div>
      <div class="sw-badge">CART READY</div>
    </div>`,
};

function riseNumbers(root) {
  root.querySelectorAll('[data-rise]').forEach((el) => {
    const target = parseFloat(el.dataset.rise);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const suf = el.dataset.suf || '';
    if (prefersReducedMotion) {
      el.textContent = (dec ? target.toFixed(dec) : target) + suf;
      return;
    }
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / 700);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = (dec ? v.toFixed(dec) : Math.floor(v)) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function runSeo(root) {
  const el = root.querySelector('.sw-rank');
  if (!el) return;
  const ranks = (el.dataset.ranks || '').split(',');
  let i = 0;
  el.textContent = ranks[0] || '#47';
  if (prefersReducedMotion) {
    el.textContent = ranks[ranks.length - 1] || '#3';
    return;
  }
  const timer = setInterval(() => {
    i += 1;
    if (i >= ranks.length) {
      clearInterval(timer);
      return;
    }
    el.classList.add('flip');
    setTimeout(() => {
      el.textContent = ranks[i];
      el.classList.remove('flip');
    }, 180);
  }, 500);
}

export function initServiceWorlds() {
  document.querySelectorAll('.service-card[data-world]').forEach((card) => {
    const key = card.dataset.world;
    const html = WORLDS[key];
    if (!html) return;

    let stage = card.querySelector('.sw-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'sw-stage';
      stage.setAttribute('aria-hidden', 'true');
      stage.innerHTML = html;
      card.appendChild(stage);
    }

    let armed = false;
    card.addEventListener('mouseenter', () => {
      card.classList.add('world-on');
      if (!armed) {
        armed = true;
        riseNumbers(stage);
        if (key === 'seo') runSeo(stage);
      }
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('world-on');
      // allow re-trigger after leave
      setTimeout(() => {
        armed = false;
      }, 400);
    });
  });
}
