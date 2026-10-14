import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, type Transition } from 'motion/react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Download, Link as LinkIcon, Maximize2, QrCode, X } from 'lucide-react';

/* ============================================================
   QR PARA COMPARTIR
   Botón que se despliega en un QR con «Copiar enlace», «Descargar»
   y «Ampliar» (pantalla completa).
============================================================ */

interface ShowQrProps {
  /** URL a codificar. Por defecto, la página actual. */
  value?: string;
  buttonLabel?: string;
}

const openSpring: Transition = { type: 'spring', bounce: 0.25, visualDuration: 0.35 };
const closeSpring: Transition = { type: 'spring', bounce: 0.15, visualDuration: 0.35 };

export default function ShowQr({ value, buttonLabel = 'Mostrar código QR' }: ShowQrProps) {
  const [url, setUrl] = useState(value ?? '');
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const canvasWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) setUrl(window.location.origin + window.location.pathname);
  }, [value]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt('Copia este enlace:', url);
    }
  };

  const download = () => {
    const canvas = canvasWrap.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'aula-metodo-qr.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="flex w-full justify-center">
      {/* Canvas oculto en alta resolución para la descarga */}
      <div ref={canvasWrap} className="hidden" aria-hidden="true">
        {url && <QRCodeCanvas value={url} size={1024} level="H" marginSize={2} />}
      </div>

      <MotionConfig transition={expanded ? openSpring : closeSpring}>
        <motion.div
          initial={false}
          animate={{ width: expanded ? 288 : 220, borderRadius: expanded ? 10 : 24 }}
          className="overflow-hidden border border-graphite-edge bg-charcoal-surface shadow-card"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!expanded ? (
              <motion.button
                key="collapsed"
                type="button"
                onClick={() => setExpanded(true)}
                className="flex h-12 w-full items-center justify-center gap-2 text-nav-control font-medium text-cloud-white"
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
              >
                <QrCode size={18} aria-hidden="true" />
                {buttonLabel}
              </motion.button>
            ) : (
              <motion.div
                key="expanded"
                className="flex flex-col items-center gap-2 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                <motion.button
                  type="button"
                  aria-label="Ampliar el código QR"
                  onClick={() => setFullscreen(true)}
                  className="group relative rounded-card bg-cloud-white p-3"
                  initial={{ opacity: 0, y: 40, scale: 1.15 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {url && <QRCodeSVG value={url} size={224} level="H" fgColor="#0a0a0a" bgColor="#fafafa" />}
                  <span className="absolute right-2 bottom-2 grid size-7 place-items-center rounded-full bg-obsidian-canvas text-cloud-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 size={14} aria-hidden="true" />
                  </span>
                </motion.button>

                <div className="mt-2 flex w-full items-center gap-2">
                  <motion.button
                    layout
                    type="button"
                    onClick={copy}
                    aria-live="polite"
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-paper-white text-nav-control font-medium text-charcoal-surface shadow-pale"
                  >
                    <LinkIcon size={16} aria-hidden="true" />
                    <AnimatedText from="Copiar" to="Copiado" active={copied} />
                    <span>enlace</span>
                  </motion.button>
                  <button
                    type="button"
                    aria-label="Descargar QR"
                    onClick={download}
                    className="btn-icon shadow-none"
                  >
                    <Download size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Cerrar"
                    onClick={() => {
                      setExpanded(false);
                      setCopied(false);
                    }}
                    className="btn-icon shadow-none"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </MotionConfig>

      <AnimatePresence>
        {fullscreen && url && <FullscreenQr url={url} onClose={() => setFullscreen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function FullscreenQr({ url, onClose }: { url: string; onClose: () => void }) {
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
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Código QR ampliado"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-true-black/90 p-6 backdrop-blur-sm"
    >
      <button ref={closeRef} type="button" aria-label="Cerrar" onClick={onClose} className="btn-icon absolute top-6 right-6 size-12">
        <X size={22} aria-hidden="true" />
      </button>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="rounded-card bg-cloud-white p-6"
      >
        <QRCodeSVG value={url} level="H" fgColor="#0a0a0a" bgColor="#fafafa" className="size-[min(80vw,70vh)]" />
      </motion.div>
      <p className="mt-4 text-caption text-fog uppercase">Escanea para abrir la web</p>
    </motion.div>
  );
}

function AnimatedText({ from, to, active }: { from: string; to: string; active: boolean }) {
  const text = active ? to : from;
  return (
    <span className="flex">
      <AnimatePresence mode="popLayout" initial={false}>
        {text.split('').map((char, i) => (
          <motion.span
            key={char + i}
            layout
            initial={{ opacity: 0, y: 5, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.03 * i } }}
            exit={{ opacity: 0, y: -5, scale: 0.7 }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
