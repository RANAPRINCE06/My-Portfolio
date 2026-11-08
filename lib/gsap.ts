import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register plugins once in a safe environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Synchronizes Lenis smooth scroll ticker with GSAP's internal RAF ticker.
 * Avoids multiple competing requestAnimationFrame loops.
 */
export function synchronizeLenisAndGsap(lenis: Lenis): () => void {
  // Update ScrollTrigger whenever Lenis scrolls
  const handleScroll = () => {
    ScrollTrigger.update();
  };
  lenis.on('scroll', handleScroll);

  // Drive Lenis directly from GSAP's ticker
  const updateTicker = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(updateTicker);

  // Disable GSAP lag smoothing to ensure synchronized visual scroll
  gsap.ticker.lagSmoothing(0);

  // Return teardown function for clean React lifecycle disposal
  return () => {
    lenis.off('scroll', handleScroll);
    gsap.ticker.remove(updateTicker);
  };
}

export { gsap, ScrollTrigger };

