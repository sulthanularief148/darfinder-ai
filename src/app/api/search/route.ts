import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { getAIProvider } from '@/lib/ai/provider';
import { checkRateLimit } from '@/lib/rate-limit';
import { logSearch } from '@/lib/queries/search-logs';
import { hashIP } from '@/lib/utils';
import type { Property, SearchFilters } from '@/types';

const SearchRequestSchema = z.object({
  query: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ipHash = await hashIP(ip);
  const rateCheck = checkRateLimit(ipHash);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded. Maximum 30 searches per hour.',
        resetIn: rateCheck.resetIn,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.resetIn),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // Validate input
  const body = await request.json().catch(() => null);
  const parsed = SearchRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { query } = parsed.data;

  try {
    // Step 1: AI parses natural language → structured filters
    const ai = await getAIProvider();
    const { filters, reasoning } = await ai.parseSearchQuery(query);

    // Step 2: Build Supabase query from validated filters (AI NEVER writes SQL)
    const supabase = await createClient();
    let dbQuery = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    if (filters.purpose) {
      dbQuery = dbQuery.eq('purpose', filters.purpose);
    }
    if (filters.propertyType) {
      dbQuery = dbQuery.eq('type', filters.propertyType);
    }
    if (filters.areas?.length) {
      dbQuery = dbQuery.in('area', filters.areas);
    }
    if (filters.minBedrooms !== undefined) {
      dbQuery = dbQuery.gte('bedrooms', filters.minBedrooms);
    }
    if (filters.maxBedrooms !== undefined) {
      dbQuery = dbQuery.lte('bedrooms', filters.maxBedrooms);
    }
    if (filters.minPrice !== undefined) {
      dbQuery = dbQuery.gte('price_aed', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      dbQuery = dbQuery.lte('price_aed', filters.maxPrice);
    }
    if (filters.furnished !== undefined) {
      dbQuery = dbQuery.eq('furnished', filters.furnished);
    }
    if (filters.petFriendly !== undefined) {
      dbQuery = dbQuery.eq('pet_friendly', filters.petFriendly);
    }
    if (filters.nearMetro !== undefined) {
      dbQuery = dbQuery.eq('near_metro', filters.nearMetro);
    }

    dbQuery = dbQuery.order('created_at', { ascending: false }).limit(20);

    const { data: properties, error: dbError, count } = await dbQuery;

    if (dbError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    let results = (properties ?? []) as Property[];

    // Step 3: If there's a freeTextIntent and we have results, re-rank with pgvector
    if (filters.freeTextIntent && results.length > 1) {
      try {
        const embedding = await ai.generateEmbedding(filters.freeTextIntent);
        if (embedding.length > 0) {
          const serviceClient = await createServiceClient();
          const propertyIds = results.map((p) => p.id);

          const { data: ranked } = await (serviceClient.rpc as Function)('match_properties', {
            query_embedding: JSON.stringify(embedding),
            match_count: results.length,
            property_ids: propertyIds,
          });

          const rankedArr = ranked as { id: string; similarity: number }[] | null;
          if (rankedArr?.length) {
            const rankMap = new Map(
              rankedArr.map((r, i) => [r.id, i])
            );
            results.sort((a, b) => {
              const aRank = rankMap.get(a.id) ?? 999;
              const bRank = rankMap.get(b.id) ?? 999;
              return aRank - bRank;
            });
          }
        }
      } catch {
        // pgvector re-ranking is best-effort
      }
    }

    // Step 4: Log the search (filters only, no personal data)
    try {
      const serviceClient = await createServiceClient();
      await logSearch(serviceClient, query, filters, results.length, ipHash);
    } catch {
      // Logging is best-effort
    }

    return NextResponse.json({
      properties: results,
      total: count ?? results.length,
      filters,
      reasoning,
      rateLimit: {
        remaining: rateCheck.remaining,
      },
    });
  } catch {
    // Fallback: keyword search if AI completely fails
    const supabase = await createClient();
    const term = `%${query}%`;
    const { data, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .or(`title.ilike.${term},description_en.ilike.${term},area.ilike.${term}`)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      properties: data ?? [],
      total: count ?? 0,
      filters: { freeTextIntent: query } as SearchFilters,
      reasoning: 'Keyword search fallback — AI was unavailable',
      rateLimit: { remaining: rateCheck.remaining },
    });
  }
}
