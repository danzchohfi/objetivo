/**
 * Header behaviour: hide-on-scroll-down / show-on-scroll-up, condensed style
 * once scrolled, active-link tracking, anchor smooth-scroll via Lenis, and the
 * fullscreen menu open/close timeline.
 */
export function initNav(gsap, ScrollTrigger, lenis) {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const menuBg = menu?.querySelector('.menu__bg');
  const menuLinks = menu ? [...menu.querySelectorAll('.menu__text')] : [];
  const menuIdx = menu ? [...menu.querySelectorAll('.menu__index')] : [];

  // ---- hide / condense on scroll ----
  let lastY = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 40);
      if (menu.classList.contains('is-open')) return;
      if (y > lastY && y > 300) header.classList.add('is-hidden');
      else header.classList.remove('is-hidden');
      lastY = y;
    },
  });

  // ---- active link by section ----
  const links = [...document.querySelectorAll('.header__link')];
  const sections = links
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);
  sections.forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => links[i]?.classList.toggle('is-active', self.isActive),
    });
  });

  // ---- menu open / close ----
  let open = false;
  gsap.set(menuLinks, { yPercent: 110 });
  const tlOpen = gsap.timeline({ paused: true });
  tlOpen
    .set(menu, { className: 'menu is-open' })
    .to(menuBg, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power4.inOut' })
    .to(menuLinks, { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.06 }, '-=0.3')
    .to(menuIdx, { opacity: 1, duration: 0.4, stagger: 0.06 }, '<');

  const setOpen = (state) => {
    open = state;
    burger.setAttribute('aria-expanded', String(state));
    burger.setAttribute('aria-label', state ? 'Fechar menu' : 'Abrir menu');
    menu.setAttribute('aria-hidden', String(!state));
    if (state) {
      document.body.classList.add('is-locked');
      lenis?.stop();
      tlOpen.timeScale(1).play(0);
    } else {
      lenis?.start();
      document.body.classList.remove('is-locked');
      gsap.to(menuLinks, { yPercent: 110, duration: 0.4, ease: 'power3.in', stagger: 0.03 });
      gsap.to(menuIdx, { opacity: 0, duration: 0.2 });
      gsap.to(menuBg, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.6,
        ease: 'power4.inOut',
        delay: 0.15,
        onComplete: () => menu.classList.remove('is-open'),
      });
    }
  };

  burger?.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  // ---- anchor smooth-scroll (Lenis) ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (open) setOpen(false);
      const delay = open ? 0.5 : 0;
      gsap.delayedCall(delay, () => {
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.3 });
        else target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  });
}
