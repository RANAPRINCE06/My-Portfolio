'use client';

import React, { useEffect, useRef } from 'react';
import { subscribeScroll } from '@/lib/scroll-bridge';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * High-performance global scroll progress bar.
 * Reads directly from the scroll bridge via DOM ref transforms (zero React re-renders).
 */
export const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const unsubscribe = subscribeScroll((state) => {
      el.style.transform = `scaleX(${state.progress})`;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-toast h-[2px] bg-white/[0.04]"
    >
      <div
        ref={barRef}
        className={
          prefersReducedMotion
            ? 'h-full w-full origin-left bg-accent-cyan/80'
            : 'h-full w-full origin-left bg-gradient-to-r from-accent-cyan via-white to-accent-violet shadow-[0_0_10px_rgba(0,240,255,0.6)] transition-opacity duration-200'
        }
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

