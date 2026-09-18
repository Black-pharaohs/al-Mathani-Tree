/**
 * السبع المثاني — Supabase Client & Architecture Integration Service
 * Architectural Decision: ADR-002 (Supabase Backend Infrastructure)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-initialized Supabase Clients
let supabasePublicClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  hasUrl: boolean;
  hasAnonKey: boolean;
  hasServiceKey: boolean;
  environment: string;
}

/**
 * Checks whether Supabase environment variables are currently configured.
 */
export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return {
    isConfigured: Boolean(url && (anonKey || serviceKey)),
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(anonKey),
    hasServiceKey: Boolean(serviceKey),
    environment: process.env.NODE_ENV || 'development'
  };
}

/**
 * Returns the public (anon) Supabase client, or null if not yet configured.
 * Follows the lazy initialization pattern to prevent crashes on startup.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!supabasePublicClient) {
    supabasePublicClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return supabasePublicClient;
}

/**
 * Returns the privileged admin (service_role) Supabase client, or null if not yet configured.
 * Used strictly in server-side operations (RLS bypass for background migrations and system jobs).
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return supabaseAdminClient;
}
