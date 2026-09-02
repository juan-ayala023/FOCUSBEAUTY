// ─────────────────────────────────────────────────────────────
//  FOCUS · Configuración única del sitio
//  Todo el contenido editable vive aquí. Cambiar un dato aquí
//  lo actualiza en toda la página.
//  ⚠️ Reemplaza los valores marcados con TODO por los reales.
// ─────────────────────────────────────────────────────────────

export const brand = {
  name: 'Focus',
  wordmark: 'focus',
  tagline: 'estudio de belleza',
  // Logo del navbar. Recortado y llevado a tonos oscuros (onyx→acero) para que
  // lea sobre la crema; el original está en fotos-originales/focus-logo-original.png
  logo: '/images/focus-logo.png',
  // Línea manuscrita bajo el logo, como el letrero del estudio.
  firma: 'Beauty Studio',
  slogan: 'Un lugar que crea empoderamiento',
  city: 'La Unión',
  region: 'Antioquia',
  // TODO: dirección exacta del estudio
  address: 'La Unión, Antioquia · Colombia',
  // Lo que se le pide a Google Maps. Ahora apunta al municipio porque
  // no tenemos la dirección exacta; en cuanto la haya, se pone aquí
  // (p. ej. 'Calle 10 #11-25, La Unión, Antioquia, Colombia') y el mapa
  // y el enlace «Cómo llegar» quedan actualizados los dos.
  // TODO: reemplazar por la dirección exacta del estudio
  mapa: 'La Unión, Antioquia, Colombia',
  // Nivel de zoom: 14 abarca el pueblo; con dirección exacta, sube a 17.
  mapaZoom: 14,
  // Formato internacional, sin + ni espacios: 57 (Colombia) + 3147396048
  whatsapp: '573147396048',
  instagramHandle: '@focus_beautystudio', // TODO: handle real
  instagramUrl: 'https://instagram.com/focus_beautystudio', // TODO
  // Sin los parámetros ?_r=&_t= que añade el botón «compartir» de la app:
  // son de rastreo y caducan. Si se deja vacío, el botón flotante de TikTok
  // no aparece — mejor eso que un enlace a ninguna parte.
  tiktokUrl: 'https://www.tiktok.com/@laurac_arias',
  // TODO: correo real
  email: 'hola@focusbeauty.co',
  hours: [
    { days: 'Lunes a viernes', time: '9:00 — 19:00' },
    { days: 'Sábados', time: '9:00 — 17:00' },
    { days: 'Domingos y festivos', time: 'Cita previa' },
  ],
}

/** Mensaje precargado del botón de WhatsApp. */
export const whatsappLink = (servicio) => {
  const base = `https://wa.me/${brand.whatsapp}`
  const texto = servicio
    ? `¡Hola Focus! Quiero agendar una cita de ${servicio}.`
    : '¡Hola Focus! Quiero agendar una cita.'
  return `${base}?text=${encodeURIComponent(texto)}`
}

export const nav = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Estudio', href: '#estudio' },
  { label: 'Contacto', href: '#contacto' },
]

export const hero = {
  eyebrow: `${brand.city}, ${brand.region}`,
  title: ['La belleza empieza', 'por dentro'],
  body: 'Somos un estudio de belleza especializado en uñas. Resaltamos el encanto de cada un@ a través del arte de dar color, refinamiento y autoconfianza.',
  primaryCta: 'Agendar cita',
  secondaryCta: 'Ver servicios',
}

/** Cinta que se desplaza bajo el hero. */
export const marqueeItems = [
  'Uñas',
  'Acrygel',
  'Semipermanente',
  'Maquillaje',
  'Peinados',
  'Pestañas',
  'Cejas',
  'Micropigmentación',
]

