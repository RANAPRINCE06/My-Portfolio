import { describe, it, expect } from 'vitest';
import { cn, formatMetricNumber, clamp } from '@/lib/utils';

describe('Utility Functions', () => {
  it('combines classes and resolves conflicts correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-white', false && 'text-black', undefined, 'bg-black')).toBe('text-white bg-black');
  });

  it('formats metric numbers with proper suffixes', () => {
    expect(formatMetricNumber(500)).toBe('500');
    expect(formatMetricNumber(1500)).toBe('1.5k');
    expect(formatMetricNumber(20000)).toBe('20k');
    expect(formatMetricNumber(1500000)).toBe('1.5M');
  });

  it('clamps numbers within range boundaries', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

