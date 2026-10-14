/* ============================================================
   CONTENIDO DE LA WEB — edita aquí textos, asignaturas y precios
============================================================ */

export const SITE = {
  title: 'Aula Método · Clases particulares de Ingeniería',
  description:
    'Clases particulares de 2º curso de Ingeniería: Métodos Numéricos, Teoría de Circuitos, Termotecnia, Resistencia de Materiales, Automatización Industrial, Señales y Sistemas y más. Trabajamos con exámenes reales.',
  brand: 'Aula Método',
  teacher: 'Rafael Gómez Vico',
  teacherFirstName: 'Rafael',
  email: 'isqrafael@gmail.com',
  schedule: 'De lunes a viernes, mañanas y tardes',
};

export type Curso = 1 | 2;
export type Cuatri = 1 | 2;

export interface Subject {
  code: string;
  name: string;
  kind: 'Obligatoria' | 'Básica';
  ects: number;
  curso: Curso;
  cuatri: Cuatri;
  topics: string;
}

export const SUBJECTS: Subject[] = [
  // 2º curso · 1º cuatrimestre
  { code: '44102203', name: 'Fundamentos de Materiales', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 1,
    topics: 'Estructura cristalina, propiedades mecánicas, diagramas de fases y tratamientos térmicos.' },
  { code: '44102104', name: 'Métodos Numéricos y Optimización', kind: 'Básica', ects: 6, curso: 2, cuatri: 1,
    topics: 'Ecuaciones no lineales, interpolación, integración numérica, sistemas lineales y optimización.' },
  { code: '44102205', name: 'Teoría de Circuitos y Máquinas Eléctricas', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 1,
    topics: 'Circuitos en continua y alterna, sistemas trifásicos, transformadores y motores.' },
  { code: '44102207', name: 'Teoría de Mecanismos', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 1,
    topics: 'Cinemática y dinámica de mecanismos, levas, engranajes y equilibrado.' },
  { code: '44102202', name: 'Termotecnia', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 1,
    topics: 'Termodinámica aplicada, ciclos de potencia y refrigeración, y transmisión de calor.' },
  // 2º curso · 2º cuatrimestre
  { code: '44102208', name: 'Automatización Industrial', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 2,
    topics: 'Sensores, actuadores, autómatas programables (PLC), GRAFCET y neumática.' },
  { code: '44102206', name: 'Electrónica Básica', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 2,
    topics: 'Diodos, transistores, amplificadores operacionales y electrónica digital.' },
  { code: '44102201', name: 'Ingeniería Fluidomecánica', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 2,
    topics: 'Estática de fluidos, ecuaciones de conservación, flujo en tuberías y turbomáquinas.' },
  { code: '44102204', name: 'Resistencia de Materiales', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 2,
    topics: 'Tensiones y deformaciones, tracción, flexión, torsión y pandeo.' },
  { code: '43102223', name: 'Señales y Sistemas', kind: 'Obligatoria', ects: 6, curso: 2, cuatri: 2,
    topics: 'Señales continuas y discretas, convolución, Fourier, Laplace y transformada Z.' },
];

export interface Plan {
  label: string;
  title: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  mailSubject: string;
  primary?: boolean;
}

export const PLANS: Plan[] = [
  {
    label: 'Clase suelta',
    title: 'Para una duda concreta o un examen que tienes encima.',
    price: '12 €',
    unit: '/ hora',
    features: ['Clase individual 1:1', 'Online o presencial, a tratar'],
    cta: 'Reservar una clase',
    mailSubject: 'Reservar una clase suelta',
    primary: true,
  },
  {
    label: 'Grupo reducido',
    title: 'De 2 a 4 alumnos de la misma asignatura.',
    price: '8-12 €',
    unit: '/ hora',
    features: ['Sesiones en grupo', 'Precio por alumno, depende del número de participantes', 'Online o presencial, a tratar'],
    cta: 'Apuntarme a un grupo',
    mailSubject: 'Apuntarme a un grupo reducido',
  },
];

export const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'asignaturas', label: 'Asignaturas' },
  { id: 'tarifas', label: 'Precios' },
  { id: 'contacto', label: 'Contacto' },
] as const;
