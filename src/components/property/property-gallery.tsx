'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PlaceholderImage } from '@/components/layout/placeholder-image';
import { Button } from '@/components/ui/button';

interface PropertyGalleryProps {
  photos: string[];
  title: string;
}

export function PropertyGallery({ photos, title }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0);
  const count = Math.max(photos.length, 3);

  function next() {
    setCurrent((c) => (c + 1) % count);
  }
  function prev() {
    setCurrent((c) => (c - 1 + count) % count);
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Main image */}
      <div className="aspect-[16/9] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <PlaceholderImage
              index={current}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {count > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
          {current + 1} / {count}
        </div>
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="flex gap-2 mt-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-1 aspect-[4/3] rounded-lg overflow-hidden transition-opacity cursor-pointer ${
                i === current ? 'ring-2 ring-primary opacity-100' : 'opacity-50 hover:opacity-75'
              }`}
            >
              <PlaceholderImage index={i} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
