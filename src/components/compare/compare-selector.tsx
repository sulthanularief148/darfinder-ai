'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/hooks/use-compare';

export function CompareSelector() {
  const { ids, remove, clear, count } = useCompare();
  const router = useRouter();

  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center gap-4 shadow-2xl border border-primary/20">
          <Scale className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            {count} of 3 selected
          </span>

          <div className="flex gap-1">
            {ids.map((id) => (
              <button
                key={id}
                onClick={() => remove(id)}
                className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-red-500/20 transition-colors cursor-pointer"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-xs"
            >
              Clear
            </Button>
            <Button
              size="sm"
              disabled={count < 2}
              onClick={() => {
                router.push(`/compare?ids=${ids.join(',')}`);
              }}
              className="btn-gold rounded-xl text-xs"
            >
              Compare
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
