/**
 * Text-scramble on hover for [data-scramble] elements. Cheap, self-contained,
 * and respects reduced-motion (no-op there).
 */
export function initScramble() {
  if (document.documentElement.classList.contains('reduced-motion')) return;
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const els = document.querySelectorAll('[data-scramble]');

  els.forEach((el) => {
    const original = el.textContent;
    let frame = 0;
    let raf = null;

    const run = () => {
      const length = original.length;
      const queue = [];
      for (let i = 0; i < length; i++) {
        const start = Math.floor(Math.random() * 12);
        const end = start + Math.floor(Math.random() * 12);
        queue.push({ char: original[i], start, end });
      }
      frame = 0;

      const tick = () => {
        let out = '';
        let complete = 0;
        for (let i = 0; i < queue.length; i++) {
          const q = queue[i];
          if (frame >= q.end) {
            complete++;
            out += q.char;
          } else if (frame >= q.start) {
            if (!q.r || Math.random() < 0.28) q.r = chars[Math.floor(Math.random() * chars.length)];
            out += `<span style="opacity:.6">${q.r}</span>`;
          } else {
            out += q.char;
          }
        }
        el.innerHTML = out;
        if (complete === queue.length) {
          el.textContent = original;
          return;
        }
        frame++;
        raf = requestAnimationFrame(tick);
      };
      cancelAnimationFrame(raf);
      tick();
    };

    el.addEventListener('pointerenter', run);
  });
}
