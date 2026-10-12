/* ============================================================
   CONFIGURACIÓN — edita aquí el email y el QR
============================================================ */
const CONFIG = {
  email:    'isqrafael@gmail.com',
  profesor: 'Rafael',
  qrUrl:    '' 
};

/* ============================================================
   CORREO — enlaces mailto
============================================================ */
const enc = encodeURIComponent;

// Cuerpo estándar: el alumno solo rellena los huecos
function mailBody() {
  return `Hola ${CONFIG.profesor},\n\nte escribo porque necesito ayuda con mis clases.\n\n` +
    `Estudio: _____\nAsignatura: _____\nMi examen es el: _____\n` +
    `Prefiero clases (online / presencial): _____\n\nUn saludo.`;
}
function mailLink(subject, body) {
  return `mailto:${CONFIG.email}?subject=${enc(subject)}&body=${enc(body)}`;
}
function setMail(a, subject, body) {
  a.href = mailLink(subject, body);
}

/* ============================================================
   MENÚ MÓVIL
============================================================ */
const menuBtn    = document.getElementById('menuBtn');
const menuClose  = document.getElementById('menuClose');
const mobileMenu = document.getElementById('mobile-menu');

function openMenu() {
  mobileMenu.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('.mobile-nav-link').forEach(a => a.addEventListener('click', closeMenu));

/* ============================================================
   SCROLL EVENTS (Header & Progress)
============================================================ */
const header = document.getElementById('site-header');
const readProgress = document.getElementById('read-progress');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const docH   = document.documentElement.scrollHeight - window.innerHeight;
  const pct    = docH > 0 ? (window.scrollY / docH) * 100 : 0;
  readProgress.style.width = pct + '%';
}, { passive: true });

/* ============================================================
   PREFERENCIA DE MOVIMIENTO REDUCIDO
============================================================ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   FILTRO DE ASIGNATURAS (curso → cuatrimestre)
============================================================ */
const subjectFilter = { curso: '2', cuatri: '1' };
const subjectPanels = [...document.querySelectorAll('.subject-panel')];
const subjectCount  = document.getElementById('subjectCount');

function showSubjects() {
  subjectPanels.forEach((panel) => {
    const match = panel.dataset.curso === subjectFilter.curso && panel.dataset.cuatri === subjectFilter.cuatri;
    panel.hidden = !match;
    if (match) {
      const track = panel.querySelector('.subject-track');
      if (track) resetTrack(track);
      subjectNav.style.display = track ? '' : 'none';
      panel.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      const n = panel.querySelectorAll('article').length;
      if (subjectCount) subjectCount.textContent = n ? `${n} asignaturas` : 'Por concretar';
    }
  });
}

/* ============================================================
   CARRUSEL DE ASIGNATURAS (sobre el panel visible)
============================================================ */
const subjectNav = document.getElementById('subjectNav');
const carouselStatus = document.getElementById('carouselStatus');
const DURATION = 500;
let busy = false;

// Orden original de cada carrusel, para volver al inicio al cambiar de filtro
const trackOrder = new Map();
document.querySelectorAll('.subject-track').forEach(t => trackOrder.set(t, [...t.children]));

const activeTrack = () => {
  const panel = subjectPanels.find(p => !p.hidden);
  return panel ? panel.querySelector('.subject-track') : null;
};
const slideWidth = (track) => track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 0;
const announce = (track) => {
  const name = track.firstElementChild && track.firstElementChild.querySelector('article');
  carouselStatus.textContent = name ? `Mostrando desde ${name.getAttribute('aria-label')}` : '';
};

function resetTrack(track) {
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  trackOrder.get(track).forEach(li => track.appendChild(li));
}

function afterSlide(track, cb) {
  if (reduceMotion) { cb(); return; }
  let done = false;
  const finish = () => { if (!done) { done = true; cb(); } };
  track.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, DURATION + 80);
}

function next() {
  const track = activeTrack();
  if (busy || !track || track.children.length < 2) return;
  busy = true;
  track.style.transition = reduceMotion ? 'none' : `transform ${DURATION}ms cubic-bezier(.22,1,.36,1)`;
  track.style.transform = `translateX(-${slideWidth(track)}px)`;
  afterSlide(track, () => {
    track.style.transition = 'none';
    track.appendChild(track.firstElementChild);
    track.style.transform = 'translateX(0)';
    busy = false; announce(track);
  });
}

function prev() {
  const track = activeTrack();
  if (busy || !track || track.children.length < 2) return;
  busy = true;
  track.style.transition = 'none';
  track.prepend(track.lastElementChild);
  track.style.transform = `translateX(-${slideWidth(track)}px)`;
  void track.offsetWidth;
  track.style.transition = reduceMotion ? 'none' : `transform ${DURATION}ms cubic-bezier(.22,1,.36,1)`;
  track.style.transform = 'translateX(0)';
  afterSlide(track, () => { busy = false; announce(track); });
}

document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);

document.querySelectorAll('.subject-track').forEach((track) => {
  let touchX = null;
  track.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX = null;
  });
});

document.querySelectorAll('[data-filter]').forEach((list) => {
  const key  = list.dataset.filter;
  const tabs = [...list.querySelectorAll('.filter-tab')];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tab.focus();
    subjectFilter[key] = tab.dataset.value;
    // Al cambiar de curso se vuelve al 1º cuatrimestre
    if (key === 'curso') {
      const first = document.querySelector('[data-filter="cuatri"] .filter-tab');
      if (first) first.click();
      return;
    }
    showSubjects();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t, false));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next, true);
    });
  });
});
showSubjects();

