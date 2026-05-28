// =============================================
// AI Platform - Supabase Helper Functions
// Common operations for users, profiles, and auth
// =============================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileRow, AuthUser } from './types';
import { Tables } from './types';

// ============================================================================
// Type Definitions
// ============================================================================

export type UserProfile = {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  plan: 'free' | 'pro' | 'team';
  created_at: string;
};

// Client type
type ClientType = SupabaseClient;

// ============================================================================
// User & Profile Helpers
// ============================================================================

/**
 * Format a Supabase user for display
 */
export function formatUser(user: AuthUser | null): { id: string; email: string; name: string } | null {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? '',
    name: user.email?.split('@')[0] ?? 'User',
  };
}

/**
 * Format a profile for display with initials and display name
 */
export function formatProfile(profile: ProfileRow | null) {
  if (!profile) return null;

  const displayName = profile.display_name ?? profile.username ?? 'User';
  const initials = displayName
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    id: profile.id,
    displayName,
    username: profile.username ?? '',
    avatarUrl: profile.avatar_url,
    initials,
    plan: profile.plan,
  };
}

/**
 * Get user profile by user ID
 */
export async function getProfile(
  supabase: ClientType,
  userId: string
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from(Tables.PROFILES)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as unknown as ProfileRow;
}

/**
 * Get profile by username
 */
export async function getProfileByUsername(
  supabase: ClientType,
  username: string
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from(Tables.PROFILES)
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    return null;
  }

  return data as unknown as ProfileRow;
}

/**
 * Create a new user profile
 */
export async function createProfile(
  supabase: ClientType,
  profileData: {
    user_id: string;
    username?: string;
    display_name?: string;
    avatar_url?: string;
  }
) {
  const { data, error } = await supabase
    .from(Tables.PROFILES)
    .insert({
      user_id: profileData.user_id,
      username: profileData.username ?? null,
      display_name: profileData.display_name ?? null,
      avatar_url: profileData.avatar_url ?? null,
      plan: 'free',
      metadata: {},
    })
    .select()
    .single();

  if (error) {
    return { success: false, profile: null, error: error.message };
  }

  return { success: true, profile: data as unknown as ProfileRow, error: null };
}

/**
 * Update user profile
 */
export async function updateProfile(
  supabase: ClientType,
  userId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.PROFILES)
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    return { success: false, profile: null, error: error.message };
  }

  return { success: true, profile: data as unknown as ProfileRow, error: null };
}

/**
 * Update user's plan
 */
export async function updateUserPlan(
  supabase: ClientType,
  userId: string,
  plan: 'free' | 'pro' | 'team'
) {
  const { error } = await supabase
    .from(Tables.PROFILES)
    .update({ plan })
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================================
// Auth Helpers
// ============================================================================

/**
 * Get current authenticated user from session
 */
export async function getCurrentUser(
  supabase: ClientType
): Promise<AuthUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user as unknown as AuthUser;
}

/**
 * Get current session
 */
export async function getSession(
  supabase: ClientType
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  };
}

/**
 * Sign up with email and password
 */
export async function signUp(
  supabase: ClientType,
  email: string,
  password: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    return { success: false, user: null, error: error.message };
  }

  return { success: true, user: data.user as unknown as AuthUser | null, error: null };
}

/**
 * Sign in with email and password
 */
export async function signIn(
  supabase: ClientType,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, user: null, error: error.message };
  }

  return { success: true, user: data.user as unknown as AuthUser | null, error: null };
}

/**
 * Sign out
 */
export async function signOut(
  supabase: ClientType
) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Reset password
 */
export async function resetPassword(
  supabase: ClientType,
  email: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Update password
 */
export async function updatePassword(
  supabase: ClientType,
  newPassword: string
) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================================
// Upload Helpers
// ============================================================================

/**
 * Upload avatar image
 */
export async function uploadAvatar(
  supabase: ClientType,
  userId: string,
  file: File,
  bucket: string = 'avatars'
) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return { success: false, url: null, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { success: true, url: urlData.publicUrl, error: null };
}

/**
 * Delete avatar image
 */
export async function deleteAvatar(
  supabase: ClientType,
  userId: string,
  bucket: string = 'avatars'
) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([`${userId}`]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if username is available
 */
export async function isUsernameAvailable(
  supabase: ClientType,
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  let query = supabase
    .from(Tables.PROFILES)
    .select('id')
    .eq('username', username);

  if (excludeUserId) {
    query = query.neq('user_id', excludeUserId);
  }

  const { data, error } = await query.single();
  return !!error || !data;
}

/**
 * Get subscription info for a user
 */
export async function getUserSubscription(
  supabase: ClientType,
  userId: string
) {
  const { data, error } = await supabase
    .from(Tables.SUBSCRIPTIONS)
    .select('plan, status, current_period_end')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return null;
  }

  return {
    plan: data.plan as 'free' | 'pro' | 'team',
    status: data.status as 'active' | 'canceled' | 'past_due' | 'trialing' | null,
    currentPeriodEnd: data.current_period_end as string | null,
  };
}
