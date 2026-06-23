import SplitType from 'split-type';

/**
 * All scroll-triggered text + element reveals. Built to degrade gracefully:
 * with reduced-motion everything is simply shown.
 */
export function initReveals(gsap, ScrollTrigger) {
  const reduced = document.documentElement.classList.contains('reduced-motion');

  if (reduced) {
    document.querySelectorAll('[data-reveal], [data-reveal-line], [data-reveal-lines] , .line__inner')
      .forEach((el) => gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' }));
    return;
  }

  // ---- generic fade/rise ----
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // ---- single line mask reveal ----
  gsap.utils.toArray('[data-reveal-line]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: el.closest('.line') || el, start: 'top 90%' },
      }
    );
  });

  // ---- multi-line headings: split into lines, mask each ----
  gsap.utils.toArray('[data-reveal-lines]').forEach((el) => {
    const split = new SplitType(el, { types: 'lines', lineClass: 'split-line' });
    split.lines.forEach((line) => {
      const wrap = document.createElement('span');
      wrap.style.display = 'block';
      wrap.style.overflow = 'hidden';
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
      line.style.display = 'block';
      line.style.willChange = 'transform';
    });
    gsap.fromTo(
      split.lines,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  // ---- manifesto: word-by-word lighting on scroll ----
  const manifesto = document.querySelector('[data-words]');
  if (manifesto) {
    const split = new SplitType(manifesto, { types: 'words', wordClass: 'word' });
    const total = split.words.length;
    ScrollTrigger.create({
      trigger: manifesto,
      start: 'top 78%',
      end: 'bottom 62%',
      scrub: true,
      onUpdate: (self) => {
        const lit = Math.round(self.progress * total);
        split.words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
      },
    });
  }

  // ---- subtle parallax for marked elements ----
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: -depth * 100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/** Hero headline reveal — called right after the preloader resolves. */
export function revealHero(gsap) {
  const reduced = document.documentElement.classList.contains('reduced-motion');
  const lines = document.querySelectorAll('[data-hero-line]');
  const fades = document.querySelectorAll('[data-pl-hero]');

  if (reduced) {
    gsap.set(lines, { yPercent: 0 });
    gsap.set(fades, { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline();
  tl.to(lines, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1 })
    .fromTo(
      fades,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 },
      '-=0.7'
    );
  return tl;
}
