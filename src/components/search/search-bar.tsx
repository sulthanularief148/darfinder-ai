'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  size?: 'default' | 'hero';
  className?: string;
}

const exampleSearches = [
  '2 bedroom in JVC under 90k/year, near metro',
  'Sea view apartment in Dubai Marina',
  'Villa with garden in Arabian Ranches for family',
  'Studio for rent in Business Bay, furnished',
  'شقة غرفتين في مارينا بأقل من مليون',
];

export function SearchBar({ size = 'default', className }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/properties?q=${encodeURIComponent(query.trim())}`);
  }

  function handleExampleClick(example: string) {
    setQuery(example);
    router.push(`/properties?q=${encodeURIComponent(example)}`);
  }

  const isHero = size === 'hero';

  return (
    <div className={cn('w-full', className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'relative glow-ring rounded-2xl transition-all duration-300',
            isHero ? 'max-w-3xl mx-auto' : 'max-w-2xl'
          )}
        >
          <div
            className={cn(
              'relative flex items-center glass-card rounded-2xl overflow-hidden',
              isFocused && 'border-primary/50'
            )}
          >
            <div className="flex items-center gap-2 pl-4 sm:pl-5 text-muted-foreground">
              <Sparkles className={cn('text-primary', isHero ? 'h-5 w-5' : 'h-4 w-4')} />
              <Search className={cn(isHero ? 'h-5 w-5' : 'h-4 w-4')} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={exampleSearches[placeholderIndex]}
              className={cn(
                'flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground/50',
                isHero
                  ? 'px-4 py-5 text-base sm:text-lg'
                  : 'px-3 py-3 text-sm'
              )}
              onAnimationEnd={() =>
                setPlaceholderIndex((i) => (i + 1) % exampleSearches.length)
              }
            />

            <Button
              type="submit"
              className={cn(
                'btn-gold rounded-xl mr-2',
                isHero ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'
              )}
            >
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="h-4 w-4 sm:ml-1" />
            </Button>
          </div>
        </div>
      </form>

      {/* Example searches — only show on hero */}
      {isHero && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto"
        >
          <span className="text-xs text-muted-foreground">Try:</span>
          {exampleSearches.slice(0, 3).map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="text-xs px-3 py-1.5 rounded-full glass-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
            >
              {example}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
