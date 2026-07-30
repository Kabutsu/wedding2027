import { useEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bottleImg from '../../assets/images/bottle.png';

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
      class="absolute top-24 sm:top-40 left-1/2 translate-x-[-1.5vw] sm:translate-x-0 w-20 sm:w-32 h-auto z-10"
      src={bottleImg.src}
      alt="Bottle"
      ref={containerRef}
    />
  );
}
