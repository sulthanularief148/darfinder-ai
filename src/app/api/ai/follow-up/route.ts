import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAIProvider } from '@/lib/ai/provider';

const FollowUpSchema = z.object({
  lead_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = FollowUpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Fetch lead + property (RLS ensures ownership)
  const { data: lead } = await supabase
    .from('leads')
    .select('*, properties(*)')
    .eq('id', parsed.data.lead_id)
    .single();

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  try {
    const ai = await getAIProvider();
    const property = (lead as any).properties;
    const message = await ai.generateFollowUp(
      {
        name: (lead as any).name,
        email: (lead as any).email,
        message: (lead as any).message,
        preferred_contact_time: (lead as any).preferred_contact_time,
        status: (lead as any).status,
        language: (lead as any).language,
      },
      {
        title: property?.title,
        type: property?.type,
        area: property?.area,
        price_aed: property?.price_aed,
        bedrooms: property?.bedrooms,
        furnished: property?.furnished,
      }
    );

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: 'AI follow-up generation failed' }, { status: 500 });
  }
}
