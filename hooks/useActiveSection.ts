'use client';

import { useEffect, useState } from 'react';

/**
 * Deterministic active-section detector synchronized to scroll position.
 * Handles tall viewports cleanly by snapping to the final section near document bottom.
 */
export function useActiveSection(sectionIds: string[], defaultId: string): [string, (id: string) => void] {
  const [activeId, setActiveId] = useState<string>(defaultId);

  useEffect(() => {
    if (typeof window === 'undefined' || sectionIds.length === 0) return;

    let rafId: number | null = null;

    const computeActive = () => {
      rafId = null;

      // Snap to last section when near the bottom of the page (handles short footer/contact sections on tall viewports)
      const docHeight = document.documentElement.scrollHeight;
      if (window.innerHeight + window.scrollY >= docHeight - 90) {
        setActiveId(sectionIds[sectionIds.length - 1]);
        return;
      }

      const activationLine = window.innerHeight * 0.36;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= activationLine) {
          current = id;
        }
      }

      setActiveId(current);
    };

    const scheduleCheck = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(computeActive);
    };

    computeActive();
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
    };
  }, [sectionIds]);

  return [activeId, setActiveId];
}

