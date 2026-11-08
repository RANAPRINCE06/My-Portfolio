import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  detectWebGLSupport,
  getScenePerformanceConfig,
  resolvePerformanceTier,
  getTierConfig,
} from '@/hooks/usePerformanceProfile';
import { PerformanceTier } from '@/types/scene';

describe('Phase 3.1 Adaptive 3D Scene Architecture Suite', () => {
  describe('WebGL Detection & Fallback Logic', () => {
    it('detects WebGL support when canvas returns a valid context', () => {
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);
      vi.spyOn(mockCanvas, 'getContext').mockImplementation((type: string) => {
        if (type === 'webgl2') return {} as unknown as RenderingContext;
        return null;
      });

      const result = detectWebGLSupport();
      expect(result.supported).toBe(true);
      expect(result.isWebGL2).toBe(true);

      vi.restoreAllMocks();
    });

    it('detects WebGL 1 when WebGL 2 is unavailable but WebGL 1 is available', () => {
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);
      vi.spyOn(mockCanvas, 'getContext').mockImplementation((type: string) => {
        if (type === 'webgl2') return null;
        if (type === 'webgl') return {} as unknown as RenderingContext;
        return null;
      });

      const result = detectWebGLSupport();
      expect(result.supported).toBe(true);
      expect(result.isWebGL2).toBe(false);

      vi.restoreAllMocks();
    });

    it('returns supported: false when getContext throws an error or returns null', () => {
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);
      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(null);

      const result = detectWebGLSupport();
      expect(result.supported).toBe(false);

      vi.restoreAllMocks();
    });
  });

  describe('Adaptive Performance Tier Resolution', () => {
    it('forces fallback tier when WebGL is unsupported', () => {
      const tier = resolvePerformanceTier({
        isWebGLSupported: false,
        hardwareConcurrency: 16,
        deviceMemory: 32,
        screenWidth: 1920,
      });
      expect(tier).toBe('fallback');
    });

    it('resolves low tier for mobile viewports regardless of cores', () => {
      const tier = resolvePerformanceTier({
        isWebGLSupported: true,
        screenWidth: 390,
        hardwareConcurrency: 8,
        deviceMemory: 8,
      });
      expect(tier).toBe('low');
    });

    it('resolves low tier for constrained devices with 2 or fewer cores', () => {
      const tier = resolvePerformanceTier({
        isWebGLSupported: true,
        screenWidth: 1440,
        hardwareConcurrency: 2,
        deviceMemory: 8,
      });
      expect(tier).toBe('low');
    });

    it('resolves low tier when device memory is under 4 GB', () => {
      const tier = resolvePerformanceTier({
        isWebGLSupported: true,
        screenWidth: 1440,
        hardwareConcurrency: 8,
        deviceMemory: 2,
      });
      expect(tier).toBe('low');
    });

    it('resolves balanced tier for tablet viewports', () => {
      const tier = resolvePerformanceTier({
        isWebGLSupported: true,
        screenWidth: 820,
        hardwareConcurrency: 8,
        deviceMemory: 8,
      });
      expect(tier).toBe('balanced');
    });

    it('resolves balanced tier for 4-core laptops or 4GB memory machines', () => {
      const tier = resolvePerformanceTier({
        isWebGLSupported: true,
        screenWidth: 1440,
        hardwareConcurrency: 4,
        deviceMemory: 8,
      });
      expect(tier).toBe('balanced');
    });

    it('resolves high tier for capable desktop machines (>=6 cores, >4GB RAM, >=1024px)', () => {
      const tier = resolvePerformanceTier({
        isWebGLSupported: true,
        screenWidth: 1920,
        hardwareConcurrency: 8,
        deviceMemory: 16,
      });
      expect(tier).toBe('high');
    });
  });

  describe('Scene Performance Configuration Profiles', () => {
    it('provides high profile with full fidelity parameters', () => {
      const config = getScenePerformanceConfig('high');
      expect(config.tier).toBe('high');
      expect(config.particleCount).toBe(1500);
      expect(config.dpr).toEqual([1, 2]);
      expect(config.antialias).toBe(true);
      expect(config.enhancedLighting).toBe(true);
      expect(config.enablePostProcessing).toBe(true);
      expect(config.enableInteractiveParallax).toBe(true);
      expect(config.targetFov).toBe(45);
    });

    it('provides balanced profile with optimized moderate parameters', () => {
      const config = getScenePerformanceConfig('balanced');
      expect(config.tier).toBe('balanced');
      expect(config.particleCount).toBe(600);
      expect(config.dpr).toEqual([1, 1.5]);
      expect(config.antialias).toBe(true);
      expect(config.enhancedLighting).toBe(true);
      expect(config.enablePostProcessing).toBe(false);
      expect(config.enableInteractiveParallax).toBe(true);
      expect(config.targetFov).toBe(50);
    });

    it('provides low profile with minimal overhead parameters', () => {
      const config = getScenePerformanceConfig('low');
      expect(config.tier).toBe('low');
      expect(config.particleCount).toBe(150);
      expect(config.dpr).toEqual([1, 1]);
      expect(config.antialias).toBe(false);
      expect(config.enhancedLighting).toBe(false);
      expect(config.enablePostProcessing).toBe(false);
      expect(config.enableInteractiveParallax).toBe(false);
      expect(config.targetFov).toBe(55);
    });

    it('provides fallback profile with 0 particles and static settings', () => {
      const config = getScenePerformanceConfig('fallback');
      expect(config.tier).toBe('fallback');
      expect(config.particleCount).toBe(0);
      expect(config.enableInteractiveParallax).toBe(false);
      expect(config.enablePostProcessing).toBe(false);
    });
  });

  describe('Backwards Compatibility with Legacy Tier Configs', () => {
    it('preserves getTierConfig mapping for high-desktop, mid-tablet, low-mobile', () => {
      const high = getTierConfig('high-desktop');
      expect(high.tier).toBe('high-desktop');
      expect(high.particleCount).toBe(1500);
      expect(high.enablePostProcessing).toBe(true);

      const mid = getTierConfig('mid-tablet');
      expect(mid.tier).toBe('mid-tablet');
      expect(mid.particleCount).toBe(600);
      expect(mid.enablePostProcessing).toBe(false);

      const low = getTierConfig('low-mobile');
      expect(low.tier).toBe('low-mobile');
      expect(low.particleCount).toBe(150);

      const fallback = getTierConfig('fallback');
      expect(fallback.tier).toBe('fallback');
      expect(fallback.particleCount).toBe(0);
    });
  });
});

