/* ============================================================
   CONFIGURACIÓN — edita aquí el email y el QR
============================================================ */
const CONFIG = {
  email:    'sergyojf04@gmail.com',
  profesor: 'Rafael',
  qrUrl:    '' 
};

/* ============================================================
   LISTA DE ASIGNATURAS
============================================================ */
const subjects = {
  uni: [
    { icon: 'sigma',        name: 'Cálculo I y II',          curso: '1º', topics: 'Límites, derivadas, integrales, series, varias variables y ecuaciones diferenciales.' },
    { icon: 'grid-3x3',     name: 'Álgebra lineal',          curso: '1º', topics: 'Matrices, sistemas, espacios vectoriales, aplicaciones lineales, diagonalización.' },
    { icon: 'atom',         name: 'Física I y II',           curso: '1º', topics: 'Cinemática, dinámica, energía, campos, electromagnetismo y circuitos.' },
    { icon: 'bar-chart-3',  name: 'Estadística',             curso: '1º', topics: 'Descriptiva, probabilidad, distribuciones, inferencia, contrastes y regresión.' },
    { icon: 'code-2',       name: 'Programación',            curso: '1º', topics: 'Python, C/C++ y Java: fundamentos, estructuras de datos, POO y prácticas.' },
    { icon: 'calculator',   name: 'Matemáticas para ADE',    curso: '1º', topics: 'Matemáticas empresariales, optimización y matemática financiera.' }
  ],
  bach: [
    { icon: 'target',         name: 'Matemáticas II · PAU',      curso: '2º', topics: 'Análisis, álgebra, geometría y probabilidad con exámenes PAU/EBAU de tu comunidad.' },
    { icon: 'trending-up',    name: 'Matemáticas CC. Sociales',   curso: '2º', topics: 'Matrices, programación lineal, funciones, probabilidad y estadística.' },
    { icon: 'orbit',          name: 'Física de Bachillerato',     curso: '2º', topics: 'Gravitación, campo eléctrico y magnético, ondas, óptica y física moderna.' },
    { icon: 'flask-conical',  name: 'Química de Bachillerato',    curso: '2º', topics: 'Estequiometría, equilibrio, ácido-base, redox y química orgánica.' },
    { icon: 'pencil-ruler',   name: 'Matemáticas 1º Bachillerato',curso: '1º', topics: 'Trigonometría, números complejos, funciones, límites y derivadas.' },
    { icon: 'backpack',       name: 'Matemáticas y Física ESO',   curso: '4º', topics: 'Refuerzo de 3º y 4º ESO, técnicas de estudio y recuperaciones.' }
  ]
};

/* ============================================================
   CORREO — Gmail en escritorio, mailto en móvil
============================================================ */
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const enc = encodeURIComponent;

