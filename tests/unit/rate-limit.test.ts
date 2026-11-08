import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  it('allows requests within the defined threshold limit', async () => {
    const id = `test-ip-${Date.now()}`;
    const first = await checkRateLimit(id, 3, 60);
    expect(first.success).toBe(true);
    expect(first.remaining).toBe(2);

    const second = await checkRateLimit(id, 3, 60);
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(1);

    const third = await checkRateLimit(id, 3, 60);
    expect(third.success).toBe(true);
    expect(third.remaining).toBe(0);

    const fourth = await checkRateLimit(id, 3, 60);
    expect(fourth.success).toBe(false);
    expect(fourth.remaining).toBe(0);
  });
});

