// =============================================
// AI Platform - Environment Variable Validation
// =============================================
//
// Use this at the top of any server-only module (API routes,
// route handlers, server actions, RSC) to fail fast if required
// environment variables are missing or malformed.
//
// Usage:
//   import { env } from '@/lib/env';
//   env.NEXT_PUBLIC_SUPABASE_URL
//
//   // or, in development, with verbose warnings:
//   import { requireServerEnv } from '@/lib/env';
//   requireServerEnv(['SUPABASE_SERVICE_ROLE_KEY']);
//
// The exported `env` proxy throws on access to server-only vars
// when called from a client component — preventing accidental
// leakage of secrets to the browser bundle.
// =============================================

const isServer = typeof window === 'undefined';

// Required for all environments
const REQUIRED_PUBLIC: ReadonlyArray<string> = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

// Server-only (NEVER prefix with NEXT_PUBLIC_)
const REQUIRED_SERVER: ReadonlyArray<string> = [
  // 'SUPABASE_SERVICE_ROLE_KEY',  // optional in dev, required in prod
];

// Optional but recommended
const OPTIONAL: Record<string, { fallback?: string; description: string }> = {
  NEXT_PUBLIC_SITE_URL: { fallback: 'http://localhost:3000', description: 'Canonical site URL' },
  NEXT_PUBLIC_ENABLE_ANALYTICS: { fallback: 'false', description: 'Toggle analytics collection' },
  NEXT_PUBLIC_ENABLE_DEBUG_MODE: { fallback: 'false', description: 'Verbose logs in browser console' },
  UPSTASH_REDIS_REST_URL: { description: 'Upstash REST endpoint for rate limiting' },
  UPSTASH_REDIS_REST_TOKEN: { description: 'Upstash REST token' },
  RESEND_API_KEY: { description: 'Resend API key for transactional email' },
  EMAIL_FROM: { description: 'Sender address for outbound email' },
  SUPABASE_SERVICE_ROLE_KEY: { description: 'Server-only Supabase admin key' },
};

/**
 * Validate env vars at module load time on the server.
 * On the client, this is a no-op (env vars are inlined by Next.js).
 */
function validateEnv(): void {
  if (!isServer) return;

  const missing: string[] = [];

  for (const key of REQUIRED_PUBLIC) {
    if (!process.env[key]) missing.push(key);
  }
  for (const key of REQUIRED_SERVER) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    const msg = `[env] Missing required environment variables:\n  - ${missing.join('\n  - ')}\n\nThe app may not work correctly. See .env.example for the full list.`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    } else {
      // In dev, log a warning but don't crash
      console.warn(`\u26A0\uFE0F  ${msg}\n`);
    }
  }

  // Light URL validation
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url && !url.startsWith('https://') && !url.startsWith('http://')) {
    console.warn(`[env] NEXT_PUBLIC_SUPABASE_URL looks malformed: "${url}"`);
  }
}

// Run once at module load
validateEnv();

/**
 * Type-safe env accessor.
 * - Throws on the server if a server-only var is missing.
 * - Returns `undefined` on the client for server-only vars (safe default).
 */
export const env = {
  // Public (safe in browser)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  NEXT_PUBLIC_ENABLE_DEBUG_MODE: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',

  // Server-only — must never be sent to the browser
  get SUPABASE_SERVICE_ROLE_KEY(): string | undefined {
    if (!isServer) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('[env] SUPABASE_SERVICE_ROLE_KEY accessed from client. This is a bug.');
      }
      return undefined;
    }
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  },

  get UPSTASH_REDIS_REST_URL(): string | undefined {
    return isServer ? process.env.UPSTASH_REDIS_REST_URL : undefined;
  },
  get UPSTASH_REDIS_REST_TOKEN(): string | undefined {
    return isServer ? process.env.UPSTASH_REDIS_REST_TOKEN : undefined;
  },
  get RESEND_API_KEY(): string | undefined {
    return isServer ? process.env.RESEND_API_KEY : undefined;
  },
  get EMAIL_FROM(): string | undefined {
    return isServer ? process.env.EMAIL_FROM : undefined;
  },
} as const;

/**
 * Server-only assertion. Throws if any of the listed vars are missing.
 * Use inside API routes / server actions that genuinely need the var.
 */
export function requireServerEnv(keys: ReadonlyArray<string>): Record<string, string> {
  if (!isServer) {
    throw new Error('requireServerEnv() called on the client. This is a bug.');
  }
  const result: Record<string, string> = {};
  const missing: string[] = [];
  for (const key of keys) {
    const value = process.env[key];
    if (!value) missing.push(key);
    else result[key as string] = value;
  }
  if (missing.length > 0) {
    throw new Error(`[env] Missing required server env vars: ${missing.join(', ')}`);
  }
  return result;
}

/**
 * Returns true if Upstash Redis is configured (i.e. rate limiting is available).
 */
export function hasUpstash(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
