# Aula Método · rgv.github.io

Landing de clases particulares de Rafael Gómez Vico, hecha con **Astro**, **React** (islas) y **Tailwind CSS v4** siguiendo la guía de diseño **Graphite**.

## Comandos

```bash
npm install       # instala dependencias (Node 22.12 o superior)
npm run dev       # servidor de desarrollo en http://localhost:4321
npm run build     # genera la web estática en dist/
npm run preview   # sirve dist/ para revisarla antes de publicar
```

Se despliega en **Vercel** con `vercel.json`: ejecuta `npm run build` y publica `dist/`. Cada push a `main` genera un despliegue de producción.

## Estructura

```
public/
  img/logoUal.png          imágenes servidas tal cual (/img/...)
src/
  data/site.ts             CONTENIDO: textos, email, asignaturas y precios
  lib/mail.ts              enlaces de correo (Gmail web en ordenador, mailto en móvil)
  styles/global.css        tokens Graphite (@theme) y clases .btn-*, .card, .eyebrow
  layouts/Layout.astro     <head>, fuente, estilos globales y script de correo
  components/              componentes estáticos .astro (0 KB de JS)
    Header, Hero, SectionHeading, PriceCard, Pricing, Contact, Footer, MailLink
  islands/                 componentes interactivos React + Motion
    Dock.tsx               navegación flotante inferior        → client:load
    SubjectExplorer.tsx    filtros, carrusel y tarjetas expandibles → client:visible
    ShowQr.tsx             QR desplegable, copiar, descargar, ampliar → client:visible
  pages/index.astro        página principal
```

Para añadir una asignatura, edita `SUBJECTS` en `src/data/site.ts`; el filtro y el carrusel se actualizan solos.
