import { PerformanceTier } from '@/types/scene';

export interface PerformanceMetrics {
  fps: number;
  frameTimeMs: number;
  p95FrameTimeMs: number;
  sampleCount: number;
  isDegraded: boolean;
}

export interface PerformanceMonitorOptions {
  windowSize?: number;
  highTierMinFps?: number;
  balancedTierMinFps?: number;
  cooldownMs?: number;
  minSamplesBeforeEvaluation?: number;
}

/**
 * Production-grade rolling frame-timing monitor.
 * Evaluates real observed frame durations using a circular buffer,
 * enforcing cooldowns and single-direction hysteresis to prevent oscillation.
 */
export class PerformanceMonitor {
  private windowSize: number;
  private highTierMinFps: number;
  private balancedTierMinFps: number;
  private cooldownMs: number;
  private minSamples: number;

  private samples: Float32Array;
  private sampleIndex = 0;
  private sampleCount = 0;
  private lastDowngradeTimestamp = 0;

  constructor(options: PerformanceMonitorOptions = {}) {
    this.windowSize = options.windowSize ?? 60;
    this.highTierMinFps = options.highTierMinFps ?? 48; // Frame time > 20.8ms
    this.balancedTierMinFps = options.balancedTierMinFps ?? 35; // Frame time > 28.5ms
    this.cooldownMs = options.cooldownMs ?? 4000;
    this.minSamples = options.minSamplesBeforeEvaluation ?? 45;

    this.samples = new Float32Array(this.windowSize);
    this.lastDowngradeTimestamp = 0;
  }

  /**
   * Records a frame delta time in seconds.
   * Discards extreme outlier pauses (e.g. tab suspension or backgrounding).
   */
  public recordFrame(deltaSeconds: number): PerformanceMetrics {
    // Ignore extreme pauses (> 0.5s) to avoid skewing rolling metrics after window blur
    if (deltaSeconds > 0 && deltaSeconds <= 0.5) {
      const frameTimeMs = deltaSeconds * 1000;
      this.samples[this.sampleIndex] = frameTimeMs;
      this.sampleIndex = (this.sampleIndex + 1) % this.windowSize;
      if (this.sampleCount < this.windowSize) {
        this.sampleCount++;
      }
    }

    return this.getMetrics();
  }

  /**
   * Computes current rolling performance metrics.
   */
  public getMetrics(): PerformanceMetrics {
    if (this.sampleCount === 0) {
      return {
        fps: 60,
        frameTimeMs: 16.7,
        p95FrameTimeMs: 16.7,
        sampleCount: 0,
        isDegraded: false,
      };
    }

    let sum = 0;
    const sorted = new Float32Array(this.sampleCount);

    for (let i = 0; i < this.sampleCount; i++) {
      const val = this.samples[i];
      sum += val;
      sorted[i] = val;
    }

    sorted.sort();

    const avgFrameTimeMs = sum / this.sampleCount;
    const fps = avgFrameTimeMs > 0 ? Math.round(1000 / avgFrameTimeMs) : 60;
    const p95Index = Math.min(
      Math.floor(this.sampleCount * 0.95),
      this.sampleCount - 1
    );
    const p95FrameTimeMs = sorted[p95Index];

    const isDegraded =
      fps < this.highTierMinFps && this.sampleCount >= this.minSamples;

    return {
      fps,
      frameTimeMs: Math.round(avgFrameTimeMs * 10) / 10,
      p95FrameTimeMs: Math.round(p95FrameTimeMs * 10) / 10,
      sampleCount: this.sampleCount,
      isDegraded,
    };
  }

  /**
   * Evaluates whether current sustained performance warrants a tier downgrade.
   * Enforces cooldowns and hysteresis (never recommends an upgrade).
   */
  public checkDowngrade(
    currentTier: PerformanceTier,
    currentTime: number = Date.now()
  ): PerformanceTier | null {
    if (currentTier === 'low' || currentTier === 'fallback') {
      return null;
    }

    if (this.sampleCount < this.minSamples) {
      return null;
    }

    if (currentTime - this.lastDowngradeTimestamp < this.cooldownMs) {
      return null;
    }

    const metrics = this.getMetrics();

    if (currentTier === 'high' && metrics.fps < this.highTierMinFps) {
      this.lastDowngradeTimestamp = currentTime;
      return 'balanced';
    }

    if (currentTier === 'balanced' && metrics.fps < this.balancedTierMinFps) {
      this.lastDowngradeTimestamp = currentTime;
      return 'low';
    }

    return null;
  }

  /**
   * Resets all recorded samples and timers.
   */
  public reset(timestamp: number = Date.now()): void {
    this.samples.fill(0);
    this.sampleIndex = 0;
    this.sampleCount = 0;
    this.lastDowngradeTimestamp = timestamp;
  }
}

// Global singleton instance for in-scene monitoring
// Calibrated to tolerate brief shader compilation / hydration dips without false downgrades
export const globalPerformanceMonitor = new PerformanceMonitor({
  windowSize: 60,
  highTierMinFps: 36,
  balancedTierMinFps: 24,
  cooldownMs: 5000,
  minSamplesBeforeEvaluation: 60,
});
