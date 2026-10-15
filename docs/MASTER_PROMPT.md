# Master prompt · Aula Método (landing de clases particulares)

> Copia todo lo que hay debajo de la línea y pégalo en cualquier asistente de IA o herramienta de desarrollo
> (Claude, Cursor, v0, ChatGPT…) para que entienda la web completa antes de pedirle cambios,
> o para reconstruirla desde cero con el mismo resultado.

---

## 0. Rol y objetivo

Actúa como desarrollador frontend sénior y diseñador UI/UX especializado en **Astro**, **React**, **Tailwind CSS v4** y **Motion (Framer Motion)**.

Vas a trabajar sobre **Aula Método**, la landing de una sola página de **Rafael Gómez Vico**, profesor particular de asignaturas de **2º curso de Ingeniería** (Universidad de Almería). La web tiene un objetivo de negocio claro: **que el alumno encuentre su asignatura, vea el precio y escriba un correo a Rafael con el mínimo esfuerzo**. Todo el diseño, el texto y las interacciones existen para llevar a ese clic de contacto.

Respeta siempre lo que se describe aquí: estructura, tokens de diseño, textos, comportamiento y accesibilidad. No inventes colores, radios ni secciones nuevas salvo que se pida.

---

## 1. Stack técnico y arquitectura

