import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PopupItem = () => {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 639px)",
          isDesktop: "(min-width: 640px)"
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean; isDesktop: boolean };

          gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: isMobile ? 25 : 50 },
            {
              opacity: 0.7,
              y: 0,
              duration: isMobile ? 0.6 : 0.5,
              ease: isMobile ? 'sine.inOut' : 'power2.out',
              scrollTrigger: {
                trigger: containerRef.current,
                start: isMobile ? 'top 70%' : 'top 80%',
                once: true,
              },
            }
          );
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <p ref={containerRef} class="w-full opacity-70 font-(family-name:--font-inter) italic font-light text-crimson text-base sm:text-xl text-center text-pretty px-4">
      (* Evening timings are approximate - we'll confirm closer to the date!)
    </p>
  );
}

export default PopupItem;
