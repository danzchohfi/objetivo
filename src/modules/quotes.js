/**
 * Testimonials rotator — auto-advances, pauses on hover, and supports the dot
 * controls. Uses the [data-active] attribute (CSS handles the cross-fade).
 */
export function initQuotes() {
  const quotes = [...document.querySelectorAll('[data-quote]')];
  const dots = [...document.querySelectorAll('[data-quote-dot]')];
  if (quotes.length < 2) return;

  let i = 0;
  let timer = null;
  const DELAY = 5200;

  const show = (n) => {
    i = (n + quotes.length) % quotes.length;
    quotes.forEach((q, idx) => {
      if (idx === i) q.setAttribute('data-active', '');
      else q.removeAttribute('data-active');
    });
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
  };

  const start = () => {
    stop();
    timer = setInterval(() => show(i + 1), DELAY);
  };
  const stop = () => timer && clearInterval(timer);

  dots.forEach((d, idx) =>
    d.addEventListener('click', () => {
      show(idx);
      start();
    })
  );

  const section = quotes[0].closest('section');
  section?.addEventListener('pointerenter', stop);
  section?.addEventListener('pointerleave', start);

  show(0);
  start();
}
