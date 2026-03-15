import defaultLogo from '@/assets/default-project-logo.png';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const extensionSlides = [
  {
    id: 1,
    title: 'Clínica Escola Digital',
    subtitle: 'Acompanhamento de atendimentos e agenda acadêmica.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Radar de Projetos Sociais',
    subtitle: 'Mapa interativo das ações de extensão da região.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Lab de Inovação FESO',
    subtitle: 'Vitrine de protótipos e pesquisas aplicadas.',
    image:
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Conecta Comunidade',
    subtitle: 'Portal de integração entre cursos e projetos locais.',
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Núcleo de Tecnologia Assistiva',
    subtitle: 'Catálogo de soluções para inclusão e acessibilidade.',
    image:
      'https://images.unsplash.com/photo-1469571486292-b53601020f45?auto=format&fit=crop&w=1200&q=80',
  },
];

const ExtensionsCarousel = () => {
  return (
    <section className="mb-8">
      <Carousel
        opts={{ align: 'start', loop: true, duration: 35, dragFree: true }}
        className="w-full px-10"
      >
        <CarouselContent>
          {extensionSlides.map((slide) => (
            <CarouselItem key={slide.id} className="basis-[88%] sm:basis-1/2 lg:basis-1/3">
              <article className="relative h-56 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = defaultLogo;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="mb-1 inline-flex rounded-full border border-white/35 bg-black/25 px-2 py-1 text-[11px] font-medium uppercase tracking-wide">
                    Extensão
                  </p>
                  <h3 className="text-lg font-semibold leading-tight">{slide.title}</h3>
                  <p className="mt-1 text-sm text-white/85">{slide.subtitle}</p>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 border-border bg-background/90" />
        <CarouselNext className="right-0 border-border bg-background/90" />
      </Carousel>
    </section>
  );
};

export default ExtensionsCarousel;
