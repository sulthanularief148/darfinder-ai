// In-memory rate limiter — works per-instance. On Vercel serverless each
// function invocation may be a fresh instance, so this is best-effort.
// For stricter enforcement, swap to Vercel KV or Upstash Redis.
const hits = new Map<string, number[]>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_HITS = 30;

export function checkRateLimit(ipHash: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  let timestamps = hits.get(ipHash) ?? [];
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= MAX_HITS) {
    const oldestInWindow = timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000),
    };
  }

  timestamps.push(now);
  hits.set(ipHash, timestamps);

  return {
    allowed: true,
    remaining: MAX_HITS - timestamps.length,
    resetIn: Math.ceil(WINDOW_MS / 1000),
  };
}

export function resetRateLimits() {
  hits.clear();
}
