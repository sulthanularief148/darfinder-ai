import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { EnquirySchema } from '@/lib/validators/enquiry';
import type { Property } from '@/types';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = EnquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid enquiry', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { property_id, name, email, phone, message, preferred_contact_time } = parsed.data;

  // Fetch property to get agent_id
  const supabase = await createClient();
  const { data: property } = await supabase
    .from('properties')
    .select('id, agent_id')
    .eq('id', property_id)
    .eq('status', 'active')
    .single();

  const prop = property as Property | null;

  if (!prop) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  // Insert lead using service client (bypasses RLS since public users aren't authenticated)
  const serviceClient = await createServiceClient();
  const { error } = await (serviceClient.from('leads') as any).insert({
    property_id: prop.id,
    agent_id: prop.agent_id,
    name,
    email,
    phone,
    message: message || null,
    preferred_contact_time: preferred_contact_time || null,
    status: 'new',
    language: 'en',
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Enquiry submitted successfully' });
}
