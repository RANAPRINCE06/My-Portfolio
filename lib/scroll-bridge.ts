import type Lenis from 'lenis';

/**
 * Lenis / Window Scroll Bridge for 3D WebGL Scene Integration.
 * Provides zero-allocation, frame-rate independent access to normalized scroll progress,
 * velocity, and scroll position without triggering React re-renders.
 */

export interface ScrollState {
  progress: number; // 0.0 (top) to 1.0 (bottom)
  velocity: number; // Current scroll speed (positive = downwards)
  currentY: number; // Raw vertical scroll offset in pixels
}

const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  currentY: 0,
};

let activeLenis: Lenis | null = null;

/**
 * Registers the singular active Lenis instance for programmatic smooth navigation.
 */
export function setLenisInstance(instance: Lenis | null): void {
  activeLenis = instance;
}

/**
 * Smoothly scrolls to a target selector or pixel offset using Lenis when active,
 * falling back cleanly to native scrolling when reduced motion is enabled.
 */
export function scrollToTarget(
  target: string | number,
  options?: { offset?: number; immediate?: boolean }
): void {
  if (typeof window === 'undefined') return;

  const offset = options?.offset ?? -96;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (activeLenis && !prefersReduced) {
    activeLenis.scrollTo(target, {
      offset,
      immediate: options?.immediate ?? false,
      duration: 1.15,
    });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: prefersReduced ? 'auto' : 'smooth' });
    return;
  }

  const el = document.querySelector(target);
  if (el) {
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  }
}

type ScrollListener = (state: Readonly<ScrollState>) => void;
const listeners = new Set<ScrollListener>();

/**
 * Updates scroll state and notifies active subscribers.
 */
export function updateScrollState(update: Partial<ScrollState>): void {
  if (update.progress !== undefined) {
    scrollState.progress = Math.min(Math.max(update.progress, 0), 1);
  }
  if (update.velocity !== undefined) {
    scrollState.velocity = update.velocity;
  }
  if (update.currentY !== undefined) {
    scrollState.currentY = Math.max(update.currentY, 0);
  }

  listeners.forEach((listener) => {
    try {
      listener(scrollState);
    } catch (err) {
      console.error('Error in scroll state listener:', err);
    }
  });
}

/**
 * Reads the latest scroll state synchronously (safe for useFrame / WebGL ticker).
 */
export function getScrollState(): Readonly<ScrollState> {
  return scrollState;
}

/**
 * Subscribes to scroll state mutations with clean unsubscription.
 */
export function subscribeScroll(listener: ScrollListener): () => void {
  listeners.add(listener);
  // Emit initial state
  listener(scrollState);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Resets scroll state (e.g. for testing).
 */
export function resetScrollState(): void {
  scrollState.progress = 0;
  scrollState.velocity = 0;
  scrollState.currentY = 0;
  listeners.clear();
}

