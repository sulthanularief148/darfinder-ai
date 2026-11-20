'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/search-bar';
import { FilterBar } from '@/components/search/filter-bar';
import { SearchResults } from '@/components/search/search-results';
import { Skeleton } from '@/components/ui/skeleton';
import type { Property, SearchFilters } from '@/types';

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 px-4">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}

interface ApiResponse {
  properties: Property[];
  total: number;
  page?: number;
  totalPages?: number;
}

interface AISearchResponse {
  properties: Property[];
  total: number;
  filters: SearchFilters;
  reasoning: string;
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiFilters, setAiFilters] = useState<SearchFilters | null>(null);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [isAISearch, setIsAISearch] = useState(false);

  const query = searchParams.get('q') || '';

  // AI search when ?q= is present
  const doAISearch = useCallback(async (q: string) => {
    setLoading(true);
    setIsAISearch(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      if (res.ok) {
        const result: AISearchResponse = await res.json();
        setData({ properties: result.properties, total: result.total });
        setAiFilters(result.filters);
        setAiReasoning(result.reasoning);
      } else if (res.status === 429) {
        const err = await res.json();
        setAiReasoning(`Rate limited: ${err.error}`);
        setData({ properties: [], total: 0 });
      } else {
        setData({ properties: [], total: 0 });
      }
    } catch {
      setData({ properties: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Traditional filter search
  const doFilterSearch = useCallback(async () => {
    setLoading(true);
    setIsAISearch(false);
    setAiFilters(null);
    setAiReasoning(null);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('q');
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (query) {
      doAISearch(query);
    } else {
      doFilterSearch();
    }
  }, [query, doAISearch, doFilterSearch]);

  function handleFilterRemove(key: keyof SearchFilters) {
    if (!aiFilters) return;
    const updated = { ...aiFilters };
    delete updated[key];
    setAiFilters(updated);

    // Re-run with remaining filters as traditional search
    const params = new URLSearchParams();
    if (updated.purpose) params.set('purpose', updated.purpose);
    if (updated.propertyType) params.set('type', updated.propertyType);
    if (updated.areas?.length) params.set('area', updated.areas[0]);
    if (updated.minBedrooms !== undefined) params.set('bedrooms_min', String(updated.minBedrooms));
    if (updated.maxBedrooms !== undefined) params.set('bedrooms_max', String(updated.maxBedrooms));
    if (updated.minPrice !== undefined) params.set('price_min', String(updated.minPrice));
    if (updated.maxPrice !== undefined) params.set('price_max', String(updated.maxPrice));
    if (updated.furnished) params.set('furnished', 'true');
    if (updated.petFriendly) params.set('pet_friendly', 'true');
    if (updated.nearMetro) params.set('near_metro', 'true');

    router.push(`/properties?${params.toString()}`);
  }

  function handleFilterClear() {
    router.push('/properties');
  }

  function handleClearSearch() {
    router.push('/properties');
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <SearchBar />
        </div>

        {/* Show traditional filters only when not in AI search mode */}
        {!isAISearch && (
          <div className="mb-6">
            <FilterBar />
          </div>
        )}

        {/* Search results */}
        <SearchResults
          properties={data?.properties ?? []}
          total={data?.total ?? 0}
          filters={aiFilters}
          reasoning={aiReasoning}
          loading={loading}
          isAISearch={isAISearch}
          onFilterRemove={handleFilterRemove}
          onFilterClear={handleFilterClear}
          onClearSearch={handleClearSearch}
        />
      </div>
    </div>
  );
}
