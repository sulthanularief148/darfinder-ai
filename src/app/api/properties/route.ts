import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { PropertyFilterSchema } from '@/lib/validators/property';
import { buildPropertyQuery } from '@/lib/queries/properties';

const CreatePropertySchema = z.object({
  title: z.string().min(5).max(200),
  type: z.enum(['apartment', 'villa', 'townhouse']),
  purpose: z.enum(['rent', 'sale']),
  price_aed: z.number().min(0),
  bedrooms: z.number().int().min(0).max(10),
  bathrooms: z.number().int().min(1).max(10),
  size_sqft: z.number().min(100).max(100000),
  area: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  furnished: z.boolean().optional().default(false),
  pet_friendly: z.boolean().optional().default(false),
  near_metro: z.boolean().optional().default(false),
  parking: z.number().int().min(0).max(10).optional().default(0),
  amenities: z.array(z.string()).optional().default([]),
  description_en: z.string().min(10),
  description_ar: z.string().optional().nullable(),
  photos: z.array(z.string()).optional().default([]),
});

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

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = CreatePropertySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid property data', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { data, error } = await (supabase.from('properties') as any).insert({
    ...parsed.data,
    agent_id: user.id,
    status: 'active',
  }).select().single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
