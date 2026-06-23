/**
 * Count-up numbers for [data-count]. Supports decimals + a suffix and fires
 * once when the stat scrolls into view.
 */
export function initCounters(gsap, ScrollTrigger) {
  const reduced = document.documentElement.classList.contains('reduced-motion');

  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';

    const render = (v) => {
      el.textContent = v.toFixed(decimals);
      el.setAttribute('data-rendered-suffix', suffix);
    };

    if (reduced) {
      render(target);
      return;
    }

    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => render(obj.v),
        });
      },
    });
  });
}
