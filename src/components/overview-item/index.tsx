import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heartImg from '../../assets/images/heart-2.png';

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

      let mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 639px)",
          isDesktop: "(min-width: 640px)"
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean; isDesktop: boolean };

          if (isMobile) {
            // On mobile, we can just fade in the item without the pendulum effect
            gsap.fromTo(
              containerRef.current,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'sine.inOut',
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: 'top 80%',
                  once: true,
                },
              }
            );
            return;
          }

          // Only create pendulum animation on desktop
          ScrollTrigger.create({
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

          // Alternative approach: normalize scroll to ensure smooth behavior
          // ScrollTrigger.normalizeScroll(true);
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      id="overview-item"
      class="w-52 sm:w-48 h-48 font-(family-name:--font-cormorant) uppercase bg-center bg-contain bg-no-repeat bg-origin-border flex flex-col items-center justify-center gap-0 px-6 pt-6 pb-10 text-ivory-light"
      style={{ backgroundImage: `url(${heartImg.src})` }}
      ref={containerRef}
    >
      <h3 class="text-lg">{title}</h3>
      <p class="text-xl font-bold whitespace-nowrap">{details}</p>
    </div>
  );
}
