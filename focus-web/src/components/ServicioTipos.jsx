import { useState } from 'react'
import { maquillajes } from '../data/maquillajes'
import SmartImage from './SmartImage'
import Lightbox from './Lightbox'

/**
 * Etiquetas de tipos de trabajo dentro de una tarjeta de servicio.
 *
 * Las que tienen fotos propias en src/data/maquillajes.js (generado) se
 * vuelven un botón: al pulsarlas se despliegan sus trabajos ahí mismo, sin
 * salir de la tarjeta ni mandar a nadie a la galería general. Las demás se
 * quedan como texto, porque anunciar un botón que no abre nada es peor que
 * no tenerlo.
 *
 * Solo se abre una a la vez: dos rejillas de fotos abiertas convierten la
 * tarjeta en una columna de scroll y se pierde el resto de la sección.
 */

/** 'Quinceañeras' -> 'quinceaneras', para casar la etiqueta con su clave. */
function clave(etiqueta) {
  return etiqueta
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

export default function ServicioTipos({ items, id }) {
  const [abierto, setAbierto] = useState(null)
  const [enVisor, setEnVisor] = useState(null)

  const fotos = abierto ? maquillajes[abierto] : null

  return (
    <>
      <ul className="mt-7 flex flex-wrap gap-2">
        {items.map((item) => {
          const k = clave(item)
          const tiene = Boolean(maquillajes[k]?.length)
          const activo = abierto === k

          if (!tiene) {
            return (
              <li
                key={item}
                className="border border-borde px-3.5 py-1.5 text-[0.7rem] uppercase tracking-wider text-tinta-suave transition-colors duration-300 group-hover:border-plata/40 group-hover:text-tinta"
              >
                {item}
              </li>
            )
          }

          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => setAbierto(activo ? null : k)}
                aria-expanded={activo}
                aria-controls={`${id}-${k}`}
                className={[
                  'flex items-center gap-2 border px-3.5 py-1.5 text-[0.7rem] uppercase tracking-wider transition-all duration-300',
                  activo
                    ? 'border-tinta-fuerte bg-tinta-fuerte text-papel'
                    : 'border-tinta-tenue/60 text-tinta hover:border-tinta-fuerte hover:text-tinta-fuerte',
                ].join(' ')}
              >
                {item}
                <span
                  aria-hidden="true"
                  className={[
                    'text-[0.85em] leading-none transition-transform duration-300',
                    activo ? 'rotate-45' : '',
                  ].join(' ')}
                >
                  +
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {fotos && (
        <div id={`${id}-${abierto}`} className="mt-5 animate-fadeIn">
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {fotos.map((foto, i) => (
              <li key={foto.src}>
                <button
                  type="button"
                  onClick={() => setEnVisor(i)}
                  className="block w-full border border-borde transition-colors duration-300 hover:border-tinta-tenue"
                  aria-label={`Ampliar: ${foto.alt}`}
                >
                  <SmartImage
                    src={foto.src}
                    alt={foto.alt}
                    lqip={foto.lqip}
                    ratio={3 / 4}
                    sizes="(min-width:768px) 110px, 30vw"
                    imgClassName="transition-transform duration-700 ease-smooth hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fotos && enVisor !== null && (
        <Lightbox
          photos={fotos}
          index={enVisor}
          onClose={() => setEnVisor(null)}
          onNavigate={setEnVisor}
        />
      )}
    </>
  )
}
