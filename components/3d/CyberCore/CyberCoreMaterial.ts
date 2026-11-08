import * as THREE from 'three';
import { ScenePerformanceConfig } from '@/types/scene';
import {
  cyberCoreVertexShader,
  cyberCoreFragmentShader,
} from './shaders';

export interface CyberCoreUniforms {
  [uniform: string]: THREE.IUniform;
  uTime: { value: number };
  uDisplacementStrength: { value: number };
  uNoiseFrequency: { value: number };
  uCyanColor: { value: THREE.Color };
  uVioletColor: { value: THREE.Color };
  uDarkBaseColor: { value: THREE.Color };
  uFresnelPower: { value: number };
  uIntensity: { value: number };
  uOpacity: { value: number };
  uPulseSpeed: { value: number };
}

/**
 * Generates adaptive GLSL shader uniforms calibrated to the active performance tier.
 */
export function getCyberCoreShaderConfig(config: ScenePerformanceConfig) {
  let displacement = 0.16;
  let noiseFreq = 2.2;
  let fresnelPow = 2.4;
  let intensity = 1.05;
  let opacity = 0.88;
  let pulseSpeed = 1.5;

  if (config.tier === 'balanced') {
    displacement = 0.12;
    noiseFreq = 2.0;
    fresnelPow = 2.2;
    intensity = 0.95;
    opacity = 0.84;
    pulseSpeed = 1.25;
  } else if (config.tier === 'low') {
    displacement = 0.06;
    noiseFreq = 1.6;
    fresnelPow = 2.0;
    intensity = 0.85;
    opacity = 0.8;
    pulseSpeed = 1.0;
  }

  return {
    displacement,
    noiseFreq,
    fresnelPow,
    intensity,
    opacity,
    pulseSpeed,
  };
}

export function createCyberCoreUniforms(
  config: ScenePerformanceConfig
): CyberCoreUniforms {
  const params = getCyberCoreShaderConfig(config);

  return {
    uTime: { value: 0 },
    uDisplacementStrength: { value: params.displacement },
    uNoiseFrequency: { value: params.noiseFreq },
    uCyanColor: { value: new THREE.Color('#00F0FF') },
    uVioletColor: { value: new THREE.Color('#8A2BE2') },
    uDarkBaseColor: { value: new THREE.Color('#050814') },
    uFresnelPower: { value: params.fresnelPow },
    uIntensity: { value: params.intensity },
    uOpacity: { value: params.opacity },
    uPulseSpeed: { value: params.pulseSpeed },
  };
}

/**
 * Creates a standalone Three.js ShaderMaterial for CyberCore.
 */
export function createCyberCoreShaderMaterial(
  config: ScenePerformanceConfig
): THREE.ShaderMaterial {
  const uniforms = createCyberCoreUniforms(config);

  return new THREE.ShaderMaterial({
    vertexShader: cyberCoreVertexShader,
    fragmentShader: cyberCoreFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

