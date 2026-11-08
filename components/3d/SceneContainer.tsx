'use client';

import React, { useState, useEffect, useCallback, useMemo, Component, ErrorInfo } from 'react';
import dynamic from 'next/dynamic';
import { usePerformanceProfile, getScenePerformanceConfig } from '@/hooks/usePerformanceProfile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PerformanceTier } from '@/types/scene';
import { StaticFallback } from './fallbacks/StaticFallback';

// Dynamically import SceneCanvas with SSR disabled to guarantee zero hydration mismatch
const SceneCanvas = dynamic(
  () => import('./SceneCanvas').then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => <StaticFallback />,
  }
);

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('3D Scene rendering error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SceneContainerProps {
  children?: React.ReactNode;
}

/**
 * SceneContainer encapsulates the 3D rendering lifecycle.
 * Manages dynamic SSR-safe loading, WebGL context loss/restoration,
 * reduced-motion adaptation, and automatic fallback rendering.
 */
export const SceneContainer: React.FC<SceneContainerProps> = ({ children }) => {
  const profile = usePerformanceProfile();
  const prefersReducedMotion = useReducedMotion();
  const [overrideTier, setOverrideTier] = useState<PerformanceTier | null>(null);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const effectiveTier = overrideTier || profile.tier;
  const activeConfig = useMemo(() => {
    return getScenePerformanceConfig(effectiveTier);
  }, [effectiveTier]);

  const handleDowngrade = useCallback((newTier: PerformanceTier) => {
    console.warn(`Sustained frame drop detected. Downgrading 3D scene tier to ${newTier}.`);
    setOverrideTier(newTier);
  }, []);

  const handleContextLost = useCallback((event: Event) => {
    // Calling preventDefault() is required to instruct the browser that we wish to restore the context
    event.preventDefault();
    console.warn('WebGL context lost. Rendering high-performance static fallback.');
    setContextLost(true);
  }, []);

  const handleContextRestored = useCallback(() => {
    console.info('WebGL context restored. Re-mounting 3D scene.');
    setContextLost(false);
  }, []);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [isMounted, contextLost, handleContextLost, handleContextRestored]);

  // If not mounted (SSR/Hydration), or WebGL disabled/unsupported, or context lost:
  // Render high-performance static CSS backdrop with zero layout shift
  if (!isMounted || activeConfig.tier === 'fallback' || contextLost) {
    return <StaticFallback />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-canvas overflow-hidden"
    >
      <StaticFallback />
      <SceneErrorBoundary fallback={<StaticFallback />}>
        <SceneCanvas
          config={activeConfig}
          prefersReducedMotion={prefersReducedMotion}
          onDowngrade={handleDowngrade}
        />
      </SceneErrorBoundary>
      {children}
    </div>
  );
};