function mailBody(intro, asignatura = '') {
  return `Hola ${CONFIG.profesor},\n\n${intro}\n\nCurso: \nAsignatura: ${asignatura}\nModalidad (online / presencial): \nDisponibilidad: \n\nUn saludo.`;
}
function mailLink(subject, body) {
  return isMobile
    ? `mailto:${CONFIG.email}?subject=${enc(subject)}&body=${enc(body)}`
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(CONFIG.email)}&su=${enc(subject)}&body=${enc(body)}`;
}
function setMail(a, subject, body) {
  a.href = mailLink(subject, body);
  if (!isMobile) { a.target = '_blank'; a.rel = 'noopener'; }
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
   CARRUSEL DE ASIGNATURAS
============================================================ */
const track  = document.getElementById('track');
const status = document.getElementById('carouselStatus');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DURATION = 500;
let busy = false;

function renderSubjects(key) {
  const level = key === 'uni' ? 'Universidad' : 'Bachillerato · ESO';
  track.innerHTML = subjects[key].map((s) => `
    <article class="shrink-0 basis-full px-2 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
      aria-roledescription="diapositiva" aria-label="${s.name}">
      <div class="flex h-full flex-col bg-[#111] border border-white/5 text-paper">
        <div class="poster-card relative flex aspect-[4/3] flex-col overflow-hidden p-6">
          
          <img src="logoUal.png" class="pointer-events-none absolute -bottom-4 -right-4 h-32 w-32 opacity-20 invert mix-blend-screen" aria-hidden="true" alt="">          <span class="text-[10px] font-semibold uppercase tracking-[.25em] text-gold">Aula Método</span>
          <span class="mt-1.5 inline-flex w-fit border border-gold/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold/80">${level}</span>
          <span class="relative mt-auto font-display text-2xl font-bold leading-tight text-paper z-10">${s.name}</span>
          <span class="relative mt-2 text-xs leading-snug text-paper/50 z-10">${s.topics}</span>
        </div>
        <div class="mt-0 flex items-start gap-4 border-t border-white/8 p-5 relative z-10 bg-[#111]">
          <div class="w-12 shrink-0 text-center leading-none border-r border-white/10 pr-4">
            <span class="block text-[9px] font-semibold uppercase tracking-wider text-gold/60">Curso</span>
            <span class="mt-0.5 block font-display text-3xl font-bold text-gold">${s.curso}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold uppercase leading-snug tracking-wide text-paper">${s.name}</h3>
            <a data-subject="${s.name}" data-curso="${s.curso}" href="#"
              class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
              Pedir información <i data-lucide="arrow-right" class="h-3 w-3" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </article>`).join('');

  track.querySelectorAll('a[data-subject]').forEach((a) => {
    const name = a.dataset.subject;
    setMail(a, `Información: ${name} (${a.dataset.curso} curso)`, mailBody(`Me gustaría información sobre las clases de ${name}.`, name));
  });

  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  if (window.lucide) lucide.createIcons();
}

const slideWidth = () => track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 0;
const announce   = () => {
  if (track.firstElementChild)
    status.textContent = `Mostrando desde ${track.firstElementChild.getAttribute('aria-label')}`;
};

function afterSlide(cb) {
  if (reduceMotion) { cb(); return; }
  let done = false;
  const finish = () => { if (!done) { done = true; cb(); } };
  track.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, DURATION + 80);
}

function next() {
  if (busy || track.children.length < 2) return;
  busy = true;
  track.style.transition = reduceMotion ? 'none' : `transform ${DURATION}ms cubic-bezier(.22,1,.36,1)`;
  track.style.transform = `translateX(-${slideWidth()}px)`;
  afterSlide(() => {
    track.style.transition = 'none';
    track.appendChild(track.firstElementChild);
    track.style.transform = 'translateX(0)';
    busy = false; announce();
  });
}

function prev() {
  if (busy || track.children.length < 2) return;
  busy = true;
  track.style.transition = 'none';
  track.prepend(track.lastElementChild);
  track.style.transform = `translateX(-${slideWidth()}px)`;
  void track.offsetWidth;
  track.style.transition = reduceMotion ? 'none' : `transform ${DURATION}ms cubic-bezier(.22,1,.36,1)`;
  track.style.transform = 'translateX(0)';
  afterSlide(() => { busy = false; announce(); });
}

document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);

let touchX = null;
track.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  touchX = null;
});

const tabs = [...document.querySelectorAll('.tab-btn')];
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    t.classList.toggle('tab-active-style', on);
    t.classList.toggle('text-paper/50', !on);
  });
  renderSubjects(tab.dataset.level);
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
});
renderSubjects('uni');

/* ============================================================
   BOTONES DE CORREO
============================================================ */
document.querySelectorAll('[data-mail]').forEach((a) => {
  setMail(a, a.dataset.mailSubject || 'Información sobre clases', mailBody(a.dataset.mailIntro || 'Me gustaría recibir información.'));
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
  colorDark: '#0A0A0A', colorLight: '#FFFFFF', correctLevel: QRCode.CorrectLevel.H
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

document.getElementById('shareBtn').addEventListener('click', async () => {
  const msg = document.getElementById('shareMsg');
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Aula Método', text: 'Clases de refuerzo', url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      msg.textContent = 'Enlace copiado.';
      setTimeout(() => msg.textContent = '', 3000);
    }
  } catch (e) {}
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