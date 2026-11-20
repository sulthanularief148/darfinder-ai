import { updateSession } from '@/lib/supabase/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Run middleware on all routes except static files and API health
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|placeholder/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
