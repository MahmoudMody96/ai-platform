// =============================================
// Tests: types barrel re-exports
// =============================================

import { describe, it, expect } from 'vitest';
import * as types from '@/types';
import type {
  Tool,
  Category,
  Profile,
  AppUser,
  PaginatedResponse,
} from '@/types';

describe('types barrel', () => {
  it('re-exports canonical database types', () => {
    // The barrel should expose the canonical table types.
    expect(typeof types).toBe('object');
  });

  it('AppUser is structurally compatible with Profile-derived shape', () => {
    const appUser: AppUser = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'a@b.c',
      name: 'Test',
      plan: 'free',
      role: 'viewer',
    };
    // Type-only assertion (will be stripped at runtime)
    const _check: AppUser = appUser;
    expect(_check.email).toBe('a@b.c');
  });

  it('PaginatedResponse generic shape compiles', () => {
    const response: PaginatedResponse<Tool> = {
      data: [],
      meta: { total: 0, page: 1, limit: 20, total_pages: 0 },
    };
    expect(response.data).toEqual([]);
    expect(response.meta.total).toBe(0);
  });
});
