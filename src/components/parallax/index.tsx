import { useEffect } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ParallaxBanner() {
  useEffect(() => {
    const banner = document.getElementById('banner');
    if (!banner) return;

    // GSAP parallax with ScrollTrigger - smooth and performant
    gsap.fromTo(
      banner,
      {
        backgroundPosition: 'center -100px', // Start position
      },
      {
        backgroundPosition: `center ${window.innerHeight * 0.75}px`, // End position
        ease: 'none',
        scrollTrigger: {
          trigger: banner,
          start: 'top top',
          end: 'bottom top',
          scrub: 0,
        },
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return null;
}

export default ParallaxBanner;
