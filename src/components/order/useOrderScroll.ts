import { useEffect, useRef, useState } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useOrderScroll(containerRef: any) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contextRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef?.current) return;

    // Initialize normalizeScroll for consistent mobile behavior
    // ScrollTrigger.normalizeScroll(true);

    const container = containerRef.current;

    const ctx = gsap.context(() => {
      // Use a dummy animation to track scroll progress
      gsap.fromTo(
        {},
        { progress: 0 },
        {
          progress: 1,
          duration: 1,
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.65,
            onUpdate: (self) => {
              setScrollProgress(self.progress);
            },
          },
          onUpdate: function() {
            // Update progress as animation plays
          },
        }
      );
    }, container);

    contextRef.current = ctx;

    return () => {
      ctx.revert();
      ScrollTrigger.normalizeScroll(false);
    };
  }, [containerRef]);

  return {
    scrollProgress,
    containerRef,
  };
}
