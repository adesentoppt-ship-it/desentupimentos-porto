/* =========================================================
   Desentupimentos 24h — interações
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const header = document.getElementById('header');

  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu ao clicar num link
    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sombra no cabeçalho ao fazer scroll ---------- */
  const onScroll = () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8
      ? '0 4px 16px rgba(15, 30, 51, 0.08)'
      : 'none';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Contadores animados (secção de estatísticas) ---------- */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target).toLocaleString('pt-PT');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  }

  /* ---------- Acordeão de FAQ ---------- */
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const panel = item.querySelector('.accordion__panel');
      const isOpen = item.classList.contains('is-open');

      // Fecha os outros itens (acordeão exclusivo)
      document.querySelectorAll('.accordion__item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.accordion__panel').style.maxHeight = null;
        }
      });

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Formulário de contacto → envio direto por WhatsApp ---------- */
  // Não usamos email nem backend: ao submeter, o pedido é formatado
  // e aberto automaticamente no WhatsApp do número da empresa, já
  // pronto a enviar. Não requer nenhuma conta ou serviço externo.
  const WHATSAPP_NUMBER = '351925375475'; // EDITAR: número com indicativo de país, sem "+"

  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Indique o seu nome.',
    phone: (v) => /^[+]?[\d\s()-]{9,}$/.test(v.trim()) || 'Indique um telefone válido.',
    message: (v) => v.trim().length >= 10 || 'Descreva o problema com mais detalhe (mín. 10 caracteres).',
  };

  const showError = (field, message) => {
    const row = form.querySelector(`#${field}`).closest('.form-row');
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    row.classList.toggle('has-error', Boolean(message));
    errorEl.textContent = message || '';
  };

  const validateField = (field) => {
    const input = form.querySelector(`#${field}`);
    const result = validators[field](input.value);
    showError(field, result === true ? '' : result);
    return result === true;
  };

  if (form) {
    Object.keys(validators).forEach(field => {
      const input = form.querySelector(`#${field}`);
      if (input) input.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isValid = Object.keys(validators)
        .map(validateField)
        .every(Boolean);

      if (!isValid) return;

      const name = form.querySelector('#name').value.trim();
      const phone = form.querySelector('#phone').value.trim();
      const message = form.querySelector('#message').value.trim();

      const text =
        `Olá! Vim do site e preciso de um desentupimento.\n\n` +
        `*Nome:* ${name}\n` +
        `*Telefone:* ${phone}\n` +
        `*Problema:* ${message}`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

      // Abre o WhatsApp (nova aba no desktop, a app diretamente no telemóvel)
      window.open(whatsappUrl, '_blank', 'noopener');

      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
    });
  }

});
