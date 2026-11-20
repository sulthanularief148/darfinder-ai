import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UpdateLeadSchema } from '@/lib/validators/lead';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = UpdateLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid update', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // RLS ensures agent can only update their own leads
  const { data, error } = await (supabase.from('leads') as any)
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Lead not found or not yours' }, { status: 404 });
  }

  return NextResponse.json({ lead: data });
}