// ─── Servicios ────────────────────────────────────────────────
// Tomados del documento de marca. Las uñas van primero: es la
// especialidad del estudio.
export const services = [
  {
    id: 'unas',
    number: '01',
    title: 'Uñas',
    lead: 'Nuestra especialidad.',
    description:
      'Estructura, forma y color trabajados con precisión. Diseños a medida que aguantan el día a día sin perder el acabado.',
    items: ['Acrygel', 'Dipping', 'Semipermanente', 'Nail art y decoración'],
    image: '/images/galeria/frances-pedreria.jpg',
    featured: true,
  },
  {
    id: 'peinados',
    number: '02',
    title: 'Peinados',
    lead: 'El que se lleva las fotos del día.',
    description:
      'Recogidos, semirecogidos, trenzas y ondas. Armados para que aguanten la fiesta entera y pensados según la ocasión y el tipo de cabello.',
    items: ['Quinceañera', 'Novia', 'Primeras comuniones', 'Sociales'],
    image: '/images/galeria/peinado-tiara-rizos.jpg',
    featured: true,
    reverse: true,
  },
  {
    id: 'maquillaje',
    number: '03',
    title: 'Maquillaje',
    lead: 'Para el día que no se repite.',
    description:
      'Desde un social sencillo hasta un editorial completo. Técnica impecable y acabado de larga duración.',
    items: [
      'Social',
      'Quinceañeras',
      'Novia',
      'Grados',
      'Confirmación',
      'Editorial',
      'Artístico',
    ],
    image: '/images/galeria/social-ahumado-calido.jpg', // trabajo real del estudio
  },
  {
    id: 'pestanas-cejas',
    number: '04',
    title: 'Pestañas & Cejas',
    lead: 'La mirada, en foco.',
    description:
      'Diseño de cejas según la forma del rostro y extensiones aplicadas pelo a pelo.',
    items: [
      'Pestañas punto a punto',
      'Depilación (hilo, cera, cuchilla)',
      'Sombreado semipermanente',
      'Micropigmentación',
    ],
    image: '/images/lashes.jpg', // TODO: foto real de pestañas
  },
]

// ─── Galería ──────────────────────────────────────────────────
// Las fotos viven en src/data/gallery.js (archivo generado).
// Aquí solo se define cómo se agrupan en el filtro.
export const galleryFilters = [
  { id: 'todo', label: 'Todo' },
  { id: 'unas', label: 'Uñas' },
  { id: 'peinados', label: 'Peinados' },
  { id: 'maquillaje', label: 'Maquillaje' },
]

// ─── Misión / Visión / Quiénes somos ──────────────────────────
// Texto adaptado del documento de marca.
export const manifesto = {
  eyebrow: 'Quiénes somos',
  title: 'Un lugar que crea empoderamiento',
  intro:
    'Somos un estudio de belleza que procura resaltar el encanto de cada un@ a través del arte de dar color, refinamiento y autoconfianza, mediante pinceladas llenas de pasión y amor por lo que hacemos.',
  pillars: [
    {
      label: 'Misión',
      text: 'Nuestro enfoque es resaltar la belleza empezando por la que llevamos dentro, que es nuestro gran poder. Cuando resaltamos la belleza interior, la exterior fluye con elocuencia y nos transformamos en nuestra versión óptima, complementada por el arte que te damos con nuestras manos.',
    },
    {
      label: 'Visión',
      text: 'Seguir brindando nuestros servicios buscando siempre mejorarlos, adaptándonos al cambio y a lo que cada persona busca, aportando muchas razones por las que siempre quieran volver y recomendarnos.',
    },
  ],
}

export const stats = [
  { value: '100%', label: 'Productos premium' },
  { value: '+1k', label: 'Clientas felices' },
  { value: '5.0', label: 'Calificación' },
  { value: '4', label: 'Líneas de servicio' },
]

export const testimonials = [
  // Transcripciones reales de mensajes de clientas. Las capturas completas
  // están en src/data/testimonios.js (generado). No inventar entradas aquí:
  // si no hay mensaje real detrás, no va.
  {
    quote:
      'Todo el mundo me admiró y di sus créditos como la responsable de la obra de arte. Hasta el profesor de artes preguntó qué técnica, que cómo hizo para ponerme esas facciones.',
    author: 'Mensaje de una clienta',
    service: 'Maquillaje',
  },
  {
    quote:
      'La gente me lo halagó demasiado; en serio que me duró hasta el último segundo, antes casi no logro desmaquillarme de lo duradero que quedó.',
    author: 'Mensaje de una clienta',
    service: 'Maquillaje',
  },
  {
    quote:
      'Tu trabajo merece que lo conozca mucha gente y nunca dudaré de eso. Eres mi manicurista de confianza.',
    author: 'Mensaje de una clienta',
    service: 'Uñas',
  },
]

export const contact = {
  eyebrow: 'Reservas',
  title: 'Tu próxima cita empieza aquí',
  body: 'Trabajamos con cita previa para dedicarle a cada persona el tiempo que merece. Escríbenos por WhatsApp y coordinamos tu espacio.',
  note: 'Cupos limitados por semana · Se requiere cita previa',
}
