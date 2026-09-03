import { useSite } from '../hooks/useSite'
import Reveal from './Reveal'
import ServicioTipos from './ServicioTipos'

export default function Services() {
  const { services, whatsappLink } = useSite()

  return (
    <section id="servicios" className="section bg-gradient-claro">
      <div className="container">
        <Reveal className="mb-16 max-w-2xl md:mb-24">
          <p className="eyebrow mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-tinta-tenue" />
            Servicios
          </p>
          <h2 className="font-display text-4xl font-light leading-tight text-tinta-fuerte sm:text-5xl lg:text-6xl">
            Cada detalle, <span className="italic text-tinta">cuidado</span>
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-tinta-suave">
            Cuatro líneas de trabajo, un mismo criterio: técnica limpia, producto premium y un
            resultado que se sostiene en el tiempo.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.id}
              delay={i * 90}
              className={service.featured ? 'md:col-span-2' : ''}
            >
              <article
                className={[
                  'group relative h-full overflow-hidden border border-borde bg-papel-hueso/60 transition-all duration-700 ease-smooth hover:-translate-y-1 hover:border-plata/60 hover:shadow-suave',
                  service.featured ? 'md:grid md:grid-cols-2' : '',
                ].join(' ')}
              >
                {/* Barrido de luz al pasar el cursor */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-onyx/[0.06] to-transparent transition-transform duration-1000 ease-smooth group-hover:translate-x-[420%]"
                />

                {/* Imagen */}
                <div
                  className={[
                    'relative overflow-hidden',
                    service.featured ? 'h-64 md:h-full md:min-h-[22rem]' : 'h-56',
                    service.reverse ? 'md:order-2' : '',
                  ].join(' ')}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-papel/85 via-papel/20 to-transparent" />
                  <span className="absolute left-6 top-6 font-display text-sm tracking-widest text-tinta-fuerte/70 transition-all duration-700 ease-smooth group-hover:scale-125 group-hover:text-tinta-fuerte">
                    {service.number}
                  </span>
                </div>

                {/* Texto */}
                <div
                  className={[
                    'flex flex-col p-8 md:p-10',
                    service.featured ? 'md:justify-center' : '',
                    service.reverse ? 'md:order-1' : '',
                  ].join(' ')}
                >
                  <h3 className="font-display text-3xl font-light text-tinta-fuerte lg:text-4xl">
                    {service.title}
                  </h3>
                  <p className="mt-2 font-display text-lg font-light italic text-tinta-tenue">
                    {service.lead}
                  </p>
                  <p className="mt-5 text-sm font-light leading-relaxed text-tinta-suave">
                    {service.description}
                  </p>

                  <ServicioTipos id={service.id} items={service.items} />

                  <a
                    href={whatsappLink(service.title)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-fit items-center gap-2 border-b border-transparent pt-8 text-xs uppercase tracking-widest text-tinta transition-all duration-300 hover:gap-3 hover:border-tinta-tenue hover:text-tinta-fuerte"
                  >
                    Agendar {service.title.toLowerCase()}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
