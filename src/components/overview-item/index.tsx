import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  title: string;
  details: string;
}

export default function OverviewItemAnimation({ title, details }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(containerRef.current, { transformOrigin: 'top center' });
    }, containerRef);

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        const target = gsap.utils.clamp(-5, 5, velocity / 80);
        const duration = // random between 0.09 and 1.15
          0.09 + Math.random() * 0.06;

        gsap.to(containerRef.current, {
          rotation: target,
          duration,
          ease: 'sine.inOut',
          overwrite: true,
          onComplete: () => {
            const duration = // random between 1.8 and 2.2 seconds
              1.8 + Math.random() * 0.4;
            gsap.to(containerRef.current, {
              rotation: 0,
              duration,
              ease: 'elastic.out(1, 0.2)',
            });
          },
        });
      },
    });

    return () => {
      ctx.revert();
      scrollTrigger.kill();
    };
  }, []);

  return (
    <div
      id="overview-item"
      class="w-52 sm:w-48 h-48 font-(family-name:--font-cormorant) uppercase bg-[url('/heart.svg')] bg-center bg-contain bg-no-repeat bg-origin-border flex flex-col items-center justify-center gap-0 px-6 pt-2 pb-10 text-ivory-light"
      ref={containerRef}
    >
      <h3 class="text-lg">{title}</h3>
      <p class="text-xl font-bold whitespace-nowrap">{details}</p>
    </div>
  );
}
