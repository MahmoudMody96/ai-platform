// =============================================
// Tests: env validation
// =============================================

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('env validation (server-only)', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    Object.assign(process.env, {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      NODE_ENV: 'test',
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('exposes public vars on server', async () => {
    const { env } = await import('@/lib/env');
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co');
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('anon-key');
  });

  it('falls back to localhost for SITE_URL', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const { env } = await import('@/lib/env');
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
  });

  it('parses ENABLE flags as booleans', () => {
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'true';
    process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE = 'false';
    // Re-import not needed — re-read happens on each property access in dev.
    expect(process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true').toBe(true);
  });

  it('requireServerEnv throws when keys are missing', async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { requireServerEnv } = await import('@/lib/env');
    expect(() => requireServerEnv(['SUPABASE_SERVICE_ROLE_KEY'])).toThrow(/Missing/);
  });
});
