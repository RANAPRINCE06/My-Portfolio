import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getScrollState,
  updateScrollState,
  subscribeScroll,
  resetScrollState,
  scrollToTarget,
  setLenisInstance,
} from '@/lib/scroll-bridge';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { MagneticWrapper } from '@/components/ui/MagneticWrapper';
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar';
import { SectionNavigationRail } from '@/components/layout/SectionNavigationRail';

describe('Phase 4.2B Cinematic Scroll & Motion Suite', () => {
  beforeEach(() => {
    resetScrollState();
    setLenisInstance(null);
  });

  it('exports reusable motion and navigation components', () => {
    expect(SplitTextReveal).toBeDefined();
    expect(MagneticWrapper).toBeDefined();
    expect(ScrollProgressBar).toBeDefined();
    expect(SectionNavigationRail).toBeDefined();
  });

  it('clamps scroll progress between 0 and 1 and notifies subscribers without re-renders', () => {
    const received: number[] = [];
    const unsubscribe = subscribeScroll((s) => {
      received.push(s.progress);
    });

    updateScrollState({ progress: 0.45, velocity: 12, currentY: 900 });
    expect(getScrollState()).toEqual({ progress: 0.45, velocity: 12, currentY: 900 });

    updateScrollState({ progress: 1.5, currentY: -20 });
    expect(getScrollState().progress).toBe(1);
    expect(getScrollState().currentY).toBe(0);

    expect(received).toEqual([0, 0.45, 1]);
    unsubscribe();
  });

  it('routes scrollToTarget through the singleton Lenis instance when reduced motion is off', () => {
    const mockScrollTo = vi.fn();
    setLenisInstance({ scrollTo: mockScrollTo } as unknown as Parameters<typeof setLenisInstance>[0]);

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );

    scrollToTarget('#projects', { offset: -104 });

    expect(mockScrollTo).toHaveBeenCalledWith('#projects', {
      offset: -104,
      immediate: false,
      duration: 1.15,
    });

    vi.unstubAllGlobals();
  });

  it('bypasses Lenis smooth scroll and jumps immediately under prefers-reduced-motion', () => {
    const mockScrollTo = vi.fn();
    const nativeScrollTo = vi.fn();
    setLenisInstance({ scrollTo: mockScrollTo } as unknown as Parameters<typeof setLenisInstance>[0]);
    vi.stubGlobal('scrollTo', nativeScrollTo);
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );

    scrollToTarget(0);

    expect(mockScrollTo).not.toHaveBeenCalled();
    expect(nativeScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    vi.unstubAllGlobals();
  });
});

