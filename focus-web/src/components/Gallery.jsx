import { useMemo, useRef, useState } from 'react'
import { useSite } from '../hooks/useSite'
import Reveal from './Reveal'
import SmartImage from './SmartImage'
import Lightbox from './Lightbox'

// Lo que se ve de entrada: dos filas en escritorio, tres en móvil. Es una
// muestra, no el archivo entero; quien quiera más lo pide.
const INICIALES = 6

// Cuántas añade cada «ver más». Más que las iniciales a propósito: quien
// pulsa una vez ya dijo que quiere ver, y no va a repetirlo seis veces.
const POR_TANDA = 12

/**
 * Orden de la pestaña «Todo».
 *
 * En src/data/gallery.js las fotos van agrupadas por categoría —primero las
 * de uñas, luego peinados, luego maquillaje—, así que la primera tanda salía
 * entera de uñas y «Todo» no parecía todo.
 *
 * A cada foto se le calcula su posición relativa dentro de su categoría,
 * (i + 0.5) / total, y se ordena por ella. Cada categoría queda repartida de
 * punta a punta sin importar cuántas fotos tenga, y las primeras filas ya
 * mezclan las tres. Es determinista a propósito: barajar de verdad cambiaría
 * el orden en cada render y las fotos saltarían al pedir la siguiente tanda.
 */
const entrelazarPorCategoria = (fotos) => {
  const totales = {}
  for (const foto of fotos) totales[foto.cat] = (totales[foto.cat] ?? 0) + 1

  const vistas = {}
  return fotos
    .map((foto) => {
      const i = vistas[foto.cat] ?? 0
      vistas[foto.cat] = i + 1
      return { foto, posicion: (i + 0.5) / totales[foto.cat] }
    })
    .sort((a, b) => a.posicion - b.posicion)
    .map(({ foto }) => foto)
}

export default function Gallery() {
  const { brand, galleryFilters, gallery } = useSite()
  const [filtro, setFiltro] = useState('todo')
  const [abierta, setAbierta] = useState(null)
  const [tope, setTope] = useState(INICIALES)
  const reticula = useRef(null)

  const fotos = useMemo(
    () =>
      filtro === 'todo'
        ? entrelazarPorCategoria(gallery)
        : gallery.filter((f) => f.cat === filtro),
    [filtro, gallery],
  )

  // Solo se pintan las primeras; el resto llega por tandas. Con 38 fotos
  // y subiendo, volcarlas todas de golpe satura la vista y el navegador.
  const visibles = fotos.slice(0, tope)
  const faltan = fotos.length - visibles.length
  const desplegada = tope > INICIALES

  // Cambiar de filtro vuelve a empezar por la primera tanda
  const cambiarFiltro = (id) => {
    setFiltro(id)
    setTope(INICIALES)
  }

  // Al plegar, el botón queda donde terminaba la retícula larga y la vista
  // se va muy abajo; la devolvemos al principio de las fotos.
  const plegar = () => {
    setAbierta(null)
    setTope(INICIALES)
    reticula.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="galeria" className="section bg-papel-puro">
      <div className="container">
        <Reveal className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow mb-6 flex items-center gap-4">
              <span className="h-px w-10 origin-left animate-drawLine bg-tinta-tenue" />
              Galería
            </p>
            <h2 className="font-display text-4xl font-light leading-tight text-tinta-fuerte sm:text-5xl lg:text-6xl">
              Trabajos <span className="italic text-tinta">recientes</span>
            </h2>
            <p className="mt-5 text-sm font-light leading-relaxed text-tinta-suave">
              Uñas, peinados y maquillaje hechos en el estudio. Toca cualquiera para verla en grande.
            </p>
          </div>
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 text-xs uppercase tracking-widest text-tinta-suave transition-colors duration-300 hover:text-tinta-fuerte"
          >
            Ver más en Instagram
            <span className="transition-transform duration-500 ease-smooth group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>

        {/* Filtros */}
        <Reveal delay={80} className="mb-10">
          <div
            role="tablist"
            aria-label="Filtrar galería"
            className="flex flex-wrap gap-2 border-b border-borde pb-6"
          >
            {galleryFilters.map((f) => {
              const activo = f.id === filtro
              const cuenta =
                f.id === 'todo'
                  ? gallery.length
                  : gallery.filter((g) => g.cat === f.id).length
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={activo}
                  onClick={() => cambiarFiltro(f.id)}
                  className={[
                    'group relative overflow-hidden border px-5 py-2.5 text-xs uppercase tracking-widest transition-all duration-500 ease-smooth',
                    activo
                      ? 'border-tinta-tenue bg-onyx text-papel'
                      : 'border-borde text-tinta-suave hover:border-plata hover:text-tinta-fuerte',
                  ].join(' ')}
                >
                  {/* Barrido de luz al pasar el cursor */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-papel/25 to-transparent transition-none group-hover:animate-shine"
                  />
                  {f.label}
                  <span className="ml-2 text-[0.6rem] opacity-60">{cuenta}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Retícula tipo mosaico */}
        <div
          key={filtro}
          ref={reticula}
          className="columns-2 scroll-mt-28 gap-3 md:gap-5 lg:columns-3"
        >
          {visibles.map((foto, i) => (
            <button
              key={foto.src}
              type="button"
              onClick={() => setAbierta(i)}
              aria-label={`Ampliar: ${foto.alt}`}
              // La animación se reinicia al cambiar de filtro porque la key
              // del contenedor cambia con él.
              style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
              className="group mb-3 block w-full animate-riseIn overflow-hidden border border-borde md:mb-4"
            >
              <div className="relative">
                <SmartImage
                  src={foto.src}
                  alt={foto.alt}
                  lqip={foto.lqip}
                  ratio={foto.ratio}
                  sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                  imgClassName="[@media(hover:hover)]:group-hover:scale-[1.06]"
                />

                {/* Velo + leyenda, aparecen al pasar el cursor */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/75 via-onyx/10 to-transparent opacity-0 transition-opacity duration-500 ease-smooth [@media(hover:hover)]:group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-4 left-4 right-4 hidden translate-y-2 text-left text-[0.65rem] uppercase leading-relaxed tracking-widest text-papel opacity-0 transition-all duration-500 ease-smooth [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                  {foto.alt}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-4 hidden h-8 w-8 scale-75 items-center justify-center border border-papel/60 text-sm text-papel opacity-0 backdrop-blur-sm transition-all duration-500 ease-smooth [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100"
                >
                  +
                </span>
              </div>
            </button>
          ))}
        </div>

        {(faltan > 0 || desplegada) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {faltan > 0 && (
              <button
                type="button"
                onClick={() => setTope((t) => t + POR_TANDA)}
                className="btn-linea px-9 py-3.5"
              >
                Ver {Math.min(faltan, POR_TANDA)} fotos más
                <span className="ml-1 text-tinta-tenue">
                  ({visibles.length} de {fotos.length})
                </span>
              </button>
            )}
            {desplegada && (
              <button
                type="button"
                onClick={plegar}
                className="text-xs uppercase tracking-widest text-tinta-tenue underline-offset-4 transition-colors duration-300 hover:text-tinta-fuerte hover:underline"
              >
                Ver menos
              </button>
            )}
          </div>
        )}
      </div>

      {abierta !== null && (
        // El visor recorre solo lo que está en pantalla: si mostrara fotos
        // que no están en la retícula, al cerrarlo no se sabría dónde quedó.
        <Lightbox
          photos={visibles}
          index={abierta}
          onClose={() => setAbierta(null)}
          onNavigate={setAbierta}
        />
      )}
    </section>
  )
}
