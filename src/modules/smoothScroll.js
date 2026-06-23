import Lenis from 'lenis';

/**
 * Lenis smooth scroll, wired into the GSAP ticker + ScrollTrigger so every
 * animation system shares one clock. Disabled for reduced-motion users.
 */
export function initSmoothScroll(gsap, ScrollTrigger) {
  // Reduced-motion users keep native scrolling — everything falls back cleanly.
  if (document.documentElement.classList.contains('reduced-motion')) {
    gsap.ticker.lagSmoothing(0);
    return null;
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    lerp: 0.1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
