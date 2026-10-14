import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import type { Cuatri, Curso, Subject } from '@/data/site';
import { openMail, subjectBody, subjectSubject } from '@/lib/mail';

/* ============================================================
   EXPLORADOR DE ASIGNATURAS
   Filtro curso → cuatrimestre, carrusel con flechas y deslizamiento,
   y tarjetas que se expanden a pantalla completa.
============================================================ */

interface Props {
  subjects: Subject[];
  cursos?: Curso[];
}

const LOGO = '/img/logoUal.png';
// Sello de la UAL como marca de agua: invertido a blanco y fundido con el fondo oscuro
const logoClass = 'pointer-events-none absolute select-none invert mix-blend-screen';

export default function SubjectExplorer({ subjects, cursos = [1, 2] }: Props) {
  const [curso, setCurso] = useState<Curso>(2);
  const [cuatri, setCuatri] = useState<Cuatri>(1);
  const [open, setOpen] = useState<Subject | null>(null);

  const visible = useMemo(
    () => subjects.filter((s) => s.curso === curso && s.cuatri === cuatri),
    [subjects, curso, cuatri],
  );

  const askFor = (s: Subject) => openMail(subjectSubject(s.name, s.curso, s.cuatri), subjectBody(s.name, s.curso, s.cuatri));

  return (
    <LayoutGroup>
      {/* Filtros */}
      <div className="surface-raised overflow-hidden">
        <FilterRow
          label="Curso"
          options={cursos.map((c) => ({ value: c, text: `${c}º Curso` }))}
          value={curso}
          onChange={(c) => {
            setCurso(c as Curso);
            setCuatri(1);
          }}
        />
        <FilterRow
          label="Cuatrimestre"
          options={[
            { value: 1, text: '1º Cuatrimestre' },
            { value: 2, text: '2º Cuatrimestre' },
          ]}
          value={cuatri}
          onChange={(c) => setCuatri(c as Cuatri)}
          trailing={visible.length ? `${visible.length} asignaturas` : 'Por concretar'}
          className="border-t border-graphite-edge bg-true-black"
        />
      </div>

      {visible.length ? (
        <Carousel key={`${curso}-${cuatri}`}>
          {visible.map((s) => (
            <SubjectCard key={s.code} subject={s} onOpen={() => setOpen(s)} onAsk={() => askFor(s)} />
          ))}
          <MoreCard />
        </Carousel>
      ) : (
        <EmptyState curso={curso} cuatri={cuatri} />
      )}

      <AnimatePresence>
        {open && <SubjectModal subject={open} onClose={() => setOpen(null)} onAsk={() => askFor(open)} />}
      </AnimatePresence>
    </LayoutGroup>
  );
}

/* ---------- Fila de filtro (pestañas compactas) ---------- */
function FilterRow({
  label,
  options,
  value,
  onChange,
  trailing,
  className = '',
}: {
  label: string;
  options: { value: number; text: string }[];
  value: number;
  onChange: (v: number) => void;
  trailing?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-2 py-2 sm:px-4 ${className}`}>
      <span className="hidden w-28 shrink-0 text-caption text-ash uppercase sm:block">{label}</span>
      <div role="tablist" aria-label={label} className="flex flex-1 gap-1 overflow-x-auto no-scrollbar">
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(o.value)}
              className={`relative min-h-9 rounded-button px-3 text-nav-control font-medium whitespace-nowrap transition-[color,transform] active:scale-95 ${
                selected ? 'text-cloud-white' : 'text-fog hover:text-cloud-white'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId={`filter-${label}`}
                  className="absolute inset-0 rounded-button border border-accent-line bg-graphite-edge shadow-[0_0_16px_-6px_var(--accent)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{o.text}</span>
            </button>
          );
        })}
      </div>
      {trailing && <span className="hidden shrink-0 text-caption text-ash uppercase sm:inline">{trailing}</span>}
    </div>
  );
}

/* ---------- Carrusel con scroll-snap y flechas ---------- */
function Carousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: 'smooth' });
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-caption text-ash uppercase">Desliza o usa las flechas</p>
        <div className="flex gap-2">
          <button type="button" className="btn-icon" aria-label="Asignatura anterior" onClick={() => step(-1)} disabled={atStart}>
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <button type="button" className="btn-icon" aria-label="Asignatura siguiente" onClick={() => step(1)} disabled={atEnd}>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <motion.div
        ref={track}
        onScroll={update}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Asignaturas"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2"
      >
        {children}
      </motion.div>
    </div>
  );
}

const slideClass = 'w-[85%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc((100%-32px)/3)]';

