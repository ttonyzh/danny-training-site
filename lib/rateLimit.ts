export interface RateLimiterOptions {
  windowMs: number;
  max: number;
}

/**
 * In-memory, per-key sliding-window rate limiter. Good enough for a single
 * warm serverless instance; state resets on cold start and isn't shared
 * across instances, so it's a soft deterrent, not a hard guarantee.
 */
export function createRateLimiter({ windowMs, max }: RateLimiterOptions) {
  const hits = new Map<string, number[]>();

  return function isRateLimited(key: string, now: number = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter(timestamp => now - timestamp < windowMs);
    const limited = recent.length >= max;
    if (!limited) recent.push(now);
    hits.set(key, recent);
    return limited;
  };
}
