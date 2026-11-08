'use client';

import React from 'react';
import { CameraRig } from './CameraRig';
import { Environment } from './Environment';
import { CyberCore } from './CyberCore';
import { ParticleField } from './Particles';
import { PostProcessingEffects, PerformanceMonitorInScene } from './effects';
import { ScenePerformanceConfig, PerformanceTier } from '@/types/scene';

interface SceneManagerProps {
  config: ScenePerformanceConfig;
  prefersReducedMotion?: boolean;
  onDowngrade?: (newTier: PerformanceTier) => void;
}

/**
 * SceneManager orchestrates the 3D visual composition inside the R3F Canvas.
 * Connects camera kinematics, atmospheric lighting, custom GLSL CyberCore,
 * kinetic particle constellation, real-time performance monitoring,
 * and adaptive post-processing effects.
 */
export const SceneManager: React.FC<SceneManagerProps> = ({
  config,
  prefersReducedMotion = false,
  onDowngrade,
}) => {
  return (
    <>
      <CameraRig
        enableParallax={config.enableInteractiveParallax}
        prefersReducedMotion={prefersReducedMotion}
      />
      <Environment config={config} />
      <CyberCore
        config={config}
        prefersReducedMotion={prefersReducedMotion}
      />
      <ParticleField
        config={config}
        prefersReducedMotion={prefersReducedMotion}
      />
      <PerformanceMonitorInScene
        currentTier={config.tier}
        onDowngrade={onDowngrade}
        disabled={prefersReducedMotion || config.tier === 'low'}
      />
      <PostProcessingEffects
        config={config}
        prefersReducedMotion={prefersReducedMotion}
      />
    </>
  );
};
