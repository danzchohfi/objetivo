import './styles/base.css';
import './styles/ui.css';
import './styles/sections.css';
import './styles/components.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroScene from './webgl/HeroScene.js';
import { initSmoothScroll } from './modules/smoothScroll.js';
import { runPreloader } from './modules/preloader.js';
import { initCursor } from './modules/cursor.js';
import { initMagnetic } from './modules/magnetic.js';
import { initNav } from './modules/nav.js';
import { initReveals, revealHero } from './modules/reveals.js';
import { initMarquees } from './modules/marquee.js';
import { initCounters } from './modules/counters.js';
import { initServices } from './modules/services.js';
import { initWorks } from './modules/works.js';
import { initQuotes } from './modules/quotes.js';
import { initFaq } from './modules/faq.js';
import { initScramble } from './modules/scramble.js';
import { initMisc } from './modules/misc.js';

gsap.registerPlugin(ScrollTrigger);
if (import.meta.env?.DEV || window.location.search.includes('debug')) window.gsap = gsap;

const reduced = document.documentElement.classList.contains('reduced-motion');

/* ---- viewport unit + resize plumbing ---- */
const setVH = () =>
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

function boot() {
  /* Hide hero headline lines up-front (behind the preloader) so the reveal
     starts clean. Set via gsap so the unit matches the animation. */
  if (!reduced) gsap.set('[data-hero-line]', { yPercent: 110 });

  /* ---- smooth scroll first (shared ticker/clock) ---- */
  const lenis = initSmoothScroll(gsap, ScrollTrigger);

  /* ---- WebGL background ---- */
  const canvas = document.getElementById('webgl');
  const hero = !reduced && canvas ? new HeroScene(canvas) : null;

  if (hero && hero.enabled) {
    // pointer → shader (normalised -1..1)
    window.addEventListener(
      'pointermove',
      (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -((e.clientY / window.innerHeight) * 2 - 1);
        hero.setMouse(x, y);
      },
      { passive: true }
    );

    // page scroll progress → shader
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => hero.setScroll(self.progress),
    });

    // single shared render tick
    gsap.ticker.add(() => hero.update(gsap.ticker.time));

    // pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      document.hidden ? hero.pause() : hero.resume();
    });

    window.addEventListener('resize', () => hero.resize());
  }

  /* ---- interaction modules that don't measure text ---- */
  initCursor(gsap);
  initMagnetic(gsap);
  initNav(gsap, ScrollTrigger, lenis);
  initMarquees(gsap, lenis);
  initQuotes();
  initFaq(gsap);
  initScramble();
  initMisc(gsap, ScrollTrigger, lenis);

  /* ---- text-measuring modules wait for fonts so line splits are correct ---- */
  const fontsReady = document.fonts
    ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))])
    : Promise.resolve();

  fontsReady.then(() => {
    initReveals(gsap, ScrollTrigger);
    initCounters(gsap, ScrollTrigger);
    initServices(gsap);
    initWorks(gsap, ScrollTrigger);
    ScrollTrigger.refresh();
  });

  /* ---- intro sequence ---- */
  runPreloader(gsap).then(() => {
    revealHero(gsap);
    if (hero) hero.reveal(gsap);
    ScrollTrigger.refresh();
  });

  /* ---- keep ScrollTrigger honest on resize ---- */
  let rt;
  window.addEventListener('resize', () => {
    setVH();
    clearTimeout(rt);
    rt = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
}

setVH();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
