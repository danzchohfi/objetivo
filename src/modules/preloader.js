/**
 * Animated preloader: a count from 0→100 with a loading bar and brand reveal.
 * Resolves once the outro finishes so the hero can take over.
 */
export function runPreloader(gsap) {
  return new Promise((resolve) => {
    const el = document.getElementById('preloader');
    const countEl = document.getElementById('pl-count');
    const barEl = document.getElementById('pl-bar');
    const word = document.querySelector('[data-pl-word]');
    const tag = document.querySelector('[data-pl-fade]');

    if (!el) return resolve();

    // Reduced-motion: skip the show, reveal content immediately.
    if (document.documentElement.classList.contains('reduced-motion')) {
      el.style.display = 'none';
      return resolve();
    }

    document.body.classList.add('is-locked');

    // establish a clean baseline + reveal the (CSS-hidden) word
    gsap.set(word, { yPercent: 110, visibility: 'visible' });

    const counter = { v: 0 };
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        el.classList.add('is-done');
        document.body.classList.remove('is-locked');
        resolve();
      },
    });

    tl.to(word, { yPercent: 0, duration: 1, ease: 'power4.out' }, 0.1)
      .to(tag, { opacity: 1, duration: 0.8 }, 0.5)
      .to(
        counter,
        {
          v: 100,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => {
            const val = Math.round(counter.v);
            if (countEl) countEl.textContent = val;
            if (barEl) barEl.style.transform = `scaleX(${counter.v / 100})`;
          },
        },
        0.2
      )
      // outro
      .to([word, tag], { yPercent: -110, opacity: 0, duration: 0.7, ease: 'power3.in', stagger: 0.05 }, '+=0.25')
      .to('.preloader__meta, .preloader__bar', { opacity: 0, duration: 0.4 }, '<')
      .to(el, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.2')
      .set(el, { display: 'none' });
  });
}
