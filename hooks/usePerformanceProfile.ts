'use client';

import { useState, useEffect } from 'react';

export type DeviceTier = 'high-desktop' | 'mid-tablet' | 'low-mobile' | 'fallback';

export interface PerformanceConfig {
  tier: DeviceTier;
  particleCount: number;
  enablePostProcessing: boolean;
  enableShaders: boolean;
  dpr: [number, number];
  interactivePhysics: boolean;
}

export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl && gl instanceof WebGLRenderingContext);
  } catch {
    return false;
  }
}

export function getTierConfig(tier: DeviceTier): PerformanceConfig {
  switch (tier) {
    case 'high-desktop':
      return {
        tier,
        particleCount: 1500,
        enablePostProcessing: true,
        enableShaders: true,
        dpr: [1, 1.5],
        interactivePhysics: true,
      };
    case 'mid-tablet':
      return {
        tier,
        particleCount: 600,
        enablePostProcessing: false,
        enableShaders: true,
        dpr: [1, 1.25],
        interactivePhysics: false,
      };
    case 'low-mobile':
      return {
        tier,
        particleCount: 200,
        enablePostProcessing: false,
        enableShaders: false,
        dpr: [1, 1],
        interactivePhysics: false,
      };
    case 'fallback':
    default:
      return {
        tier: 'fallback',
        particleCount: 0,
        enablePostProcessing: false,
        enableShaders: false,
        dpr: [1, 1],
        interactivePhysics: false,
      };
  }
}

export function usePerformanceProfile(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>(() => getTierConfig('high-desktop'));

  useEffect(() => {
    // 1. Detect WebGL support
    if (!detectWebGLSupport()) {
      setConfig(getTierConfig('fallback'));
      return;
    }

    // 2. Hardware and screen dimension heuristics
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    // 3. Low-power / low-core mobile devices
    if (isMobile || hardwareConcurrency <= 2) {
      setConfig(getTierConfig('low-mobile'));
      return;
    }

    if (isTablet || hardwareConcurrency <= 4) {
      setConfig(getTierConfig('mid-tablet'));
      return;
    }

    setConfig(getTierConfig('high-desktop'));
  }, []);

  return config;
}

