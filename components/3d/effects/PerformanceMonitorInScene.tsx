'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerformanceTier } from '@/types/scene';
import { globalPerformanceMonitor } from '@/lib/performance-monitor';

interface PerformanceMonitorInSceneProps {
  currentTier: PerformanceTier;
  onDowngrade?: (newTier: PerformanceTier) => void;
  disabled?: boolean;
}

/**
 * In-Scene Frame-Rate and Degradation Observer.
 * Samples delta times inside useFrame without triggering React re-renders.
 * Triggers onDowngrade when sustained frame drops are confirmed.
 */
export const PerformanceMonitorInScene: React.FC<PerformanceMonitorInSceneProps> = ({
  currentTier,
  onDowngrade,
  disabled = false,
}) => {
  const isDowngradingRef = useRef(false);

  useFrame((_, delta) => {
    if (disabled || isDowngradingRef.current) return;

    // Record frame timing to circular rolling buffer
    globalPerformanceMonitor.recordFrame(delta);

    // Evaluate tier downgrade with cooldown & hysteresis
    const nextTier = globalPerformanceMonitor.checkDowngrade(currentTier);
    if (nextTier && onDowngrade) {
      isDowngradingRef.current = true;
      onDowngrade(nextTier);
      // Reset flag after a moment to allow further downgrades if degradation persists
      setTimeout(() => {
        isDowngradingRef.current = false;
      }, 4000);
    }
  });

  return null;
};

