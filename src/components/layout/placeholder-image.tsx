'use client';

import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  index?: number;
  className?: string;
}

const gradients = [
  'from-blue-950 via-blue-900 to-cyan-900',
  'from-slate-950 via-slate-800 to-blue-900',
  'from-indigo-950 via-indigo-900 to-blue-800',
  'from-cyan-950 via-teal-900 to-emerald-900',
  'from-amber-950 via-amber-900 to-orange-900',
  'from-rose-950 via-rose-900 to-pink-900',
  'from-purple-950 via-purple-900 to-indigo-900',
  'from-emerald-950 via-emerald-900 to-teal-900',
  'from-orange-950 via-orange-900 to-amber-900',
  'from-slate-900 via-zinc-800 to-neutral-900',
];

export function PlaceholderImage({ index = 0, className }: PlaceholderImageProps) {
  const gradient = gradients[index % gradients.length];
  return (
    <div
      className={cn(
        'relative flex items-center justify-center bg-gradient-to-br overflow-hidden',
        gradient,
        className
      )}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />

      {/* Decorative shapes */}
      <div className="absolute top-1/4 -right-8 w-32 h-32 rounded-full bg-white/[0.03] blur-2xl" />
      <div className="absolute -bottom-4 left-1/4 w-24 h-24 rounded-full bg-white/[0.05] blur-xl" />

      <div className="relative flex flex-col items-center gap-2">
        <Building2 className="h-10 w-10 text-white/15" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/10 font-medium">
          DarFinder
        </span>
      </div>
    </div>
  );
}
