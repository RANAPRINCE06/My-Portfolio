'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneManager } from './SceneManager';
import { ScenePerformanceConfig, PerformanceTier } from '@/types/scene';

interface SceneCanvasProps {
  config: ScenePerformanceConfig;
  prefersReducedMotion?: boolean;
  onDowngrade?: (newTier: PerformanceTier) => void;
}

/**
 * SceneCanvas encapsulates the WebGL Canvas lifecycle.
 * Manages device-pixel-ratio scaling, power preferences, clear colors,
 * frameloop throttling, and degradation cascades.
 */
export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  config,
  prefersReducedMotion = false,
  onDowngrade,
}) => {
  return (
    <div
      className="absolute inset-0 h-full w-full pointer-events-none"
      role="region"
      aria-label="3D Ambient Scene"
      aria-hidden="true"
    >
      <Canvas
        gl={{
          antialias: config.antialias,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={config.dpr}
        camera={{
          position: [0, 0, 5.8],
          fov: 50,
          near: 0.1,
          far: 50,
        }}
        frameloop={prefersReducedMotion ? 'demand' : 'always'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        onCreated={({ gl }) => {
          // Set transparent clear color to allow deep CSS ambient gradients to blend cleanly
          gl.setClearColor(0x05070d, 0);
        }}
      >
        <Suspense fallback={null}>
          <SceneManager
            config={config}
            prefersReducedMotion={prefersReducedMotion}
            onDowngrade={onDowngrade}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
