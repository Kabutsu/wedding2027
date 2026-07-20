import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type OrderItem = {
  time: string;
  title: string;
};

const InfoItem = ({ time, title }: OrderItem) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.6 : 0.5,
              ease: isMobile ? 'sine.inOut' : 'power2.out',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 50%',
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
    <div ref={containerRef} class="font-(family-name:--font-dream) text-crimson mb-4 sm:mb-12 flex flex-col items-end justify-center gap-1 w-[42.5%] mr-auto ml-0 text-right even:ml-auto even:mr-0 even:text-left even:items-start">
      <span class="text-xl sm:text-3xl">{time}</span>
      <span class="text-xl sm:text-3xl">{title}</span>
    </div>
  );
}

export default InfoItem;
