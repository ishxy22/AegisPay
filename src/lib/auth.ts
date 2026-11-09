// ==============================================================================
// AEGISPAY AUTHENTICATION & SESSION MANAGEMENT
// Powered by Supabase Auth with secure HTTP-only cookie persistence
// ==============================================================================

import { cookies } from 'next/headers';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserRole } from '@/types';
import { env } from './env';

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId?: string;
  expiresAt: number;
}

const COOKIE_NAME = 'aegispay_session';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function getSupabase(): SupabaseClient | null {
  if (!env.supabase.url || (!env.supabase.serviceRoleKey && !env.supabase.anonKey)) {
    return null;
  }
  return createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey || env.supabase.anonKey,
    { auth: { persistSession: false } }
  );
}

/**
 * Persist an active session in an HTTP-only secure cookie
 */
export async function setSessionCookie(user: {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId?: string;
}): Promise<UserSession> {
  const session: UserSession = {
    userId: user.userId,
    email: user.email.toLowerCase(),
    fullName: user.fullName,
    role: user.role,
    organizationId: user.organizationId,
    expiresAt: Date.now() + COOKIE_MAX_AGE * 1000,
  };

  const cookieStore = await cookies();
  const serialized = Buffer.from(JSON.stringify(session)).toString('base64');

  cookieStore.set(COOKIE_NAME, serialized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });

  return session;
}

/**
 * Retrieve and validate the current user session from cookies
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;

    const raw = Buffer.from(cookie.value, 'base64').toString('utf-8');
    const session: UserSession = JSON.parse(raw);

    if (!session.userId || !session.expiresAt || session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Terminate the active session and remove the cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Register a new user in Supabase Auth & create a linked profile record
 */
export async function signUpUser(params: {
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
}): Promise<{ success: boolean; session?: UserSession; error?: string }> {
  const email = params.email.trim().toLowerCase();
  const password = params.password || 'Password123!';
  const supabase = getSupabase();

  if (!supabase) {
    // In-memory demo fallback session if Supabase is offline
    const session = await setSessionCookie({
      userId: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email,
      fullName: params.fullName,
      role: params.role,
    });
    return { success: true, session };
  }

  try {
    // Use admin create user with auto-confirmation if service role key is present
    let userId: string;
    if (env.supabase.serviceRoleKey) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: params.fullName, role: params.role },
      });

      if (error) {
        // If user already exists, try signing in
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return signInUser({ email, password });
        }
        return { success: false, error: error.message };
      }
      userId = data.user.id;
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: params.fullName, role: params.role } },
      });
      if (error) return { success: false, error: error.message };
      if (!data.user?.id) return { success: false, error: 'Registration failed to return user ID' };
      userId = data.user.id;
    }

    // Upsert linked profile row
    await supabase.from('profiles').upsert({
      id: userId,
      email,
      full_name: params.fullName,
      role: params.role,
      updated_at: new Date().toISOString(),
    });

    const session = await setSessionCookie({
      userId,
      email,
      fullName: params.fullName,
      role: params.role,
    });

    return { success: true, session };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' };
  }
}

/**
 * Authenticate an existing user via Supabase Auth
 */
export async function signInUser(params: {
  email: string;
  password?: string;
  roleOverride?: UserRole;
}): Promise<{ success: boolean; session?: UserSession; error?: string }> {
  const email = params.email.trim().toLowerCase();
  const password = params.password || 'Password123!';
  const supabase = getSupabase();

  if (!supabase) {
    // Demo fallback
    const fullName = email === 'fuzail@actenx.com'
      ? 'Fuzail (Lead Architect)'
      : email.includes('ishita')
      ? 'Ishita (Frontend Lead)'
      : email.split('@')[0];

    const session = await setSessionCookie({
      userId: `usr_demo_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      fullName,
      role: params.roleOverride || 'service_provider',
    });
    return { success: true, session };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Invalid email or password' };
    }

    // Fetch profile
    let role: UserRole = params.roleOverride || 'service_provider';
    let fullName = authData.user.user_metadata?.full_name || email.split('@')[0];

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profile) {
      role = (profile.role as UserRole) || role;
      fullName = profile.full_name || fullName;
    } else {
      // Create missing profile
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
      });
    }

    const session = await setSessionCookie({
      userId: authData.user.id,
      email,
      fullName,
      role,
      organizationId: profile?.organization_id,
    });

    return { success: true, session };
  } catch (err: any) {
    return { success: false, error: err.message || 'Sign in failed' };
  }
}

/**
 * Validates whether a user session has permission to access a project
 */
export function canUserAccessProject(
  project: {
    client_id?: string;
    client_email?: string;
    provider_id?: string;
    provider_email?: string;
  },
  session: UserSession
): boolean {
  if (session.role === 'admin') return true;
  if (project.client_id === session.userId || project.provider_id === session.userId) return true;
  if (project.client_email && project.client_email.toLowerCase() === session.email.toLowerCase()) return true;
  if (project.provider_email && project.provider_email.toLowerCase() === session.email.toLowerCase()) return true;
  return false;
}
