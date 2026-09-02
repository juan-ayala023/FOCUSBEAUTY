import { useEffect, useRef, useState } from 'react'
import { useSite } from '../hooks/useSite'
import SmartImage from './SmartImage'
import Reveal from './Reveal'

/**
 * Franja de maquillaje social.
 *
 * Es el único bloque oscuro de la página, y a propósito: las fotos están
 * tomadas sobre fondo negro en el estudio, así que aquí se funden con la
 * sección en vez de recortarse contra la crema. De paso recupera el
 * «plata sobre noche» del manual como el momento negro del sitio.
 *
 * Las fotos salen de la galería filtrando por categoría, así que añadir
 * una más al script las trae aquí solas.
 *
 * La tira avanza sola, una foto cada 3,5 s, y se arrastra con el dedo o
 * el ratón cuando a alguien le apetece adelantarse. El avance es un
 * scrollTo sobre la misma tira de scroll-snap que ya había, no un
 * carrusel aparte: así el arrastre manual y el automático son el mismo
 * gesto y nunca se pelean por la posición.
 */

/** Cada cuánto salta a la siguiente foto. */
const AVANCE_MS = 3500

/** Tras soltar el dedo, cuánto espera antes de retomar el avance solo. */
const ESPERA_TRAS_TOCAR_MS = 5000

export default function MaquillajeSocial() {
  const { gallery, whatsappLink } = useSite()
  const fotos = gallery.filter((f) => f.cat === 'maquillaje')

  const tira = useRef(null)
  const reanudar = useRef(null)
  const [enPausa, setEnPausa] = useState(false)
  const [aLaVista, setALaVista] = useState(false)

  // Solo avanza mientras la franja está en pantalla. Si no, al volver a
  // ella el visitante se la encontraría ya recorrida hasta el final.
  useEffect(() => {
    const el = tira.current
    if (!el) return
    const observador = new IntersectionObserver(
      ([entrada]) => setALaVista(entrada.isIntersecting),
      { threshold: 0.25 },
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    const el = tira.current
    if (!el || enPausa || !aLaVista) return
    // Quien pidió menos animación no quiere que la página se mueva sola.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      const foto = el.firstElementChild
      if (!foto) return
      // El paso se mide del DOM, no de las clases: el ancho cambia en cada
      // punto de ruptura (64% en móvil, 18.4% en pantallas grandes).
      const separacion = parseFloat(getComputedStyle(el).columnGap) || 0
      const paso = foto.getBoundingClientRect().width + separacion
      const tope = el.scrollWidth - el.clientWidth
      // El margen de 4px absorbe los redondeos a subpíxel del navegador;
      // sin él, la última foto a veces no se reconoce como el final.
      const destino = el.scrollLeft >= tope - 4 ? 0 : el.scrollLeft + paso
      el.scrollTo({ left: destino, behavior: 'smooth' })
    }, AVANCE_MS)

    return () => clearInterval(id)
  }, [enPausa, aLaVista])

  // Limpia el temporizador pendiente si la sección se desmonta a medias.
  useEffect(() => () => clearTimeout(reanudar.current), [])

  const pausar = () => {
    clearTimeout(reanudar.current)
    setEnPausa(true)
  }

  const seguir = () => {
    clearTimeout(reanudar.current)
    setEnPausa(false)
  }

  // En táctil no hay «salir con el cursor»: se retoma tras una espera,
  // para no arrebatarle la tira a quien la está mirando.
  const seguirConCalma = () => {
    clearTimeout(reanudar.current)
    reanudar.current = setTimeout(() => setEnPausa(false), ESPERA_TRAS_TOCAR_MS)
  }

  if (!fotos.length) return null

  return (
    <section className="relative overflow-hidden bg-onyx py-20 md:py-24">
      {/* Halo frío, como el neón del estudio detrás de las modelos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-plata/30 to-transparent"
      />

      <div className="container">
        <Reveal className="max-w-2xl">
          <p className="text-[0.68rem] font-medium uppercase tracking-widest text-plata/60">
            Maquillaje · Social
          </p>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight text-papel sm:text-5xl">
            Lista para la <span className="italic text-plata">ocasión</span>
          </h2>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-plata/70">
            Cumpleaños, cenas, matrimonios, grados: cualquier plan que se salga
            de lo cotidiano. Piel luminosa que no se apaga en las fotos, mirada
            definida y un acabado que aguanta la noche entera.
          </p>
        </Reveal>
      </div>

      {/* La tira va dentro del contenedor para que su primera foto quede
          a plomo con el titular. El relleno propio no sirve: con
          snap-mandatory el navegador lo compensa y desplaza la tira solo. */}
      <Reveal delay={150} className="container">
        <ul
          ref={tira}
          onMouseEnter={pausar}
          onMouseLeave={seguir}
          onFocusCapture={pausar}
          onBlurCapture={seguir}
          onTouchStart={pausar}
          onTouchEnd={seguirConCalma}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {fotos.map((foto, i) => (
            <li
              key={foto.src}
              className="w-[64%] shrink-0 snap-start sm:w-[38%] lg:w-[23%] xl:w-[18.4%]"
            >
              <SmartImage
                src={foto.src}
                alt={foto.alt}
                lqip={foto.lqip}
                ratio={3 / 4}
                loading={i < 3 ? 'eager' : 'lazy'}
                sizes="(min-width:1280px) 240px, (min-width:1024px) 300px, (min-width:640px) 38vw, 64vw"
                className="border border-plata/15"
                imgClassName="transition-transform duration-700 ease-smooth hover:scale-[1.04]"
              />
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="container">
        <Reveal delay={250} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={whatsappLink('Maquillaje social')}
            target="_blank"
            rel="noreferrer"
            className="btn-base border border-plata/40 text-papel transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:border-plata hover:bg-papel hover:text-onyx"
          >
            Agendar mi cita
          </a>
          <a
            href="#galeria"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-plata/60 transition-colors duration-300 hover:text-papel"
          >
            Ver las {fotos.length} fotos
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-smooth group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
