// =============================================
// AI Platform - Rate Limiting
// =============================================
//
// Wraps Upstash Ratelimit with safe fallbacks:
//   - In production, when UPSTASH_* is configured, it enforces real limits.
//   - In dev / when Upstash is missing, the calls are no-ops
//     (so the app keeps working without Redis).
//
// Usage:
//   const { success, limit, remaining, reset } = await rateLimiters.auth.limit(ip);
//   if (!success) return new Response('Too Many Requests', { status: 429 });
// =============================================

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { hasUpstash } from './env';

// ============================================================================
// Redis client (lazy, only created when needed)
// ============================================================================

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!hasUpstash()) return null;
  if (_redis) return _redis;
  _redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return _redis;
}

// ============================================================================
// In-memory fallback (DEV ONLY)
// ============================================================================
//
// Per-process map; resets on restart. Good enough for local dev so the
// developer experience doesn't break if Upstash isn't configured.

interface MemoryWindow {
  count: number;
  resetAt: number;
}
const memoryStore = new Map<string, MemoryWindow>();

function memoryLimit(key: string, limit: number, windowMs: number): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { success: false, limit, remaining: 0, reset: entry.resetAt };
  }
  return { success: true, limit, remaining: limit - entry.count, reset: entry.resetAt };
}

// ============================================================================
// Public API
// ============================================================================

function makeLimiter(name: string, limit: number, window: string) {
  const windowMs = parseWindow(window);
  return {
    name,
    async limit(identifier: string) {
      const redis = getRedis();
      if (redis) {
        const rl = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(limit, window as `${number} ${'s' | 'm' | 'h'}`),
          analytics: true,
          prefix: `aip:${name}`,
        });
        return rl.limit(identifier);
      }
      // In-memory fallback
      return memoryLimit(`${name}:${identifier}`, limit, windowMs);
    },
  };
}

function parseWindow(w: string): number {
  // "1 m" -> 60_000, "5 s" -> 5_000
  const [n, unit] = w.split(' ');
  const num = parseInt(n, 10);
  if (unit === 's') return num * 1_000;
  if (unit === 'm') return num * 60_000;
  if (unit === 'h') return num * 60 * 60_000;
  if (unit === 'd') return num * 24 * 60 * 60_000;
  return num * 1_000;
}

// Exposed for unit tests
export const _internals = { parseWindow };

// Public limiters (in requests / window)
export const rateLimiters = {
  // Edge proxy — 100 req / min per IP
  proxy: makeLimiter('proxy', 100, '1 m'),

  // API routes — 60 req / min per IP
  api: makeLimiter('api', 60, '1 m'),

  // Auth flows — 5 attempts / 15 min per IP
  auth: makeLimiter('auth', 5, '15 m'),

  // Reviews — 3 per hour per user
  reviews: makeLimiter('reviews', 3, '1 h'),

  // Newsletter subscribe — 1 per minute per IP
  newsletter: makeLimiter('newsletter', 1, '1 m'),

  // Admin / sensitive routes — 30 / min per user
  admin: makeLimiter('admin', 30, '1 m'),
} as const;

/**
 * Helper to extract a stable identifier from a Next.js request.
 * Prefers the first IP in `x-forwarded-for`, falling back to `x-real-ip`,
 * then a literal 'anonymous' (which means all anonymous share a bucket —
 * acceptable for soft limits).
 */
export function getClientIdentifier(request: Request | { headers: Headers }): string {
  const headers = request.headers;
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  return headers.get('x-real-ip') ?? 'anonymous';
}

// Convenience: re-export the same shape Upstash returns
export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};
