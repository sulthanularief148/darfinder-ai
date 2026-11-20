'use client';

import { motion } from 'framer-motion';
import { Brain, ThumbsUp, ThumbsDown, Trophy } from 'lucide-react';
import { formatPriceLabel, formatArea } from '@/lib/utils';
import type { Property } from '@/types';
import type { ComparisonResult } from '@/lib/ai/provider';

interface CompareTableProps {
  properties: Property[];
  comparison: ComparisonResult | null;
}

const rows: { label: string; render: (p: Property) => string }[] = [
  { label: 'Type', render: (p) => p.type.charAt(0).toUpperCase() + p.type.slice(1) },
  { label: 'Purpose', render: (p) => (p.purpose === 'rent' ? 'For Rent' : 'For Sale') },
  { label: 'Price', render: (p) => formatPriceLabel(p.price_aed, p.purpose) },
  { label: 'Area', render: (p) => p.area },
  { label: 'Bedrooms', render: (p) => String(p.bedrooms) },
  { label: 'Bathrooms', render: (p) => String(p.bathrooms) },
  { label: 'Size', render: (p) => formatArea(p.size_sqft) },
  { label: 'Furnished', render: (p) => (p.furnished ? 'Yes' : 'No') },
  { label: 'Near Metro', render: (p) => (p.near_metro ? 'Yes' : 'No') },
  { label: 'Pet Friendly', render: (p) => (p.pet_friendly ? 'Yes' : 'No') },
  { label: 'Parking', render: (p) => `${p.parking} space${p.parking !== 1 ? 's' : ''}` },
];

export function CompareTable({ properties, comparison }: CompareTableProps) {
  const colCount = properties.length;

  return (
    <div className="space-y-6">
      {/* AI Comparison Summary */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Comparison</h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {comparison.summary}
          </p>

          {comparison.winner && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Best value:</span>
              <span className="text-primary">
                {properties.find((p) => p.id === comparison.winner)?.title ?? 'Unknown'}
              </span>
            </div>
          )}

          {/* Pros/cons per property */}
          <div className={`grid gap-4 ${colCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {comparison.highlights.map((h) => {
              const prop = properties.find((p) => p.id === h.propertyId);
              if (!prop) return null;
              return (
                <div key={h.propertyId} className="space-y-2">
                  <h4 className="text-sm font-medium truncate">{prop.title}</h4>
                  {h.pros.map((pro, i) => (
                    <div key={`pro-${i}`} className="flex items-start gap-1.5 text-xs text-green-400">
                      <ThumbsUp className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                  {h.cons.map((con, i) => (
                    <div key={`con-${i}`} className="flex items-start gap-1.5 text-xs text-red-400">
                      <ThumbsDown className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-muted-foreground font-medium w-36">
                  Feature
                </th>
                {properties.map((p) => (
                  <th key={p.id} className="text-left p-4 font-semibold">
                    <div className="truncate max-w-[200px]">{p.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}
                >
                  <td className="p-4 text-muted-foreground font-medium">
                    {row.label}
                  </td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
