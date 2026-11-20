'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DUBAI_AREAS } from '@/types';

const PURPOSES = [
  { value: '', label: 'All' },
  { value: 'rent', label: 'Rent' },
  { value: 'sale', label: 'Buy' },
];

const TYPES = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
];

const BEDROOMS = [
  { value: '', label: 'Any Beds' },
  { value: '0', label: 'Studio' },
  { value: '1', label: '1 Bed' },
  { value: '2', label: '2 Beds' },
  { value: '3', label: '3 Beds' },
  { value: '4', label: '4+ Beds' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'oldest', label: 'Oldest' },
];

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg bg-muted/50 border border-border/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string) => searchParams.get(key) || '',
    [searchParams]
  );

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/properties?${params.toString()}`);
  }

  function clearAll() {
    router.push('/properties');
  }

  const activeCount = ['purpose', 'type', 'area', 'bedrooms_min', 'price_min', 'price_max', 'furnished', 'pet_friendly', 'near_metro']
    .filter((k) => searchParams.has(k)).length;

  const areaOptions = [
    { value: '', label: 'All Areas' },
    ...DUBAI_AREAS.map((a) => ({ value: a, label: a })),
  ];

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
          {activeCount > 0 && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-7">
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterSelect
          label="Purpose"
          value={getParam('purpose')}
          options={PURPOSES}
          onChange={(v) => setFilter('purpose', v)}
        />
        <FilterSelect
          label="Type"
          value={getParam('type')}
          options={TYPES}
          onChange={(v) => setFilter('type', v)}
        />
        <FilterSelect
          label="Area"
          value={getParam('area')}
          options={areaOptions}
          onChange={(v) => setFilter('area', v)}
        />
        <FilterSelect
          label="Bedrooms"
          value={getParam('bedrooms_min')}
          options={BEDROOMS}
          onChange={(v) => {
            const params = new URLSearchParams(searchParams.toString());
            if (v) {
              params.set('bedrooms_min', v);
              if (v === '4') {
                params.delete('bedrooms_max');
              } else {
                params.set('bedrooms_max', v);
              }
            } else {
              params.delete('bedrooms_min');
              params.delete('bedrooms_max');
            }
            params.delete('page');
            router.push(`/properties?${params.toString()}`);
          }}
        />
        <FilterSelect
          label="Sort"
          value={getParam('sort') || 'newest'}
          options={SORT_OPTIONS}
          onChange={(v) => setFilter('sort', v)}
        />

        {/* Toggle filters */}
        <ToggleChip
          label="Furnished"
          active={getParam('furnished') === 'true'}
          onClick={() =>
            setFilter('furnished', getParam('furnished') === 'true' ? '' : 'true')
          }
        />
        <ToggleChip
          label="Near Metro"
          active={getParam('near_metro') === 'true'}
          onClick={() =>
            setFilter('near_metro', getParam('near_metro') === 'true' ? '' : 'true')
          }
        />
        <ToggleChip
          label="Pet Friendly"
          active={getParam('pet_friendly') === 'true'}
          onClick={() =>
            setFilter('pet_friendly', getParam('pet_friendly') === 'true' ? '' : 'true')
          }
        />
      </div>
    </div>
  );
}

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        active
          ? 'bg-primary/20 text-primary border border-primary/30'
          : 'bg-muted/50 text-muted-foreground border border-border/50 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}
