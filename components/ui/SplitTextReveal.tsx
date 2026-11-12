'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export interface SplitTextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  stagger?: number;
  delay?: number;
  start?: string;
}

/**
 * Lightweight, accessible SplitText-style word reveal powered by GSAP ScrollTrigger.
 * Preserves semantic screen-reader phrasing via aria-label while animating clipped word tokens.
 */
export const SplitTextReveal: React.FC<SplitTextRevealProps> = ({
  text,
  as: Tag = 'h2',
  className,
  stagger = 0.045,
  delay = 0,
  start = 'top 88%',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tokens = el.querySelectorAll('.split-word-inner');
      if (tokens.length === 0) return;

      gsap.fromTo(
        tokens,
        {
          yPercent: isMobile ? 45 : 85,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: isMobile ? 0.45 : 0.65,
          stagger: isMobile ? stagger * 0.6 : stagger,
          delay,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion, stagger, delay, start, text]);

  return (
    <Tag
      ref={containerRef as React.RefObject<never>}
      aria-label={text}
      className={cn('inline-block', className)}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0"
        >
          <span className="split-word-inner inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
};

