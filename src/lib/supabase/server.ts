import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

// Server-side Supabase client — used in Server Components and Route Handlers.
// It reads and writes auth cookies through Next.js cookie helpers.
export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can fail in Server Components (read-only cookies).
            // The middleware handles the refresh, so this is safe to ignore.
          }
        },
      },
    }
  );
}

// Service-role client bypasses RLS — only use server-side for
// operations that need elevated access (embedding writes, search logs).
export async function createServiceClient() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
