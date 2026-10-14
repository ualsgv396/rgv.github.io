import { SITE } from '@/data/site';

/* ============================================================
   CORREO
   - Ordenador: Gmail web con destinatario, asunto y cuerpo rellenos.
   - Móvil: mailto (abre la app de correo).
   Se usa tanto en el servidor (href de respaldo) como en el navegador.
============================================================ */

const enc = encodeURIComponent;

/** Cuerpo estándar: el alumno solo rellena los huecos. */
export function standardBody(): string {
  return (
    `Hola ${SITE.teacherFirstName},\n\nte escribo porque necesito ayuda con mis clases.\n\n` +
    `Estudio: _____\nAsignatura: _____\nMi examen es el: _____\n` +
    `Prefiero clases (online / presencial): _____\n\nUn saludo.`
  );
}

export function subjectSubject(name: string, curso: number, cuatri: number): string {
  return `Información sobre ${name} - ${curso}º Curso, ${cuatri}º Cuatrimestre`;
}

export function subjectBody(name: string, curso: number, cuatri: number): string {
  return (
    `Hola ${SITE.teacherFirstName},\n\n` +
    `me gustaría pedirte más información sobre las clases particulares de ${name} ` +
    `correspondientes al ${curso}º Curso (${cuatri}º Cuatrimestre). Me gustaría saber...\n\n_____\n\nUn saludo.`
  );
}

export function mailtoHref(subject: string, body = standardBody()): string {
  return `mailto:${SITE.email}?subject=${enc(subject)}&body=${enc(body)}`;
}

export function gmailHref(subject: string, body = standardBody()): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(SITE.email)}&su=${enc(subject)}&body=${enc(body)}`;
}

export function isMobile(): boolean {
  return typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Abre el correo con el método adecuado al dispositivo. */
export function openMail(subject: string, body = standardBody()): void {
  if (isMobile()) window.location.href = mailtoHref(subject, body);
  else window.open(gmailHref(subject, body), '_blank', 'noopener');
}

/**
 * En ordenador cambia los <a data-mail-subject> estáticos (que llevan un mailto
 * de respaldo) para que abran Gmail web en una pestaña nueva.
 */
export function upgradeMailLinks(root: ParentNode = document): void {
  if (isMobile()) return;
  root.querySelectorAll<HTMLAnchorElement>('a[data-mail-subject]').forEach((a) => {
    a.href = gmailHref(a.dataset.mailSubject ?? 'Clases particulares - Consulta');
    a.target = '_blank';
    a.rel = 'noopener';
  });
}
