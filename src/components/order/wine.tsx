import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WineContent } from './WineContent';

gsap.registerPlugin(ScrollTrigger);

interface WineProps {
  containerRef: any;
}

export default function Wine({ containerRef }: WineProps) {
  const maskRef = useRef<SVGRectElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!maskRef.current || !containerRef?.current) return;

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 639px)",
          isDesktop: "(min-width: 640px)"
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean; isDesktop: boolean };

          const scrollConfig = isMobile
            ? { start: 'top 25%', end: 'bottom 40%' }
            : { start: 'top top', end: 'bottom 40%' };

          gsap.fromTo(
            maskRef.current,
            { attr: { height: 0 } },
            {
              attr: { height: '100%' },
              scrollTrigger: {
                trigger: containerRef.current,
                ...scrollConfig,
                scrub: 0.65,
              },
            }
          );
        }
      );
    }, svgContainerRef);

    return () => {
      ctx.revert();
    };
  }, [containerRef]);

  return (
    <div ref={svgContainerRef} class="absolute top-32 sm:top-52 bottom-12 left-2 w-full pointer-events-none">
      <svg
        viewBox="0 0 63 1066"
        class="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id="wine-mask">
            {/* Start with a rect at height 0, will grow as user scrolls */}
            <rect ref={maskRef} x="0" y="0" width="63" height="0" fill="white" />
          </mask>
        </defs>

        {/* Wine SVG content with mask applied */}
        <g mask="url(#wine-mask)">
          <WineContent />
        </g>
      </svg>
    </div>
  );
}
