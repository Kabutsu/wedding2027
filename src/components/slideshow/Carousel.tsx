import { useEffect, useRef } from "preact/hooks";
import EmblaCarousel from "embla-carousel";
// import AutoScroll from 'embla-carousel-auto-scroll'
// import Autoplay from 'embla-carousel-autoplay'

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

    // const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(
    //   navigator.userAgent
    // );

    emblaRef.current = EmblaCarousel(containerRef.current, {
      align: "center",
      loop: true,
      skipSnaps: false,
    },
      // [
      //   Autoplay({
      //     delay: 3000,
      //     stopOnInteraction: false,
      //   }),
      //   AutoScroll({
      //     speed: isMobileDevice ? 1 : 2,
      //     playOnInit: true,
      //     stopOnInteraction: false,
      //     stopOnFocusIn: false,
      //     stopOnMouseEnter: false,
      //     startDelay: 2000,
      //   })
      // ]
    );

    emblaRef.current.on("select", () => {
      // Handle scroll snap changes if needed
    });

    return () => {
      emblaRef.current?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} class="embla overflow-hidden h-full">
      <div class="embla__container flex h-full gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            class="embla__slide shrink-0 h-full max-w-[80vw] max-h-[90vh] aspect-square sm:aspect-5/4 cursor-pointer first:ml-2"
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
