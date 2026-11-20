import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PropertyFilterSchema } from '@/lib/validators/property';
import { buildPropertyQuery } from '@/lib/queries/properties';

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = PropertyFilterSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid filters', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error, count } = await buildPropertyQuery(supabase, parsed.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    properties: data ?? [],
    total: count ?? 0,
    page: parsed.data.page,
    limit: parsed.data.limit,
    totalPages: Math.ceil((count ?? 0) / parsed.data.limit),
  });
}
