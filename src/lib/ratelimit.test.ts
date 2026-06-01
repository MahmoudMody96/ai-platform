// =============================================
// Tests: ratelimit.ts in-memory fallback
// =============================================

import { describe, it, expect } from 'vitest';

// Force the "no Upstash" path by clearing the env vars before import.
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

const { rateLimiters, getClientIdentifier, _internals } = await import('@/lib/ratelimit');
const { parseWindow } = _internals;

function makeReq(ip: string): Request {
  return new Request('http://localhost', {
    headers: { 'x-forwarded-for': ip },
  });
}

describe('rateLimiters (in-memory fallback)', () => {
  it('allows requests under the limit', async () => {
    const r = await rateLimiters.newsletter.limit('ip-allow-1');
    expect(r.success).toBe(true);
    expect(r.limit).toBe(1);
  });

  it('blocks requests above the limit', async () => {
    const r1 = await rateLimiters.newsletter.limit('ip-block-1');
    expect(r1.success).toBe(true);
    const r2 = await rateLimiters.newsletter.limit('ip-block-1');
    expect(r2.success).toBe(false);
  });

  it('uses x-forwarded-for first IP', () => {
    const req = makeReq('1.2.3.4, 10.0.0.1');
    expect(getClientIdentifier(req)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip', () => {
    const req = new Request('http://localhost', { headers: { 'x-real-ip': '5.6.7.8' } });
    expect(getClientIdentifier(req)).toBe('5.6.7.8');
  });

  it('falls back to "anonymous" if no IP headers', () => {
    const req = new Request('http://localhost');
    expect(getClientIdentifier(req)).toBe('anonymous');
  });

  it('parseWindow handles common units', () => {
    expect(parseWindow('5 s')).toBe(5_000);
    expect(parseWindow('1 m')).toBe(60_000);
    expect(parseWindow('2 h')).toBe(7_200_000);
  });
});
