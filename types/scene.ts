export type PerformanceTier = 'high' | 'balanced' | 'low' | 'fallback';

export interface BloomSettings {
  enabled: boolean;
  intensity: number;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  mipmapBlur: boolean;
}

export interface ChromaticAberrationSettings {
  enabled: boolean;
  offset: [number, number];
  radialModulation: boolean;
}

export interface VignetteSettings {
  enabled: boolean;
  offset: number;
  darkness: number;
}

export interface ToneMappingSettings {
  enabled: boolean;
  mode: number;
}

export interface PostProcessingConfig {
  enabled: boolean;
  multisampling: number;
  bloom: BloomSettings;
  chromaticAberration: ChromaticAberrationSettings;
  vignette: VignetteSettings;
  toneMapping: ToneMappingSettings;
}

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
  postProcessing?: PostProcessingConfig;
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
