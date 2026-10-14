/* ============================================================
   LOGOTIPO DE GMAIL
   variant="color" → colores corporativos de Google
   variant="mono"  → una sola tinta (currentColor), para el tema oscuro
   Funciona en .astro sin hidratar (HTML estático) y dentro de las islas.
============================================================ */

export type GmailVariant = 'color' | 'mono';

interface Props {
  size?: number;
  variant?: GmailVariant;
  className?: string;
  title?: string;
}

const PATHS = {
  blue: 'M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6',
  green: 'M120 108h14c3.32 0 6-2.69 6-6V59l-20 15',
  yellow: 'M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2',
  red: 'M72 74V48l24 18 24-18v26L96 92',
  darkRed: 'M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2',
};

const COLORS = { blue: '#4285F4', green: '#34A853', yellow: '#FBBC04', red: '#EA4335', darkRed: '#C5221F' };

export default function GmailIcon({ size = 20, variant = 'color', className, title }: Props) {
  const mono = variant === 'mono';
  return (
    <svg
      viewBox="52 42 88 66"
      width={size}
      height={(size * 66) / 88}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {(Object.keys(PATHS) as (keyof typeof PATHS)[]).map((key) => (
        <path
          key={key}
          d={PATHS[key]}
          fill={mono ? 'currentColor' : COLORS[key]}
          // En la versión mono, la "M" central va un poco más tenue para mantener la lectura del logo
          fillOpacity={mono && (key === 'red' || key === 'darkRed') ? 0.7 : 1}
        />
      ))}
    </svg>
  );
}
