/**
 * Magnetic hover for [data-magnetic] elements — the element (and an inner
 * label, if present) eases toward the pointer, then springs back.
 */
export function initMagnetic(gsap) {
  if (matchMedia('(hover: none)').matches) return;
  if (document.documentElement.classList.contains('reduced-motion')) return;

  const targets = document.querySelectorAll('[data-magnetic]');
  const strength = 0.4;

  targets.forEach((el) => {
    const inner = el.querySelector('span') || el;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: relX * strength, y: relY * strength, duration: 0.6, ease: 'power3.out' });
      gsap.to(inner, { x: relX * strength * 0.35, y: relY * strength * 0.35, duration: 0.6, ease: 'power3.out' });
    };
    const reset = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('pointerenter', () => el.addEventListener('pointermove', move));
    el.addEventListener('pointerleave', () => {
      el.removeEventListener('pointermove', move);
      reset();
    });
  });
}
