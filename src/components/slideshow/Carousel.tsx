import { useRef, useEffect } from 'preact/hooks';
import type { ImageMetadata } from 'astro';

interface CarouselProps {
  images: ImageMetadata[];
}

export default function Carousel({ images }: CarouselProps) {
  return images.map((image, index) => (
    <div
      key={index}
      id="slideshow-item"
      data-carousel-item
      class="shrink-0 h-full aspect-square sm:aspect-5/4"
      style={{
        width: 'clamp(50vw, 60vw, 100vw)',
      }}
    >
      <img
        src={image.src}
        alt={`Photo ${index + 1}`}
        class="w-full h-full object-cover"
        style={{ objectPosition: 'center center', display: 'block' }}
      />
    </div>
  ));
}
