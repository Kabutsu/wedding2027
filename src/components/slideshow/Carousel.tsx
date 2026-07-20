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
  return images.map((image) => (
    <div
      id="slideshow-item"
      class="shrink-0 h-full max-h-[90vh] aspect-square sm:aspect-5/4 snap-start snap-always"
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
  ));
}
