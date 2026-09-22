import { describe, it, expect } from 'vitest';
import { createRateLimiter } from '../lib/rateLimit';

describe('createRateLimiter', () => {
  it('allows requests under the limit', () => {
    const isRateLimited = createRateLimiter({ windowMs: 1000, max: 3 });
    expect(isRateLimited('ip-a', 0)).toBe(false);
    expect(isRateLimited('ip-a', 10)).toBe(false);
    expect(isRateLimited('ip-a', 20)).toBe(false);
  });

  it('blocks once the limit is hit within the window', () => {
    const isRateLimited = createRateLimiter({ windowMs: 1000, max: 2 });
    expect(isRateLimited('ip-a', 0)).toBe(false);
    expect(isRateLimited('ip-a', 10)).toBe(false);
    expect(isRateLimited('ip-a', 20)).toBe(true);
  });

  it('tracks each key independently', () => {
    const isRateLimited = createRateLimiter({ windowMs: 1000, max: 1 });
    expect(isRateLimited('ip-a', 0)).toBe(false);
    expect(isRateLimited('ip-b', 0)).toBe(false);
    expect(isRateLimited('ip-a', 10)).toBe(true);
    expect(isRateLimited('ip-b', 10)).toBe(true);
  });

  it('allows requests again once the window has passed', () => {
    const isRateLimited = createRateLimiter({ windowMs: 1000, max: 1 });
    expect(isRateLimited('ip-a', 0)).toBe(false);
    expect(isRateLimited('ip-a', 500)).toBe(true);
    expect(isRateLimited('ip-a', 1500)).toBe(false);
  });
});