/* ============================================================
   BOTONES DE CORREO
============================================================ */
document.querySelectorAll('[data-mail]').forEach((a) => {
  setMail(a, a.dataset.mailSubject || 'Clases particulares - Consulta', mailBody());
});

/* ============================================================
   "PEDIR INFORMACIÓN" EN LAS TARJETAS DE ASIGNATURA
   Lee el nombre de la tarjeta y el curso/cuatrimestre de su panel.
============================================================ */
function subjectMailLink(name, curso, cuatri) {
  const nivel   = `${curso}º Curso, ${cuatri}º Cuatrimestre`;
  const subject = `Información sobre ${name} - ${nivel}`;
  const body =
    `Hola ${CONFIG.profesor},\n\n` +
    `me gustaría pedirte más información sobre las clases particulares de ${name} ` +
    `correspondientes al ${curso}º Curso (${cuatri}º Cuatrimestre). Me gustaría saber...\n\n` +
    `_____\n\nUn saludo.`;
  return mailLink(subject, body);
}

document.getElementById('asignaturas').addEventListener('click', (e) => {
  const btn = e.target.closest('.subject-info');
  if (!btn) return;
  e.preventDefault();
  const card  = btn.closest('article');
  const panel = btn.closest('.subject-panel');
  const name  = card.querySelector('h4').textContent.trim();
  const curso  = panel ? panel.dataset.curso  : subjectFilter.curso;
  const cuatri = panel ? panel.dataset.cuatri : subjectFilter.cuatri;
  window.location.href = subjectMailLink(name, curso, cuatri);
});
document.querySelectorAll('[data-mail-address]').forEach(el => el.textContent = CONFIG.email);

/* ============================================================
   ACORDEÓN FAQ
============================================================ */
document.querySelectorAll('.faq-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const body = item.querySelector('.faq-body');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-body').style.maxHeight = '0';
      openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================================================
   CÓDIGO QR
============================================================ */
const shareUrl = CONFIG.qrUrl || window.location.href.split('#')[0];
if(document.getElementById('qrUrl')) document.getElementById('qrUrl').textContent = shareUrl;
new QRCode(document.getElementById('qrcode'), {
  text: shareUrl, width: 512, height: 512,
  colorDark: '#171717', colorLight: '#FFFFFF', correctLevel: QRCode.CorrectLevel.H
});

/* QR ampliado en un modal a pantalla completa */
new QRCode(document.getElementById('qrcodeBig'), {
  text: shareUrl, width: 1024, height: 1024,
  colorDark: '#171717', colorLight: '#FFFFFF', correctLevel: QRCode.CorrectLevel.H
});

const qrModal = document.getElementById('qrModal');
const qrOpen  = document.getElementById('qrOpen');
const qrClose = document.getElementById('qrClose');

function openQrModal() {
  qrModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  qrClose.focus();
}
function closeQrModal() {
  qrModal.classList.add('hidden');
  document.body.style.overflow = '';
  qrOpen.focus();
}
qrOpen.addEventListener('click', openQrModal);
qrClose.addEventListener('click', closeQrModal);
// Clic en el fondo oscuro (fuera del QR grande)
qrModal.addEventListener('click', (e) => { if (e.target === qrModal) closeQrModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !qrModal.classList.contains('hidden')) closeQrModal();
});

document.getElementById('qrDownload').addEventListener('click', () => {
  const box = document.getElementById('qrcode');
  const canvas = box.querySelector('canvas');
  const src = canvas ? canvas.toDataURL('image/png') : box.querySelector('img').src;
  if (!src) return;
  const link = document.createElement('a');
  link.download = 'aula-metodo-qr.png';
  link.href = src;
  link.click();
});

const shareBtn = document.getElementById('shareBtn');
let copiedTimer = null;

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  if (!ok) throw new Error('copy failed');
}

shareBtn.addEventListener('click', async () => {
  const msg = document.getElementById('shareMsg');
  try {
    await copyText(window.location.href);
    shareBtn.classList.remove('is-copied');
    void shareBtn.offsetWidth;
    shareBtn.classList.add('is-copied');
    msg.textContent = 'Enlace copiado. Ya puedes pegarlo donde quieras.';
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      shareBtn.classList.remove('is-copied');
      msg.textContent = '';
    }, 2200);
  } catch (e) {
    msg.textContent = 'No se ha podido copiar. Copia la dirección desde la barra del navegador.';
  }
});

/* ============================================================
   EFFECT TILT 3D EN QR
============================================================ */
const qrCard = document.getElementById('qr-card');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  qrCard.addEventListener('mousemove', (e) => {
    const rect = qrCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    qrCard.style.transform = `perspective(500px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  qrCard.addEventListener('mouseleave', () => {
    qrCard.style.transform = 'perspective(500px) rotateY(0deg) rotateX(0deg)';
  });
}

/* ============================================================
   INTERSECTION OBSERVERS
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const labelObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('line-drawn'), 200);
      labelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.section-label').forEach(el => labelObserver.observe(el));

if (!reduceMotion) {
  document.querySelectorAll('.hero-item').forEach((el) => {
    setTimeout(() => el.classList.add('entered'), parseInt(el.style.animationDelay || '0') + 80);
  });
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.target || '';
      const num = parseFloat(raw.replace(/[^\d.]/g, ''));
      if (!isNaN(num) && !raw.includes('[')) {
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / 1200, 1);
          el.textContent = Math.floor(progress * num);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = num;
        };
        requestAnimationFrame(step);
      }
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter-val').forEach(el => counterObserver.observe(el));
} else {
  document.querySelectorAll('.hero-item').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}

if (window.lucide) lucide.createIcons();