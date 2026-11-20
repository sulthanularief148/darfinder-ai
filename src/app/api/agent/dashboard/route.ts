import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parallel queries for dashboard stats
  const [
    { count: totalListings },
    { count: activeListings },
    { data: leads },
    { data: recentSearches },
  ] = await Promise.all([
    supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', user.id),
    supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', user.id)
      .eq('status', 'active'),
    supabase
      .from('leads')
      .select('id, status, created_at')
      .eq('agent_id', user.id),
    supabase
      .from('search_logs')
      .select('query_text, parsed_filters, result_count, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const leadsList = (leads ?? []) as { id: string; status: string; created_at: string }[];
  const searchList = (recentSearches ?? []) as {
    query_text: string;
    parsed_filters: Record<string, unknown>;
    result_count: number;
    created_at: string;
  }[];

  // Lead status breakdown
  const leadStats = {
    total: leadsList.length,
    new: leadsList.filter((l) => l.status === 'new').length,
    contacted: leadsList.filter((l) => l.status === 'contacted').length,
    viewing_booked: leadsList.filter((l) => l.status === 'viewing_booked').length,
    closed: leadsList.filter((l) => l.status === 'closed').length,
    lost: leadsList.filter((l) => l.status === 'lost').length,
  };

  // Most searched areas
  const areaCounts: Record<string, number> = {};
  for (const s of searchList) {
    const filters = s.parsed_filters;
    const areas = (filters as any)?.areas;
    if (Array.isArray(areas)) {
      for (const area of areas) {
        areaCounts[area] = (areaCounts[area] || 0) + 1;
      }
    }
  }
  const topAreas = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([area, count]) => ({ area, count }));

  // Zero-result searches
  const zeroResultSearches = searchList
    .filter((s) => s.result_count === 0)
    .slice(0, 10)
    .map((s) => s.query_text);

  return NextResponse.json({
    totalListings: totalListings ?? 0,
    activeListings: activeListings ?? 0,
    leadStats,
    topAreas,
    zeroResultSearches,
    recentSearchCount: searchList.length,
  });
}
