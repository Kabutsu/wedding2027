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
      // Animate mask height from 0 to full height as user scrolls through the order section
      gsap.fromTo(
        maskRef.current,
        { attr: { height: 0 } },
        {
          attr: { height: '100%' },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom 40%',
            scrub: 0.65,
            markers: true,
          },
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
