import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import {
  cyberCoreVertexShader,
  cyberCoreFragmentShader,
  getCyberCoreShaderConfig,
  createCyberCoreUniforms,
} from '@/components/3d/CyberCore';
import {
  updateScrollState,
  getScrollState,
  subscribeScroll,
  resetScrollState,
} from '@/lib/scroll-bridge';
import { getScenePerformanceConfig } from '@/hooks/usePerformanceProfile';

describe('Phase 3.2 CyberCore GLSL Shaders & Kinetic Dynamics Suite', () => {
  beforeEach(() => {
    resetScrollState();
  });

  describe('CyberCore GLSL Shaders Verification', () => {
    it('verifies vertex shader declares all necessary uniform and varying attributes', () => {
      expect(cyberCoreVertexShader).toContain('uniform float uTime;');
      expect(cyberCoreVertexShader).toContain('uniform float uDisplacementStrength;');
      expect(cyberCoreVertexShader).toContain('uniform float uNoiseFrequency;');
      expect(cyberCoreVertexShader).toContain('varying vec3 vNormal;');
      expect(cyberCoreVertexShader).toContain('varying vec3 vWorldPosition;');
      expect(cyberCoreVertexShader).toContain('varying vec3 vViewPosition;');
      expect(cyberCoreVertexShader).toContain('varying float vDisplacement;');
      expect(cyberCoreVertexShader).toContain('calculateDisplacement');
      expect(cyberCoreVertexShader).toContain('gl_Position');
    });

    it('verifies fragment shader implements dual Fresnel, color gradient, and controlled emission', () => {
      expect(cyberCoreFragmentShader).toContain('uniform float uTime;');
      expect(cyberCoreFragmentShader).toContain('uniform vec3 uCyanColor;');
      expect(cyberCoreFragmentShader).toContain('uniform vec3 uVioletColor;');
      expect(cyberCoreFragmentShader).toContain('uniform vec3 uDarkBaseColor;');
      expect(cyberCoreFragmentShader).toContain('uniform float uFresnelPower;');
      expect(cyberCoreFragmentShader).toContain('uniform float uIntensity;');
      expect(cyberCoreFragmentShader).toContain('uniform float uOpacity;');
      expect(cyberCoreFragmentShader).toContain('fresnelCyan');
      expect(cyberCoreFragmentShader).toContain('fresnelViolet');
      expect(cyberCoreFragmentShader).toContain('gl_FragColor');
    });

    it('adapts shader configuration dynamically based on performance tier', () => {
      const highConfig = getScenePerformanceConfig('high');
      const highParams = getCyberCoreShaderConfig(highConfig);
      expect(highParams.displacement).toBe(0.16);
      expect(highParams.noiseFreq).toBe(2.2);
      expect(highParams.intensity).toBe(1.05);

      const balancedConfig = getScenePerformanceConfig('balanced');
      const balancedParams = getCyberCoreShaderConfig(balancedConfig);
      expect(balancedParams.displacement).toBe(0.12);
      expect(balancedParams.noiseFreq).toBe(2.0);
      expect(balancedParams.intensity).toBe(0.95);

      const lowConfig = getScenePerformanceConfig('low');
      const lowParams = getCyberCoreShaderConfig(lowConfig);
      expect(lowParams.displacement).toBe(0.06);
      expect(lowParams.noiseFreq).toBe(1.6);
      expect(lowParams.intensity).toBe(0.85);
    });

    it('creates Three.js shader uniforms with correct color space and initial values', () => {
      const highConfig = getScenePerformanceConfig('high');
      const uniforms = createCyberCoreUniforms(highConfig);

      expect(uniforms.uTime.value).toBe(0);
      expect(uniforms.uDisplacementStrength.value).toBe(0.16);
      expect(uniforms.uCyanColor.value).toBeInstanceOf(THREE.Color);
      expect(uniforms.uCyanColor.value.getHexString().toLowerCase()).toBe('00f0ff');
      expect(uniforms.uVioletColor.value).toBeInstanceOf(THREE.Color);
      expect(uniforms.uVioletColor.value.getHexString().toLowerCase()).toBe('8a2be2');
      expect(uniforms.uDarkBaseColor.value).toBeInstanceOf(THREE.Color);
      expect(uniforms.uDarkBaseColor.value.getHexString().toLowerCase()).toBe('050814');
    });
  });

  describe('Lenis Scroll Bridge Dynamics', () => {
    it('initializes with default zeroed scroll metrics', () => {
      const state = getScrollState();
      expect(state.progress).toBe(0);
      expect(state.velocity).toBe(0);
      expect(state.currentY).toBe(0);
    });

    it('updates scroll state and clamps progress between 0 and 1', () => {
      updateScrollState({ progress: 0.5, velocity: 12.5, currentY: 450 });
      let state = getScrollState();
      expect(state.progress).toBe(0.5);
      expect(state.velocity).toBe(12.5);
      expect(state.currentY).toBe(450);

      // Overscroll protection (above 1.0)
      updateScrollState({ progress: 1.4 });
      state = getScrollState();
      expect(state.progress).toBe(1);

      // Underscroll protection (negative progress)
      updateScrollState({ progress: -0.2 });
      state = getScrollState();
      expect(state.progress).toBe(0);
    });

    it('notifies active subscribers when scroll state changes and unbinds cleanly', () => {
      const listener = vi.fn();
      const unsubscribe = subscribeScroll(listener);

      // Listener is called with initial state
      expect(listener).toHaveBeenCalledTimes(1);

      updateScrollState({ progress: 0.75, velocity: 5 });
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenLastCalledWith(
        expect.objectContaining({ progress: 0.75, velocity: 5 })
      );

      // Unsubscribe
      unsubscribe();
      updateScrollState({ progress: 0.9 });
      expect(listener).toHaveBeenCalledTimes(2); // Not called after unsubscribe
    });
  });

  describe('Particle Kinetics & Tier Capacity', () => {
    it('verifies adaptive particle count matches tier specification', () => {
      const high = getScenePerformanceConfig('high');
      expect(high.particleCount).toBe(1500);

      const balanced = getScenePerformanceConfig('balanced');
      expect(balanced.particleCount).toBe(600);

      const low = getScenePerformanceConfig('low');
      expect(low.particleCount).toBe(150);

      const fallback = getScenePerformanceConfig('fallback');
      expect(fallback.particleCount).toBe(0);
    });
  });
});

