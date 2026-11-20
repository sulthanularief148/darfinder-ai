import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import type { PropertyFilter } from '@/lib/validators/property';

type Client = SupabaseClient<Database>;

export function buildPropertyQuery(supabase: Client, filters: PropertyFilter) {
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'active');

  if (filters.purpose) {
    query = query.eq('purpose', filters.purpose);
  }
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  if (filters.area) {
    query = query.eq('area', filters.area);
  }
  if (filters.bedrooms_min !== undefined) {
    query = query.gte('bedrooms', filters.bedrooms_min);
  }
  if (filters.bedrooms_max !== undefined) {
    query = query.lte('bedrooms', filters.bedrooms_max);
  }
  if (filters.price_min !== undefined) {
    query = query.gte('price_aed', filters.price_min);
  }
  if (filters.price_max !== undefined) {
    query = query.lte('price_aed', filters.price_max);
  }
  if (filters.furnished !== undefined) {
    query = query.eq('furnished', filters.furnished);
  }
  if (filters.pet_friendly !== undefined) {
    query = query.eq('pet_friendly', filters.pet_friendly);
  }
  if (filters.near_metro !== undefined) {
    query = query.eq('near_metro', filters.near_metro);
  }

  if (filters.q) {
    const term = `%${filters.q}%`;
    query = query.or(`title.ilike.${term},description_en.ilike.${term},area.ilike.${term}`);
  }

  switch (filters.sort) {
    case 'price_asc':
      query = query.order('price_aed', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price_aed', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const from = (filters.page - 1) * filters.limit;
  const to = from + filters.limit - 1;
  query = query.range(from, to);

  return query;
}

export function buildSinglePropertyQuery(supabase: Client, id: string) {
  return supabase
    .from('properties')
    .select('*, agents(full_name, agency_name, avatar_url)')
    .eq('id', id)
    .eq('status', 'active')
    .single();
}
