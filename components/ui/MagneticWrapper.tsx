'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  maxOffset?: number;
}

/**
 * Desktop-only restrained magnetic hover wrapper using GSAP quickTo.
 * Automatically disables on touchscreens, coarse pointers, and under prefers-reduced-motion.
 */
export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  className,
  strength = 0.22,
  maxOffset = 10,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || prefersReducedMotion || typeof window === 'undefined') return;

    // Activate strictly on fine pointer devices with hover capability (desktop)
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const clamp = (val: number) => Math.max(-maxOffset, Math.min(maxOffset, val));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) * strength;
      const relY = (e.clientY - rect.top - rect.height / 2) * strength;
      xTo(clamp(relX));
      yTo(clamp(relY));
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.45)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { clearProps: 'x,y' });
    };
  }, [prefersReducedMotion, strength, maxOffset]);

  return (
    <div ref={wrapperRef} className={cn('inline-flex will-change-transform', className)}>
      {children}
    </div>
  );
};

