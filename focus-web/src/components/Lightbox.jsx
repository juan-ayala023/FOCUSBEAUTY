import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Visor a pantalla completa para la galería.
 * Flechas y Escape en teclado, deslizar en móvil, y la miniatura
 * borrosa de fondo mientras carga la foto grande.
 *
 * Va por portal al <body> a propósito. Un `position: fixed` se mide contra
 * el ancestro transformado más cercano, y casi todo el sitio vive dentro de
 * un <Reveal>, que lleva un translate permanente: desde ahí el visor se
 * abría del tamaño de la tarjeta y con la foto cortada. Colgándolo del body
 * no hay ancestro que lo encierre, se abra desde donde se abra.
 */
export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const photo = photos[index]
  const closeRef = useRef(null)
  const touchX = useRef(null)

  const prev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate],
  )
  const next = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate],
  )

  // Teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  // Bloquea el scroll del fondo y devuelve el foco al cerrar
  useEffect(() => {
    const previo = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      if (previo instanceof HTMLElement) previo.focus()
    }
  }, [])

  if (!photo) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[60] flex animate-fadeIn flex-col bg-papel/96 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 60) (dx > 0 ? prev : next)()
        touchX.current = null
      }}
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-[0.65rem] uppercase tracking-widest text-tinta-tenue">
          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex h-10 w-10 items-center justify-center border border-borde text-tinta transition-colors duration-300 hover:border-tinta-tenue hover:text-tinta-fuerte"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ×
          </span>
        </button>
      </div>

      {/* Foto */}
      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center text-2xl text-tinta-tenue transition-all duration-300 hover:-translate-x-1 hover:text-tinta-fuerte md:left-8"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <figure key={photo.src} className="flex max-h-full animate-zoomIn flex-col items-center">
          <picture>
            <source srcSet={`${photo.src}.webp`} type="image/webp" />
            <img
              src={`${photo.src}.jpg`}
              alt={photo.alt}
              className="max-h-[74vh] w-auto max-w-full border border-borde object-contain shadow-suave"
            />
          </picture>
          <figcaption className="mt-5 max-w-md text-center text-xs font-light leading-relaxed text-tinta-suave">
            {photo.alt}
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={next}
          aria-label="Siguiente"
          className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center text-2xl text-tinta-tenue transition-all duration-300 hover:translate-x-1 hover:text-tinta-fuerte md:right-8"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>,
    document.body,
  )
}
