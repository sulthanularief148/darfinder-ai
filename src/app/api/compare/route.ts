import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAIProvider } from '@/lib/ai/provider';
import type { Property } from '@/types';

const CompareRequestSchema = z.object({
  ids: z.array(z.string().uuid()).min(2).max(3),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = CompareRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Send 2-3 property UUIDs', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { ids } = parsed.data;

  const supabase = await createClient();
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .in('id', ids)
    .eq('status', 'active');

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const props = (properties ?? []) as Property[];

  if (props.length < 2) {
    return NextResponse.json(
      { error: 'Could not find all requested properties' },
      { status: 404 }
    );
  }

  try {
    const ai = await getAIProvider();
    const comparison = await ai.compareProperties(
      props.map((p) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        purpose: p.purpose,
        price_aed: p.price_aed,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        size_sqft: p.size_sqft,
        area: p.area,
        furnished: p.furnished,
        pet_friendly: p.pet_friendly,
        near_metro: p.near_metro,
        amenities: p.amenities,
        description_en: p.description_en,
      }))
    );

    return NextResponse.json({ properties: props, comparison });
  } catch {
    return NextResponse.json({
      properties: props,
      comparison: null,
      error: 'AI comparison unavailable',
    });
  }
}