/* ---------- Tarjeta de asignatura ---------- */
function SubjectCard({ subject: s, onOpen, onAsk }: { subject: Subject; onOpen: () => void; onAsk: () => void }) {
  return (
    <motion.article
      layoutId={`subject-${s.code}`}
      onClick={onOpen}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`${slideClass} card card-interactive flex cursor-pointer flex-col overflow-hidden shadow-card`}
    >
      <div className="relative flex min-h-48 flex-1 flex-col overflow-hidden border-b border-graphite-edge bg-true-black p-4">
        <img src={LOGO} alt="" aria-hidden="true" className={`${logoClass} -right-6 -bottom-6 size-40 opacity-20`} />
        <span className="w-fit rounded-badge border border-graphite-edge px-2 py-0.5 text-caption text-fog">
          {s.cuatri}º cuatrimestre · {s.kind}
        </span>
        <motion.h3 layoutId={`subject-title-${s.code}`} className="relative mt-auto pt-6 text-feature-heading font-semibold">
          {s.name}
        </motion.h3>
        <p className="relative mt-2 line-clamp-2 text-nav-control text-fog">{s.topics}</p>
      </div>
      <div className="flex items-start gap-4 bg-charcoal-surface p-4">
        <div className="w-12 shrink-0 border-r border-graphite-edge pr-4 text-center leading-none">
          <span className="block text-[10px] font-bold text-ash uppercase">Curso</span>
          <span className="mt-1 block text-[28px] font-medium tracking-[-1px]">{s.curso}º</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-caption text-ash">
            {s.code} · {s.ects} ECTS
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              className="link-accent text-nav-control"
              onClick={(e) => {
                e.stopPropagation();
                onAsk();
              }}
            >
              Pedir información <ArrowRight size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`Ver detalles de ${s.name}`}
              className="grid size-8 place-items-center rounded-full border border-graphite-edge text-fog transition-[color,border-color,transform] hover:scale-110 hover:border-accent-line hover:text-accent active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              <Maximize2 size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MoreCard() {
  return (
    <div className={`${slideClass} relative flex min-h-48 flex-col justify-center overflow-hidden rounded-card border border-dashed border-graphite-edge p-4`}>
      <img src={LOGO} alt="" aria-hidden="true" className={`${logoClass} -right-6 -bottom-6 size-40 opacity-20`} />
      <p className="text-subheading font-medium">Y más asignaturas por concretar...</p>
      <p className="mt-1 text-nav-control text-fog">
        ¿Buscas otra?{' '}
        <button type="button" className="link-accent text-nav-control" onClick={() => openMail('Consulta sobre otra asignatura')}>
          Pregúntame <ArrowRight size={14} aria-hidden="true" />
        </button>
      </p>
    </div>
  );
}

function EmptyState({ curso, cuatri }: { curso: Curso; cuatri: Cuatri }) {
  return (
    <motion.div
      key={`${curso}-${cuatri}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-8 overflow-hidden rounded-card border border-dashed border-graphite-edge p-6 sm:p-8"
    >
      <img src={LOGO} alt="" aria-hidden="true" className={`${logoClass} -right-8 -bottom-8 size-48 opacity-20`} />
      <p className="text-caption text-ash uppercase">
        {curso}º curso · {cuatri}º cuatrimestre
      </p>
      <p className="mt-2 text-feature-heading font-semibold">Asignaturas por concretar...</p>
      <p className="mt-2 max-w-md text-body text-fog">
        Estoy preparando la lista de {curso}º curso. Si necesitas ayuda con alguna, escríbeme y lo vemos.
      </p>
      <button
        type="button"
        className="btn-charcoal mt-6"
        onClick={() => openMail(`Información sobre una asignatura - ${curso}º Curso, ${cuatri}º Cuatrimestre`)}
      >
        Preguntar por una asignatura
      </button>
    </motion.div>
  );
}

/* ---------- Tarjeta expandida ---------- */
function SubjectModal({ subject: s, onClose, onAsk }: { subject: Subject; onClose: () => void; onAsk: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={s.name}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-true-black/80 backdrop-blur-sm"
      />
      <motion.div
        layoutId={`subject-${s.code}`}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-card border border-graphite-edge bg-charcoal-surface shadow-card"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="btn-icon absolute top-4 right-4 z-10"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="relative overflow-hidden border-b border-graphite-edge bg-true-black p-6 shadow-frame">
          <img src={LOGO} alt="" aria-hidden="true" className={`${logoClass} -right-8 -bottom-8 size-48 opacity-20`} />
          <span className="rounded-badge border border-graphite-edge px-2 py-0.5 text-caption text-fog">
            {s.curso}º curso · {s.cuatri}º cuatrimestre
          </span>
          <motion.h3 layoutId={`subject-title-${s.code}`} className="relative mt-12 pr-12 text-[30px] leading-[1.11] font-medium sm:text-section-heading">
            {s.name}
          </motion.h3>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6"
        >
          <dl className="grid grid-cols-3 gap-2">
            {[
              ['Código', s.code],
              ['Créditos', `${s.ects} ECTS`],
              ['Carácter', s.kind],
            ].map(([k, v]) => (
              <div key={k} className="rounded-button border border-graphite-edge bg-obsidian-canvas p-2">
                <dt className="text-caption text-ash">{k}</dt>
                <dd className="mt-1 text-nav-control font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <h4 className="mt-6 text-nav-control font-medium text-fog">Temario</h4>
          <p className="mt-2 text-body text-cloud-white">{s.topics}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <button type="button" className="btn-pale" onClick={onAsk}>
              Pedir información
            </button>
            <button type="button" className="btn-ghost" onClick={onClose}>
              Volver
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
