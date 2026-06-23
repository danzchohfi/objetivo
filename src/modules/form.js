/**
 * "Solicitar atendimento" modal + lead form.
 *
 * The site is static (GitHub Pages), so submissions go to a no-backend form
 * handler (FormSubmit) that emails the lead to the agency. If that request
 * fails for any reason, we fall back to a pre-filled WhatsApp link so the lead
 * is never lost.
 *
 * NOTE: FormSubmit requires a one-time activation — the first submission sends a
 * confirmation email to contato@objetivomarketing.com.br; click it once and all
 * future leads arrive by email.
 */
const ENDPOINT = 'https://formsubmit.co/ajax/contato@objetivomarketing.com.br';
const WHATSAPP = '5548998313601';

export function initForm(lenis) {
  const modal = document.getElementById('form-modal');
  const form = document.getElementById('lead-form');
  if (!modal || !form) return;

  const note = document.getElementById('form-note');
  const planoField = form.querySelector('input[name="plano"]');
  const submitBtn = form.querySelector('.modal__submit');
  const submitLabel = form.querySelector('.modal__submit-label');
  const nameInput = form.querySelector('input[name="nome"]');
  let lastFocused = null;

  const open = (plano) => {
    lastFocused = document.activeElement;
    planoField.value = plano || '';
    form.classList.remove('is-sent');
    form.reset();
    note.textContent = '';
    note.className = 'modal__note';
    submitBtn.disabled = false;
    submitLabel.textContent = 'Solicitar atendimento';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    lenis?.stop();
    setTimeout(() => nameInput?.focus(), 80);
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    lenis?.start();
    lastFocused?.focus?.();
  };

  document.querySelectorAll('[data-open-form]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open(el.getAttribute('data-plan'));
    })
  );
  modal.querySelectorAll('[data-close-form]').forEach((el) => el.addEventListener('click', close));

  // keyboard: ESC to close, basic focus trap while open
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') return close();
    if (e.key === 'Tab') {
      const f = modal.querySelectorAll('button, input, a[href]');
      const list = [...f].filter((el) => !el.disabled && el.offsetParent !== null);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  const validate = () => {
    let ok = true;
    form.querySelectorAll('.field__input[required]').forEach((inp) => {
      const v = inp.value.trim();
      let bad = !v;
      if (inp.type === 'email' && v) bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
      inp.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    return ok;
  };
  form.querySelectorAll('.field__input').forEach((inp) =>
    inp.addEventListener('input', () => inp.classList.remove('is-invalid'))
  );

  const enc = (s) => encodeURIComponent(s || '');
  const waLink = (d) =>
    `https://wa.me/${WHATSAPP}?text=` +
    enc(`Olá! Quero solicitar um atendimento.
Nome: ${d.nome}
Empresa: ${d.empresa || '-'}
E-mail: ${d.email}
WhatsApp: ${d.whatsapp}${d.plano ? `\nPlano: ${d.plano}` : ''}`);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    note.textContent = '';
    note.className = 'modal__note';

    const data = Object.fromEntries(new FormData(form).entries());
    if (data._honey) return; // bot trap

    if (!validate()) {
      note.textContent = 'Confira os campos destacados.';
      note.classList.add('is-err');
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Enviando…';

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          empresa: data.empresa || '—',
          email: data.email,
          whatsapp: data.whatsapp,
          plano: data.plano || '—',
          _subject: 'Novo lead — Objetivo Marketing',
          _template: 'table',
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.classList.add('is-sent');
      note.textContent = '✓ Recebido! Entraremos em contato no WhatsApp nos próximos minutos.';
      note.classList.add('is-ok');
    } catch (err) {
      note.innerHTML =
        'Não consegui enviar agora. <a href="' + waLink(data) + '" target="_blank" rel="noopener">Falar no WhatsApp →</a>';
      note.classList.add('is-err');
      submitBtn.disabled = false;
      submitLabel.textContent = 'Solicitar atendimento';
    }
  });
}
