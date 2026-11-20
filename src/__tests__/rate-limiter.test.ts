import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, resetRateLimits } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it('allows requests under the limit', () => {
    const result = checkRateLimit('test-ip');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(29);
  });

  it('allows exactly 30 requests per hour', () => {
    for (let i = 0; i < 30; i++) {
      const result = checkRateLimit('test-ip');
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks request 31', () => {
    for (let i = 0; i < 30; i++) {
      checkRateLimit('test-ip');
    }
    const result = checkRateLimit('test-ip');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.resetIn).toBeGreaterThan(0);
  });

  it('tracks limits per IP independently', () => {
    for (let i = 0; i < 30; i++) {
      checkRateLimit('ip-a');
    }
    const resultA = checkRateLimit('ip-a');
    const resultB = checkRateLimit('ip-b');

    expect(resultA.allowed).toBe(false);
    expect(resultB.allowed).toBe(true);
    expect(resultB.remaining).toBe(29);
  });
});
