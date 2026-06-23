/**
 * Custom cursor: a lerped ring + dot with hover / label / press states.
 * Skipped entirely on touch devices.
 */
export function initCursor(gsap) {
  if (matchMedia('(hover: none)').matches) return;
  if (document.documentElement.classList.contains('reduced-motion')) return;

  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  const dot = document.getElementById('cursor-dot');
  const label = document.getElementById('cursor-label');
  if (!cursor) return;

  document.documentElement.classList.add('cursor-ready');

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...pos };

  const xSet = gsap.quickSetter(dot, 'x', 'px');
  const ySet = gsap.quickSetter(dot, 'y', 'px');
  const xRing = gsap.quickSetter(ring, 'x', 'px');
  const yRing = gsap.quickSetter(ring, 'y', 'px');
  const xLabel = gsap.quickSetter(label, 'x', 'px');
  const yLabel = gsap.quickSetter(label, 'y', 'px');

  let visible = false;
  window.addEventListener('pointermove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    if (!visible) {
      visible = true;
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    }
  });

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.18;
    ringPos.y += (pos.y - ringPos.y) * 0.18;
    xSet(pos.x);
    ySet(pos.y);
    xRing(ringPos.x);
    yRing(ringPos.y);
    xLabel(pos.x);
    yLabel(pos.y);
  });

  // hover targets
  const hoverSel = 'a, button, [data-magnetic], [data-cursor], input, .svc__row, .work__media';
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest(hoverSel);
    if (!t) return;
    const labelText = t.getAttribute('data-cursor');
    if (labelText) {
      cursor.classList.add('is-label');
      cursor.classList.remove('is-hover');
      label.textContent = labelText;
    } else {
      cursor.classList.add('is-hover');
    }
  });
  document.addEventListener('pointerout', (e) => {
    const t = e.target.closest(hoverSel);
    if (!t) return;
    cursor.classList.remove('is-hover', 'is-label');
  });

  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
}
