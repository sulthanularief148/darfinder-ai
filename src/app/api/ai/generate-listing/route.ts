import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAIProvider } from '@/lib/ai/provider';

const GenerateListingSchema = z.object({
  type: z.enum(['apartment', 'villa', 'townhouse']),
  purpose: z.enum(['rent', 'sale']),
  bedrooms: z.number().int().min(0).max(10),
  bathrooms: z.number().int().min(1).max(10),
  size_sqft: z.number().min(100).max(100000),
  area: z.string().min(1),
  price_aed: z.number().min(0),
  furnished: z.boolean().optional(),
  pet_friendly: z.boolean().optional(),
  near_metro: z.boolean().optional(),
  parking: z.number().int().min(0).max(10).optional(),
  amenities: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = GenerateListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const ai = await getAIProvider();
    const content = await ai.generateListing(parsed.data);

    return NextResponse.json(content);
  } catch {
    return NextResponse.json(
      { error: 'AI generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
