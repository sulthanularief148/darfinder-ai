'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutGrid, Map, Loader2, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchBar } from '@/components/search/search-bar';
import { FilterBar } from '@/components/search/filter-bar';
import { PropertyCard } from '@/components/property/property-card';
import { MapView } from '@/components/map/map-view';
import type { Property } from '@/types';

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
  page: number;
  totalPages: number;
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'map'>(
    searchParams.get('view') === 'map' ? 'map' : 'grid'
  );
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties?${searchParams.toString()}`);
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // Network error — data stays null
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function setPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/properties?${params.toString()}`);
  }

  const properties = data?.properties ?? [];
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <SearchBar />
        </div>

        {/* Filters + View toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <FilterBar />
          </div>
          <div className="flex gap-1 glass-card rounded-xl p-1 self-start">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('grid')}
              className="rounded-lg"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('map')}
              className="rounded-lg"
            >
              <Map className="h-4 w-4 mr-1" />
              Map
            </Button>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {loading ? (
              'Searching...'
            ) : (
              <>
                <span className="font-medium text-foreground">{data?.total ?? 0}</span>{' '}
                properties found
                {query && (
                  <span>
                    {' '}for &ldquo;<span className="text-primary">{query}</span>&rdquo;
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <SearchX className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No properties found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search with different terms.
            </p>
            <Button onClick={() => router.push('/properties')} className="btn-gold rounded-xl">
              Clear all filters
            </Button>
          </motion.div>
        )}

        {/* Grid view */}
        {!loading && properties.length > 0 && view === 'grid' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page <= 1}
                  onClick={() => setPage(data.page - 1)}
                  className="rounded-lg"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-3">
                  Page {data.page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page >= data.totalPages}
                  onClick={() => setPage(data.page + 1)}
                  className="rounded-lg"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Map view */}
        {!loading && properties.length > 0 && view === 'map' && (
          <div className="h-[600px] rounded-2xl overflow-hidden">
            <MapView properties={properties} />
          </div>
        )}
      </div>
    </div>
  );
}
