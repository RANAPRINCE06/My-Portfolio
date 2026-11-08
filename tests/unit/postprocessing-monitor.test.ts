import { describe, it, expect, beforeEach } from 'vitest';
import { PerformanceMonitor } from '@/lib/performance-monitor';
import { getScenePerformanceConfig } from '@/hooks/usePerformanceProfile';

describe('Phase 3.3 Post-Processing & Performance Monitor Suite', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor({
      windowSize: 60,
      highTierMinFps: 48,
      balancedTierMinFps: 35,
      cooldownMs: 4000,
      minSamplesBeforeEvaluation: 45,
    });
  });

  describe('Rolling Frame-Timing & Metrics Calculation', () => {
    it('initializes with default metrics when empty', () => {
      const metrics = monitor.getMetrics();
      expect(metrics.fps).toBe(60);
      expect(metrics.frameTimeMs).toBe(16.7);
      expect(metrics.sampleCount).toBe(0);
      expect(metrics.isDegraded).toBe(false);
    });

    it('calculates accurate rolling average FPS and frame times at 60 FPS', () => {
      // Record 60 frames at 16.66ms delta (0.01666s)
      for (let i = 0; i < 60; i++) {
        monitor.recordFrame(0.01666);
      }

      const metrics = monitor.getMetrics();
      expect(metrics.fps).toBe(60);
      expect(metrics.frameTimeMs).toBeCloseTo(16.7, 1);
      expect(metrics.sampleCount).toBe(60);
      expect(metrics.isDegraded).toBe(false);
    });

    it('calculates accurate p95 frame timing to catch micro-stutters', () => {
      // 55 smooth frames at 16.6ms, 5 slow frames at 33.3ms
      for (let i = 0; i < 55; i++) {
        monitor.recordFrame(0.0166);
      }
      for (let i = 0; i < 5; i++) {
        monitor.recordFrame(0.0333);
      }

      const metrics = monitor.getMetrics();
      expect(metrics.p95FrameTimeMs).toBeCloseTo(33.3, 1);
    });

    it('ignores anomalous extreme delta outliers caused by tab suspension (> 0.5s)', () => {
      for (let i = 0; i < 30; i++) {
        monitor.recordFrame(0.0166);
      }
      // Record an extreme suspension delta of 2.5 seconds
      monitor.recordFrame(2.5);

      const metrics = monitor.getMetrics();
      // Outlier should not be recorded into sample count
      expect(metrics.sampleCount).toBe(30);
      expect(metrics.fps).toBe(60);
    });
  });

  describe('Hysteresis, Cooldown, and Tier Downgrades', () => {
    it('does not downgrade prematurely before minimum sample count is reached', () => {
      // Record only 20 slow frames (< 45 min samples)
      for (let i = 0; i < 20; i++) {
        monitor.recordFrame(0.025); // 40 FPS
      }

      const nextTier = monitor.checkDowngrade('high', Date.now());
      expect(nextTier).toBeNull();
    });

    it('downgrades from high to balanced when sustained frame drop occurs', () => {
      // Record 50 slow frames at 25ms (40 FPS, below high threshold of 48 FPS)
      for (let i = 0; i < 50; i++) {
        monitor.recordFrame(0.025);
      }

      const mockTime = 10000;
      const nextTier = monitor.checkDowngrade('high', mockTime);
      expect(nextTier).toBe('balanced');
    });

    it('enforces cooldown period to prevent rapid tier cascading', () => {
      for (let i = 0; i < 50; i++) {
        monitor.recordFrame(0.035); // 28 FPS
      }

      const t0 = 10000;
      // First downgrade triggers
      const tier1 = monitor.checkDowngrade('high', t0);
      expect(tier1).toBe('balanced');

      // Immediately checking again during cooldown (e.g. 2000ms < 4000ms cooldown)
      const tier2 = monitor.checkDowngrade('balanced', t0 + 2000);
      expect(tier2).toBeNull();

      // After cooldown elapses (4500ms > 4000ms)
      const tier3 = monitor.checkDowngrade('balanced', t0 + 4500);
      expect(tier3).toBe('low');
    });

    it('returns null when current tier is low or fallback', () => {
      for (let i = 0; i < 50; i++) {
        monitor.recordFrame(0.05); // 20 FPS
      }
      expect(monitor.checkDowngrade('low', 50000)).toBeNull();
      expect(monitor.checkDowngrade('fallback', 50000)).toBeNull();
    });
  });

  describe('Post-Processing Tier Configuration', () => {
    it('configures High tier with selective bloom, chromatic aberration, and ACES tone mapping', () => {
      const config = getScenePerformanceConfig('high');
      expect(config.enablePostProcessing).toBe(true);
      expect(config.postProcessing).toBeDefined();

      const pp = config.postProcessing!;
      expect(pp.enabled).toBe(true);
      expect(pp.multisampling).toBe(2);
      expect(pp.bloom.enabled).toBe(true);
      expect(pp.bloom.intensity).toBe(0.9);
      expect(pp.bloom.luminanceThreshold).toBe(0.25);
      expect(pp.bloom.mipmapBlur).toBe(true);
      expect(pp.chromaticAberration.enabled).toBe(true);
      expect(pp.chromaticAberration.radialModulation).toBe(true);
      expect(pp.vignette.enabled).toBe(true);
      expect(pp.vignette.darkness).toBe(0.42);
      expect(pp.toneMapping.mode).toBe(6); // ACES_FILMIC
    });

    it('configures Balanced tier with reduced bloom and minimal chromatic aberration', () => {
      const config = getScenePerformanceConfig('balanced');
      expect(config.enablePostProcessing).toBe(true);
      expect(config.postProcessing).toBeDefined();

      const pp = config.postProcessing!;
      expect(pp.enabled).toBe(true);
      expect(pp.multisampling).toBe(0);
      expect(pp.bloom.intensity).toBe(0.45);
      expect(pp.bloom.luminanceThreshold).toBe(0.3);
      expect(pp.chromaticAberration.offset).toEqual([0.0006, 0.0004]);
      expect(pp.vignette.darkness).toBe(0.35);
    });

    it('disables post-processing on Low and Fallback tiers', () => {
      const low = getScenePerformanceConfig('low');
      expect(low.enablePostProcessing).toBe(false);
      expect(low.postProcessing?.enabled).toBe(false);

      const fallback = getScenePerformanceConfig('fallback');
      expect(fallback.enablePostProcessing).toBe(false);
      expect(fallback.postProcessing?.enabled).toBe(false);
    });
  });
});

