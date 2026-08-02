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

interface Props {
  images: OptimizedImage[];
  align: "start" | "center" | "end";
}

export default function Gallery({ images, align }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const emblaRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    emblaRef.current = EmblaCarousel(containerRef.current,
      {
        align,
        dragFree: true,
        loop: true,
        skipSnaps: true,
      },
    );

    return () => {
      emblaRef.current?.destroy();
    };
  }, [align]);

  return (
    <div ref={containerRef} class="embla overflow-hidden h-full">
      <div class="embla__container flex h-full gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            class="embla__slide shrink-0 h-full max-w-[40vw] max-h-[20vh] sm:max-w-[30vw] sm:max-h-[30vh] aspect-square sm:aspect-5/4 cursor-pointer first:ml-2"
            tabindex={0}
          >
            <img
              src={image.src}
              srcset={image.srcSet.attribute}
              alt={image.attributes.alt}
              loading={image.loading}
              class="w-full h-full object-cover"
              style={{ objectPosition: "center center", display: "block" }}
              onLoad={() =>
                window.dispatchEvent(new CustomEvent("gallery:image-settled"))
              }
              onError={() =>
                window.dispatchEvent(new CustomEvent("gallery:image-settled"))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}