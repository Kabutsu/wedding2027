import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin);

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

    gsap.fromTo(
      containerRef.current,
      { rotation: 0 },
      {
        rotation: 25,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(containerRef.current, {
            rotation: -18,
            duration: 0.35,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 5,
            repeatDelay: 0,
            overwrite: true,
          });
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          // toggleActions: 'play none none reverse',
          markers: true,
        },
      }
    )

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      id="overview-item"
      class="w-40 h-48 font-(family-name:--font-cormorant) uppercase bg-wedding-burgundy flex flex-col items-center justify-center gap-4 px-6 py-4 rounded-lg text-ivory-light"
      ref={containerRef}
    >
      <h3 class="text-lg">{title}</h3>
      <p class="text-xl font-bold whitespace-nowrap">{details}</p>
    </div>
  );
}
