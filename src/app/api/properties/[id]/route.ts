import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { buildSinglePropertyQuery } from '@/lib/queries/properties';

const ParamsSchema = z.object({ id: z.string().uuid() });

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = ParamsSchema.safeParse({ id });

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await buildSinglePropertyQuery(supabase, parsed.data.id);

  if (error || !data) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
