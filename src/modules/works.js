/**
 * 3D tilt for [data-tilt] work cards (pointer-driven), plus a gentle scroll
 * parallax on the poster text. Tilt is disabled on touch / reduced-motion.
 */
export function initWorks(gsap, ScrollTrigger) {
  const reduced = document.documentElement.classList.contains('reduced-motion');
  const isTouch = matchMedia('(hover: none)').matches;

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const media = card.querySelector('.work__media');
    if (!media) return;

    // entrance
    if (!reduced) {
      gsap.from(card, {
        opacity: 0,
        y: 60,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%' },
      });
    }

    if (isTouch || reduced) return;

    const rotX = gsap.quickTo(media, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const rotY = gsap.quickTo(media, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const scale = gsap.quickTo(media, 'scale', { duration: 0.6, ease: 'power3.out' });

    gsap.set(media, { transformPerspective: 900 });

    media.addEventListener('pointermove', (e) => {
      const r = media.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 14);
      rotX(-py * 14);
      scale(1.03);
    });
    media.addEventListener('pointerleave', () => {
      rotY(0);
      rotX(0);
      scale(1);
    });
  });
}
