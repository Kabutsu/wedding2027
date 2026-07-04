import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BottleAnimation() {
  const containerRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(containerRef.current, { transformOrigin: '40% 10%' });
    }, containerRef);

    gsap.fromTo(containerRef.current, { rotation: -60 }, {
      rotation: -110,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        end: 'bottom 30%',
        scrub: 0.65,
      },
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <img
      id="bottle"
      class="w-20 sm:w-32 h-auto ml-[50%] sm:ml-[15%]"
      src="/src/assets/images/bottle.png"
      alt="Bottle"
      ref={containerRef}
    />
  );
}
