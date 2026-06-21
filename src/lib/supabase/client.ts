'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let cachedClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (cachedClient) return cachedClient;
  cachedClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cachedClient;
}

async function restFetch(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data.msg || data.error_description || data.error || `HTTP ${res.status}`;
    console.error(`[Supabase] ${res.status} ${url}:`, msg, text.slice(0, 300));
    return { data: null, error: new Error(msg) };
  }
  return { data, error: null };
}

export async function restSignUp(email: string, password: string, name: string) {
  const result = await restFetch(`${supabaseUrl}/auth/v1/signup`, { email, password, data: { name } });
  if (result.data && !result.error) {
    const client = createClient();
    const { access_token, refresh_token } = result.data;
    if (access_token) {
      await client.auth.setSession({ access_token, refresh_token });
    }
  }
  return result;
}

export async function restSignIn(email: string, password: string) {
  const result = await restFetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, { email, password });
  if (result.data && !result.error) {
    const client = createClient();
    const { access_token, refresh_token } = result.data;
    if (access_token) {
      await client.auth.setSession({ access_token, refresh_token });
    }
  }
  return result;
}
