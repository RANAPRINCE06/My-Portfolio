'use client';

import React from 'react';
import { scrollToTarget } from '@/lib/scroll-bridge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'hero', label: '01 · Core', href: '#about' },
  { id: 'statistics', label: '02 · Telemetry', href: '#statistics' },
  { id: 'projects', label: '03 · Systems', href: '#projects' },
  { id: 'skills', label: '04 · Matrix', href: '#skills' },
  { id: 'experience', label: '05 · Timeline', href: '#experience' },
  { id: 'simulations', label: '06 · Simulations', href: '#simulations' },
  { id: 'achievements', label: '07 · Contests', href: '#achievements' },
  { id: 'certifications', label: '08 · Credentials', href: '#certifications' },
  { id: 'contact', label: '09 · Dispatch', href: '#contact' },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

/**
 * Interactive floating section navigation rail for wide desktop viewports (2XL+).
 * Highlights active viewport narrative position and scrolls smoothly via Lenis.
 */
export const SectionNavigationRail: React.FC = () => {
  const [activeId, setActiveId] = useActiveSection(SECTION_IDS, 'hero');
  const prefersReducedMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, href: string, id: string) => {
    e.preventDefault();
    setActiveId(id);
    scrollToTarget(href, { offset: id === 'hero' ? 0 : -96 });
  };

  return (
    <nav
      aria-label="Section Quick Navigation"
      className="fixed right-6 top-1/2 z-dock hidden -translate-y-1/2 flex-col items-end gap-2.5 2xl:flex"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeId === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={(e) => handleClick(e, sec.href, sec.id)}
            aria-label={`Jump to ${sec.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-2.5 py-0.5 focus-visible:outline-none"
          >
            <span
              className={cn(
                'font-mono text-[10px] uppercase tracking-wider transition-all duration-200',
                isActive
                  ? 'translate-x-0 text-accent-cyan opacity-100 font-semibold'
                  : 'translate-x-2 text-text-muted opacity-0 group-hover:translate-x-0 group-hover:text-text-secondary group-hover:opacity-100',
                prefersReducedMotion && 'transition-none'
              )}
            >
              {sec.label}
            </span>

            {/* Reticle Dot / Pip */}
            <span
              className={cn(
                'relative flex h-2.5 w-2.5 items-center justify-center rounded-full border transition-all duration-300',
                isActive
                  ? 'border-accent-cyan bg-accent-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)] scale-110'
                  : 'border-white/20 bg-white/10 group-hover:border-accent-cyan/60 group-hover:scale-105'
              )}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full bg-accent-cyan/50 opacity-75"
                />
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
