/**
 * Infinite marquees. Base drift + extra push from scroll velocity, and a
 * direction flip based on scroll direction. Pure transform, GPU-friendly.
 */
export function initMarquees(gsap, lenis) {
  const tracks = document.querySelectorAll('[data-marquee]');
  if (!tracks.length) return;

  const items = [...tracks].map((el) => ({
    el,
    dir: parseFloat(el.dataset.marqueeDir) || 1,
    x: 0,
    width: el.scrollWidth / 2 || el.offsetWidth,
    baseSpeed: 0.04,
  }));

  let velocity = 0;
  if (lenis) {
    lenis.on('scroll', ({ velocity: v }) => {
      velocity = v || 0;
    });
  } else {
    let last = window.scrollY;
    window.addEventListener('scroll', () => {
      velocity = window.scrollY - last;
      last = window.scrollY;
    });
  }

  // refresh widths on resize
  window.addEventListener('resize', () => {
    items.forEach((it) => (it.width = it.el.scrollWidth / 2 || it.el.offsetWidth));
  });

  gsap.ticker.add((time, deltaTime) => {
    const dt = deltaTime || 16.6;
    const boost = Math.min(Math.abs(velocity) * 0.6, 14);
    const sign = velocity >= 0 ? 1 : -1;
    items.forEach((it) => {
      const speed = (it.baseSpeed + boost * 0.01) * it.dir * sign;
      it.x -= speed * dt;
      if (it.width) {
        if (it.x <= -it.width) it.x += it.width;
        if (it.x > 0) it.x -= it.width;
      }
      it.el.style.transform = `translate3d(${it.x}px,0,0)`;
    });
    velocity *= 0.9;
  });
}
