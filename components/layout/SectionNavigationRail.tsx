'use client';

import React from 'react';
import { scrollToTarget } from '@/lib/scroll-bridge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'hero', label: '01 · Core', href: '#hero' },
  { id: 'statistics', label: '02 · Telemetry', href: '#statistics' },
  { id: 'projects', label: '03 · Systems', href: '#projects' },
  { id: 'skills', label: '04 · Matrix', href: '#skills' },
  { id: 'contact', label: '05 · Dispatch', href: '#contact' },
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
      className="fixed right-6 top-1/2 z-dock hidden -translate-y-1/2 flex-col items-end gap-3 2xl:flex"
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
            className="group flex items-center gap-2.5 py-1 focus-visible:outline-none"
          >
            <span
              className={cn(
                'font-mono text-[10px] uppercase tracking-wider transition-all duration-200',
                isActive
                  ? 'translate-x-0 text-accent-cyan opacity-100'
                  : 'translate-x-2 text-text-muted opacity-0 group-hover:translate-x-0 group-hover:text-text-secondary group-hover:opacity-100',
                prefersReducedMotion && 'transition-none'
              )}
            >
              {sec.label}
            </span>
            <span
              className={cn(
                'block rounded-full transition-all duration-300',
                isActive
                  ? 'h-5 w-1.5 bg-accent-cyan shadow-[0_0_10px_rgba(0,240,255,0.75)]'
                  : 'h-2 w-1.5 bg-border-elevated group-hover:h-3 group-hover:bg-accent-cyan/70',
                prefersReducedMotion && 'transition-none'
              )}
            />
          </button>
        );
      })}
    </nav>
  );
};
