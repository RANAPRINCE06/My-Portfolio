'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile';
import { StaticFallback } from './StaticFallback';

interface SceneContainerProps {
  children?: React.ReactNode;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({ children }) => {
  const profile = usePerformanceProfile();
  const [contextLost, setContextLost] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault();
    console.warn('WebGL context lost. Rendering high-performance static fallback.');
    setContextLost(true);
  }, []);

  const handleContextRestored = useCallback(() => {
    console.info('WebGL context restored.');
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
  }, [handleContextLost, handleContextRestored]);

  // If SSR, WebGL disabled/unsupported, or context lost, show StaticFallback
  if (!isMounted || profile.tier === 'fallback' || contextLost) {
    return <StaticFallback />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-canvas overflow-hidden"
    >
      <StaticFallback />
      {/* 3D Scene children will mount here dynamically in Phase 3 */}
      {children}
    </div>
  );
};

