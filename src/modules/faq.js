/**
 * FAQ accordion built on native <details>. JS adds smooth height animation
 * and single-open behaviour; without JS the <details> still work.
 */
export function initFaq(gsap) {
  const items = [...document.querySelectorAll('.faq__item')];
  if (!items.length) return;
  const reduced = document.documentElement.classList.contains('reduced-motion');

  const open = (item) => {
    const panel = item.querySelector('.faq__a');
    item.setAttribute('open', '');
    if (reduced) return;
    panel.style.display = 'block';
    gsap.fromTo(
      panel,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
  };

  const close = (item) => {
    const panel = item.querySelector('.faq__a');
    if (reduced) {
      item.removeAttribute('open');
      return;
    }
    gsap.to(panel, {
      height: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.inOut',
      onComplete: () => {
        item.removeAttribute('open');
        panel.style.display = '';
        gsap.set(panel, { clearProps: 'height,opacity' });
      },
    });
  };

  items.forEach((item) => {
    const summary = item.querySelector('.faq__q');
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.hasAttribute('open');
      items.forEach((other) => {
        if (other !== item && other.hasAttribute('open')) close(other);
      });
      isOpen ? close(item) : open(item);
    });
  });
}
