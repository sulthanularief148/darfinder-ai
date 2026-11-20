'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Map, Loader2, SearchX, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/property-card';
import { MapView } from '@/components/map/map-view';
import { FilterChips } from './filter-chips';
import type { Property, SearchFilters } from '@/types';

interface SearchResultsProps {
  properties: Property[];
  total: number;
  filters: SearchFilters | null;
  reasoning: string | null;
  loading: boolean;
  isAISearch: boolean;
  onFilterRemove: (key: keyof SearchFilters) => void;
  onFilterClear: () => void;
  onClearSearch: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  perPage: number;
}

export function SearchResults({
  properties,
  total,
  filters,
  reasoning,
  loading,
  isAISearch,
  onFilterRemove,
  onFilterClear,
  onClearSearch,
  page,
  totalPages,
  onPageChange,
  perPage,
}: SearchResultsProps) {
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const startItem = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  return (
    <div className="space-y-4">
      {/* AI filter chips */}
      {isAISearch && filters && (
        <FilterChips
          filters={filters}
          reasoning={reasoning ?? undefined}
          onRemove={onFilterRemove}
          onClearAll={onFilterClear}
        />
      )}

      {/* Results header + view toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isAISearch ? 'AI is searching...' : 'Searching...'}
            </span>
          ) : (
            <>
              Showing <span className="font-medium text-foreground">{startItem}–{endItem}</span> of{' '}
              <span className="font-medium text-foreground">{total}</span> properties
              {isAISearch && (
                <span className="inline-flex items-center gap-1 ml-2 text-primary">
                  <Sparkles className="h-3 w-3" />
                  AI Search
                </span>
              )}
            </>
          )}
        </p>

        <div className="flex gap-1 glass-card rounded-xl p-1">
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

      {/* Loading */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-80 rounded-2xl" />
            ))}
          </motion.div>
        )}

        {/* Empty */}
        {!loading && properties.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <SearchX className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No properties found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or use different terms.
            </p>
            <Button onClick={onClearSearch} className="btn-gold rounded-xl">
              Clear search
            </Button>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && properties.length > 0 && view === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </motion.div>
        )}

        {/* Map */}
        {!loading && properties.length > 0 && view === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[600px] rounded-2xl overflow-hidden"
          >
            <MapView properties={properties} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 pt-8 pb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-xl"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | 'dots')[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('dots');
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === 'dots' ? (
                <span key={`dots-${idx}`} className="px-1 text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(item as number)}
                  className={`rounded-xl min-w-[36px] ${
                    item === page ? 'btn-gold' : ''
                  }`}
                >
                  {item}
                </Button>
              )
            )}

          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-xl"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
