/**
 * Production-ready Rate Limiter supporting both distributed Upstash Redis
 * and a graceful local development fallback.
 */

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory fallback map strictly for local development
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

export async function checkRateLimit(
  identifier: string,
  limit: number = 3,
  windowSeconds: number = 600
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Distributed Rate Limiting via Upstash Redis REST API
  if (upstashUrl && upstashToken) {
    try {
      const key = `rate_limit:${identifier}`;
      const now = Math.floor(Date.now() / 1000);
      const clearBefore = now - windowSeconds;

      // Pipeline Redis commands: remove expired, add current, count elements in window, set TTL
      const pipelineUrl = `${upstashUrl}/pipeline`;
      const response = await fetch(pipelineUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['ZREMRANGEBYSCORE', key, 0, clearBefore],
          ['ZADD', key, now, `${now}-${Math.random()}`],
          ['ZCARD', key],
          ['EXPIRE', key, windowSeconds],
        ]),
      });

      if (response.ok) {
        const results = await response.json();
        const currentCount = results[2]?.result ?? 1;
        const remaining = Math.max(0, limit - currentCount);
        return {
          success: currentCount <= limit,
          limit,
          remaining,
          reset: now + windowSeconds,
        };
      }
    } catch (err) {
      console.error('Distributed rate limiter error, falling back to local store:', err);
    }
  }

  // 2. Local memory fallback for development environments
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.expiresAt) {
    memoryStore.set(identifier, {
      count: 1,
      expiresAt: now + windowSeconds * 1000,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.floor((now + windowSeconds * 1000) / 1000),
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);

  return {
    success: entry.count <= limit,
    limit,
    remaining,
    reset: Math.floor(entry.expiresAt / 1000),
  };
}
