'use client';

import { useState, useEffect } from 'react';
import {
  PerformanceTier,
  ScenePerformanceConfig,
  WebGLSupportResult,
} from '@/types/scene';

/**
 * Robust WebGL feature and capability detection.
 * Works safely in SSR, Node, JSDOM, and real browser contexts.
 */
export function detectWebGLSupport(): WebGLSupportResult {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { supported: false, isWebGL2: false };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      return { supported: true, isWebGL2: true };
    }

    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (gl) {
      return { supported: true, isWebGL2: false };
    }

    return { supported: false, isWebGL2: false };
  } catch {
    return { supported: false, isWebGL2: false };
  }
}

/**
 * Return strict configuration based on performance tier.
 */
export function getScenePerformanceConfig(
  tier: PerformanceTier
): ScenePerformanceConfig {
  switch (tier) {
    case 'high':
      return {
        tier: 'high',
        particleCount: 1500,
        dpr: [1, 2],
        antialias: true,
        shadows: false,
        enhancedLighting: true,
        enablePostProcessing: true,
        enableInteractiveParallax: true,
        targetFov: 45,
      };
    case 'balanced':
      return {
        tier: 'balanced',
        particleCount: 600,
        dpr: [1, 1.5],
        antialias: true,
        shadows: false,
        enhancedLighting: true,
        enablePostProcessing: false,
        enableInteractiveParallax: true,
        targetFov: 50,
      };
    case 'low':
      return {
        tier: 'low',
        particleCount: 150,
        dpr: [1, 1],
        antialias: false,
        shadows: false,
        enhancedLighting: false,
        enablePostProcessing: false,
        enableInteractiveParallax: false,
        targetFov: 55,
      };
    case 'fallback':
    default:
      return {
        tier: 'fallback',
        particleCount: 0,
        dpr: [1, 1],
        antialias: false,
        shadows: false,
        enhancedLighting: false,
        enablePostProcessing: false,
        enableInteractiveParallax: false,
        targetFov: 45,
      };
  }
}

export interface DeviceCapabilityOptions {
  isWebGLSupported?: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  screenWidth?: number;
  isTouch?: boolean;
}

/**
 * Pure evaluation function resolving appropriate performance tier
 * based on device capabilities without relying purely on screen width.
 */
export function resolvePerformanceTier(
  options?: DeviceCapabilityOptions
): PerformanceTier {
  if (options?.isWebGLSupported === false) {
    return 'fallback';
  }

  const concurrency = options?.hardwareConcurrency ?? 4;
  const memory = options?.deviceMemory;
  const width = options?.screenWidth ?? 1280;

  // 1. Constrained mobile or low hardware
  if (width < 768 || concurrency <= 2 || (memory !== undefined && memory < 4)) {
    return 'low';
  }

  // 2. Mid tablet or moderate hardware (e.g. 4 cores or <=4GB RAM or tablet screen)
  if (width < 1024 || concurrency <= 4 || (memory !== undefined && memory <= 4)) {
    return 'balanced';
  }

  // 3. Capable desktop
  return 'high';
}

/**
 * Hook providing dynamic, adaptive scene performance configuration.
 */
export function usePerformanceProfile(): ScenePerformanceConfig {
  const [config, setConfig] = useState<ScenePerformanceConfig>(() =>
    getScenePerformanceConfig('high')
  );

  useEffect(() => {
    const webgl = detectWebGLSupport();
    if (!webgl.supported) {
      setConfig(getScenePerformanceConfig('fallback'));
      return;
    }

    const width = window.innerWidth;
    const concurrency = navigator.hardwareConcurrency || 4;
    const memory =
      'deviceMemory' in navigator
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory
        : undefined;
    const isTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const resolvedTier = resolvePerformanceTier({
      isWebGLSupported: webgl.supported,
      hardwareConcurrency: concurrency,
      deviceMemory: memory,
      screenWidth: width,
      isTouch,
    });

    setConfig(getScenePerformanceConfig(resolvedTier));
  }, []);

  return config;
}

// -------------------------------------------------------------
// Backwards Compatibility Exports for Phase 1 / Phase 2 modules
// -------------------------------------------------------------
export type DeviceTier = 'high-desktop' | 'mid-tablet' | 'low-mobile' | 'fallback';

export interface PerformanceConfig {
  tier: DeviceTier;
  particleCount: number;
  enablePostProcessing: boolean;
  enableShaders: boolean;
  dpr: [number, number];
  interactivePhysics: boolean;
}

export function getTierConfig(tier: DeviceTier): PerformanceConfig {
  switch (tier) {
    case 'high-desktop':
      return {
        tier,
        particleCount: 1500,
        enablePostProcessing: true,
        enableShaders: true,
        dpr: [1, 2],
        interactivePhysics: true,
      };
    case 'mid-tablet':
      return {
        tier,
        particleCount: 600,
        enablePostProcessing: false,
        enableShaders: true,
        dpr: [1, 1.5],
        interactivePhysics: false,
      };
    case 'low-mobile':
      return {
        tier,
        particleCount: 150,
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
