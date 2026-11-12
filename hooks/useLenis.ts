'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger, synchronizeLenisAndGsap } from '@/lib/gsap';
import { setLenisInstance, updateScrollState } from '@/lib/scroll-bridge';
import { useReducedMotion } from './useReducedMotion';

/**
 * Custom hook managing Lenis smooth scroll lifecycle,
 * GSAP ticker synchronization, and the 3D WebGL scroll bridge.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fallback native scroll listener (also active if reduced motion is preferred)
    const handleNativeScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      updateScrollState({
        currentY: scrollY,
        progress: scrollY / maxScroll,
        velocity: 0,
      });
    };

    // If reduced motion is preferred, use native passive scroll listener without smooth inertia
    if (prefersReducedMotion) {
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Bridge Lenis scroll events to 3D scene store
    const handleLenisScroll = (e: {
      scroll: number;
      limit: number;
      velocity: number;
    }) => {
      const progress = e.limit > 0 ? e.scroll / e.limit : 0;
      updateScrollState({
        currentY: e.scroll,
        progress,
        velocity: e.velocity,
      });
    };

    lenis.on('scroll', handleLenisScroll);

    // Pause smooth scroll inertia when tab is backgrounded
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
        ScrollTrigger.refresh();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Synchronize Lenis with GSAP's central RAF ticker
    const cleanupSync = synchronizeLenisAndGsap(lenis);

    // Initial sync
    handleNativeScroll();
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      lenis.off('scroll', handleLenisScroll);
      cleanupSync();
      setLenisInstance(null);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return lenisRef;
}
