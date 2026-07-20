import { useRef } from 'preact/hooks';
import Bottle from './bottle';
import Wine from './wine';
import { useOrderScroll } from './useOrderScroll';

export default function OrderContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  useOrderScroll(containerRef);

  return (
    <div
      ref={containerRef}
      class="relative w-full min-h-[90vh] sm:min-h-[125vh] flex flex-col items-center justify-stretch overflow-x-hidden"
    >
      <h1 class="text-6xl font-(family-name:--font-boston) text-crimson text-center text-pretty mt-8">
        Order of the Day
      </h1>
      <div class="w-1/2 h-full flex-1 p-12 pt-24 sm:pt-40 flex flex-col items-center-safe justify-start relative">
        <Bottle />
        <Wine containerRef={containerRef} />
      </div>
    </div>
  );
}
