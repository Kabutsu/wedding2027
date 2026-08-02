import { useEffect, useRef } from "preact/hooks";
import EmblaCarousel from "embla-carousel";
// import WheelGestures from "embla-carousel-wheel-gestures";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OptimizedImage {
  src: string;
  srcSet: {
    attribute: string;
  };
  attributes: Record<string, any>;
  loading: "eager" | "lazy";
}

interface Props {
  images: OptimizedImage[];
  direction: "ltr" | "rtl";
}

export default function Gallery({ images, direction }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const emblaRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    emblaRef.current = EmblaCarousel(containerRef.current,
      {
        align: "center",
        direction,
        dragFree: true,
        loop: true,
        skipSnaps: true,
        // watchDrag: false,
      },
      // [
      //   WheelGestures({
      //     forceWheelAxis: "y",
      //     target: document.querySelector('#body') as HTMLElement,
      //   }),
      // ]
    );

    return () => {
      emblaRef.current?.destroy();
    };
  }, [direction]);

  return (
    <div ref={containerRef} class="embla overflow-hidden h-full">
      <div class="embla__container flex h-full gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            class="embla__slide shrink-0 h-full max-w-[30vw] max-h-[20vh] aspect-square sm:aspect-5/4 cursor-pointer first:ml-2"
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