import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import type { SearchFilters } from '@/types';

type Client = SupabaseClient<Database>;

export async function logSearch(
  supabase: Client,
  queryText: string,
  filters: SearchFilters,
  resultCount: number,
  ipHash: string | null
) {
  await (supabase.from('search_logs') as any).insert({
    query_text: queryText,
    parsed_filters: filters as unknown as Record<string, unknown>,
    result_count: resultCount,
    ip_hash: ipHash,
  });
}
