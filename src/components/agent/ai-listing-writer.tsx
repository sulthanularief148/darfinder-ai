'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface GeneratedContent {
  title: string;
  description_en: string;
  description_ar: string;
  highlights: string[];
}

interface AIListingWriterProps {
  propertyDetails: Record<string, unknown>;
  onAccept: (content: GeneratedContent) => void;
}

export function AIListingWriter({ propertyDetails, onAccept }: AIListingWriterProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);

    const res = await fetch('/api/ai/generate-listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyDetails),
    });

    if (res.ok) {
      setContent(await res.json());
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || 'Failed to generate listing');
    }
    setLoading(false);
  }

  if (!content) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
        <h3 className="font-semibold mb-2">AI Listing Writer</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Generate a professional title, descriptions in English &amp; Arabic,
          and 5 key highlights — all from your property details.
        </p>
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <Button
          onClick={generate}
          disabled={loading}
          className="btn-gold rounded-xl"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI-Generated Content</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generate}
          disabled={loading}
          className="text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
      </div>

      <div>
        <Label>Title</Label>
        <Textarea
          value={content.title}
          onChange={(e) => setContent({ ...content, title: e.target.value })}
          rows={1}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Description (English)</Label>
        <Textarea
          value={content.description_en}
          onChange={(e) => setContent({ ...content, description_en: e.target.value })}
          rows={5}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Description (Arabic)</Label>
        <Textarea
          value={content.description_ar}
          onChange={(e) => setContent({ ...content, description_ar: e.target.value })}
          rows={5}
          dir="rtl"
          className="mt-1 font-[family-name:var(--font-arabic)]"
        />
      </div>

      <div>
        <Label>Highlights</Label>
        <div className="mt-1 space-y-2">
          {content.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-primary text-sm font-medium shrink-0">
                {i + 1}.
              </span>
              <input
                value={h}
                onChange={(e) => {
                  const updated = [...content.highlights];
                  updated[i] = e.target.value;
                  setContent({ ...content, highlights: updated });
                }}
                className="flex-1 bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          onClick={() => onAccept(content)}
          className="btn-gold rounded-xl flex-1"
        >
          <Check className="h-4 w-4 mr-2" />
          Use This Content
        </Button>
      </div>
    </motion.div>
  );
}
