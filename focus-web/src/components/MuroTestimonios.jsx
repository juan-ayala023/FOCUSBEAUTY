import { useRef, useState } from 'react'
import { testimonios } from '../data/testimonios'
import SmartImage from './SmartImage'
import Reveal from './Reveal'

/**
 * Muro de capturas de mensajes de clientas.
 *
 * Son las conversaciones reales, sin retocar: es lo que las hace creíbles.
 * Van a dos columnas como mucho porque a tres el texto de las capturas
 * queda demasiado pequeño para leerlo.
 *
 * El `alt` de cada una es la transcripción del mensaje. Sin eso, veinte
 * capturas serían veinte huecos vacíos para un lector de pantalla y para
 * Google: el texto de una imagen no lo lee ninguno de los dos.
 *
 * Arranca cerrado, detrás de un botón: veinte capturas alargan la página
 * muchísimo para quien solo pasaba por aquí. Quien quiera leerlas las abre.
 */
export default function MuroTestimonios() {
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)

  if (!testimonios.length) return null

  // Al cerrar, el botón queda donde estaba el final del muro y la vista
  // se va muy abajo; lo devolvemos al encabezado de la sección.
  function alternar() {
    const cerrando = abierto
    setAbierto(!abierto)
    if (cerrando) {
      contenedor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div ref={contenedor} className="mt-16 scroll-mt-28">
      <Reveal className="mb-8 flex items-baseline gap-4">
        <span className="text-[0.68rem] font-medium uppercase tracking-widest text-tinta-tenue">
          Mensajes de clientas
        </span>
        <span className="h-px flex-1 bg-borde" />
      </Reveal>

      <div className="text-center">
        <button
          type="button"
          onClick={alternar}
          aria-expanded={abierto}
          aria-controls="muro-testimonios"
          className="btn-linea px-8 py-3"
        >
          {abierto
            ? 'Ocultar opiniones'
            : `Ver opiniones de clientas (${testimonios.length})`}
        </button>
      </div>

      {/* Columnas CSS: cada captura tiene un alto distinto y así encajan
          solas, sin dejar huecos ni tener que calcular nada. */}
      <div
        id="muro-testimonios"
        hidden={!abierto}
        className="mt-8 columns-1 gap-5 sm:columns-2 [column-fill:balance]"
      >
        {abierto &&
          testimonios.map((t, i) => (
            <figure
              key={t.src}
              className="mb-5 break-inside-avoid overflow-hidden border border-borde bg-papel-puro p-2 shadow-suave"
            >
              <SmartImage
                src={t.src}
                alt={t.texto}
                lqip={t.lqip}
                ratio={t.ratio}
                loading={i < 4 ? 'eager' : 'lazy'}
                sizes="(min-width:640px) 45vw, 90vw"
              />
            </figure>
          ))}
      </div>
    </div>
  )
}
