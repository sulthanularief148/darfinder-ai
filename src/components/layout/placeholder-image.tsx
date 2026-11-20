'use client';

import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  index?: number;
  className?: string;
}

const gradients = [
  'from-blue-900 to-blue-700',
  'from-cyan-900 to-cyan-700',
  'from-teal-900 to-teal-700',
  'from-emerald-900 to-emerald-700',
  'from-amber-900 to-amber-700',
  'from-orange-900 to-orange-700',
  'from-rose-900 to-rose-700',
  'from-purple-900 to-purple-700',
  'from-indigo-900 to-indigo-700',
  'from-slate-800 to-slate-600',
];

export function PlaceholderImage({ index = 0, className }: PlaceholderImageProps) {
  const gradient = gradients[index % gradients.length];
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br',
        gradient,
        className
      )}
    >
      <Building2 className="h-12 w-12 text-white/20" />
    </div>
  );
}
