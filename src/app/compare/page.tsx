'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompareTable } from '@/components/compare/compare-table';
import { Skeleton } from '@/components/ui/skeleton';
import type { Property } from '@/types';
import type { ComparisonResult } from '@/lib/ai/provider';

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const idsParam = searchParams.get('ids') || '';
  const ids = idsParam.split(',').filter(Boolean);

  useEffect(() => {
    if (ids.length < 2) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setAiLoading(true);

      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties);
        setComparison(data.comparison);
      }

      setLoading(false);
      setAiLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Compare Properties</h1>
          </div>
        </div>

        {/* No properties */}
        {!loading && ids.length < 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Scale className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Select properties to compare</h2>
            <p className="text-muted-foreground mb-6">
              Go to the properties page and select 2-3 properties to compare side by side.
            </p>
            <Button
              onClick={() => router.push('/properties')}
              className="btn-gold rounded-xl"
            >
              Browse Properties
            </Button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm">
                {aiLoading ? 'AI is analyzing properties...' : 'Loading properties...'}
              </span>
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        )}

        {/* Results */}
        {!loading && properties.length >= 2 && (
          <CompareTable properties={properties} comparison={comparison} />
        )}
      </div>
    </div>
  );
}
