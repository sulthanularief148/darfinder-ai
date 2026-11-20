import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Lead } from '@/types';

export async function GET() {
  const supabase = await createClient();

  // Auth check — only agents can see leads
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // RLS ensures agent only sees their own leads
  const { data, error } = await supabase
    .from('leads')
    .select('*, properties(id, title, area, type, purpose, price_aed)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }

  return NextResponse.json({ leads: data as Lead[] });
}
