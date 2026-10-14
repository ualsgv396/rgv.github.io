import { useEffect, useState, type ComponentType } from 'react';
import { motion, type Transition } from 'motion/react';
import { BookOpen, House, MessageSquare, Send, Wallet, type LucideProps } from 'lucide-react';
import { openMail } from '@/lib/mail';

/* ============================================================
   DOCK DE NAVEGACIÓN
   Barra flotante inferior. Marca la sección visible y da un pequeño
   rebote al pulsar. El último botón abre el correo.
============================================================ */

interface DockItem {
  id: string;
  label: string;
  Icon: ComponentType<LucideProps>;
}

const ITEMS: DockItem[] = [
  { id: 'inicio', label: 'Inicio', Icon: House },
  { id: 'asignaturas', label: 'Asignaturas', Icon: BookOpen },
  { id: 'tarifas', label: 'Precios', Icon: Wallet },
  { id: 'contacto', label: 'Contacto', Icon: MessageSquare },
];

const dockSpring: Transition = { type: 'spring', stiffness: 300, damping: 22, mass: 0.7 };
const itemSpring: Transition = { type: 'spring', stiffness: 550, damping: 15, mass: 1.1 };

export default function Dock() {
  const [active, setActive] = useState<string>('inicio');
  const [bouncing, setBouncing] = useState<string | null>(null);

  // Sección visible → elemento activo
  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const bounce = (id: string) => {
    setBouncing(id);
    window.setTimeout(() => setBouncing(null), 200);
  };

  return (
    <nav aria-label="Accesos rápidos" className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <motion.ul
        layout
        transition={dockSpring}
        className="flex items-end gap-2 rounded-full border border-graphite-edge bg-charcoal-surface/90 p-2 shadow-nav backdrop-blur"
      >
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <motion.li
              key={id}
              className="group relative"
              style={{ transformOrigin: 'bottom' }}
              whileHover={{ y: -4 }}
              animate={{ scale: bouncing === id ? 1.25 : 1, y: bouncing === id ? -6 : 0 }}
              transition={itemSpring}
            >
              <a
                href={`#${id}`}
                aria-label={label}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => {
                  setActive(id);
                  bounce(id);
                }}
                className={`grid size-10 place-items-center rounded-full transition-colors ${
                  isActive ? 'bg-graphite-edge text-cloud-white' : 'text-fog hover:text-cloud-white'
                }`}
              >
                <Icon size={18} aria-hidden="true" />
              </a>
              <Tooltip label={label} />
              <span
                aria-hidden="true"
                className={`absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-cloud-white transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </motion.li>
          );
        })}

        <li aria-hidden="true" className="mx-1 h-10 w-px self-center bg-graphite-edge" />

        <motion.li
          className="group relative"
          style={{ transformOrigin: 'bottom' }}
          whileHover={{ y: -4 }}
          animate={{ scale: bouncing === 'mail' ? 1.25 : 1, y: bouncing === 'mail' ? -6 : 0 }}
          transition={itemSpring}
        >
          <button
            type="button"
            aria-label="Escríbeme por Gmail"
            onClick={() => {
              bounce('mail');
              openMail('Clases particulares - Consulta');
            }}
            className="grid size-10 place-items-center rounded-full bg-paper-white text-charcoal-surface shadow-pale transition-colors hover:bg-cloud-white"
          >
            <Send size={18} aria-hidden="true" />
          </button>
          <Tooltip label="Escríbeme" />
        </motion.li>
      </motion.ul>
    </nav>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span
      role="presentation"
      className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-tab border border-graphite-edge bg-true-black px-2 py-1 text-caption whitespace-nowrap text-fog opacity-0 transition-opacity group-hover:opacity-100"
    >
      {label}
    </span>
  );
}
