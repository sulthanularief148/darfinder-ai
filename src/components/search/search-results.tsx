'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Map, Loader2, SearchX, Sparkles } from 'lucide-react';
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
}: SearchResultsProps) {
  const [view, setView] = useState<'grid' | 'map'>('grid');

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
              <span className="font-medium text-foreground">{total}</span> properties found
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
    </div>
  );
}
