'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AIListingWriter } from './ai-listing-writer';
import { DUBAI_AREAS } from '@/types';

const AREA_COORDS: Record<string, [number, number]> = {
  'Dubai Marina': [25.0805, 55.1403],
  'Downtown Dubai': [25.1972, 55.2744],
  'Business Bay': [25.1860, 55.2652],
  'JVC': [25.0620, 55.2093],
  'JLT': [25.0735, 55.1399],
  'Al Barsha': [25.1134, 55.1996],
  'Deira': [25.2744, 55.3326],
  'Dubai Hills': [25.1255, 55.2435],
  'Arabian Ranches': [25.0577, 55.2621],
  'Dubai Silicon Oasis': [25.1257, 55.3789],
};

interface FormData {
  type: string;
  purpose: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  price_aed: number;
  furnished: boolean;
  pet_friendly: boolean;
  near_metro: boolean;
  parking: number;
  amenities: string[];
  title: string;
  description_en: string;
  description_ar: string;
  notes: string;
}

export function ListingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    type: 'apartment',
    purpose: 'rent',
    area: 'Dubai Marina',
    bedrooms: 1,
    bathrooms: 1,
    size_sqft: 800,
    price_aed: 60000,
    furnished: false,
    pet_friendly: false,
    near_metro: false,
    parking: 1,
    amenities: [],
    title: '',
    description_en: '',
    description_ar: '',
    notes: '',
  });

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleAIContent(content: { title: string; description_en: string; description_ar: string; highlights: string[] }) {
    update('title', content.title);
    update('description_en', content.description_en);
    update('description_ar', content.description_ar);
    update('amenities', content.highlights);
    setStep(3);
  }

  async function handleSubmit() {
    if (!form.title || !form.description_en) {
      setError('Title and English description are required');
      return;
    }

    setSaving(true);
    setError(null);

    const coords = AREA_COORDS[form.area] || [25.2048, 55.2708];

    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        latitude: coords[0],
        longitude: coords[1],
        photos: [],
        description_ar: form.description_ar || null,
      }),
    });

    setSaving(false);

    if (res.ok) {
      router.push('/agent/properties');
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error || 'Failed to create property');
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-0.5 ${s < step ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Details */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold">Property Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select
                defaultValue={form.type}
                onValueChange={(v) => v && update('type', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Purpose</Label>
              <Select
                defaultValue={form.purpose}
                onValueChange={(v) => v && update('purpose', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Area</Label>
            <Select
              defaultValue={form.area}
              onValueChange={(v) => v && update('area', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DUBAI_AREAS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Bedrooms</Label>
              <Input
                type="number"
                min={0}
                max={10}
                value={form.bedrooms}
                onChange={(e) => update('bedrooms', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Bathrooms</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.bathrooms}
                onChange={(e) => update('bathrooms', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Size (sq ft)</Label>
              <Input
                type="number"
                min={100}
                value={form.size_sqft}
                onChange={(e) => update('size_sqft', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Price (AED{form.purpose === 'rent' ? '/year' : ''})</Label>
            <Input
              type="number"
              min={0}
              value={form.price_aed}
              onChange={(e) => update('price_aed', Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.furnished}
                onChange={(e) => update('furnished', e.target.checked)}
                className="accent-primary"
              />
              Furnished
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.near_metro}
                onChange={(e) => update('near_metro', e.target.checked)}
                className="accent-primary"
              />
              Near Metro
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.pet_friendly}
                onChange={(e) => update('pet_friendly', e.target.checked)}
                className="accent-primary"
              />
              Pet Friendly
            </label>
          </div>

          <div>
            <Label>Extra notes for AI (optional)</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="e.g. Sea view, recently renovated, close to schools..."
              rows={2}
              className="mt-1"
            />
          </div>

          <Button
            onClick={() => setStep(2)}
            className="btn-gold rounded-xl w-full"
          >
            Next: AI Generate
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      )}

      {/* Step 2: AI Generation */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Button
            variant="ghost"
            onClick={() => setStep(1)}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to details
          </Button>

          <AIListingWriter
            propertyDetails={{
              type: form.type,
              purpose: form.purpose,
              area: form.area,
              bedrooms: form.bedrooms,
              bathrooms: form.bathrooms,
              size_sqft: form.size_sqft,
              price_aed: form.price_aed,
              furnished: form.furnished,
              pet_friendly: form.pet_friendly,
              near_metro: form.near_metro,
              notes: form.notes,
            }}
            onAccept={handleAIContent}
          />

          <div className="text-center">
            <button
              onClick={() => setStep(3)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer underline-offset-2 hover:underline"
            >
              Skip AI — write manually
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review & Publish */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Review & Publish</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(2)}
              className="text-xs"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back to AI
            </Button>
          </div>

          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Luxurious 2BR Apartment in Dubai Marina"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description (English)</Label>
            <Textarea
              value={form.description_en}
              onChange={(e) => update('description_en', e.target.value)}
              placeholder="Describe the property..."
              rows={5}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description (Arabic, optional)</Label>
            <Textarea
              value={form.description_ar}
              onChange={(e) => update('description_ar', e.target.value)}
              placeholder="وصف العقار..."
              rows={4}
              dir="rtl"
              className="mt-1 font-[family-name:var(--font-arabic)]"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-gold rounded-xl w-full"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Publishing...' : 'Publish Property'}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
