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
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 50%',
            once: true,
          },
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
