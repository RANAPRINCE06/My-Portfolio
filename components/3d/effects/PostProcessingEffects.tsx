'use client';

import React from 'react';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  ToneMapping,
} from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { ScenePerformanceConfig } from '@/types/scene';

interface PostProcessingEffectsProps {
  config: ScenePerformanceConfig;
  prefersReducedMotion?: boolean;
}

/**
 * PostProcessingEffects encapsulates selective bloom, chromatic dispersion,
 * cinematic vignette falloff, and ACES Filmic tone mapping.
 * Automatically adapts across High, Balanced, and Low profiles,
 * and deactivates optical distortion under reduced-motion preferences.
 */
export const PostProcessingEffects: React.FC<PostProcessingEffectsProps> = ({
  config,
  prefersReducedMotion = false,
}) => {
  const pp = config.postProcessing;

  // 1. Bypass completely on low / fallback profiles or when disabled
  if (!config.enablePostProcessing || !pp || !pp.enabled || config.tier === 'low') {
    return null;
  }

  // Chromatic aberration offset vector
  const chromaticOffset =
    prefersReducedMotion || !pp.chromaticAberration.enabled
      ? new THREE.Vector2(0, 0)
      : new THREE.Vector2(...pp.chromaticAberration.offset);

  // Construct strictly-typed effects array for EffectComposer
  const effects: JSX.Element[] = [];

  // 1. Selective Energy Bloom: Glows on Cyan & Violet above luminance threshold
  if (pp.bloom.enabled) {
    effects.push(
      <Bloom
        key="bloom"
        intensity={pp.bloom.intensity}
        luminanceThreshold={pp.bloom.luminanceThreshold}
        luminanceSmoothing={pp.bloom.luminanceSmoothing}
        mipmapBlur={pp.bloom.mipmapBlur}
      />
    );
  }

  // 2. Restrained Anamorphic Chromatic Aberration
  if (pp.chromaticAberration.enabled && !prefersReducedMotion) {
    effects.push(
      <ChromaticAberration
        key="chromatic"
        offset={chromaticOffset}
        radialModulation={pp.chromaticAberration.radialModulation}
        modulationOffset={0.2}
      />
    );
  }

  // 3. Subtle Composition Vignette
  if (pp.vignette.enabled) {
    effects.push(
      <Vignette
        key="vignette"
        eskil={false}
        offset={pp.vignette.offset}
        darkness={pp.vignette.darkness}
      />
    );
  }

  // 4. Film-Grade Color Grading: ACES Filmic Curve
  if (pp.toneMapping.enabled) {
    effects.push(
      <ToneMapping
        key="tonemapping"
        mode={ToneMappingMode.ACES_FILMIC}
      />
    );
  }

  if (effects.length === 0) {
    return null;
  }

  return (
    <EffectComposer
      multisampling={pp.multisampling}
      enableNormalPass={false}
    >
      {effects}
    </EffectComposer>
  );
};
