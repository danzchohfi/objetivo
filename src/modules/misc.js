/**
 * Small bits: live São Paulo clock, footer year, scroll-progress bar,
 * back-to-top, and the (front-end only) newsletter form.
 */
export function initMisc(gsap, ScrollTrigger, lenis) {
  // ---- year ----
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---- live local time ----
  const timeEl = document.getElementById('local-time');
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
    });
    const tick = () => (timeEl.textContent = fmt.format(new Date()));
    tick();
    setInterval(tick, 1000);
  }

  // ---- scroll progress bar ----
  const bar = document.getElementById('scroll-progress-bar');
  if (bar) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => (bar.style.transform = `scaleX(${self.progress})`),
    });
  }

  // ---- back to top ----
  const top = document.getElementById('back-to-top');
  top?.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- newsletter (front-end only) ----
  const form = document.getElementById('newsletter');
  const note = document.getElementById('newsletter-note');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim());
    if (!valid) {
      note.textContent = 'Hmm, confira o e-mail 👀';
      note.classList.remove('is-ok');
      input.focus();
      return;
    }
    note.textContent = 'Feito! Bem-vindo ao alvo certo. 🎯';
    note.classList.add('is-ok');
    input.value = '';
  });

  // ---- footer wordmark parallax ----
  const mark = document.querySelector('[data-footer-mark]');
  if (mark && !document.documentElement.classList.contains('reduced-motion')) {
    gsap.fromTo(
      mark,
      { xPercent: -4 },
      {
        xPercent: 4,
        ease: 'none',
        scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
      }
    );
  }
}
