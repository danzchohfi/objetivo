/**
 * Interactive services list: hovering a row activates it and a colour preview
 * tile eases toward the cursor. Touch devices just get the active state on tap.
 *
 * Transform (position + scale) is driven manually in one ticker; GSAP only
 * touches opacity so the two never fight over the same property.
 */
export function initServices(gsap) {
  const list = document.getElementById('svc-list');
  const preview = document.getElementById('svc-preview');
  if (!list || !preview) return;

  const fill = preview.querySelector('span');
  const rows = [...list.querySelectorAll('.svc')];
  const isTouch = matchMedia('(hover: none)').matches;

  const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const current = { ...target };
  let scale = 0.8;
  let active = false;

  const setColor = (svc) => {
    const color = svc.dataset.color || '#ff5a1f';
    svc.style.setProperty('--svc-color', color);
    fill.style.setProperty('--svc-color', color);
  };

  rows.forEach((svc) => {
    svc.addEventListener('pointerenter', (e) => {
      rows.forEach((r) => r.classList.remove('is-active'));
      svc.classList.add('is-active');
      setColor(svc);
      if (!isTouch) {
        active = true;
        target.x = current.x = e.clientX;
        target.y = current.y = e.clientY;
        gsap.to(preview, { opacity: 1, duration: 0.5, ease: 'power3.out' });
      }
    });
    svc.addEventListener('pointermove', (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    });
    svc.addEventListener('pointerleave', () => {
      svc.classList.remove('is-active');
      if (!isTouch) {
        active = false;
        gsap.to(preview, { opacity: 0, duration: 0.4, ease: 'power3.out' });
      }
    });
  });

  if (!isTouch) {
    gsap.ticker.add(() => {
      const targetScale = active ? 1 : 0.8;
      scale += (targetScale - scale) * 0.12;
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      preview.style.transform =
        `translate(${current.x}px, ${current.y}px) translate(-50%, -50%) scale(${scale})`;
    });
  }
}
