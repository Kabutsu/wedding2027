import { useEffect } from 'preact/hooks';

const Y_OFFSET = 150; // Adjust this to control the initial position of the background image (e.g., 50px means it starts 50px below the top of the viewport)

function ParallaxBanner() {
  useEffect(() => {
    function updateParallax() {
      const banner = document.getElementById('banner');
      if (!banner) return;
      
      const scrolled = window.scrollY - Y_OFFSET;
      const rate = 0.75; // Adjust this: lower = slower scroll (0.5 = half speed)
      
      // Move the background image position, not the element itself
      const yPos = scrolled * rate;
      banner.style.backgroundPosition = `center ${yPos}px`;
    }

    // Initial position
    updateParallax();

    // Update on scroll
    window.addEventListener('scroll', updateParallax, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateParallax);
    };
  }, []);

  return null; // This component doesn't render anything
}

export default ParallaxBanner;
