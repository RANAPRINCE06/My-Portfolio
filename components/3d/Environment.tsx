'use client';

import React from 'react';
import { ScenePerformanceConfig } from '@/types/scene';

interface EnvironmentProps {
  config: ScenePerformanceConfig;
}

/**
 * Environment creates a cinematic, low-noise atmospheric lighting setup.
 * Uses subtle fog calibrated to the site background (#05070D) and dual-tone
 * cyberpunk highlights (Cyan key light and Violet rim light).
 */
export const Environment: React.FC<EnvironmentProps> = ({ config }) => {
  return (
    <>
      {/* Background depth fog calibrated precisely to #05070D void */}
      <fog attach="fog" args={['#05070D', 4, 18]} />

      {/* Atmospheric ambient base with low intensity to preserve deep shadows */}
      <ambientLight color="#0A101D" intensity={0.5} />

      {/* Primary Key Light: Cyber Cyan highlight positioned upper-left */}
      <directionalLight
        position={[-4, 5, 4]}
        color="#00F0FF"
        intensity={config.enhancedLighting ? 1.0 : 0.6}
      />

      {/* Secondary Rim Light: Electric Violet contour accent positioned lower-right */}
      <directionalLight
        position={[4, -3, -2]}
        color="#8A2BE2"
        intensity={config.enhancedLighting ? 0.8 : 0.4}
      />

      {/* Accent Frontal Fill: Active on high and balanced profiles only */}
      {config.enhancedLighting && (
        <pointLight
          position={[0, 0, 3]}
          color="#00F0FF"
          intensity={0.3}
          distance={10}
          decay={2}
        />
      )}
    </>
  );
};

