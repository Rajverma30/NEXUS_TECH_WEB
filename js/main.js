import { onReady, prefersReducedMotion } from './core.js';
import { initLoader } from './loader.js';
import { initCursorFollower } from './cursor.js';
import { initMagnetic } from './magnetic.js';
import { initParticleField } from './particleField.js';
import { initGrowthEngine } from './growthEngine.js';
import { initTextMorph } from './textMorph.js';
import { initChaosSystem } from './chaosSystem.js';
import { initOrbitSystem } from './orbitSystem.js';
import { initAiCore } from './aiCore.js';
import { initServiceWorlds } from './serviceWorlds.js';
import { initAnimatedDashboard } from './animatedDashboard.js';
import { initScrollGraph } from './scrollGraph.js';
import { initSystemMap } from './systemMap.js';
import { initCaseStudies } from './caseStudy.js';
import { initPlatformOrbit } from './platformOrbit.js';

onReady(() => {
  initLoader();
  initCursorFollower();
  initMagnetic();
  initParticleField(document.querySelector('.hero'));
  initGrowthEngine(document.getElementById('growthEngine'));
  initTextMorph(document.getElementById('heroMorph'));
  initChaosSystem(document.getElementById('chaos'));
  initOrbitSystem(document.getElementById('universe'));
  initPlatformOrbit(document.getElementById('platformEco'));
  initAiCore(document.getElementById('aiCore'));
  initServiceWorlds();
  initAnimatedDashboard(document.querySelector('.analytics-board'));
  initScrollGraph(document.getElementById('scrollGrowth'));
  initSystemMap();
  initCaseStudies();

  if (!prefersReducedMotion) {
    document.querySelectorAll('.section-title').forEach((h) => {
      h.classList.add('title-reveal');
    });
  }

  document.documentElement.classList.add('cinematic-on');
});
