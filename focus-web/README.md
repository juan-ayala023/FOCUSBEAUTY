# Focus · Estudio de belleza

Landing page de **Focus**, estudio de belleza especializado en uñas en La Unión, Antioquia.
React 18 + Vite + Tailwind CSS. Sin dependencias de animación: todo es CSS y
`IntersectionObserver`.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/ para revisar el build
```

## Qué falta completar

El contenido de texto vive en **un solo archivo**: [`src/config/site.js`](src/config/site.js).
Los valores pendientes están marcados con `TODO`:

| Dato | Dónde | Ahora tiene |
|---|---|---|
| WhatsApp | `brand.whatsapp` | `573000000000` (placeholder) |
| Instagram | `brand.instagramHandle` / `instagramUrl` | `@focus_beautystudio` |
| Correo | `brand.email` | `hola@focusbeauty.co` |
| Dirección | `brand.address` | Solo ciudad y departamento |
| Horarios | `brand.hours` | Estimados |
| Testimonios | `testimonials` | Tres de ejemplo, inventados |
| Fotos de maquillaje, peinados y pestañas | `services[].image` | Provisionales |

El número de WhatsApp va en formato internacional **sin `+` ni espacios**
(ej. Colombia: `57` + número). Cada botón de servicio abre WhatsApp con el
mensaje ya escrito.

## Fotos

Las 24 fotos son reales y están agrupadas por servicio, que es como funciona el
filtro de la galería: **uñas** (13) y **peinados** (11).

```
FOCUS/fotos-originales/            originales a resolución completa (no se publican)
focus-web/public/images/galeria/   versiones web: .jpg + .webp, lado largo 1400px
focus-web/src/data/gallery.js      ARCHIVO GENERADO — no editarlo a mano
```

### Agregar o cambiar fotos

```bash
pip install Pillow                    # una sola vez
python scripts/procesar-fotos.py
```

1. Guarda la foto en `FOCUS/fotos-originales/` con un nombre descriptivo.
2. Agrega su línea a `MAPA` en [`scripts/procesar-fotos.py`](scripts/procesar-fotos.py),
   con la categoría y el texto alternativo.
3. Ejecuta el script: comprime, genera WebP y reescribe `src/data/gallery.js`.

El script también calcula un **LQIP** por foto (una miniatura de 16 px en base64)
que se muestra desenfocada mientras baja la imagen real. Por eso nunca se ve un
hueco negro al hacer scroll.

### Fotos por tipo de maquillaje

En la tarjeta de **Maquillaje**, las etiquetas que tienen fotos propias se vuelven
un botón: al pulsarlas se despliegan cinco trabajos ahí mismo. Hoy son **Social** y
**Grados**; las demás siguen siendo texto hasta que haya material suyo.

```
FOCUS/fotos-originales/maquillaje-social/   originales de social
focus-web/public/images/maquillaje/         versiones web: .jpg + .webp
focus-web/src/data/maquillajes.js           ARCHIVO GENERADO — no editarlo a mano
```

1. Guarda las fotos en `FOCUS/fotos-originales/` (una subcarpeta por tipo si son varias).
2. Añade sus líneas a `MAPA` en
   [`scripts/procesar-maquillajes.py`](scripts/procesar-maquillajes.py). La clave del
   tipo es la etiqueta de `site.js` en minúsculas y sin tildes (`Quinceañeras` →
   `quinceaneras`), así la etiqueta y sus fotos se encuentran solas.
3. Ejecuta `python scripts/procesar-maquillajes.py`.

Faltan fotos reales de **maquillaje** y de **pestañas y cejas**: esas dos tarjetas
de servicio siguen usando las del prototipo, marcadas con `TODO` en `site.js`.

## Animaciones

| Dónde | Qué hace |
|---|---|
| Hero | Fondo con parallax; el titular entra palabra por palabra |
| Composición del hero | Tres fotos reales flotando a distinto ritmo |
| Barra superior | Hilo plateado que marca el avance de la página |
| Menú | Subrayado lleno en la sección donde estás, se dibuja al pasar el cursor |
| Cinta de servicios | Se detiene al pasar el cursor para poder leerla |
| Tarjetas de servicio | Se elevan, la foto hace zoom y un reflejo las cruza |
| Galería | Filtro por servicio, entrada escalonada, blur-up al cargar |
| Visor de fotos | Se abre con zoom; flechas, Escape y deslizar en móvil |
| Cifras | Cuentan desde cero al entrar en pantalla |
| Botones | Barrido de luz plateada al pasar el cursor |

Dos cosas a tener en cuenta si tocas esto:

- Todo respeta `prefers-reduced-motion`. Si el sistema pide menos movimiento,
  las animaciones se desactivan y el contenido aparece directamente.
- Las capas que solo aparecen al pasar el cursor están dentro de
  `[@media(hover:hover)]`, porque en pantallas táctiles el `:hover` se queda
  pegado después de tocar y taparía la foto.

## Panel de administración (demostración)

En `/admin` hay un panel para editar el contenido del sitio desde el navegador,
al estilo de WordPress. **Es una demostración**: guarda todo en el
`localStorage` del navegador, no en un servidor.

Qué implica eso, en concreto:

- Lo que edites se ve en **ese** navegador y en **ese** equipo. Nadie más lo ve,
  y el sitio publicado no cambia.
- El inicio de sesión acepta cualquier usuario y contraseña. No hay
  autenticación real ni se envía nada a ningún lado.
- Por lo mismo, que `/admin` sea público no expone nada: nadie puede modificar
  lo que ven los demás.

Se llega desde `/admin` directamente o con el enlace «Administrar» del pie.

### Qué se puede editar

| Sección | Qué controla |
|---|---|
| Panel | Resumen, y qué contenido de ejemplo falta reemplazar |
| Marca y contacto | Nombre, slogan, WhatsApp, Instagram, correo, dirección, horarios, menú |
| Portada | Titular, párrafo, botones y la cinta de servicios |
| Servicios | Alta, baja, orden, textos, etiquetas, foto y destacado |
| Galería | Orden, categoría y descripción de cada foto; etiquetas del filtro |
| Estudio | Quiénes somos, misión, visión y las cifras |
| Testimonios | Alta, baja, orden y textos |
| Contacto | Textos del bloque de reservas |
| Ajustes | Respaldo a JSON, restaurar desde archivo y restablecer |

Hay una **vista previa** dentro del panel, con tamaños de escritorio, tablet y
móvil, que se actualiza sola al editar.

### Cómo funciona por dentro

`src/config/site.js` y `src/data/gallery.js` siguen siendo el contenido por
defecto. El almacén los carga, les aplica lo guardado y expone el resultado por
`useSite()`, que es lo que leen los componentes de la página. Sin ediciones
guardadas, el sitio muestra exactamente los valores de esos dos archivos.

### Para volverlo un CMS real

Todo el acoplamiento con el navegador está en un único archivo,
[`src/admin/store.js`](src/admin/store.js). Reemplazar sus funciones `leer()` y
`persistir()` por llamadas a una API es el único cambio que necesita el panel:
las pantallas quedan igual. Faltaría además un inicio de sesión de verdad y
subida de fotos desde el navegador.

## Identidad visual

Los HEX salen del **manual de marca Focus Beauty vol.01**. Están definidos en
[`tailwind.config.js`](tailwind.config.js).

El manual describe la paleta como «plata sobre noche» y pone Onyx como color
principal. **Aquí la jerarquía está invertida a propósito**: dominan la crema y
los grises, y el negro queda para detalles. El manual lo permite — tiene un
lockup oficial sobre fondo claro y Crema es color de paleta— pero conviene
saberlo antes de tocar nada.

- **Superficies** — `papel`: `puro` #FFFFFF · `DEFAULT` #F5F5F2 (Crema) ·
  `hueso` #EFEFEA · `humo` #E5E5DE. Son neutros **cálidos**.
- **Textos** — `tinta`: `fuerte` #0F1115 (Onyx) · `DEFAULT` #3A3D42 (Carbón) ·
  `suave` #5A5E64 · `tenue` #686C73
- **Líneas** — `plata` #C8CBD0 y `acero` #8A8E94 (los únicos grises fríos, y por
  contraste son los que hacen leer cálido al resto)
- **Detalles negros** — `onyx` #0F1115: botón principal, filtro activo de la
  galería, velo de las fotos y botón flotante de WhatsApp
- **Degradado grafito** — `bg-gradient-grafito`, en las cifras y en la barra de avance
- **Tipografías** — `Cormorant Garamond` (títulos) y `Jost` (texto), como fija el manual

> Los tonos de texto **no** son los del manual al pie de la letra: su Acero
> (#8A8E94) da 3.01:1 sobre la crema y no pasa AA en las etiquetas pequeñas.
> Sobre Onyx sí cumplía. Por eso `tinta-suave` y `tinta-tenue` se oscurecieron
> hasta 5.97:1 y 4.83:1, y el Acero quedó solo para trazos e iconos.

## Estructura

```
scripts/procesar-fotos.py   prepara las fotos y regenera src/data/gallery.js
scripts/procesar-maquillajes.py  fotos por tipo de maquillaje -> src/data/maquillajes.js
src/
  main.jsx                  decide entre el sitio y el panel según la ruta
  App.jsx                   orden de las secciones
  config/site.js            contenido de texto por defecto
  data/gallery.js           GENERADO: las fotos de la galería
  hooks/useSite.js          contenido vivo que leen los componentes
  hooks/useMotion.js        reducedMotion, inView, countUp, scrollProgress, activeSection
  admin/
    store.js                estado del contenido + localStorage
    AdminApp.jsx            armazón: barra lateral, cabecera, secciones
    Login.jsx               acceso (demostración)
    Preview.jsx             vista previa del sitio en el panel
    ui.jsx                  campos, botones, tarjetas, listas
    paginas/                una pantalla por sección
  components/
    ScrollProgress.jsx      barra de avance
    Navbar.jsx              menú fijo, sección activa, menú móvil
    Hero.jsx                portada con parallax
    HeroCollage.jsx         composición de fotos del hero (solo en pantallas grandes)
    Marquee.jsx             cinta de servicios
    Services.jsx            las 4 líneas de servicio
    Gallery.jsx             filtro + mosaico
    Lightbox.jsx            visor a pantalla completa
    SmartImage.jsx          WebP + JPG con blur-up
    Studio.jsx              quiénes somos, misión/visión, cifras
    Stat.jsx                cifra que cuenta desde cero
    Testimonials.jsx        reseñas
    Contact.jsx             reservas, canales, horarios
    Footer.jsx
    WhatsAppFab.jsx         botón flotante
    Reveal.jsx              aparición al hacer scroll
```

## Publicar

El build es estático (`dist/`), así que sirve cualquier hosting:

```bash
npm run build
# sube el contenido de dist/ a Netlify, Vercel, Cloudflare Pages o el hosting que uses
```

Antes de publicar, actualiza también en [`index.html`](index.html):
la URL de `<link rel="canonical">` y la dirección dentro del bloque JSON-LD.
