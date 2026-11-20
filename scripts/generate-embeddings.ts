if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class FakeWebSocket { close() {} };
}

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;
const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

if (!supabaseUrl || !serviceKey || !geminiKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

function buildEmbeddingText(property: Record<string, unknown>): string {
  const parts = [
    property.title,
    `${property.type} for ${property.purpose}`,
    `${property.bedrooms} bedrooms ${property.bathrooms} bathrooms`,
    `${property.size_sqft} sqft`,
    property.area,
    property.furnished ? 'furnished' : 'unfurnished',
    property.pet_friendly ? 'pet friendly' : '',
    property.near_metro ? 'near metro' : '',
    property.description_en,
    ...(Array.isArray(property.amenities) ? property.amenities : []),
  ];
  return parts.filter(Boolean).join('. ');
}

async function embedText(text: string): Promise<number[] | null> {
  const url = `https://generativelanguage.googleapis.com/v1/models/${embeddingModel}:embedContent?key=${geminiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${embeddingModel}`,
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Embedding API error: ${err}`);
    return null;
  }

  const data = await res.json();
  return data.embedding?.values || null;
}

async function main() {
  console.log(`Using embedding model: ${embeddingModel}`);
  console.log('Fetching properties...');
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active');

  if (error || !properties) {
    console.error('Failed to fetch properties:', error);
    process.exit(1);
  }

  console.log(`Found ${properties.length} properties. Generating embeddings...`);

  let created = 0;
  let skipped = 0;

  for (const property of properties) {
    const text = buildEmbeddingText(property);
    const contentHash = createHash('sha256').update(text).digest('hex');

    const { data: existing } = await supabase
      .from('property_embeddings')
      .select('content_hash')
      .eq('property_id', property.id)
      .single();

    if (existing?.content_hash === contentHash) {
      skipped++;
      continue;
    }

    const embedding = await embedText(text);
    if (!embedding) {
      console.warn(`\nNo embedding returned for ${property.id}`);
      continue;
    }

    const { error: upsertError } = await supabase
      .from('property_embeddings')
      .upsert(
        {
          property_id: property.id,
          embedding: JSON.stringify(embedding),
          content_hash: contentHash,
        },
        { onConflict: 'property_id' }
      );

    if (upsertError) {
      console.error(`\nFailed to upsert embedding for ${property.id}:`, upsertError.message);
    } else {
      created++;
      process.stdout.write(`\r  Embedded ${created}/${properties.length - skipped}...`);
    }

    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\nDone! Created: ${created}, Skipped (unchanged): ${skipped}`);
}

main();
