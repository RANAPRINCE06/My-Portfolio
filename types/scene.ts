export type PerformanceTier = 'high' | 'balanced' | 'low' | 'fallback';

export interface ScenePerformanceConfig {
  tier: PerformanceTier;
  particleCount: number;
  dpr: [number, number];
  antialias: boolean;
  shadows: boolean;
  enhancedLighting: boolean;
  enablePostProcessing: boolean;
  enableInteractiveParallax: boolean;
  targetFov: number;
}

export interface CameraRigConfig {
  maxOffsetX: number;
  maxOffsetY: number;
  smoothSpeed: number;
  basePosition: [number, number, number];
}

export interface WebGLSupportResult {
  supported: boolean;
  isWebGL2: boolean;
  renderer?: string;
  vendor?: string;
}

