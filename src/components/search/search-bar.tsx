'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight, Mic } from 'lucide-react';
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
  const [displayPlaceholder, setDisplayPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (query) return;

    const target = exampleSearches[placeholderIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDisplayPlaceholder('');

    intervalRef.current = setInterval(() => {
      if (charIndex < target.length) {
        setDisplayPlaceholder(target.slice(0, charIndex + 1));
        charIndex++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTyping(false);
        setTimeout(() => {
          setPlaceholderIndex((i) => (i + 1) % exampleSearches.length);
        }, 2500);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholderIndex, query]);

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
        <motion.div
          className={cn(
            'relative rounded-2xl transition-all duration-500',
            isHero ? 'max-w-3xl mx-auto' : 'max-w-2xl',
          )}
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Animated glow behind search bar */}
          <div className={cn(
            'absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-gold/40 via-cyan-500/40 to-gold/40 opacity-0 blur-md transition-opacity duration-500',
            isFocused && 'opacity-100'
          )} />

          <div
            className={cn(
              'relative flex items-center glass-card rounded-2xl overflow-hidden border transition-all duration-300',
              isFocused
                ? 'border-gold/40 shadow-lg shadow-gold/10'
                : 'border-border/50'
            )}
          >
            <div className="flex items-center gap-2 pl-4 sm:pl-5 text-muted-foreground">
              <Sparkles className={cn(
                'text-gold transition-all duration-300',
                isHero ? 'h-5 w-5' : 'h-4 w-4',
                isFocused && 'animate-pulse'
              )} />
              <Search className={cn(
                isHero ? 'h-5 w-5' : 'h-4 w-4',
                'transition-colors',
                isFocused && 'text-foreground'
              )} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={displayPlaceholder + (isTyping && !query ? '|' : '')}
              className={cn(
                'flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground/50',
                isHero
                  ? 'px-4 py-5 text-base sm:text-lg'
                  : 'px-3 py-3 text-sm'
              )}
            />

            {isHero && (
              <button
                type="button"
                className="p-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors mr-1"
                title="Voice search coming soon"
              >
                <Mic className="h-5 w-5" />
              </button>
            )}

            <Button
              type="submit"
              className={cn(
                'btn-gold rounded-xl mr-2 group',
                isHero ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'
              )}
            >
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="h-4 w-4 sm:ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </form>

      {/* Example searches — only show on hero */}
      {isHero && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-5 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto"
        >
          <span className="text-xs text-muted-foreground/70 self-center">Popular:</span>
          {exampleSearches.slice(0, 3).map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="text-xs px-3.5 py-1.5 rounded-full glass-card text-muted-foreground hover:text-gold hover:border-gold/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {example}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
