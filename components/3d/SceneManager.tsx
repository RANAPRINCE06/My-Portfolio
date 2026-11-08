'use client';

import React from 'react';
import { CameraRig } from './CameraRig';
import { Environment } from './Environment';
import { CyberCore } from './CyberCore';
import { ParticleField } from './Particles';
import { ScenePerformanceConfig } from '@/types/scene';

interface SceneManagerProps {
  config: ScenePerformanceConfig;
  prefersReducedMotion?: boolean;
}

/**
 * SceneManager orchestrates the 3D visual composition inside the R3F Canvas.
 * Connects the camera rig, lighting environment, core geometry, and particle fields
 * according to the active performance profile.
 */
export const SceneManager: React.FC<SceneManagerProps> = ({
  config,
  prefersReducedMotion = false,
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
    </>
  );
};

