import { useEffect, useRef } from "preact/hooks";
import EmblaCarousel from "embla-carousel";

interface OptimizedImage {
  src: string;
  srcSet: {
    attribute: string;
  };
  attributes: Record<string, any>;
  loading: "eager" | "lazy";
}

interface CarouselProps {
  images: OptimizedImage[];
}

export default function Carousel({ images }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const emblaRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    emblaRef.current = EmblaCarousel(containerRef.current, {
      align: "center",
      loop: true,
      skipSnaps: false,
    });

    emblaRef.current.on("select", () => {
      // Handle scroll snap changes if needed
    });

    return () => {
      emblaRef.current?.destroy();
    };
  }, []);

  const handleImageClick = (index: number) => {
    const embla = emblaRef.current;
    if (!embla) return;

    const slides = embla.slideNodes();
    if (!slides[index]) return;

    const slide = slides[index];
    const container = embla.containerNode();
    const slideWidth = slide.getBoundingClientRect().width;
    const containerWidth = container.getBoundingClientRect().width;
    const slideOffsetLeft = slide.offsetLeft;

    // Scroll so the slide is centered in the container
    const scrollPosition = slideOffsetLeft - (containerWidth - slideWidth) / 2;
    container.scrollTo({ left: scrollPosition, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} class="embla overflow-hidden h-full">
      <div class="embla__container flex h-full">
        {images.map((image, index) => (
          <div
            key={index}
            class="embla__slide shrink-0 h-full max-h-[90vh] aspect-square sm:aspect-5/4 cursor-pointer"
            onClick={() => handleImageClick(index)}
            role="button"
            tabindex={0}
          >
            <img
              src={image.src}
              srcset={image.srcSet.attribute}
              alt={image.attributes.alt}
              loading={image.loading}
              class="w-full h-full object-cover"
              style={{ objectPosition: "center center", display: "block" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