- **Framework:** Astro 7 con salida 100 % estática (`output: static`).
- **Interactividad:** islas de **React 19** con **Motion 14** (`motion/react`). Solo hidratan los componentes que lo necesitan.
- **Estilos:** **Tailwind CSS v4** mediante `@tailwindcss/vite`, con tokens declarados en `@theme` dentro de `src/styles/global.css`.
- **Iconos:** `lucide-react`. En los `.astro` se renderizan sin JavaScript (la clase se pasa con `className`, no `class`).
- **QR:** `qrcode.react` (`QRCodeSVG` para mostrar, `QRCodeCanvas` oculto a 1024 px para descargar).
- **Fuente:** Inter (Google Fonts), sustituto de matterFont, con `font-feature-settings: "clig" 0, "liga" 0`.
- **Despliegue:** Vercel. `vercel.json` (framework `astro`) ejecuta `npm run build` y publica `dist/`; cada push a `main` se publica en producción.
- **Requisitos locales:** Node ≥ 22.12. Comandos: `npm run dev` (http://localhost:4321), `npm run build`, `npm run preview`.

### Estructura de carpetas

```
public/
  img/logoUal.png              sello de la Universidad de Almería (negro sobre blanco)
src/
  data/site.ts                 TODO el contenido: email, textos, asignaturas, precios, navegación
  lib/mail.ts                  lógica de correo (Gmail web en ordenador, mailto en móvil)
  styles/global.css            selector de acento, tokens Graphite, clases de componentes
  layouts/Layout.astro         <head>, fuente, estilos globales y script que mejora los enlaces de correo
  components/                  componentes estáticos .astro (0 KB de JS)
    Header.astro               barra de navegación flotante
    Hero.astro                 portada
    SectionHeading.astro       cabecera reutilizable de sección (etiqueta + título + descripción)
    PriceCard.astro            tarjeta de tarifa horizontal
    Pricing.astro              sección de precios + tarjeta del QR
    Contact.astro              sección de contacto
    Footer.astro               pie
    MailLink.astro             enlace de correo con mailto de respaldo
    icons/GmailIcon.tsx        logotipo de Gmail (versión color y mono)
  islands/                     componentes interactivos React + Motion
    Dock.tsx                   navegación flotante inferior         → client:load
    SubjectExplorer.tsx        filtros, carrusel y tarjetas expandibles → client:visible
    ShowQr.tsx                 QR desplegable, copiar, descargar, ampliar → client:visible
  pages/index.astro            página principal (ensambla todo)
```

**Regla de hidratación:** el Dock usa `client:load` porque es navegación y debe funcionar desde el primer momento. El explorador de asignaturas y el QR usan `client:visible`, así que su JavaScript solo se descarga cuando el usuario llega a esa sección. Todo lo demás es HTML estático.

**Regla de contenido:** ningún texto de negocio va escrito a mano en los componentes; sale de `src/data/site.ts`. Para añadir una asignatura o cambiar un precio solo se edita ese archivo.

---

## 2. Sistema de diseño: «Graphite» refinado

Tema oscuro tipo herramienta de desarrollador (referencias: Linear, Vercel, Raycast): superficies casi negras, bordes finos de grafito, tipografía blanca precisa y un único color de acento usado con moderación.

### 2.1 Colores (tokens Tailwind)

| Token | Valor | Uso |
|---|---|---|
| `obsidian-canvas` | `#0a0a0a` | Fondo principal de página y tarjetas base |
| `true-black` | `#000000` | Cabecera tipo póster de las tarjetas de asignatura, fondos de modal |
| `charcoal-surface` | `#171717` | Superficies elevadas, cabecera, pie de tarjetas, Dock |
| `graphite-edge` | `#262626` | Bordes de 1 px, separadores, botón secundario |
| `steel-border` | `#464646` | Bordes destacados, hover del botón secundario |
| `cloud-white` | `#fafafa` | Texto principal, títulos, iconos |
| `paper-white` | `#e5e5e5` | Botón primario y tarjeta de correo (superficie pálida) |
| `fog` | `#a1a1a1` | Texto secundario, enlaces de navegación |
| `ash` | `#737373` | Etiquetas terciarias, metadatos |
| `accent` | `var(--accent)` | Color de acento intercambiable (ver 2.2) |
| `accent-soft` | acento al 14 % | Fondos tenues en hover |
| `accent-line` | acento al 45 % | Bordes y anillos de brillo |

**Nunca** se usan colores saturados como relleno de botones ni para texto de párrafo. El color solo aparece en el acento, en el degradado decorativo del hero y en el logo de Gmail.

### 2.2 Color de acento intercambiable

Al principio de `src/styles/global.css` hay un bloque `:root` con cinco opciones; solo una está activa:

```css
:root {
  --accent: #4d8dff;    /* 1. Azul eléctrico (activo) */
  /* --accent: #2fd39a; */ /* 2. Verde esmeralda */
  /* --accent: #b57bff; */ /* 3. Violeta neón */
  /* --accent: #22d3ee; */ /* 4. Cian */
  /* --accent: #ff8833; */ /* 5. Ámbar original (Signal Orange) */
}
```

Se expone a Tailwind con `@theme inline` (`--color-accent`, `--color-accent-soft`, `--color-accent-line`, estos dos últimos con `color-mix`). El acento colorea: enlaces «Pedir información →», el punto del hero, el punto e indicador del Dock, la pestaña activa del filtro, los checks de precios, el reloj del horario, el icono del QR, el brillo de botones y tarjetas en hover, el halo del hero y el contorno `:focus-visible`.

### 2.3 Tipografía

Familia única Inter. Escala (tokens `text-*`):

| Token | Tamaño / interlineado | Uso |
|---|---|---|
| `caption` | 12 / 1.33 | Etiquetas, metadatos, mayúsculas pequeñas |
| `nav-control` | 14 / 1.43 | Navegación, botones, listas |
| `body` | 16 / 1.5 | Texto de lectura |
| `body-large` | 18 / 1.25 | Entradillas |
| `subheading` | 20 / 1.4 | Títulos de tarjeta de tarifa, «Aula Método» bajo el nombre |
| `feature-heading` | 24 / 1.17, peso 600 | Títulos de tarjeta |
| `section-heading` | 36 / 1.11, peso 500 | Títulos de sección (30 px en móvil) |
| `display` | 60 / 1, peso 500, tracking −1.5 px | Solo el nombre del hero (44 px en móvil) |

Nunca se superan pesos de 600 en titulares ni se aflojan los interlineados del display.

### 2.4 Formas, espaciado y sombras

- **Radios:** tarjetas, marcos e imágenes 10 px (`rounded-card`); botones 8 px (`rounded-button`); etiquetas tipo píldora 20 px (`rounded-badge`); tooltips 4 px (`rounded-tab`); Dock, botones de icono y QR plegado en forma de píldora (`rounded-full`).
- **Espaciado:** base de 8 px usando la escala por defecto de Tailwind en valores pares (2 = 8 px, 4 = 16 px, 6 = 24 px, 8 = 32 px, 12 = 48 px, 16 = 64 px, 32 = 128 px). Contenedor máximo 1152 px con 16 px de margen lateral. Secciones con 64 px de padding vertical en móvil y 128 px en escritorio.
- **Sombras:** `shadow-nav` (0 4 4 negro 25 %), `shadow-card` (0 8 10 negro 30 %), `shadow-control` (botón secundario), `shadow-frame` (interior verde-grisáceo para marcos de producto), `shadow-pale` (reflejo blanco interior del botón pálido).

### 2.5 Superficies y matices (para no ser «todo negro»)

- `.card`: obsidiana con borde grafito.
- `.surface-raised`: degradado vertical de `#171717` a `#101010` con borde grafito. Se usa en tarjetas de tarifa, tarjeta del QR, tarjeta de horario y barra de filtros.
- `.section-tint`: degradado de carbón a obsidiana. Lo llevan las secciones **Asignaturas** y **Contacto**; Precios queda en obsidiana. Así se alternan los planos.
- `.hero-glow`: halo radial muy tenue del color de acento detrás de la foto, más un reflejo blanco al 4 % arriba a la izquierda.
- La tarjeta del QR tiene además una mancha difuminada del acento (10 % de opacidad) en su esquina superior derecha.
- Cabecera y Dock en carbón translúcido con `backdrop-blur`.

---

## 3. Página, sección a sección

Orden: Cabecera → Inicio → Asignaturas → Precios → Contacto → Pie, más el Dock flotante.

### 3.1 Cabecera (`Header.astro`)
- Barra **flotante y fija** (`sticky top-0`) con 16 px de margen, borde grafito, radio 10 px, fondo carbón translúcido, desenfoque y `shadow-nav`.
- Izquierda: cuadrado blanco de 32 px con icono de birrete + «Aula Método» / «Rafael Gómez Vico».
- Centro (solo escritorio, `md+`): enlaces «Asignaturas», «Precios», «Contacto» en gris niebla; en hover se vuelven blancos con fondo `accent-soft`.
- Derecha: botón pálido «Quiero empezar» (abre el correo).
- En móvil se ocultan los enlaces; la navegación la hace el Dock.

### 3.2 Inicio / Hero (`Hero.astro`, `id="inicio"`)
- Fondo con `.hero-glow`. Rejilla de 12 columnas: texto en 7, foto en 5.
- **Texto (alineado a la izquierda):**
  - Etiqueta píldora con un punto del acento que brilla: «Clases particulares».
  - `<h1>` con el nombre «Rafael Gómez Vico» en estilo display.
  - Subtítulo gris: «Aula Método».
  - Botones: pálido «Escríbeme por Gmail» (con logo de Gmail) y secundario «Ver asignaturas ↓» (ancla a `#asignaturas`).
- **Foto:** marco carbón con `shadow-frame`, imagen cuadrada en escala de grises que pasa a color en hover. Detrás, gráfico decorativo de **polígonos luminosos**: tres cuadrados redondeados girados (6°, −3°, 12°), dos con contorno blanco tenue y uno con borde en degradado «Solar Spectrum» (`#ffb931 → #ffffff → #2e73fc`) desenfocado.
- La foto es todavía un marcador de posición (`placehold.co`); la real irá en `public/img/`.

### 3.3 Asignaturas (`SubjectExplorer.tsx`, `id="asignaturas"`)
- Cabecera de sección: etiqueta «Asignaturas por curso», título «¿Qué asignatura estás buscando?», descripción «Elige tu curso y cuatrimestre. Si tu asignatura no aparece, pregúntame igualmente.»
- **Barra de filtros** (`.surface-raised`) con dos filas:
  - Fila 1 «Curso»: pestañas «1º Curso» / «2º Curso».
  - Fila 2 (fondo negro) «Cuatrimestre»: «1º Cuatrimestre» / «2º Cuatrimestre» y, a la derecha, el contador («5 asignaturas» o «Por concretar»).
  - Por defecto: 2º Curso, 1º Cuatrimestre. Al cambiar de curso vuelve al 1º cuatrimestre.
- **Carrusel** (cuando hay asignaturas): texto «Desliza o usa las flechas» + flechas anterior/siguiente (botones circulares, se desactivan en los extremos). Pista con `scroll-snap` horizontal y deslizamiento táctil nativo. Se ven 1 tarjeta en móvil (85 % de ancho, asomando la siguiente), 2 en tablet y 3 en escritorio.
- **Tarjeta de asignatura:**
  - Parte superior tipo póster (negro): píldora «Nº cuatrimestre · Obligatoria/Básica», nombre grande (24 px, 600) y temario en dos líneas. Marca de agua: sello de la UAL abajo a la derecha, invertido a blanco, `mix-blend-screen`, 20 % de opacidad.
  - Pie carbón: bloque «CURSO 2º», código y ECTS («44102203 · 6 ECTS»), enlace de acento «Pedir información →» y botón circular de ampliar.
  - Toda la tarjeta es clicable y se **expande** a un modal.
- **Tarjeta final** «Y más asignaturas por concretar...» con borde discontinuo y enlace «Pregúntame →».
- **Estado vacío** (1º curso): tarjeta discontinua «Asignaturas por concretar...», texto «Estoy preparando la lista de Nº curso…» y botón «Preguntar por una asignatura».
- **Modal de asignatura** (tarjeta expandida): fondo negro al 80 % con desenfoque; tarjeta de máx. 672 px con cabecera negra (píldora curso/cuatrimestre, nombre a 36 px, sello de la UAL), rejilla de tres datos (Código, Créditos, Carácter), «Temario» y botones «Pedir información» (pálido) y «Volver» (transparente). Botón X arriba a la derecha.

**Asignaturas actuales (2º curso):**

| Cuatrimestre | Código | Asignatura | Carácter |
|---|---|---|---|
| 1º | 44102203 | Fundamentos de Materiales | Obligatoria |
| 1º | 44102104 | Métodos Numéricos y Optimización | Básica |
| 1º | 44102205 | Teoría de Circuitos y Máquinas Eléctricas | Obligatoria |
| 1º | 44102207 | Teoría de Mecanismos | Obligatoria |
| 1º | 44102202 | Termotecnia | Obligatoria |
| 2º | 44102208 | Automatización Industrial | Obligatoria |
| 2º | 44102206 | Electrónica Básica | Obligatoria |
| 2º | 44102201 | Ingeniería Fluidomecánica | Obligatoria |
| 2º | 44102204 | Resistencia de Materiales | Obligatoria |
| 2º | 43102223 | Señales y Sistemas | Obligatoria |

Todas de 6 ECTS. Cada una tiene un temario de una línea en `site.ts`. 1º curso aún no tiene asignaturas.

### 3.4 Precios (`Pricing.astro` + `PriceCard.astro` + `ShowQr.tsx`, `id="tarifas"`)
- Cabecera: etiqueta «Modalidades y precios», título «Lo que cuesta, sin letra pequeña.»
- Rejilla de 2 columnas en escritorio (`lg:grid-cols-2`):
  - **Izquierda:** dos tarjetas de tarifa apiladas, horizontales (detalle a la izquierda, precio y botón a la derecha separados por una línea vertical; en móvil se apilan).
    - **Clase suelta** — «Para una duda concreta o un examen que tienes encima.» — **12 € / hora** — ✓ Clase individual 1:1 · ✓ Online o presencial, a tratar — botón pálido «Reservar una clase».
    - **Grupo reducido** — «De 2 a 4 alumnos de la misma asignatura.» — **8-12 € / hora** — ✓ Sesiones en grupo · ✓ Precio por alumno, depende del número de participantes · ✓ Online o presencial, a tratar — botón secundario «Apuntarme a un grupo».
  - **Derecha:** tarjeta «Pásalo a tu clase» — «¿Os apuntáis varios? En grupo reducido sale a cuenta.» — «Enséñales el código QR o mándales el enlace.» — y la isla **ShowQr**.
- **ShowQr:**
  - Plegado: píldora «Mostrar código QR» con icono QR en color de acento.
  - Desplegado (se ensancha de 220 a 288 px y el radio pasa de píldora a 10 px): QR blanco de la URL actual (`fg #0a0a0a`, `bg #fafafa`, nivel H) que es un botón para **ampliar**, y debajo «Copiar enlace» (píldora pálida), «Descargar» (PNG 1024 px, `aula-metodo-qr.png`) y cerrar (X).
  - Ampliado: modal a pantalla completa, fondo negro al 90 %, QR de `min(80vw, 70vh)`, texto «Escanea para abrir la web» y X grande. Se cierra con X, clic en el fondo o Escape.

### 3.5 Contacto (`Contact.astro`, `id="contacto"`)
- Fondo `.section-tint`. Cabecera: «Contacto y horarios» / «Escríbeme y lo hablamos.» / «Cuéntame qué estudias y cuándo es el examen. Con eso ya podemos empezar.»
- Rejilla 5 + 7 columnas:
  - **Horario** (`.surface-raised`): reloj en acento + «Horario de clases» y «De lunes a viernes, mañanas y tardes».
  - **Tarjeta de correo** (superficie pálida, es la conversión principal): logo de Gmail grande, flecha ↗, «Escríbeme por Gmail» y `isqrafael@gmail.com`.

### 3.6 Pie (`Footer.astro`)
- Borde superior grafito, «Aula Método» a la izquierda y «Clases particulares · Rafael Gómez Vico» a la derecha. Padding inferior amplio para que el Dock no tape el texto.

### 3.7 Dock (`Dock.tsx`)
- Barra **flotante inferior centrada** (`fixed bottom-4`), píldora carbón translúcida con desenfoque, borde grafito y `shadow-nav`.
- Botones circulares de 40 px: Inicio (casa), Asignaturas (libro), Precios (cartera), Contacto (bocadillo). Separador vertical y botón pálido con el **logo de Gmail** que abre el correo.
- La **sección visible** se marca sola (IntersectionObserver con margen −45 % / −50 %): fondo grafito, anillo y brillo del acento, y un punto del acento debajo.
- Tooltip con el nombre al pasar el ratón.

---

## 4. Sistema de correo (`src/lib/mail.ts`)

- Destinatario único: **isqrafael@gmail.com** (`SITE.email`).
- **Ordenador:** abre **Gmail web** en una pestaña nueva (`https://mail.google.com/mail/?view=cm&fs=1&to=…&su=…&body=…`). No se usa `mailto:` en escritorio porque en Windows abre el selector de perfiles de Chrome.
- **Móvil** (Android/iPhone/iPad): `mailto:`, que abre la app de correo.
- Todo se codifica con `encodeURIComponent`.
- Los enlaces estáticos (`MailLink.astro`) llevan un `mailto:` completo como respaldo sin JavaScript; un script del Layout los convierte a Gmail web en ordenador.
- **Cuerpo estándar** (botones generales):
  ```
  Hola Rafael,

  te escribo porque necesito ayuda con mis clases.

  Estudio: _____
  Asignatura: _____
  Mi examen es el: _____
  Prefiero clases (online / presencial): _____

  Un saludo.
  ```
- **Asuntos por contexto:**
  - Inicio, cabecera, Dock y tarjeta de contacto → «Clases particulares - Consulta»
  - Clase suelta → «Reservar una clase suelta»
  - Grupo reducido → «Apuntarme a un grupo reducido»
  - «Pregúntame» → «Consulta sobre otra asignatura»
  - Estado vacío → «Información sobre una asignatura - Nº Curso, Nº Cuatrimestre»
- **«Pedir información» de una asignatura:** asunto «Información sobre [Asignatura] - [Nº] Curso, [Nº] Cuatrimestre» y cuerpo «Hola Rafael, me gustaría pedirte más información sobre las clases particulares de [Asignatura] correspondientes al [Nº] Curso ([Nº] Cuatrimestre). Me gustaría saber... _____ Un saludo.»
- **Logo de Gmail:** `GmailIcon` con dos variantes, `color` (colores corporativos `#4285F4`, `#34A853`, `#FBBC04`, `#EA4335`, `#C5221F`) y `mono` (`currentColor`). Se elige globalmente en `SITE.gmailIcon`.

---

## 5. Animaciones y micro-interacciones

Principio: sutiles, rápidas y con muelles suaves. Todo se desactiva con `prefers-reduced-motion: reduce`.

### 5.1 CSS (componentes estáticos)
- **Botones `.btn-pale` / `.btn-charcoal` / `.btn-ghost`:** hover → `translateY(-1px) scale(1.02)` + anillo y halo del acento; active → `scale(.97)` en 80 ms. Curva `cubic-bezier(.22,1,.36,1)`.
- **Botón pálido:** además, un **barrido de luz** diagonal que lo cruza en 600 ms al pasar el ratón.
- **Botón secundario:** fondo a `steel-border` y borde/halo del acento.
- **Botón transparente:** fondo `accent-soft` y borde del acento.
- **Botones de icono `.btn-icon`:** hover → `scale(1.08)`, icono y borde en acento con brillo; active → `scale(.92)`.
- **Enlaces de acento `.link-accent`:** subrayado que crece de izquierda a derecha y flecha que avanza 3 px.
- **Tarjetas `.card-interactive`:** en hover, borde `accent-line` y halo del acento (transiciones solo de borde y sombra para no interferir con Motion).
- **Tarjeta de correo:** sube 2 px, fondo a blanco, halo del acento; la flecha ↗ se desplaza en diagonal. Active → `scale(.99)`.
- **Foto del hero:** de escala de grises a color en 500 ms.
- **Navegación de la cabecera:** fondo `accent-soft` en hover.

### 5.2 Motion (islas)
- **Dock:** contenedor con `layout` y muelle (stiffness 300, damping 22). Cada icono sube 4 px en hover, se encoge a 0.9 al pulsar y da un **rebote** al hacer clic (escala 1.25, −6 px, muelle stiffness 550 / damping 15). El punto de sección activa aparece con fundido.
- **Filtros:** la pestaña activa es un fondo con `layoutId` que **se desliza** de una opción a otra (muelle 400/32).
- **Carrusel:** al cambiar de filtro, la pista entra con fundido y desplazamiento de 8 px. Las flechas hacen `scrollBy` suave de una tarjeta.
- **Tarjetas de asignatura:** hover → sube 4 px; tap → escala 0.98. Al abrirlas, **transición compartida** (`layoutId`) de la tarjeta y del título hacia el modal; el contenido del modal entra con fundido y 12 px de desplazamiento con 150 ms de retraso; el fondo hace fundido.
- **ShowQr:** `MotionConfig` con muelles (apertura bounce 0.25, cierre 0.15, 350 ms). El ancho y el radio se animan; el contenido plegado/desplegado alterna con `AnimatePresence mode="popLayout"` y desenfoque. El QR entra desde abajo (y 40, escala 1.15 → 1). Hover del QR: escala 1.03 y anillo del acento. «Copiar» → «Copiado»: animación **letra a letra** (cada carácter entra con muelle y 30 ms de retraso escalonado). El modal ampliado entra con fundido y escala 0.92 → 1.

---

## 6. Accesibilidad y comportamiento

- HTML semántico: `header`, `nav`, `main`, `section` con `id` para anclas (`scroll-mt-24` para no quedar bajo la cabecera), un único `h1`.
- Pestañas con `role="tablist"` / `role="tab"` y `aria-selected`. Carrusel con `role="region"` y `aria-roledescription="carrusel"`.
- Modales con `role="dialog"`, `aria-modal`, foco inicial en el botón de cerrar, cierre con Escape y bloqueo del scroll de fondo.
- Botones de icono con `aria-label`. Iconos decorativos con `aria-hidden`.
- Dock con `aria-current` en la sección activa.
- `:focus-visible` con contorno del color de acento.
- Áreas táctiles de al menos 40 px.
- `scroll-behavior: smooth`, desactivado con movimiento reducido.

---

## 7. Tono y textos

- Español de España, cercano, directo y sin frases hechas de IA.
- Prohibido: «revoluciona», «desata tu potencial», «descubre el poder», «solución integral» y similares.
- Frases cortas y concretas, orientadas al alumno («¿Qué asignatura estás buscando?», «Lo que cuesta, sin letra pequeña.», «Escríbeme y lo hablamos.»).
- El hero es mínimo a propósito: solo nombre, marca y botones.

---

## 8. Cómo pedir cambios (instrucciones para la IA)

1. Cambios de **contenido** (asignaturas, precios, textos, email, horario): edita solo `src/data/site.ts`.
2. Cambios de **color de acento**: comenta/descomenta la línea `--accent` en `src/styles/global.css`. No introduzcas colores nuevos en los componentes; usa los tokens.
3. Cambios **visuales**: reutiliza las clases `.btn-*`, `.card`, `.surface-raised`, `.card-interactive`, `.section-tint`, `.eyebrow`, `.link-accent` y los tokens de Tailwind. Mantén radios de 10 / 8 px y bordes de 1 px grafito.
4. Nueva **interactividad**: crea una isla en `src/islands/*.tsx` con Motion y elige `client:visible` salvo que deba funcionar al cargar.
5. Cualquier botón de **correo** debe pasar por `MailLink.astro` (estático) u `openMail()` de `src/lib/mail.ts` (islas), nunca un `mailto:` suelto.
6. Comprueba siempre con `npm run build` (debe terminar sin errores) y revisa móvil (390 px) y escritorio (1280 px).
