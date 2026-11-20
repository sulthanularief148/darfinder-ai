'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain } from 'lucide-react';
import type { SearchFilters } from '@/types';

interface FilterChipsProps {
  filters: SearchFilters;
  reasoning?: string;
  onRemove: (key: keyof SearchFilters) => void;
  onClearAll: () => void;
}

function chipLabel(key: string, value: unknown): string | null {
  switch (key) {
    case 'purpose':
      return value === 'rent' ? 'For Rent' : 'For Sale';
    case 'propertyType':
      return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    case 'minBedrooms':
      return `${value}+ Beds`;
    case 'maxBedrooms':
      return `Up to ${value} Beds`;
    case 'minPrice':
      return `From AED ${Number(value).toLocaleString()}`;
    case 'maxPrice':
      return `Under AED ${Number(value).toLocaleString()}`;
    case 'areas':
      return Array.isArray(value) ? (value as string[]).join(', ') : null;
    case 'nearMetro':
      return value ? 'Near Metro' : null;
    case 'petFriendly':
      return value ? 'Pet Friendly' : null;
    case 'furnished':
      return value ? 'Furnished' : null;
    case 'amenities':
      return Array.isArray(value) ? (value as string[]).join(', ') : null;
    case 'freeTextIntent':
      return `"${String(value)}"`;
    default:
      return null;
  }
}

export function FilterChips({ filters, reasoning, onRemove, onClearAll }: FilterChipsProps) {
  const entries = Object.entries(filters).filter(
    ([, v]) => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  );

  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      {reasoning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 text-xs text-muted-foreground glass-card rounded-lg p-3"
        >
          <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>{reasoning}</span>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground font-medium">AI Filters:</span>
        <AnimatePresence>
          {entries.map(([key, value]) => {
            const label = chipLabel(key, value);
            if (!label) return null;
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => onRemove(key as keyof SearchFilters)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 transition-colors cursor-pointer"
              >
                {label}
                <X className="h-3 w-3" />
              </motion.button>
            );
          })}
        </AnimatePresence>

        {entries.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
